import Image from "next/image"
import { Suspense } from "react"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import { StoreProductCategory } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import DiamondTop1 from "@images/diamond/diamond-top-1.jpg"
import DiamondTop2 from "@images/diamond/diamond-top-2.jpg"
import DiamondTop3 from "@images/diamond/diamond-top-3.jpg"
import DiamondTop4 from "@images/diamond/diamond-top-4.jpg"
import DiamondTop5 from "@images/diamond/diamond-top-5.jpg"
import PricingTable from "./diamondPricingTable"

const collections = [
  {
    name: "Women's",
    imageSrc: DiamondTop4,
    imageAlt: "Woman wearing an off-white cotton t-shirt.",
  },
  {
    name: "Men's",
    imageSrc: DiamondTop2,
    imageAlt: "Man wearing a charcoal gray cotton t-shirt.",
  },
  {
    name: "Desk Accessories",
    imageSrc: DiamondTop1,
    imageAlt:
      "Person sitting at a wooden desk with paper note organizer, pencil and tablet.",
  },
]

export default async function Diamond({
  category,
  sort,
  pageNumber,
  countryCode,
}: {
  category: StoreProductCategory
  sort?: string
  pageNumber?: string
  countryCode: string
}) {
  const parentCategory = category
  const looseDiamondsCategory = parentCategory.category_children?.find(
    (child: StoreProductCategory) => child.name === "Loose Diamonds"
  )

  const categoryId = looseDiamondsCategory?.id || parentCategory.id

  return (
    <main>
      <PageHeader
        name={category.name}
        subtitle={category.metadata?.subtitle}
        tidbit={category.description}
      />

      <div className="relative bg-white">
        {/* Background image and overlap */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden sm:flex sm:flex-col"
        >
          <div className="relative w-full flex-1 bg-dolginsblue">
            <div className="absolute inset-0 overflow-hidden"></div>
            <div className="absolute inset-0 bg-gray-900 opacity-50" />
          </div>
          <div className="h-16 w-full bg-white md:h-16 lg:h-16" />
        </div>

        <section
          aria-labelledby="collection-heading"
          className="relative -mt-96 sm:mt-0 pt-4"
        >
          <div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8">
            {collections.map((collection) => (
              <div
                key={collection.name}
                className="group relative h-96 rounded-lg bg-white shadow-xl sm:aspect-[1/1] sm:h-auto"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden rounded-lg"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      alt={collection.imageAlt}
                      src={collection.imageSrc}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PricingTable />
      </Suspense>

      <DolginsCTA
        title="Let's Design Some Jewelry"
        imageSrc={DiamondTop3}
        imageAlt="Joseph Dolginow showing off a 3D printed model, a rough casting, and a completed custom ring set with diamonds from her mother."
        text="We want you to love your jewelry. At Dolgins, we go to great lengths to ensure your jewelry is a piece you like and will like into the future."
      />

      <div className="content-container py-12 small:py-24">
        <div className="flex justify-between mb-8 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
            Shop Stunning Diamonds
          </h2>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            categoryId={categoryId}
            sortBy={sort as SortOptions}
            page={pageNumber ? parseInt(pageNumber) : 1}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
      <DolginsCTA
        title="Start The Process"
        text="Reach out, and we can discuss your idea and jewelry project."
        imageAlt={
          "Diagram of a custom ring figuring out measurements of each diamond."
        }
      />
    </main>
  )
}
