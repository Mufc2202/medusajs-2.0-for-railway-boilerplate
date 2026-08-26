const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:5FJsrGFir15360vTFcZ9U2IA73sGeAvh5pvAGO0jvmEKni2HGq7T6ZBBIKnA4Yah@62.72.3.123:5431/dolgins_v2';
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'https://meilisearch-mgck80448kk8og48ggks4o80.62.72.3.123.sslip.io';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'dzalSkt0k7rZAYABQk1p8TWRC0a5e2Q1';

async function meiliRequest(endpoint, method = 'GET', body = null) {
  const url = `${MEILISEARCH_HOST.replace(/\/$/, '')}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${MEILISEARCH_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const json = await res.json();
  return json;
}

async function syncProductsToMeiliSearch() {
  console.log(`Connecting to Postgres...`);
  const pgClient = new Client({ connectionString: DATABASE_URL });
  await pgClient.connect();

  console.log(`Connecting to MeiliSearch: ${MEILISEARCH_HOST}`);

  try {
    // 1. Ensure index exists
    try {
      await meiliRequest('/indexes', 'POST', { uid: 'products', primaryKey: 'id' });
    } catch (e) {}

    // 2. Update index settings
    console.log('Updating index settings...');
    const settingsRes = await meiliRequest('/indexes/products/settings', 'PATCH', {
      searchableAttributes: ['title', 'description', 'variant_sku', 'handle'],
      displayedAttributes: ['id', 'title', 'description', 'variant_sku', 'thumbnail', 'handle', 'status', 'variants'],
      filterableAttributes: ['status', 'handle'],
    });
    console.log('Settings update:', settingsRes);

    // 3. Fetch products from database
    const query = `
      SELECT 
        p.id,
        p.title,
        p.handle,
        p.description,
        p.thumbnail,
        p.status,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'title', pv.title,
              'sku', pv.sku
            )
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) as variants,
        string_agg(pv.sku, ' ') as variant_sku
      FROM product p
      LEFT JOIN product_variant pv ON pv.product_id = p.id AND pv.deleted_at IS NULL
      WHERE p.deleted_at IS NULL AND p.status = 'published'
      GROUP BY p.id;
    `;

    console.log('Querying published products from database...');
    const result = await pgClient.query(query);
    const products = result.rows.map(row => ({
      ...row,
      objectID: row.id,
    }));

    console.log(`Found ${products.length} products. Uploading to MeiliSearch...`);
    const uploadRes = await meiliRequest('/indexes/products/documents?primaryKey=id', 'POST', products);
    console.log('Upload task enqueued:', uploadRes);

    // Poll until indexing task is done
    if (uploadRes.taskUid) {
      console.log(`Waiting for task ${uploadRes.taskUid} to finish...`);
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const taskStatus = await meiliRequest(`/tasks/${uploadRes.taskUid}`);
        console.log(`Task ${uploadRes.taskUid} status:`, taskStatus.status);
        if (taskStatus.status === 'succeeded' || taskStatus.status === 'failed') {
          break;
        }
      }
    }

    const stats = await meiliRequest('/indexes/products/stats');
    console.log('Current MeiliSearch stats for products:', stats);

  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    await pgClient.end();
  }
}

syncProductsToMeiliSearch();
