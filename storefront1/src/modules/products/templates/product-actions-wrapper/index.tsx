import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const [product] = await getProductsById({
    ids: [id],
    regionId: region.id,
  })

  if (!product) {
    return null
  }

  // Check if the product is in the Jewelry Repair category
  const isJewelryRepair = product.categories?.some(
    (category) => category.name === "Jewelry Repair"
  )

  // If this is a Jewelry Repair product, don't show the price or add to cart button
  if (isJewelryRepair) {
    return null
  }

  return <ProductActions product={product} region={region} />
}
