import { DEFAULT_REGION } from "@lib/constants"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { CustomProduct } from "types/global"

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function wrapInCDATA(text: string): string {
  // Ensure the text doesn't contain CDATA end marker
  const safeText = text.replace(/]]>/g, ']]&gt;');
  return `<![CDATA[${safeText}]]>`;
}

function sanitizeDescription(description: string | null, subtitle: string | null): string {
  if (!description && !subtitle) return '';
  const textToUse = description || subtitle || '';
  const stripped = stripHtml(textToUse);
  return stripped.substring(0, 5000); // Google's limit
}

function formatPrice(price: number | string | null | undefined): string {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }
  if (!price || isNaN(price)) return "0.00 USD";
  return `${price.toFixed(2)} USD`;
}

export async function GET() {
  const { response } = await getProductsList({
    countryCode: DEFAULT_REGION,
  })

  const allProducts = response.products as CustomProduct[]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Dolgins Jewelry Products</title>
    <link>https://dolgins.com</link>
    <description>Dolgins's Google Merchant RSS Feed</description>\n`;

  if (allProducts) {
    const validProducts = allProducts.filter(product =>
      product?.metadata?.googleCategory &&
      typeof product.metadata.googleCategory === 'string' &&
      product.metadata.googleCategory.trim() !== ''
    );

    validProducts.forEach((product) => {
      try {
        const cleanDescription = sanitizeDescription(product.description, product.subtitle)
        const googleCategory = product.metadata?.googleCategory as string;
        const googleGender = product.metadata?.googleGender as string;
        const googleColor = product.metadata?.googleColor as string;


        // Handle products with no variants
        if (!product.variants || product.variants.length === 0) {
          const { cheapestPrice } = getProductPrice({
            product: product as StoreProduct,
          })

          const price = cheapestPrice?.calculated_price ?? cheapestPrice?.original_price ?? 0;

          // Try getting price directly from variants
          const variantPrice = product.variants?.[0]?.prices?.[0]?.amount;

          xml += `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${wrapInCDATA(product.title ?? "")}</g:title>
      <g:description>${wrapInCDATA(cleanDescription)}</g:description>
      <g:link>${escapeXml(`https://dolgins.com/jewelry/${product.handle}`)}</g:link>
      <g:image_link>${escapeXml(product.thumbnail ?? "")}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${formatPrice(price)}</g:price>
      <g:brand>Dolgins Fine Jewelry</g:brand>
      <g:condition>new</g:condition>
      <g:gender>${wrapInCDATA(googleGender)}</g:gender>
      <g:color>${wrapInCDATA(googleColor)}</g:color>
      <g:age_group>adult</g:age_group>
      <g:google_product_category>${wrapInCDATA(googleCategory)}</g:google_product_category>`

          if (product.material) {
            xml += `\n      <g:material>${wrapInCDATA(String(product.material))}</g:material>`
          }

          // Add additional images
          product.images?.slice(0, 10).forEach(img => {
            if (img.url) {
              xml += `\n      <g:additional_image_link>${escapeXml(img.url)}</g:additional_image_link>`
            }
          })

          xml += '\n    </item>\n'
          return; // Skip the rest of the processing for this product
        }

        // Process products with variants
        product.variants.forEach((variant) => {
          const variantPrice = variant.calculated_price?.calculated_amount;
          const isInStock = (variant?.inventory_quantity ?? 0) > 0;
          const variantId = `${product.id}_${variant.id}`;

          const variantTitle = variant.title
            ? `${product.title} - ${variant.title}`
            : product.title;

          xml += `    <item>
      <g:id>${escapeXml(variantId.slice(-49))}</g:id>
      <g:title>${wrapInCDATA(variantTitle ?? "")}</g:title>
      <g:description>${wrapInCDATA(cleanDescription)}</g:description>
      <g:link>${escapeXml(`https://dolgins.com/jewelry/${product.handle}?variant=${variant.id}`)}</g:link>
      <g:image_link>${escapeXml(product.thumbnail ?? "")}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${formatPrice(variantPrice)}</g:price>
      <g:brand>Dolgins Fine Jewelry</g:brand>
      <g:condition>new</g:condition>
      <g:gender>unisex</g:gender>
      <g:age_group>adult</g:age_group>
      <g:google_product_category>${wrapInCDATA(googleCategory)}</g:google_product_category>
      <g:item_group_id>${escapeXml(product.id)}</g:item_group_id>`

          if (variant.height) {
            xml += `\n      <g:size>${escapeXml(String(variant.height))}</g:size>`
          }

          if (variant.weight) {
            xml += `\n      <g:shipping_weight>${escapeXml(String(variant.weight))} kg</g:shipping_weight>`
          }

          if (product.material) {
            xml += `\n      <g:material>${wrapInCDATA(String(product.material))}</g:material>`
          }

          // Add variant-specific options
          variant.options?.forEach(option => {
            if (option.value && option.option?.title) {
              const optionName = option.option.title.toLowerCase()
                .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric chars with underscore
                .replace(/_+/g, '_') // Replace multiple underscores with single
                .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

              if (optionName) {
                xml += `\n      <g:${escapeXml(optionName)}>${wrapInCDATA(option.value)}</g:${escapeXml(optionName)}>`
              }
            }
          })

          // Add additional images
          product.images?.slice(0, 10).forEach(img => {
            if (img.url) {
              xml += `\n      <g:additional_image_link>${escapeXml(img.url)}</g:additional_image_link>`
            }
          })

          xml += '\n    </item>\n'
        })
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error)
      }
    })
  }

  xml += '  </channel>\n</rss>'

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate"
    },
  })
}