import { getProductsListWithSort } from "@lib/data/products"
import { StoreProductCategory } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"

interface PriceData {
  size: string
  prices: {
    best: string | null
    better: string | null
    good: string | null
    lab: string | null
  }
  link: string | null
}

interface DiamondShape {
  name: string
  keyword: string
  imageSrc: any
  imageAlt: string
  description: string
  category_id: string[]
}

interface ShapeSelectorProps {
  sort?: string
  pageNumber?: string | number
  category: StoreProductCategory
  countryCode: string
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function FetchPricingData(shape: DiamondShape) {
  const getPriceByType = (variants: any[], type: string) => {
    const variant = variants.find((v) => v.title === type)
    return variant
      ? formatPrice(variant.calculated_price.calculated_amount)
      : null
  }

  const queryParams = {
    category_id: shape.category_id,
    order: "created_at",
    limit: 100, // Increase limit to get more products
  }

  const { response: serverRes } = await getProductsListWithSort({
    pageParam: 0,
    queryParams: {
      category_id: ["pcat_01JHB1PYWAQMXN7WJ9S1VZ136W"],
      order: "created_at",
    },
    countryCode: "us",
  })

  console.warn("serverRes", serverRes)

  const filteredProducts = (serverRes?.products || []).filter(
    (product: any) => product.metadata?.shape && product.metadata?.size
  )

  filteredProducts.sort((a: any, b: any) => {
    const sizeA = parseFloat(a.metadata.size)
    const sizeB = parseFloat(b.metadata.size)
    return sizeA - sizeB
  })

  return filteredProducts.map((product: any) => ({
    size: product.metadata.size,
    prices: {
      best: getPriceByType(product.variants, "Highest Quality"),
      better: getPriceByType(product.variants, "Great Quality & Value"),
      good: getPriceByType(product.variants, "Love The Size"),
      lab: getPriceByType(product.variants, "Laboratory Created"),
    },
    link: `/products/${product.handle}`,
  }))
}
