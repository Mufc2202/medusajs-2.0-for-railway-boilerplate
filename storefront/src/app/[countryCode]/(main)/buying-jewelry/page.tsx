import Image from "next/image"
import { Metadata } from "next"
import Link from "next/head"
import Appraising from "/src/images/buying/Appraising-2.jpg"
import Camera from "/src/images/buying/Camera-2.jpg"
import GoldBuying from "/src/images/buying/Gold-buying-2.jpg"
import RingCash from "/src/images/buying/Cash-Ring.jpg"
import EngagementRing from "/src/images/buying/Divorced.jpg"
import Inherited from "/src/images/buying/inherited.jpg"
import Divorced from "/src/images/buying/divorced2.jpg"
import Worn from "/src/images/buying/worn-out.jpg"
import Trade from "/src/images/buying/trade.jpg"
import Repurposed from "/src/images/buying/repurpose.jpg"
import Need from "/src/images/buying/need-money.jpg"
import Evaluation from "/src/images/buying/evaluation.jpg"
import Testimonial from "@modules/layout/components/testimonial"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"

const exampleBuys = [
  {
    Name: "Inherited",
    Image: Inherited,
    Alt: "Gold nugget ring with round diamond inherited and sold to Dolgins.",
    Situation:
      "My family member (mother, aunt, grandma, etc.) left us some jewelry as a part of the estate. We distributed some items but want to sell these pieces.",
    Buy: "Unworn nugget diamond ring and broken gold chain (not pictured)",
    Amount: "$500",
    Future:
      "Remove diamonds, then sort and repurpose them. Refine and recycle gold.",
    Link: false,
  },
  {
    Name: "Divorced",
    Image: Divorced,
    Alt: "Engagement ring and wedding band with 2 carat round diamond sold to Dolgins after a divorce.",
    Situation:
      "The relationship has ended, and I am ready to move on. Selling this diamond ring and other items will help.",
    Amount: "$8,000",
    Buy: "Platinum halo engagement ring with a 2 carat round brilliant center diamond and a mens platinum and 18 karat gold band",
    Future:
      "Dismantle the ring. Refine the platinum. Reuse the melee diamonds in a new project. Have GIA grade the large 2 carat round center diamond and resell it.",
    Link: false,
  },
  {
    Name: "Needed Money",
    Image: Need,
    Alt: "4 carat round brilliant diamond sold to Dolgins to pay some bills.",
    Situation:
      "I have some responsibilities elsewhere and am selling this diamond or jewelry to fulfill those promises.",
    Buy: "4 Carat Round Brilliant Diamond GIA graded",
    Amount: "$45,000",
    Future:
      "Updated the GIA gradind report and make the diamond available to purchase",
    Link: false,
  },
  {
    Name: "Traded/Wanted New",
    Image: Trade,
    Alt: "18 karat yellow gold bee pin sold to Dolgins as a trade for a new diamond.",
    Situation:
      "In order to fund her upgraded new ring, I accepted these antique bee pins as a form of payment.",
    Buy: "Antique diamond and 18 karat yellow gold pin",
    Amount: "$1,000",
    Future: "Refurbish the pin and try to sell",
    Link: false,
  },
  {
    Name: "Repurposed",
    Image: Repurposed,
    Alt: "Removed single cut diamonds from grandma's ring and sold the gold in to Dolgins to pay for her new wedding band.",
    Situation:
      "After pulling the diamonds and setting them in her new wedding band, I purchased the gold ring.",
    Buy: "Dismantled, broken gold ring",
    Amount: "$150",
    Future:
      "This ring was destroyed when we pulled the diamonds. The gold will be refined and recycled. She kept the diamonds to set in her new wedding band.",
    Link: false,
  },
  {
    Name: "Worn Out",
    Image: Worn,
    Situation:
      "Bracelet in 14 karat white gold sold to Dolgins because it has worn out and had links that were breaking.",
    Buy: "Worn out 14 karat white gold bracelet",
    Amount: "$350",
    Future: "Refining and recycling the gold",
    Link: false,
  },
]

