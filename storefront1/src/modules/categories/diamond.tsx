import Image from "next/image"
import Link from "next/link"
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
import Round from "@images/diamond/DiamondShapes/round.svg"
import Oval from "@images/diamond/DiamondShapes/oval.svg"
import Pear from "@images/diamond/DiamondShapes/pear.svg"
import Princess from "@images/diamond/DiamondShapes/princess.svg"
import Marquise from "@images/diamond/DiamondShapes/marquise.svg"
import Heart from "@images/diamond/DiamondShapes/heart.svg"
import Emerald from "@images/diamond/DiamondShapes/emerald.svg"
import Radiant from "@images/diamond/DiamondShapes/radiant.svg"
import Cushion from "@images/diamond/DiamondShapes/cushion.svg"
import Asscher from "@images/diamond/DiamondShapes/asscher.svg"

const shapePosts = [
  {
    name: "Round",
    imageSrc: Round,
    imageAlt: "Round diamond top view drawing outline",
    text: "The most popular shape, known for its brilliance and fire. They pop in almost any setting style and are my personal favorite.",
    link: "/t/diamonds/round-brilliant",
  },
  {
    name: "Oval",
    imageSrc: Oval,
    imageAlt: "Oval diamond top view drawing outline",
    text: "Gained popularity as the 2nd most requested shape. Their elongated looks looks beautiful as a center or an accent.",
    link: "/t/diamonds/oval",
  },
  {
    name: "Pear",
    imageSrc: Pear,
    imageAlt: "Pear diamond top view drawing outline",
    text: "Pointed and rounded, pear-shaped diamonds are a classic in jewelry. I love a pear-shaped diamond in an pendant.",
    link: "/t/diamonds/pear-shaped",
  },
  {
    name: "Princess",
    imageSrc: Princess,
    imageAlt: "Princess diamond top view drawing outline",
    text: "The square that took over jewelry for decades in the late 1980s and 1990s. Princess cut diamonds pop like a round but have the design possibilities of a square.",
    link: "/t/diamonds/square-princess-cut",
  },
  {
    name: "Marquise",
    imageSrc: Marquise,
    imageAlt: "Marquise diamond top view drawing outline",
    text: "The long and narrow shape makes marquise diamonds look large and beautiful. So many beautiful setting options exists for them including as accents, in North-South, or East-west across the finger.",
    link: "/t/diamonds/marquise-shaped",
  },
  {
    name: "Heart",
    imageSrc: Heart,
    imageAlt: "Heart diamond top view drawing outline",
    text: "Nothing says love like a heart-shaped diamond, but beautiful heart-shaped diamonds can be difficult to find.",
    link: "/t/diamonds/heart-shaped",
  },
  {
    name: "Emerald",
    imageSrc: Emerald,
    imageAlt: "Emerald diamond top view drawing outline",
    text: "A classic and timeless shape featuring unique step cut facets. Emerald cuts need to be clean and white to be at their best.",
    link: "/t/diamonds/emerald-cut",
  },
  {
    name: "Radiant",
    imageSrc: Radiant,
    imageAlt: "Radiant diamond top view drawing outline",
    text: "Either elongated or square, radiant cut diamonds can be stunning. Their straight sides and corners make them a great choice in so many settings styles.",
    link: "/t/diamonds/radiant-cut",
  },
  {
    name: "Cushion",
    imageSrc: Cushion,
    imageAlt: "Cushion diamond top view drawing outline",
    text: "Either elongated or square, cushion cut diamonds can be stunning. They are common in fancy colored diamonds.",
    link: "/t/diamonds/cushion-cut",
  },
  {
    name: "Asscher",
    imageSrc: Asscher,
    imageAlt: "Asscher diamond top view drawing outline",
    text: "The square cut diamond is a modern and chic shape that is a great choice for a center stone. Its faceting is similar to an emerald cut.",
    link: "/t/diamonds/asscher-cut",
  },
  {
    name: "Specialty Shapes",
    imageSrc: Asscher,
    imageAlt: "Asscher diamond top view drawing outline",
    text: "So many variations of specialty shapes exist, and most are stunning as centers or accents. We love a unique look and specialty shapes often provide just that.",
    link: "/t/diamonds/specialty",
  },
]

