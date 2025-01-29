import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { countryCode } from "@lib/constants"

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
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
