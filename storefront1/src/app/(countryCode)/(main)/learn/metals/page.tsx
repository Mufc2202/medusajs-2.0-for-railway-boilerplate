import { Metadata } from "next"
import Image from "next/image"
import { Fragment } from "react"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import PageHeader from "@modules/layout/components/page-header"
import MarquiseDiamondWithTweezers from "@images/labgrownVnatural/Marquise-Diamond-With-Tweezers.jpg"
import ImageCTA from "@images/labgrownVnatural/CTA.jpg"
import Bracelet18KY from "@images/learning/metals/18k-metal-bracelet.jpg"
import ButtonBack1 from "@images/learning/metals/Button-Back-Prong-Engagement-Ring-1.jpg"
import ButtonBack2 from "@images/learning/metals/Button-Back-Prong-Engagement-Ring-2.jpg"
import ButtonBack3 from "@images/learning/metals/Button-Back-Prong-Engagement-Ring-3.jpg"
import ButtonBack4 from "@images/learning/metals/Button-Back-Prong-Engagement-Ring-4.jpg"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Jewelry Metals | Dolgins Jewelry`,
    description:
      "As a custom jewelry store in Kansas City, I have a lot of knowledge about jewelry metals. Visit For More Information.",
  } as Metadata

  return metadata
}

interface Tier {
  name: string
  id: string
  href: string
}

interface Comparison {
  name: string
  tiers: Record<string, string>
  explanation: string
}

const tiers: Tier[] = [
  {
    name: "Platinum",
    id: "tier-plat",
    href: "#",
  },
  {
    name: "14 Karat Yellow Gold",
    id: "tier-14ky",
    href: "#",
  },
  {
    name: "18 Karat Yellow Gold",
    id: "tier-18ky",
    href: "#",
  },
  {
    name: "14 Karat White Gold",
    id: "tier-14kw",
    href: "#",
  },
  {
    name: "14 Karat Rose Gold",
    id: "tier-14kr",
    href: "#",
  },
]

const comparisons: Comparison[] = [
  {
    name: "Durability",
    tiers: {
      Platinum: "Most Durable",
      "14 Karat Yellow Gold": "Very Durable",
      "18 Karat Yellow Gold": "Durable",
      "14 Karat White Gold": "Very Durable",
      "14 Karat Rose Gold": "Very Durable",
    },
    explanation:
      "Platinum is the most durable precious metal, making it ideal for everyday wear. 14K gold offers a good balance of durability and purity, while 18K gold is softer but more pure.",
  },
  {
    name: "Color",
    tiers: {
      Platinum: "White/Silver",
      "14 Karat Yellow Gold": "Rich Yellow",
      "18 Karat Yellow Gold": "Deep Yellow",
      "14 Karat White Gold": "White/Silver",
      "14 Karat Rose Gold": "Pink/Rose",
    },
    explanation:
      "Each metal has its unique color characteristics. Platinum maintains its white color naturally, while white gold is rhodium plated to achieve its white appearance. Rose gold gets its color from copper alloy.",
  },
  {
    name: "Maintenance",
    tiers: {
      Platinum: "Low",
      "14 Karat Yellow Gold": "Low",
      "18 Karat Yellow Gold": "Low",
      "14 Karat White Gold": "Medium",
      "14 Karat Rose Gold": "Low",
    },
    explanation:
      "White gold requires periodic rhodium plating to maintain its white appearance. Platinum and yellow/rose gold require minimal maintenance but benefit from regular cleaning.",
  },
  {
    name: "Price Point",
    tiers: {
      Platinum: "Highest",
      "14 Karat Yellow Gold": "Moderate",
      "18 Karat Yellow Gold": "Higher",
      "14 Karat White Gold": "Moderate",
      "14 Karat Rose Gold": "Moderate",
    },
    explanation:
      "Platinum is typically the most expensive option due to its density and purity. 18K gold is more expensive than 14K due to higher gold content. White and rose gold variations are priced similarly to their yellow counterparts.",
  },
  {
    name: "Allergies",
    tiers: {
      Platinum: "Hypoallergenic",
      "14 Karat Yellow Gold": "Rare",
      "18 Karat Yellow Gold": "Rare",
      "14 Karat White Gold": "Possible",
      "14 Karat Rose Gold": "Rare",
    },
    explanation:
      "Platinum is naturally hypoallergenic. Gold allergies are rare but possible, especially with white gold which contains nickel. Rose gold's copper content can cause reactions in some individuals.",
  },
  {
    name: "Weight",
    tiers: {
      Platinum: "Heaviest",
      "14 Karat Yellow Gold": "Light",
      "18 Karat Yellow Gold": "Light",
      "14 Karat White Gold": "Light",
      "14 Karat Rose Gold": "Light",
    },
    explanation:
      "Platinum is the densest precious metal, making it feel substantial. Gold alloys are lighter but still provide a satisfying weight for fine jewelry.",
  },
  {
    name: "Trademark",
    tiers: {
      Platinum: "PT, PLAT, PT950, PT900",
      "14 Karat Yellow Gold": "14K, 14KT, 585",
      "18 Karat Yellow Gold": "18K, 18KT, 18K, 750",
      "14 Karat White Gold": "14K, 14KT, 585",
      "14 Karat Rose Gold": "14K, 14KT, 585",
    },
    explanation:
      "Each metal has its ideal applications. Platinum's durability makes it perfect for engagement rings, while 14K gold offers versatility for everyday wear. 18K gold is often chosen for special pieces, and white/rose gold are popular for contemporary designs.",
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function Metals() {
  return (
    <div>
      <div className="min-h-screen bg-dolginsblue">
        <PageHeader
          name="Metals For Fine Jewelry"
          subtitle="Different Metals For Different Jewelry"
          tidbit="Crafting Jewelry is a form a metalworking. Here you can learn about the metals are used in fine jewelry."
        />
        <div className="bg-gradient-to-b flex flex-row gap-x-6 from-white via-white via-60% to-dolginsblue pb-12">
          <Image
            src={Bracelet18KY}
            alt="Heavy 18 Karat Yellow Gold Bracelet Set With Round Diamonds"
            className="w-full lg:w-1/2 mx-auto aspect-video object-cover rounded-xl"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-white mb-8 text-2xl">
            Metals For Jewelry We Like The Most & Why
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gold">
              <table className="w-full">
                <caption className="sr-only">Jewelry Metals Comparison</caption>
                <thead>
                  <tr className="border-b border-gold bg-dolginslightblue/5">
                    <th
                      scope="col"
                      className="py-6 pl-6 pr-3 text-left text-sm font-semibold text-dolginsblue"
                    >
                      Feature
                    </th>
                    {tiers.map((tier) => (
                      <th
                        key={tier.id}
                        scope="col"
                        className="px-6 py-6 text-left text-sm font-semibold text-dolginsblue"
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold">
                  {comparisons.map((comparison, idx) => (
                    <Fragment key={comparison.name}>
                      <tr
                        className={classNames(
                          idx % 2 === 0 ? "bg-white" : "bg-dolginslightblue/5"
                        )}
                      >
                        <th
                          scope="row"
                          className="py-4 pl-6 pr-3 text-left text-sm font-medium text-dolginsblue"
                        >
                          {comparison.name}
                        </th>
                        {tiers.map((tier) => (
                          <td
                            key={tier.id}
                            className="px-6 py-4 text-sm text-gray-600"
                          >
                            {comparison.tiers[tier.name]}
                          </td>
                        ))}
                      </tr>
                      <tr
                        className={classNames(
                          idx % 2 === 0 ? "bg-white" : "bg-dolginslightblue/5"
                        )}
                      >
                        <td
                          colSpan={tiers.length + 1}
                          className="px-6 py-3 text-sm text-gray-600 border-t border-gold"
                        >
                          <p className="italic pl-6">
                            {comparison.explanation}
                          </p>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <DolginsCTA
          title="Have More Questions About Natural vs Lab-Grown Diamonds?"
          imageSrc={ImageCTA}
          subtitle="We Love Talking Diamonds"
          imageAlt="Princess Cut, Oval, Round, and Marquise Diamonds"
          text="At Dolgins Jewelry, we look forward to working with you. A call is great, but a text is best. Talk to you soon."
          link="/t/diamonds"
          linkText="See More Diamonds"
        />
      </div>
    </div>
  )
}

export default Metals
