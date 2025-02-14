import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { countryCode } from "@lib/constants"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import BuyingRing from "@images/index/buying-ring-money.jpg"
import Repair from "@images/index/repairing.jpg"

export const metadata: Metadata = {
  title: "Dolgins: Kansas City's Fine Jewelry Store",
  description:
    "A trusted, 4th generation jewelry store serving Kansas City from a private office in Overland Park. We sell & custom-make beautiful diamond engagement rings, wedding bands & other jewelry. We also buy your unwanted gold and diamonds and repair jewelry.",
}

export default async function Home() {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <DolginsCTA
        title="Have Jewelry To Sell? We Buy Gold & Diamonds & Rings."
        subtitle="Free & Fair Offers"
        text="We buy fine jewelry, gold, and diamonds from Kansas City in our
              small and discreet office."
        imageSrc={BuyingRing}
        imageAlt="Diamond gold ring on cash for selling jewelry and engagement rings"
        linkText="Learn More About Selling Your Jewelry"
        link="/buying-jewelry"
      />
      <DolginsCTA
        title="Let Us Help With Your Jewelry Repairs."
        subtitle="Quality Jewelry Repair"
        text="Marsha and I repair fine jewelry and watches in our Kansas City Jewelry store. We have decades of experience and do a quality job."
        imageSrc={Repair}
        linkText="Learn More About Jewelry Repair"
        link="/categories/jewelry-repair"
        imageAlt="Carving a wax for a custom diamond wedding band that contours an engagement ring"
      />
    </>
  )
}
