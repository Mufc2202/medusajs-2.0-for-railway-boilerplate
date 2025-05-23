import { Metadata } from "next"
import Image from "next/image"
import { Fragment } from "react"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import PageHeader from "@modules/layout/components/page-header"
import WeddingSet from "@images/learning/Wedding-Set-On-Bench.jpg"
import ImageCTA from "@images/labgrownVnatural/CTA.jpg"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Learn About Jewelry & Diamonds & Gemstones | Dolgins Jewelry`,
    description:
      "Learn specifics about jewelry from experts in Kansas City jewelry.",
  } as Metadata

  return metadata
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function Learn() {
  return (
    <div>
      <div className="min-h-screen bg-dolginsblue">
        <PageHeader
          name="Learn About Jewelry & Diamonds & Gemstones"
          subtitle="It Helps To Understand"
          tidbit="I spent most of my childhood in a jewelry store. I have a lot of knowledge to share. Here are some informative pages."
        />
        <div className="bg-gradient-to-b from-white via-white via-60% to-dolginsblue pb-12">
          <Image
            src={WeddingSet}
            alt="Round Diamond Wedding Set"
            className="w-full lg:w-1/2 mx-auto aspect-video object-cover rounded-xl"
          />
        </div>
      </div>
      <div>
        <DolginsCTA
          title="Have More Questions About Jewelry & Diamonds & Gemstones?"
          imageSrc={ImageCTA}
          subtitle="We Love Talking"
          imageAlt="Princess Cut, Oval, Round, and Marquise Diamonds"
          text="At Dolgins Jewelry, we look forward to working with you. A call is great, but a text is best. Talk to you soon."
        />
      </div>
    </div>
  )
}

export default Learn
