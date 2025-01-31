import { AUTHOR, DEFAULT_REGION } from "@lib/constants"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import RSS from "rss"

export async function GET() {
  const feed = new RSS({
    title: "Dolgins products",
    description: "Dolgins's Product",
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
    countryCode: DEFAULT_REGION as unknown as string,
  })

  const allProducts = response.products

  if (allProducts) {
    allProducts.map((product) => {
      const { cheapestPrice } = getProductPrice({
        product,
      })
      return feed.item({
        title: product.title ?? "",
        description: product.description ?? "",
        categories: product.categories?.map((cat) => cat.name) || [],
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.handle}`,
        date: product.created_at ?? new Date().toISOString(),
        author: AUTHOR,
        guid: product.id,
        custom_elements: [
          {
            variant: product.variants?.map((variant) => variant.title) || [],
          },
          {
            thumbnail: product.thumbnail ?? "",
          },
          { product_type: product.type ?? "" },
          { material: product.material ?? "" },
          { size_system: DEFAULT_REGION.toUpperCase() ?? "US" },
          { product_height: product.height ?? "" },
          { product_width: product.width ?? "" },
          { product_length: product.length ?? "" },
          { product_weight: product.weight ?? "" },
          { price: cheapestPrice?.original_price ?? "" },
        ],
      })
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
