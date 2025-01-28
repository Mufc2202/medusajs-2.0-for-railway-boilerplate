import { countryCode } from "@lib/constants"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import { getProductsList } from "@lib/data/products"
import { StoreProductCategory } from "@medusajs/types"
import { MetadataRoute } from "next"

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

enum ChangeFrequency {
  Always = "always",
  Hourly = "hourly",
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
  Never = "never",
}

export type Sitemap = {
  url: string
  lastModified: string | Date | undefined
  changeFrequency?: ChangeFrequency | undefined
  priority?: number | undefined
}

const generateProductsRoute = async (
  countryCode: string
): Promise<Sitemap[] | null> => {
  try {
    const {
      response: { products },
    } = await getProductsList({ countryCode })

    const productsSitemap = products?.map((product) => ({
      url: `${BASE_URL}/products/${product.handle}`,
      lastModified:
        product.updated_at || product.created_at || new Date().toISOString(),
      priority: 0.7,
    }))

    return productsSitemap
  } catch (error) {
    console.log("error while generating products sitemap")
  }
  return null
}

const generateCollectionRoute = async (): Promise<Sitemap[] | null> => {
  try {
    const { collections } = await getCollectionsList()

    const collectionSitemap = collections?.map((collection) => ({
      url: `${BASE_URL}/collections/${collection.handle}`,
      lastModified:
        collection.updated_at ||
        collection.created_at ||
        new Date().toISOString(),
      priority: 0.7,
    }))

    return collectionSitemap
  } catch (error) {
    console.log("error while generating generateCollectionRoute")
  }
  return null
}

const generateCategoryRoutes = async (): Promise<Sitemap[] | null> => {
  try {
    const { product_categories } = await getCategoriesList()

    const categoryRoutes: Sitemap[] = product_categories?.reduce(
      (p: Sitemap[], c: StoreProductCategory) => {
        const data = []
        data.push({
          url: `${BASE_URL}/categories/${c.handle}`,
          lastModified: c.updated_at,
          priority: 0.8,
        })
        if (c?.category_children && c?.category_children?.length) {
          c?.category_children?.map((subCategory) => {
            data.push({
              url: `${BASE_URL}/categories/${c?.handle}/${subCategory?.handle}`,
              lastModified: subCategory?.updated_at,
              priority: 0.8,
            })
            if (
              subCategory?.category_children &&
              subCategory?.category_children?.length
            ) {
              subCategory?.category_children?.map((subSubCategory) => {
                data.push({
                  url: `${BASE_URL}/categories/${c?.handle}/${subCategory?.handle}/${subSubCategory?.handle}`,
                  lastModified: subSubCategory?.updated_at,
                  priority: 0.8,
                })
              })
            }
          })
        }
        return [...p, ...data]
      },
      []
    )

    return categoryRoutes
  } catch (error) {
    console.log("error in generating sitemap categoryRoutes")
  }
  return null
}

const generateStaticSitemap = async (): Promise<Sitemap[] | null> => {
  try {
    return [
      {
        url: `${BASE_URL}`,
        lastModified: new Date().toISOString(),
        priority: 1,
      },
      {
        url: `${BASE_URL}/store`,
        lastModified: new Date().toISOString(),
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/contact`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/policy`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/results`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/search`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/blogs`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/jewelry-insurance-appraisal`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
      },
    ]
  } catch (error) {
    console.log("error in generating static sitemap generateStaticSitemap")
  }
  return null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: Sitemap[] | null = await generateStaticSitemap()

  const productsSitemap: Sitemap[] | null = await generateProductsRoute(
    countryCode
  )

  const collectionSitemap: Sitemap[] | null = await generateCollectionRoute()

  const categorySitemap: Sitemap[] | null = await generateCategoryRoutes()

  return [
    ...(staticPages ? staticPages : []),
    ...(productsSitemap ? productsSitemap : []),
    ...(collectionSitemap ? collectionSitemap : []),
    ...(categorySitemap ? categorySitemap : []),
  ]
}
