import { Metadata } from "next"
import Image from "next/image"
import { Fragment } from "react"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import PageHeader from "@modules/layout/components/page-header"
import MarquiseDiamondWithTweezers from "@images/labgrownVnatural/Marquise-Diamond-With-Tweezers.jpg"
import ImageCTA from "@images/labgrownVnatural/CTA.jpg"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Lab-Grown Vs Natural Diamonds | Dolgins Jewelry`,
    description:
      "Lab-grown versus natural diamonds is a common question in my Overland Park, Kansas City jewelry store. Here are some of my opinions.",
  } as Metadata

  return metadata
}

interface Tier {
  name: "Natural Diamonds" | "Lab-Grown Diamonds"
  id: string
  href: string
}

interface Comparison {
  name: string
  tiers: {
    "Natural Diamonds": string
    "Lab-Grown Diamonds": string
  }
  explanation: string
}

const tiers: Tier[] = [
  {
    name: "Natural Diamonds",
    id: "tier-natural",
    href: "#",
  },
  {
    name: "Lab-Grown Diamonds",
    id: "tier-lab",
    href: "#",
  },
]

const comparisons: Comparison[] = [
  {
    name: "Appearance",
    tiers: {
      "Natural Diamonds": "Looks Like A Diamond",
      "Lab-Grown Diamonds": "Cannot Tell The Difference",
    },
    explanation:
      "Both natural and lab-grown diamonds are visually identical to the naked eye. The main way I tell the difference is that lab-grown diamonds are usually more perfect, look at the inscriptions, or with a tester that shows how they reflect UV light differently.",
  },
  {
    name: "Uniqueness",
    tiers: {
      "Natural Diamonds":
        "Have layers of color variation and unique inclusions",
      "Lab-Grown Diamonds": "~2/3 Seem Perfect",
    },
    explanation:
      "Lab-grown diamonds can be more BORING because there is less variation. No weird inclusions or color variations.",
  },
  {
    name: "Effort",
    tiers: {
      "Natural Diamonds":
        "Slowly formed over millions of years deep within the Earth",
      "Lab-Grown Diamonds": "Created in ~2 weeks",
    },
    explanation:
      "Our creator slowly formed natural diamonds over millions of years whereas lab-grown diamonds were made over a few weeks in India or China.",
  },
  {
    name: "Price Point",
    tiers: {
      "Natural Diamonds": "Expensive",
      "Lab-Grown Diamonds": "Affordable",
    },
    explanation:
      "I love lab-grown diamonds because they mean we get to make jewelry with larger more visually appealing stones. The exact price difference depends.",
  },
  {
    name: "Resale Value",
    tiers: {
      "Natural Diamonds": "Retains Some Value",
      "Lab-Grown Diamonds": "I Won't Buy Them Back",
    },
    explanation:
      "Natural diamonds have historically maintained their value better in the secondary market; however, with the lab-growns on the market, the prices for a large slice of natural diamonds has dropped dramatically.",
  },
  {
    name: "Long-term Investment",
    tiers: { "Natural Diamonds": "No", "Lab-Grown Diamonds": "No" },
    explanation:
      "Neither type of diamond should be considered aninvestment where you will earn money. They are primarily purchased for their beauty and sentimental value.",
  },
  {
    name: "Environmental Impact",
    tiers: {
      "Natural Diamonds": "Difficult To Answer",
      "Lab-Grown Diamonds": "Lower Than Mined",
    },
    explanation:
      "Understanding the source of the diamond is important to answering this question. Natural diamonds from mines probably have the most impact. Lab-growns still have some impact, but it is much lower. However, I would imagine that diamonds from alluvial deposits found centuries ago have the least environmental impact.",
  },
  {
    name: "Certification",
    tiers: {
      "Natural Diamonds": "Recommended",
      "Lab-Grown Diamonds": "Recommended",
    },
    explanation:
      "Know what you are buying, and independant evaluations of the diamonds are helpful. I use GIA for natural diamonds. For lab-growns, I use IGI or GCAL. I want to stress that these reports do NOT include all the necessary information. Normally, the best option is a good quality lab report with a trained eye evaluation.",
  },
  {
    name: "Consistency",
    tiers: {
      "Natural Diamonds": "Be Consistent",
      "Lab-Grown Diamonds": "Be Consistent",
    },
    explanation:
      "I never recommend and seldom make jewelry with lab-growns AND natural diamonds. Choose one or the other.",
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function Labs() {
  return (
    <div>
      <div className="min-h-screen bg-dolginsblue">
        <PageHeader
          name="Lab-Grown Vs Natural Diamonds"
          subtitle="Understanding the Differences"
          tidbit="I happily look at natural and lab-grown diamonds everyday and
              all day. I also sell both. In my personal jewelry collection, I own
              natural diamonds because of consistency and uniqueness."
        />
        <div className="bg-gradient-to-b from-white via-white via-60% to-dolginsblue pb-12">
          <Image
            src={MarquiseDiamondWithTweezers}
            alt="Marquise Diamond With Tweezers"
            className="w-full lg:w-1/2 mx-auto aspect-video object-cover rounded-xl"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-white mb-8 text-2xl">
            Important Similarities & Differences & Considerations
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gold">
              <table className="w-full">
                <caption className="sr-only">
                  Lab-Grown vs Natural Diamonds Comparison
                </caption>
                <thead>
                  <tr className="border-b border-gold bg-dolginslightblue/5">
                    <th
                      scope="col"
                      className="py-6 pl-6 pr-3 text-left text-sm font-semibold text-dolginsblue"
                    >
                      {" "}
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
                          colSpan={3}
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

export default Labs
