import { notFound } from "next/navigation"
import { Suspense } from "react"
import PageHeader from "@modules/layout/components/page-header"
import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Repair from "@modules/categories/repair"
import Custom from "@modules/categories/custom"
import Watch from "@modules/categories/watch"

export default function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  if (!category || !countryCode) notFound()

  if (category.name === "Jewelry Repair")
    return (
      <Repair
        sort={sort}
        pageNumber={pageNumber}
        category={category}
        countryCode={countryCode}
      />
    )

  if (category.name === "Custom Jewelry")
    return (
      <Custom
        sort={sort}
        pageNumber={pageNumber}
        category={category}
        countryCode={countryCode}
      />
    )

  if (category.name === "Watch Repair")
    return (
      <Watch
        sort={sort}
        pageNumber={pageNumber}
        category={category}
        countryCode={countryCode}
      />
    )

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/t/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
        </div>
        <PageHeader
          name={category.name}
          subtitle={category.metadata?.subtitle || "We Love This!"}
          tidbit={category.description}
        />
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-2">
              {category.category_children?.map((c) => {
                const route = [
                  "/t",
                  category.parent_category?.handle,
                  category.handle,
                  c.handle,
                ]
                  .filter(Boolean)
                  .join("/")
                return (
                  <li key={c.id}>
                    <InteractiveLink href={route}>{c.name}</InteractiveLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
