import { sdk } from "@lib/config"
import { countryCode, DEFAULT_REGION } from "@lib/constants"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import { getProductsList } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { HttpTypes, StoreProductCategory } from "@medusajs/types"
import { MetadataRoute } from "next"

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

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
  region_id: string
): Promise<Sitemap[] | null> => {
  try {
    // const {
    //   response: { products },
    // } = await getProductsList({ countryCode })

    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: 5000,
        fields: "id,handle,title",
        region_id: region_id,
      },
    })

    const productsSitemap = products?.map((product) => ({
      url: `https://dolgins.com/jewelry/${product.handle}`,
      lastModified:
        product.updated_at || product.created_at || new Date().toISOString(),
      priority: 0.7,
    }))

    return productsSitemap
  } catch (error) {
    console.log("error while generating products sitemap")
    console.error(error)
  }
  return null
}

const generateCollectionRoute = async (): Promise<Sitemap[] | null> => {
  try {
    const { collections } = await getCollectionsList()

    const collectionSitemap = collections?.map((collection) => ({
      url: `https://dolgins.com/collections/${collection.handle}`,
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
    const { product_categories } = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>("/store/product-categories", {
      query: {
        limit: 1000,
        fields:
          "handle,parent_category_id,category_children.name,category_children.handle,category_children.id",
        include_descendants_tree: true,
      },
    })

    const categoryRoutes: Sitemap[] = []

    const categoryHandleMap = new Map<string, string>() // id => handle
    for (const productCategory of product_categories) {
      categoryHandleMap.set(productCategory.id, productCategory.handle)
      if (productCategory.parent_category) {
        categoryHandleMap.set(
          productCategory.parent_category.id,
          productCategory.parent_category.handle
        )
      }
    }

    for (const productCategory of product_categories) {
      // up to 3 levels supported
      const route = [] as string[]

      if (productCategory.parent_category?.parent_category_id) {
        const grandparent = categoryHandleMap.get(
          productCategory.parent_category.parent_category_id
        )
        if (grandparent) route.push(grandparent)
      }
      if (productCategory.parent_category_id) {
        const parent = categoryHandleMap.get(productCategory.parent_category_id)
        if (parent) route.push(parent)
      }
      route.push(productCategory.handle)

      categoryRoutes.push({
        url: `https://dolgins.com/t/${route.join('/')}`,
        lastModified: productCategory.updated_at,
        priority: 0.8,
      })
    }

    return categoryRoutes
  } catch (error) {
    console.log("error in generating sitemap categoryRoutes")
    console.error(error)
  }
  return null
}

const generateStaticSitemap = async (): Promise<Sitemap[] | null> => {
  try {
    return [
      {
        url: `https://dolgins.com`,
        lastModified: new Date().toISOString(),
        priority: 1,
      },
      {
        url: `https://dolgins.com/store`,
        lastModified: new Date().toISOString(),
        priority: 0.9,
      },
      {
        url: `https://dolgins.com/about`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `https://dolgins.com/contact`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `https://dolgins.com/policy`,
        lastModified: new Date().toISOString(),
        priority: 0.7,
      },
      {
        url: `https://dolgins.com/results`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      },
      {
        url: `https://dolgins.com/search`,
        lastModified: new Date().toISOString(),
        priority: 0.6,
      },
      {
        url: `https://dolgins.com/blogs`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
      },
      {
        url: `https://dolgins.com/jewelry-insurance-appraisal`,
        lastModified: new Date().toISOString(),
        priority: 0.5,
      },
    ]
  } catch (error) {
    console.log("error in generating static sitemap generateStaticSitemap")
    console.error(error)
  }
  return null
}

const generateSitemapByCountryCode = async (
  countryCode: string
): Promise<Sitemap[] | null> => {
  const region = await getRegion(countryCode)

  if (!region?.id)
    throw new Error(`Region not found for country_code ${countryCode}`)

  const dynamicRoutes: Sitemap[] = []
  const productsSitemap: Sitemap[] | null = await generateProductsRoute(
    region?.id
  )
  if (productsSitemap) {
    dynamicRoutes.push(...productsSitemap)
  }
  return dynamicRoutes
}

const findCountryCodes = async () => {
  try {
    const regions = await listRegions()
    const countryCodes = regions?.reduce(
      (p: string[], c: HttpTypes.StoreRegion) => {
        if (c.countries) {
          return [
            ...p,
            ...(c.countries
              .map((country) => country.iso_2)
              .filter(Boolean) as string[]),
          ]
        }
        return p
      },
      []
    )

    return countryCodes
  } catch (error) {
    console.log("error countryCodes")
    console.error(error)
  }
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countryCodes = await findCountryCodes()

  let staticPages: Sitemap[] = []
  let dynamicPages: Sitemap[] = []

  if (countryCodes && countryCodes?.length) {
    for (let i = 0; i < countryCodes.length; i++) {
      const currentCountryCode = countryCodes[i]!
      const dynamicSitemap: Sitemap[] | null =
        await generateSitemapByCountryCode(currentCountryCode)
      const staticSitemap: Sitemap[] | null =
        await generateStaticSitemap()
      if (dynamicSitemap) dynamicPages = [...dynamicSitemap]
      if (staticSitemap) staticPages = [...staticSitemap]
    }
  } else {
    const sitemap: Sitemap[] | null = await generateSitemapByCountryCode(
      DEFAULT_REGION
    )
    if (sitemap) dynamicPages = [...dynamicPages, ...sitemap]
  }

  const categoryRoutes = await generateCategoryRoutes()

  if (categoryRoutes) {
    dynamicPages.push(...categoryRoutes)
  }

  return [...staticPages, ...dynamicPages]
}


//old code ------------------------------


// import { countryCode } from "@lib/constants"
// import { getCategoriesList } from "@lib/data/categories"
// import { getCollectionsList } from "@lib/data/collections"
// import { getProductsList } from "@lib/data/products"
// import { StoreProductCategory } from "@medusajs/types"
// import { MetadataRoute } from "next"

// export const BASE_URL =
//   process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

// enum ChangeFrequency {
//   Always = "always",
//   Hourly = "hourly",
//   Daily = "daily",
//   Weekly = "weekly",
//   Monthly = "monthly",
//   Yearly = "yearly",
//   Never = "never",
// }

// export type Sitemap = {
//   url: string
//   lastModified: string | Date | undefined
//   changeFrequency?: ChangeFrequency | undefined
//   priority?: number | undefined
// }

// const generateProductsRoute = async (
//   countryCode: string
// ): Promise<Sitemap[] | null> => {
//   try {
//     const {
//       response: { products },
//     } = await getProductsList({ countryCode })

//     const productsSitemap = products?.map((product) => ({
//       url: `${BASE_URL}/jewelry/${product.handle}`,
//       lastModified:
//         product.updated_at || product.created_at || new Date().toISOString(),
//       priority: 0.7,
//     }))

//     return productsSitemap
//   } catch (error) {
//     console.log("error while generating products sitemap")
//   }
//   return null
// }

// const generateCollectionRoute = async (): Promise<Sitemap[] | null> => {
//   try {
//     const { collections } = await getCollectionsList()

//     const collectionSitemap = collections?.map((collection) => ({
//       url: `${BASE_URL}/collections/${collection.handle}`,
//       lastModified:
//         collection.updated_at ||
//         collection.created_at ||
//         new Date().toISOString(),
//       priority: 0.7,
//     }))

//     return collectionSitemap
//   } catch (error) {
//     console.log("error while generating generateCollectionRoute")
//   }
//   return null
// }

// const generateCategoryRoutes = async (): Promise<Sitemap[] | null> => {
//   try {
//     const { product_categories } = await getCategoriesList()

//     const categoryRoutes: Sitemap[] = [];

//     const categoryHandleMap = new Map<string, string>() // id => handle
//     for (const productCategory of product_categories) {
//       categoryHandleMap.set(productCategory.id, productCategory.handle)
//       if (productCategory.parent_category) {
//         categoryHandleMap.set(
//           productCategory.parent_category.id,
//           productCategory.parent_category.handle
//         )
//       }
//     }
  
//     for (const productCategory of product_categories) {
//       // up to 3 levels supported
//       const route = [] as string[]

//       if (productCategory.parent_category?.parent_category_id) {
//         const grandparent = categoryHandleMap.get(
//           productCategory.parent_category.parent_category_id
//         )
//         if (grandparent) route.push(grandparent)
//       }
//       if (productCategory.parent_category_id) {
//         const parent = categoryHandleMap.get(productCategory.parent_category_id)
//         if (parent) route.push(parent)
//       }
//       route.push(productCategory.handle)

//       categoryRoutes.push({
//         url: `${BASE_URL}/t/${route.join('/')}`,
//         lastModified: productCategory.updated_at,
//         priority: 0.8,
//       })
//     }

//     return categoryRoutes
//   } catch (error) {
//     console.log("error in generating sitemap categoryRoutes")
//   }
//   return null
// }

// const generateStaticSitemap = async (): Promise<Sitemap[] | null> => {
//   try {
//     return [
//       {
//         url: `${BASE_URL}`,
//         lastModified: new Date().toISOString(),
//         priority: 1,
//       },
//       {
//         url: `${BASE_URL}/store`,
//         lastModified: new Date().toISOString(),
//         priority: 0.9,
//       },
//       {
//         url: `${BASE_URL}/about`,
//         lastModified: new Date().toISOString(),
//         priority: 0.7,
//       },
//       {
//         url: `${BASE_URL}/contact`,
//         lastModified: new Date().toISOString(),
//         priority: 0.7,
//       },
//       {
//         url: `${BASE_URL}/policy`,
//         lastModified: new Date().toISOString(),
//         priority: 0.7,
//       },
//       {
//         url: `${BASE_URL}/results`,
//         lastModified: new Date().toISOString(),
//         priority: 0.6,
//       },
//       {
//         url: `${BASE_URL}/search`,
//         lastModified: new Date().toISOString(),
//         priority: 0.6,
//       },
//       {
//         url: `${BASE_URL}/blogs`,
//         lastModified: new Date().toISOString(),
//         priority: 0.5,
//       },
//       {
//         url: `${BASE_URL}/jewelry-insurance-appraisal`,
//         lastModified: new Date().toISOString(),
//         priority: 0.5,
//       },
//     ]
//   } catch (error) {
//     console.log("error in generating static sitemap generateStaticSitemap")
//   }
//   return null
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const staticPages: Sitemap[] | null = await generateStaticSitemap()

//   const productsSitemap: Sitemap[] | null = await generateProductsRoute(
//     countryCode
//   )

//   const collectionSitemap: Sitemap[] | null = await generateCollectionRoute()

//   const categorySitemap: Sitemap[] | null = await generateCategoryRoutes()

//   return [
//     ...(staticPages ? staticPages : []),
//     ...(productsSitemap ? productsSitemap : []),
//     ...(collectionSitemap ? collectionSitemap : []),
//     ...(categorySitemap ? categorySitemap : []),
//   ]
// }
