import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import Testimonial from "@modules/layout/components/testimonial"
import Custom1 from "@images/custom/custom-jewelry-1.jpg"
import Custom2 from "@images/custom/custom-jewelry-2.jpg"
import Custom3 from "@images/custom/custom-jewelry-13.jpg"
import Custom4 from "@images/custom/custom-jewelry-14.jpg"
import Custom5 from "@images/custom/custom-jewelry-15.jpg"
import Custom6 from "@images/custom/custom-jewelry-16.jpg"
import Design from "@images/custom/Design.jpg"
import Yellow from "@images/custom/Yellow-Diamond-Ring.jpg"
import Purple from "@images/custom/Purple-Sapphire-Ring.jpg"

const Custom = (props: any) => {
  const { category, sort, countryCode, pageNumber } = props

  return (
    <main>
      <PageHeader
        name={category.name}
        subtitle={category.metadata.subtitle}
        tidbit={category.description}
      />
      <section>
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <Image
            src={Custom6}
            alt="Emerald cut diamond engagement in 18 karat yellow gold"
            className="h-full w-full object-scale-down object-bottom rounded-md"
            priority
          />
          <Image
            src={Custom3}
            alt="Unique custom coin ring set with a Hobo Nickel"
            className="h-full w-full object-scale-down object-bottom rounded-md"
            priority
          />
          <Image
            src={Custom5}
            alt="Men's emerald cut diamond wedding ring after being set and sized "
            className="h-full w-full object-scale-down object-bottom rounded-md"
            priority
          />
          <Image
            src={Custom4}
            alt="15 carat cushion cut sapphire pendant with custom cut epaulette diamond"
            className="h-full w-full object-scale-down object-bottom rounded-md"
            priority
          />
        </div>
      </section>
      <section>
        <div className="bg-dolginsblue pt-12 sm:pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                When You Want Something Right
              </h2>
              <p className="mt-3 text-xl text-gray-100 sm:mt-4">
                We have honed the process for creating custom jewelry over many
                years in order to ensure the result is a piece you will love. In
                addition, we work to honor your budget for a given jewelry
                project and will be honest if we cannot complete the project
                within your budget.
              </p>
            </div>
          </div>
          <div className="mt-10 bg-white pb-12 sm:pb-16">
            <div className="relative">
              <div className="absolute inset-0 h-1/2 bg-dolginsblue" />
              <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                  <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                      <Image
                        src={Design}
                        alt="3D Cad design of halo ring"
                        className="h-full w-full object-scale-down object-bottom"
                      />
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                        Designing
                      </dt>
                      <dd className="order-1 text-5xl font-bold tracking-tight text-dolginsblue">
                        Together
                      </dd>
                    </div>
                    <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                      <Image
                        src={Yellow}
                        alt="Canary Yellow Diamond Ring ready to be set"
                        className="h-full w-full object-scale-down object-bottom"
                      />
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                        Crafting
                      </dt>
                      <dd className="order-1 text-5xl font-bold tracking-tight text-dolginsblue">
                        Our Shop
                      </dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <Image
                        src={Purple}
                        alt="Wearing a purple sapphire halo ring"
                        className="h-full w-full object-scale-down object-bottom"
                      />
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                        Enjoying
                      </dt>
                      <dd className="order-1 text-5xl font-bold tracking-tight text-dolginsblue">
                        For You
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="relative flex flex-col justify-start overflow-hidden bg-gray-50 py-6">
          <div className="relative w-full bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
            <div className="mx-auto px-5">
              <div className="flex flex-col items-center">
                <h2 className="text-5xl font-serif font-gold tracking-tight border-b-2 border-gold pb-2">
                  FAQ
                </h2>
                <p className="mt-3 text-lg text-dolginsblue md:text-xl">
                  Frequenty Asked Questions About Custom Jewelry
                </p>
              </div>
              <div className="mx-auto mt-8 grid max-w-xl divide-y divide-gold">
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> How expensive is a custom ring?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      Custom jewelry ranges in price. We have made custom
                      solitaire pendants which feature one diamond or gemstone
                      for under $800. Custom engagement rings start around
                      $1,500 for just the ring. Complicated designs with
                      multiple metals tend to be more expensive. Most pieces
                      range from $2,000 to $6,000 excluding large diamonds or
                      gemstones. Estimates are given before the project begins.
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> How long does a custom piece take?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      We can create a model and custom ring in as little as 2
                      weeks; however, that never happens. Usually the process
                      takes around 6 weeks. Creating a 3D model and agreeing on
                      a design typically takes the longest amount of time
                      especially if we do a few iterations. Casting and crafting
                      the piece normally takes about 2 to 3 weeks.
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> Can I use my diamonds or gemstones?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      Yes! We love crafting jewelry that repurposes diamonds or
                      gemstones from unwanted or inherited pieces. We work with
                      you to identify and create a custom piece that can use
                      these (sometimes mismatched) parts. However, if you do not
                      own your perfect diamond or gemstone, we love helping you
                      with that part of the purchase as well.
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span>
                        Can you duplicate or copy a ring I have or saw?
                      </span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      Yes, we can make an exact{" "}
                      <Link
                        href="/jewelry/duplicating-a-ring-or-jewelry"
                        className="text-dolginslightblue"
                      >
                        replica of a piece of jewelry or ring
                      </Link>{" "}
                      you have or saw elsewhere. We commonly make replica of
                      heirloom rings, so more family members can enjoy a piece.
                      In addition, we can{" "}
                      <Link
                        className="text-dolginslightblue"
                        href="https://dolgins.com/jewelry/baguette-round-band"
                      >
                        duplicate a costume piece in fine materials
                      </Link>
                      .
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> Will I like it?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      Our process works. Whether you have a blank slate and want
                      us to create ideas or you have a piece you have seen and
                      want to recreate, we take steps and iterate to know we get
                      it right before you even see a final product.{" "}
                      <Link
                        className="text-dolginslightblue"
                        href="/about/tour#tools"
                      >
                        We print the model on a 3D printer
                      </Link>{" "}
                      and have you try on before approving purchase, so you do
                      not need to imagine what the piece will look like. If a
                      piece just is not right, we are small shop and will work
                      with you fairly make a piece you love.
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> Who designs the piece?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      It is collaborative. We do design pieces for us, and they
                      are available to purchase. However, most custom pieces
                      start with a cue from you. We develop ideas around that
                      cue and ensure the piece is properly designed to be worn
                      and enjoyed. In addition, we will contribute design
                      details we have seen and liked if we see fit.
                    </p>
                  </details>
                </div>
                <div className="py-5">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <span> Do you offer any discounts or promotions?</span>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      We have not offered discounts or promotions or sales in
                      over 15 years. We price our jewelry fairly everyday of the
                      week and every week of the year. It is easier for you and
                      us that way.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DolginsCTA
        title="Let's Design Some Jewelry"
        imageSrc={Custom1}
        imageAlt="Joseph Dolginow showing off a 3D printed model, a rough casting, and a completed custom ring set with diamonds from her mother."
        text="We want you to love your jewelry. At Dolgins, we go to great lengths to ensure your jewelry is a piece you like and will like into the future."
      />
      <section>
        <div className="relative flex flex-col justify-start overflow-hidden bg-gray-50 py-6">
          <div className="relative w-full bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
            <div className="mx-auto px-5">
              <div className="flex flex-col items-center">
                <h2 className="mt-5 text-center text-3xl text-dolginsblue font-bold tracking-tight md:text-5xl">
                  3D Jewelry Model
                </h2>
                <p className="mt-3 text-lg text-dolginsblue md:text-xl">
                  Download A Model We Made
                </p>
                <a href="/ExampleModel.stl" target="_blank">
                  <button className="to mt-5 min-w-[10rem] rounded-md bg-dolginslightblue bg-gradient-to-br from-dolginsblue px-5 py-3 font-bold text-white shadow-xl shadow-gold">
                    Download STL Model Here
                  </button>
                </a>
              </div>
            </div>
            <p className="mt-3 text-lg text-dolginsblue md:text-xl">
              This model is for a custom solitaire engagement ring featuring an
              square emerald cut diamond center. The emerald cut diamond is
              bezel set in the ring which also features a fancy basket setting.
              We completed the ring with some micro milgrain edging. We cast the
              ring in platinum creating a{" "}
              <Link
                href="/jewelry/2-carat-asscher-engagement-ring"
                className="text-dolginslightblue"
              >
                solid heirloom engagement ring
              </Link>
              . We make the 3D models and{" "}
              <Link className="text-dolginslightblue" href="/about/tour#tools">
                print them
              </Link>
              , so you know how your piece will look.
            </p>
          </div>
        </div>
      </section>

      <div className="content-container py-12 small:py-24">
        <div className="flex justify-between mb-8 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
            A Few Custom Jewelry Commissions
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
      <DolginsCTA
        title="Start The Process"
        text="Reach out, and we can discuss your idea and jewelry project."
        imageSrc={Custom2}
        imageAlt={
          "Diagram of a custom ring figuring out measurements of each diamond."
        }
      />
    </main>
  )
}

export default Custom