const features = [
  {
    name: "Fair Offers.",
    description:
      "I understand you want the most money for your jewelry. Dolgins offers the highest price we can.",
  },
  {
    name: "Local & Trusted.",
    description:
      "When selling your gold or jewelry, it will stay with you. Our assessments are completed face-to-face. We have 4 generations of experience and have earned a good reputation.",
  },
  {
    name: "Comfortable, Discreet Office.",
    description:
      "The Dolgins office is quiet and personal with a complete jewelry shop. Selling jewelry can be difficult, so we are empathetic and honest.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Buying Unwanted Jewelry - Dolgins Fine Jewelry Store`,
    description:
      "Sell your unwanted gold, diamonds, jewelry, engagement ring, and platinum in a discreet, no-pressure private office to an honest, local jeweler in Kansas City.",
  } as Metadata

  return metadata
}

export function Buying() {
  return (
    <main>
      <PageHeader
        name="Sell Us Your Jewelry, Gold Or Rings"
        subtitle="Free & Fair Offers"
        tidbit="                Dolgins has been buying unwanted jewelry including engagement
                rings, estate jewelry, antique jewelry, gold, platinum, and
                diamonds for decades in Kansas City. Our experience, market
                knowledge, onsite jewelry shop, and comfortable office make our
                store the best place to sell jewelry."
      />

      <section className="flex flex-wrap flex-row items-center gap-x-1 gap-y-1 justify-center bg-dolginsblue py-3 mx-auto">
        <Image
          priority
          className="aspect-square w-1/4"
          src={Camera}
          alt="Kansas City jewelry, ring, gold, and diamond buyer Joseph Dolgin preparing to buy a diamond engagement ring."
        />
        <Image
          priority
          className=" w-1/3"
          src={GoldBuying}
          alt="Marsha assessing the value of some gold."
        />
        <Image
          priority
          className="aspect-square w-1/4"
          src={Appraising}
          alt="Joseph evaluating a diamond to buy."
        />
      </section>

      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-dolginsblue"></p>
                <h2 className="mt-2 text-3xl tracking-tight text-gold font-serif sm:text-4xl border-b-2 border-gold pb-1">
                  The Best Place To Sell Jewelry
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Dolgins has been a recognized gold, diamond, & jewelry buyer
                  in Kansas City for 4 generations. We continue to buy and sell
                  jewelry from our private store in Overland Park as an
                  independent.
                </p>
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
              src={Evaluation}
              alt="Dolgins evaluating jewelry to buy in Kansas City."
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </div>
        </div>
      </div>
      <DolginsCTA
        title="Get Money For Your Jewelry"
        subtitle="Setup An Appointment To Sell."
        text="We are low pressure and quick. Send us a message with what you have to sell and when you can meet."
      />

      <div className="relative flex flex-col justify-start overflow-hidden bg-gray-50 py-6">
        <div className="relative w-full bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
          <div className="mx-auto px-5">
            <div className="flex flex-col items-center">
              <h2 className="mt-5 text-center text-3xl text-dolginsblue font-bold tracking-tight md:text-5xl">
                FAQ
              </h2>
              <p className="mt-3 text-lg text-dolginsblue md:text-xl">
                Frequenty Asked Questions About Selling Your Jewelry?
              </p>
            </div>
            <div className="mx-auto mt-8 grid max-w-xl divide-y divide-gold">
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span> How much will I get paid?</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    I answer this question after I inspect the jewelry. It can
                    be difficult to do without a close assessment. With
                    appraisals and GIA reports, I can sometimes give an
                    estimate; however, I need to see the item.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>
                      {" "}
                      What percentage do you as a jeweler pay for jewelry?
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    This question is similar to the previous one and depends on
                    the piece. In a few instances, I have paid WAY more than
                    some insurance appraisal values (150% more than the
                    appraisal value). Other times and more frequently, I have
                    seen appraisal values 1000 times more than I could pay.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>
                      {" "}
                      What is the process for selling unwanted jewelry?
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    Setup an appointment in my small and discreet Overland Park
                    jewelry office. You can{" "}
                    <a className="text-dolginslightblue" href="sms:9132282808">
                      text me
                    </a>{" "}
                    to setup a time. Our meeting will be quick. I will assess
                    your piece and make you an offer. If you chose to accept,
                    the offer I will write you a check.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span> How do you pay?</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    We pay with a check and do require a valid government-issued
                    photo identification such as a drivers licence or passport.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>What jewelry do you buy?</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    The list is long, but here are some highlights: engagement
                    rings, diamonds, bracelets, earrings, estate jewelry,
                    heirlooms, antique jewelry, gold, gold bullion and coins.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>
                      Do you trade-in jewelry or credit towards a new piece?
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    Yes, we commonly take old or unwanted rings, diamonds, and
                    jewelry as payment or partial payment when we are making a
                    new piece or completing a jewelry repair.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>
                      {" "}
                      Is it a good time to sell my gold, diamonds, rings or
                      jewelry?
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    Yes, offers are based on current market conditions. As of{" "}
                    {new Date().getFullYear()}, gold prices are incredibly
                    strong. However, diamond prices have fallen over the last 3
                    years greater than any time during my dad or granddad's
                    career.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span> What can I expect when selling my jewelry?</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    Marsha and I are jewelry professionals and will complete a
                    thorough and honest evaluation. Our office is safe and low
                    pressure. In addition, Marsha and I will give an honest
                    assessment, which sometimes is not what someone wants to
                    hear. We aim to make lasting relationships with clients.
                  </p>
                </details>
              </div>
              <div className="py-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span> Do I need paperwork or an appraisal?</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    No, it is not required. Though, please bring any paperwork
                    you have including a{" "}
                    <a
                      className="text-dolginslightblue"
                      href="https://www.gia.edu/"
                    >
                      GIA grading paper
                    </a>
                    , original receipt, or{" "}
                    <a
                      className="text-dolginslightblue"
                      href="/jewelry-insurance-appraisal"
                    >
                      insurance appraisal
                    </a>
                    . Please note: there is no need to pay a jeweler for an
                    updated appraisal if you are going to sell an item.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Testimonial   
        imageSrc = {EngagementRing}
        imageAlt = "Engagement Ring With Diamond and Gold Sold After Divorce"
        review = "Dolgin's was extremely helpful, friendly and a pleasure to do business with.
                   Very knowledgeable and a real pro in his business. Best guy to bring gold rings & diamonds to,
                   honest and best price. 10/10 recommended!"
        reviewer = "Sean P"
        who = "Found Dolgins On Google" />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <div className="absolute inset-auto h-96 w-96 scale-150 bg-gold opacity-20 blur-3xl"></div>
        <div className="absolute inset-auto h-96 w-96 translate-x-full scale-150 bg-dolginsblue opacity-20 blur-3xl"></div>
        <div className="w-full">
          <div className="max-w-lg px-10 pb-6 sm:pb-12">
            <h2 className="text-5xl font-serif font-gold tracking-tight border-b-2 border-gold pb-2">
              Example Buys
            </h2>
            <p className="mt-5">
              At Dolgins, we have a long history of buying fine jewelry from
              worn out gold rings for $100 to complicated, high valued estates.
              Here are a few recent examples of what we have bought:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 mx-auto px-4">
            {exampleBuys.map((buy) => (
              <div>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <Image
                    src={buy.Image}
                    alt="yes"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <p className="mt-4 text-center text-dolginsblue font-serif border-b-2 border-gold pb-1 text-2xl">
                  {buy.Name}
                </p>
                <h3 className="mt-2 italic text-gray-500">
                  <span className="font-medium text-gray-900">Who Sold...</span>{" "}
                  {buy.Situation}
                </h3>
                <h3 className="mt-2 italic text-gray-500">
                  <span className="font-medium text-gray-900">
                    What Specifically...
                  </span>{" "}
                  {buy.Buy}
                </h3>
                <p className="mt-2 italic text-gray-500">
                  <span className="font-medium text-gray-900">
                    Where Now...
                  </span>{" "}
                  {buy.Future}
                </p>
                <p className="mt-2 italic text-gray-500">
                  <span className="font-medium text-gray-900">Sold For...</span>{" "}
                  {buy.Amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Buying
