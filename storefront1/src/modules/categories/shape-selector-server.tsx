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
