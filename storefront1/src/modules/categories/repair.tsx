import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import Testimonial from "@modules/layout/components/testimonial"
import JPD from "@images/repairs/JPD.jpg"
import ML from "@images/repairs/ML.jpg"
import Example1 from "@images/repairs/ring-repair-example-1.jpg"
import Example2 from "@images/repairs/ring-repair-example-2.jpg"
import Example3 from "@images/repairs/ring-repair-example.jpg"
import Example4 from "@images/repairs/ring-repair-example-3.jpg"
import FrontImage from "@images/repairs/ring-ready-for-repairs.jpg"
import PolishingHands2 from "@images/repairs/Polishing.jpg"
import SapphireRing from "@images/repairs/sapphire-antique-ring-repair.jpg"

const RepairFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How expensive is a ring sizing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The price depends on a few factors including sizing up or down, metal, width, and other labor involved securing diamonds or gemstones. Expect to pay $150 with a range of $75 to $500.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have a guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We complete repairs to the best of our ability and stand behind our work with a handshake rather than some legal corporate policy. The exact guarantee depends on the nature of the work and are discussed with the initial estimate. Also, we do have insurance to cover monetary loss if a repair does not go smoothly. Ultimately, we want you to wear and enjoy your piece rather than worrying about it.",
      },
    },
    {
      "@type": "Question",
      name: "How long do repairs take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good rule of thumb is one week. Certain times of the year, we are busier, so the repair may take a little longer. Complicated repairs often take longer than a week especially if the repair has multiple steps involved. If you are on a time crunch, let us know, and we can determine if we can accommodate.",
      },
    },
    {
      "@type": "Question",
      name: "Do you repair silver or costume jewelry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, we limit ourselves to fine jewelry. For us to work on silver jewelry, we have to charge about the same as we would for a gold or platinum piece, which most people are not willing to pay. Also, fine jewelry uses techniques and materials which wear better and are easier to repair versus costume jewelry. If a piece of silver or costume jewelry breaks, I suggest returning it to wherever it was purchased. As a rule: the less expensive the piece of jewelry, the more difficult the repair.",
      },
    },
  ],
}

const features = [
  {
    name: "Reconstruct The Gold Ring.",
    description:
      "The ring had worn, so we rebuild the prongs, the shank, and the channels with 14 karat yellow gold maing the ring look new again.",
  },
  {
    name: "Recut And Polish Emerald.",
    description:
      "Emeralds are soft, and this one has abraided and chipped. We had our lapidary repolish the stone, so it sparkled again.",
  },
  {
    name: "Reset And Refinish.",
    description:
      "We finished the ring by resetting the original emerald and diamonds. Once polished, the ring was restored to how it looked when she and her husband first purchased it.",
  },
]

const incentives = [
  {
    name: "How It Started",
    imageSrc: Example1,
    alt: "How the ring arrived in our jewelry store.",
    description:
      "How it arrived after years of wear. The emeralds were abraided, diamonds fallen out, and shank damaged.",
  },
  {
    name: "What We Did",
    imageSrc: Example2,
    alt: "Emerald and diamond ring on the bench before final polishing",
    description:
      "Work in progress on Marsha bench repairing the shank, repolishing the emerald, and refinshing the ring.",
  },
  {
    name: "How It Ended",
    imageSrc: Example3,
    alt: "Emerald and diamond ring completed repaired.",
    description:
      "The ring completely repaired just like the day she and her husband purchased it.",
  },
]