const collections = [
  {
    name: "Three Stone with Heart",
    imageSrc: DiamondTop4,
    imageAlt:
      "Three stone diamond ring with emerald cut center and heart background.",
  },
  {
    name: "JPD",
    imageSrc: DiamondTop2,
    imageAlt:
      "Joseph Dolginow at Dolgins Jewelry Store showing off a round brilliant diamond in tweezers.",
  },
  {
    name: "10 Carat Pear",
    imageSrc: DiamondTop1,
    imageAlt:
      "10 carat pear-shaped natural diamond on the jewelers bench in Overland Park, Kansas.",
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
        <p className="text-lg mb-4">
          For four generations, my family has sold quality diamonds to Kansas
          City and beyond. We continue that tradition today. I work closely with
          you to find the perfect diamond for your jewelry. My trained eye and
          decades worth of relationships with diamond cutters allows me to find
          the best diamonds for your jewelry.
        </p>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            categoryId={categoryId}
            sortBy={sort as SortOptions}
            page={pageNumber ? parseInt(pageNumber) : 1}
            countryCode={countryCode}
          />
        </Suspense>
        <div className="flex justify-between mb-4 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pt-8">
            See Diamond Prices
          </h2>
        </div>
        <p className="text-lg mb-4">
          Here is a quick run down of diamond prices. Lab-grown diamonds are
          priced differently than naturally-found diamonds. Larger diamonds are
          more expensive, and often exponentially so. Lastly, the quality of the
          diamond is important in diamond prices with whiter and cleaner and
          more brilliant diamonds being more expensive.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <PricingTable />
        </Suspense>
      </div>

      <div className="bg-white content-container">
        <div className="flex justify-between mb-4 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
            Undestand Diamond Shapes
          </h2>
        </div>
        <p className="text-lg mb-4">
          Diamonds are cut into many different shapes, and each shape has its
          own unique characteristics. They work as the center of any piece of
          jewelry including an engagement ring or as accents.
        </p>
        <div className="mx-auto max-w-7xl">
          <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3 lg:grid-cols-4">
            {shapePosts.map((shape, index) => (
              <div
                key={shape.name}
                className={`rounded-lg p-8 sm:p-10 ${
                  index % 2 === 0 ? "bg-dolginsblue" : "bg-dolginsblue/85"
                }`}
              >
                <Image
                  alt={shape.imageAlt}
                  src={shape.imageSrc}
                  width={158}
                  height={48}
                  className="max-h-12 w-full object-contain"
                />
                <h3 className="text-2xl font-serif border-gold border-b-2 text-white text-center tracking-tight pb-2">
                  {shape.name}
                </h3>
                <p className="text-white">{shape.text}</p>
                <a
                  href={shape.link}
                  className="mt-4 inline-block text-sm font-medium text-white hover:text-dolginslightblue"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between m-4 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
            Learn About Diamond Quality
          </h2>
        </div>
        <p className="text-lg mb-4">
          In the 1950s, the Gemological Institute of America (GIA) developed a
          system for grading diamonds. This system is now the industry standard
          for diamond grading. Their system is used by jewelers and consumers
          alike to understand the quality of a diamond. It is not perfect, but
          it is a good starting point and the standard by which I grade.
        </p>
        <div className="grid grid-cols-12 gap-4 mb-8">
          {/* Large box - Carat Weight */}
          <div className="col-span-8 row-span-2 bg-dolginsblue rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-serif text-white border-b-2 border-gold pb-2">
                Carat Weight
              </h3>
            </div>
            <p className="text-white">
              Carat weight is how a diamond is measured. One carat equals 200
              milligrams. Larger diamonds are rarer and more valuable, but size
              isn't everything. The quality of the cut, color, and clarity also
              significantly impact a diamond's beauty.
            </p>
          </div>

          {/* Medium box - Cut */}
          <div className="col-span-4 bg-dolginsblue/85 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-serif text-white border-b-2 border-gold pb-2">
                Cut
              </h3>
            </div>
            <p className="text-white">
              The cut determines how well a diamond reflects light. A well-cut
              diamond will sparkle brilliantly, while a poorly cut one may
              appear dull.
            </p>
          </div>

          {/* Small box - Color */}
          <div className="col-span-4 bg-dolginsblue/85 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-serif text-white border-b-2 border-gold pb-2">
                Color
              </h3>
            </div>
            <p className="text-white">
              Diamond color grades range from D (colorless) to Z (light yellow).
              The less color, the higher the grade.
            </p>
          </div>

          {/* Medium box - Clarity */}
          <div className="col-span-8 bg-dolginsblue rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-serif text-white border-b-2 border-gold pb-2">
                Clarity
              </h3>
            </div>
            <p className="text-white">
              Clarity refers to the presence of internal and external
              characteristics in a diamond. These characteristics are often
              microscopic and don't affect the diamond's beauty to the naked
              eye.
            </p>
          </div>

          {/* Small box - Certification */}
          <div className="col-span-4 bg-dolginsblue/85 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-serif text-white border-b-2 border-gold pb-2">
                Certification
              </h3>
            </div>
            <p className="text-white">
              A diamond certificate from a reputable laboratory like GIA
              provides an unbiased assessment of the diamond's quality
              characteristics.
            </p>
          </div>
        </div>
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
