import { AUTHOR, DEFAULT_REGION } from "@lib/constants"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { StoreProduct } from "@medusajs/types"
import RSS from "rss"
import { CustomProduct } from "types/global"

export async function GET() {
  const feed = new RSS({
    title: "Dolgins products",
    description: "Dolgins's Product Description",
    generator: "RSS for Node and Next.js",
    feed_url: `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
    site_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    managingEditor: "editor@example.com (Dolgins)",
    webMaster: "editor@example.com (Dolgins)",
    copyright: `Copyright ${new Date().getFullYear().toString()}, Dolgins`,
    language: "en-US",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  })

  const { response } = await getProductsList({
    countryCode: DEFAULT_REGION,
  })

  const allProducts = response.products as CustomProduct[]

  if (allProducts) {
    allProducts.forEach((product) => {
      let feedData

      if (
        product.seo_details &&
        product.seo_details?.feedData &&
        typeof product.seo_details.feedData === "string" &&
        product.seo_details.feedData.trim() !== ""
      ) {
        feedData = JSON.parse(product.seo_details.feedData)
      } else {
        console.log(`No valid feedData for product ${product.id}`)
      }

      const { cheapestPrice } = getProductPrice({
        product: product as StoreProduct,
      })

      return feed.item({
        title: product.title ?? "",
        description: product.description ?? "",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.handle}`,
        date: product.created_at ?? new Date().toISOString(),
        author: AUTHOR,
        guid: product.id,
        custom_elements: [
          {
            variant: product.variants?.map((variant) => variant.title) || [],
          },
          { image_link: product.thumbnail ?? "" },
          { price: cheapestPrice?.original_price ?? "" },
          { size_system: DEFAULT_REGION.toUpperCase() ?? "US" },
          ...(product?.metadata && product?.metadata?.googleCategory
            ? [{ google_product_category: product?.metadata?.googleCategory }]
            : []),
          ...(product.material ? [{ material: product.material }] : []),
          ...(product.height ? [{ product_height: product.height }] : []),
          ...(product.width ? [{ product_width: product.width }] : []),
          ...(product.length ? [{ product_length: product.length }] : []),
          ...(product.weight ? [{ product_weight: product.weight }] : []),
          ...(product.type ? [{ product_type: product.type }] : []),
        ],
        ...feedData,
      })
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