const Repair = (props: any) => {
  const { category, sort, countryCode, pageNumber } = props

  return (
    <div>
      <PageHeader
        name={category.name}
        subtitle={category.metadata.subtitle}
        tidbit={category.description}
      />
      <pre>{JSON.stringify(category, null, 2)}</pre>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl py-8 sm:px-2 sm:py-8 lg:px-4">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
            <div className="grid grid-cols-1 items-center gap-y-10 gap-x-16 lg:grid-cols-2">
              <div>
                <div className="grid grid-cols-2 justify-items-center gap-3">
                  <Image
                    src={JPD}
                    className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                    alt="Joseph Dolginow evaluating a piece for jewelry for repair in Kansas City."
                    priority
                  />
                  <Image
                    src={ML}
                    className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                    alt="Marsha busy at the jewelers bench repairing a missing diamond."
                    priority
                  />
                </div>
                <p className="mt-4 text-gray-500 max-w-prose">
                  We want to help you with any of your jewelry repairs in our
                  state-of-the-art jewelry shop. At Dolgins, Marsha,{" "}
                  <Link className="text-dolginslightblue" href="/about">
                    a master jeweler who started at Dolgin's in Kansas City over
                    40 years ago
                  </Link>
                  . We have the experience to fix any problem and ensure it will
                  last well into the future. Our jewelry store in Overland Park,
                  KS is equipped with all the latest technology including a{" "}
                  <Link
                    className="text-dolginslightblue"
                    href="/about/tour#tools"
                  >
                    laser welder and bench scope
                  </Link>{" "}
                  to make sure your repair is completed correctly.{" "}
                  <Link
                    className="text-dolginslightblue"
                    href="/categories/jewelry-repair/watches"
                  >
                    For more information on watch repair, click here.
                  </Link>
                </p>
              </div>
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={FrontImage}
                  alt="Ready on the bench ready to be soldered."
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <DolginsCTA
        title="Start Your Jewelry Repair"
        imageSrc={PolishingHands2}
        imageAlt="Marsha polishing a yellow gold ring set with a round green emerald"
        text="Please reach out if you are interested. We can answer any question and are happy to help!"
      />

      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
        />
      </Suspense>

      <section>
        <div className="overflow-hidden bg-white py-8 sm:py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-lg font-semibold leading-8 tracking-tight text-dolginsblue">
                    Example Repair
                  </h2>
                  <p className="mt-2 text-3xl font-serif tracking-tight text-dolginslightblue sm:text-4xl">
                    Emerald Engagement Ring Restoration
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    We originally custom-made this 14 karat yellow gold
                    engagement ring and wedding band in the 1990s. It featured a
                    stunning emerald with two round diamond accents and a
                    channel set band.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Image
                      src={Example1}
                      className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      alt="14 karat yellow gold ring before repairs"
                    />
                    <Image
                      src={Example2}
                      className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      alt="Yellow gold engagement ring on the bench while being fixed"
                    />
                  </div>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    {features.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-gray-900">
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <Image
                src={Example4}
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="relative flex flex-col justify-start overflow-hidden bg-dolginsblue py-6">
        <div className="relative w-full bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
          <div className="mx-auto px-5">
            <div className="flex flex-col items-center">
              <h2 className="text-5xl font-serif font-gold tracking-tight border-b-2 border-gold pb-2">
                FAQ
              </h2>
              <p className="mt-3 text-lg text-dolginsblue md:text-xl">
                Frequenty Asked Questions About Jewelry Repairs
              </p>
            </div>
            <div className="mx-auto mt-8 grid max-w-xl divide-y divide-gold">
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>Do you have a guarantee?</span>
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
                    We complete repairs to the best of our ability and stand
                    behind our work with a handshake rather than some legal
                    corporate policy. The exact guarantee depends on the nature
                    of the work and are discussed with the initial estimate.
                    Also, we do have insurance to cover monetary loss if a
                    repair does not go smoothly. Ultimately, we want you to wear
                    and enjoy your piece rather than worrying about it.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>How long do repairs take?</span>
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
                    A good rule of thumb is one week. Certain times of the year,
                    we are busier, so the repair may take a little longer.
                    Complicated repairs often take longer than a week especially
                    if the repair has multiple steps involved. If you are on a
                    time crunch, let us know, and we can determine if we can
                    accommodate.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>Do you repair or size “while you wait”?</span>
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
                    No, and we suggest you avoid places that do. First, our shop
                    is busy enough that we cannot operate like that. Second, no
                    one does their best work with someone waiting and staring at
                    them. Third, sizing rings can be complicated and often takes
                    longer than you would want to wait. For example, our
                    thorough cleaning process which is necessary to complete
                    before soldering or welding on gold or platinum often takes
                    hours. I can assure you most jewelry repairs are completed
                    in our small office. We are well-qualified and insured, so
                    you can feel comfortable leaving your valuables with us.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>Do you repair silver or costume jewelry?</span>
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
                    No, we limit ourselves to fine jewelry. For us to work on
                    silver jewelry, we have to charge about the same as we would
                    for a gold or platinum piece, which most people are not
                    willing to pay. Also, fine jewelry uses techniques and
                    materials which wear better and are easier to repair versus
                    costume jewelry. If a piece of silver or costume jewelry
                    breaks, I suggest returning it to wherever it was purchased.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>
                      Do you ever advise against repairing a piece of jewelry?
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
                    Fine jewelry does wear out. On occasion, we will advise you
                    against completing a repair. Jewelry, especially rings and
                    bracelets, do wear out as gold slowly wears down. Yes, we
                    can almost always fix them, but some repairs we do not
                    suggest completing because the price of a new piece may be
                    less.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Testimonial
        reviewer="Kelly P."
        who="Recommended By A Friend"
        review="Dolgin's did a wonderful job refurbishing a ring I inherited from
         my mother after she passed away recently. They understood the sentimental value of
         the piece of jewelry, and they cleaned, sized and restored it to be even more beautiful
         than I imagined! They went above and beyond to replace everything to how it had been originally.
         I will treasure this ring for the rest of my life,
         and pass it along to the next generation. Thank you so much for your help!"
        imageSrc={SapphireRing}
        imageAlt="Antique sapphire ring in platinum with custom cut sapphire being reset"
      />
    </div>
  )
}

export default Repair
