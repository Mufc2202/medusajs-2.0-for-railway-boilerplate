import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  CategoryByHandle,
  getCategoryByHandle,
  listCategories,
} from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import {
  APPLICATION_NAME,
  BASE_URL,
  countryCode,
  FB_APP_ID,
  FB_USER_ID,
  GENERATOR,
  PUBLISHER,
  SITE_NAME,
  TWITTER_CREATER,
  TWITTER_SITE_ID,
} from "@lib/constants"
import { CustomCategory } from "types/global"
import { sdk } from "@lib/config"

type Props = {
  params: { category: string[] }
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

type Params = {
  params: Promise<{
    handle: string[]
  }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

type OGProps = {
  url: string
  width: number
  height: number
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

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

  const staticParams = []

  for (const countryCode of countryCodes) {
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

      staticParams.push({
        countryCode,
        category: route,
      })
    }
  }

  return staticParams
}

export const dynamicParams = false // don't allow any route

const buildCategoryUrl = async (category: CustomCategory) => {
  const categoryPathIds = category?.parent_category?.mpath?.split(".")

  const { product_categories }: { product_categories: CustomCategory[] } =
    categoryPathIds?.length
      ? await sdk.client.fetch(
          `/store/product-categories?fields=id,handle&id[]=${categoryPathIds.join(
            ","
          )}`,
          {
            method: "GET",
            next: {
              tags: [`canonical-url-${category.handle}`],
              revalidate: 3600,
            },
            cache: "force-cache",
          }
        )
      : { product_categories: [] }

  return `${BASE_URL}/categoria/${[
    ...product_categories?.map((x) => x.handle),
    category?.handle,
  ].join("/")}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const product_category = (await CategoryByHandle(
    category
  )) as unknown as CustomCategory

    const title = product_categories
      .map((category: StoreProductCategory) => category.name)
      .reverse()
      .join(" | ")

  const openGraphImages: OGProps[] = [
    {
      url:
        product_category?.seo_details?.metaImage ||
        product_category?.category_details?.thumbnail ||
        "",
      width: 1600,
      height: 1200,
    },
  ]

    return {
      title: `${title} | Dolgins Jewelry`,
      description,
      alternates: {
        canonical: `/t/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page } = await searchParams
  params = await params

  const { product_categories } = await getCategoryByHandle(params.category)

  if (!product_categories) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={product_categories}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
