import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { countryCode } from "@lib/constants"

export const metadata: Metadata = {
  title: "Jewelry Catalog - Dolgins Fine Jewelry",
  description:
    "We complete so many custom jewelry and engagement rings; we love using our jewelry shop and skills to create treasured & unique pieces of jewelry and engagement rings. Contact us or visit our Kansas City jewelry store for more details.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export default async function StorePage({ searchParams }: Params) {
  const { sortBy, page } = searchParams

  return <StoreTemplate sortBy={sortBy} page={page} countryCode={countryCode} />
}
