export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/xml")

  // Instructing the Vercel edge to cache the file
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600")

  // generate sitemap here
  // https://vercel.com/guides/how-do-i-generate-a-sitemap-for-my-nextjs-app-on-vercel
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.dolgins.com/</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/about</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry-repairs</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry-insurance-appraisal</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/custom-jewelry</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/buying-jewelry</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry-repairs/watch-repair</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry/diamonds</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://www.dolgins.com/jewelry/engagement-rings</loc>
        <lastmod>2022-11-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      </urlset>`
  res.end(xml)
}
