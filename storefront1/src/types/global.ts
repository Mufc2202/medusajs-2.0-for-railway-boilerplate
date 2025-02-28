import { StoreProduct, UserDTO } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type SeoDetails = {
  id: string
  metaTitle: string
  metaDescription: string
  metaImage: string
  keywords: string
  metaRobots: string
  structuredData: string
  feedData: string
  metaViewport: string
  canonicalURL: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  metaSocial: {
    id: string
    title: string
    description: string
    image: string
    socialNetwork: string
    seo_details_id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
  }[]
}

export type BlogProps = {
  id: string
  title: string
  subtitle: string
  handle: string
  image: string | null
  content: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  seo_details: SeoDetails
  user: UserDTO
  product_categories: { id: string }[]
}
export type BannerProps = {
  created_at: Date
  updated_at: Date
  id: string
  image: string | null
  isActive: boolean
  link: string
  metadata: any | null
  name: string
  text: string
  deleted_at: Date | null
}
export type CustomProduct = StoreProduct & {
  seo_details: SeoDetails
}
