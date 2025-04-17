import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"

export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*categories",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+metadata,+variants.inventory_quantity,*seo_details,*seo_details.metaSocial,*categories",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 10000
  const validPageParam = Math.max(pageParam, 1)
  const offset = (validPageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Debug logging
  console.log('getProductsList params:', {
    limit,
    offset,
    region_id: region.id,
    queryParams,
    category_id: queryParams?.category_id
  })

  // Ensure category_id is properly formatted
  const formattedQueryParams = {
    ...queryParams,
    category_id: queryParams?.category_id?.[0] || undefined // Take the first category ID if it's an array
  }

  // Debug logging
  console.log('getProductsList formatted params:', {
    ...formattedQueryParams,
    category_id: formattedQueryParams.category_id
  })

  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields:
          "*variants.calculated_price,+metadata,*seo_details,*seo_details.metaSocial,*variants.inventory_quantity,*categories",
        ...formattedQueryParams,
      },
      { next: { tags: ["products"] } }
    )
    .then((response) => {
      // Debug logging
      console.log('getProductsList API response:', response)

      const { products, count } = response

      // Debug logging for each product's categories
      console.log('Product categories:')
      products.forEach(product => {
        console.log(`Product ${product.id} (${product.title}):`, {
          categories: product.categories?.map(cat => ({
            id: cat.id,
            name: cat.name
          }))
        })
      })

      // Debug logging
      console.log('getProductsList processed response:', {
        count,
        productCount: products.length,
        firstProduct: products[0] ? {
          id: products[0].id,
          title: products[0].title,
          categories: products[0].categories
        } : null
      })

      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage,
        queryParams,
      }
    })
})

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const getProductsListWithSort = cache(async function ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12

  // Debug logging
  console.log('getProductsListWithSort params:', {
    page,
    queryParams,
    sortBy,
    countryCode,
    category_id: queryParams?.category_id
  })

  const {
    response: { products, count },
  } = await getProductsList({
    pageParam: page + 1, // Add 1 because page is 0-based but pageParam is 1-based
    queryParams: {
      ...queryParams,
      limit,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  // Debug logging
  console.log('getProductsListWithSort response:', {
    count,
    productCount: sortedProducts.length,
    firstProduct: sortedProducts[0] ? {
      id: sortedProducts[0].id,
      title: sortedProducts[0].title,
      categories: sortedProducts[0].categories
    } : null,
    category_id: queryParams?.category_id
  })

  const nextPage = count > (page + 1) * limit ? page + 1 : null

  return {
    response: {
      products: sortedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})
