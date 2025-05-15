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
          className="relative sm:mt-0 pt-4"
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
      <div className="bg-white content-container">
        <p className="text-lg m-4">
          For four generations, my family has sold quality diamonds to Kansas
          City and beyond. We continue that tradition today. I work closely with
          you to find the perfect diamond for your jewelry.
        </p>
        <ul role="list" className="mt-8 space-y-8 text-gray-600">
          <li className="flex gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mt-1 size-5 flex-none text-gold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>
              <strong className="font-semibold text-dolginsblue">
                Trained Eye.
              </strong>{" "}
              Looking at a diamond is not like looking at a car. I been looking
              at diamonds for decades and know their subtleties.
            </span>
          </li>
          <li className="flex gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mt-1 size-5 flex-none text-gold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
              />
            </svg>

            <span>
              <strong className="font-semibold text-dolginsblue">
                Honest Assessments.
              </strong>{" "}
              I want to find the best diamond for you. Whethers that is a{" "}
              <Link className="text-gold" href="/lab-diamonds-v-natural">
                lab-grown or a natural.
              </Link>{" "}
              I can help you determine the most appropriate size and quality for
              your jewelry.
            </span>
          </li>
          <li className="flex gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mt-1 size-5 flex-none text-gold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>

            <span>
              <strong className="font-semibold text-dolginsblue">
                Everlasting Sparkle.
              </strong>{" "}
              Diamonds are beautiful because of way light travels through them.
              Find them is the first part.{" "}
              <Link className="text-gold" href="/t/custom-jewelry">
                Crafting a special piece for it
              </Link>{" "}
              is the next step.
            </span>
          </li>
        </ul>
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
        <div className="flex justify-center">
          <a href="/lab-diamonds-v-natural">
            <button className="mt-5 min-w-[10rem] rounded-md bg-dolginslightblue bg-gradient-to-br from-dolginsblue px-5 py-3 font-bold text-white shadow-xl shadow-gold">
              Learn More About Lab Grown Vs Natural Diamonds
            </button>
          </a>
        </div>
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
          <div className="mx-3 grid grid-cols-1 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Large box - Carat Weight */}
          <div className="md:col-span-8 md:row-span-2 bg-dolginsblue rounded-lg p-6">
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
          <div className="md:col-span-4 bg-dolginsblue/85 rounded-lg p-6">
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
          <div className="md:col-span-4 bg-dolginsblue/85 rounded-lg p-6">
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
          <div className="md:col-span-8 bg-dolginsblue rounded-lg p-6">
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
          <div className="md:col-span-4 bg-dolginsblue/85 rounded-lg p-6">
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
