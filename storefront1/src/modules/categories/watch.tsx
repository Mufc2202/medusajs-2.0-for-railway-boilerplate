import Image from "next/image"
import { Suspense } from "react"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import Watch7 from "@images/repairs/101664875.jpg"
import Watch5 from "@images/repairs/watch-repair-5.jpg"
import WatchBattery from "@images/repairs/watch-battery-replacement.jpg"

const Watch = (props: any) => {
  const { category, sort, countryCode, pageNumber } = props

  return (
    <div>
      <main>
        <PageHeader
          name={category.name}
          subtitle={category.metadata.subtitle}
          tidbit={category.description}
        />
        <div>
          <div className="mx-auto max-w-7xl py-6 sm:px-2 sm:py-5 lg:px-4">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
              <div className="grid grid-cols-1 items-center gap-y-10 gap-x-16 lg:grid-cols-2">
                <div>
                  <p className="mt-4 text-gray-500">
                    Estimates are free. Our prices are competitive; however,
                    owning a luxury timepiece is expensive. The most common
                    watch repair is a clean, oil, and adjustment, which normally
                    runs about $600. Replacement faces (or glass or crystals)
                    are also common, but there is more variation in the cost of
                    that repair depending on the material (glass vs plastic vs
                    sapphire) and size. Repairing watches is not easy as they
                    have have so many moving parts and need to work so
                    precisely. I work with a master watchmaker who has the
                    decades of experience, access to factory parts, and a
                    precision touch. He can service any brand watch including
                    Rolex, Tag Heuer Cartier, Breitling, Movado,
                    Jaeger-LeCoultre, Ebel, Elgin, and Patek Philippe often
                    using factory parts. I provide a{" "}
                    <span className="text-gray-900">free estimate</span> before
                    beginning the work and{" "}
                    <span className="text-gray-900">
                      guarantee the work for 1 year
                    </span>
                    .
                  </p>
                  <p className="text-center text-gray-500 mt-2">
                    Please Note: I do{" "}
                    <span className="font-extrabold">NOT</span> work on watch
                    bands.
                  </p>
                </div>
                <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={Watch5}
                    alt="Restored pocket watch open showing the movement inside"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-container py-12 small:py-24">
          <div className="flex justify-between mb-8 border-b-2 border-gold">
            <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
              Common Watch Repairs
            </h2>
          </div>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>

        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0">
                <Image
                  src={WatchBattery}
                  alt="Watch with batteries being replaced"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="relative bg-gray-900 bg-opacity-75 px-6 sm:py-40 sm:px-12 lg:px-16">
                <div className="relative mx-auto flex py-4 max-w-3xl flex-col items-center text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <span className="block sm:inline">
                      Watch Battery Replacement
                    </span>
                  </h2>
                  <p className="mt-3 text-xl text-white">
                    In addition to repairing and maintaining on fine watches, we
                    replace watch batteries in our Overland Park jewelry store.
                    The charge is normally between $20 and $30 depending on the
                    battery and takes only a few minutes while you wait. More
                    complicated watch batteries are more expensive and will
                    require more time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DolginsCTA
          title="Start Your Watch Repair"
          text="Estimates to repair your watch are free. We can help get it working again."
          imageSrc={Watch7}
          imageAlt="Fully restored and stunning gold pocket watch."
        />
      </main>
    </div>
  )
}

export default Watch
