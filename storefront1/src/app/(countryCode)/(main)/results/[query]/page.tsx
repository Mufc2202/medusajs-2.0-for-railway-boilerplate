import { Metadata } from "next"

import SearchResultsTemplate from "@modules/search/templates/search-results-template"

import { search } from "@modules/search/actions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { countryCode } from "@lib/constants"

export const metadata: Metadata = {
  title: "Search",
  description: "Explore all of our products.",
}

type Params = {
  params: Promise<{ countryCode?: string; query: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function SearchResults(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams

  const query = decodeURIComponent(params?.query || "")
  const { sortBy, page } = searchParams || {}

  const hits = await search(query)

  const ids = hits
    .map((h) => (h.objectID || h.id) as string)
    .filter((id): id is string => typeof id === "string")

  return (
    <SearchResultsTemplate
      query={query}
      ids={ids}
      sortBy={sortBy}
      page={page}
      countryCode={params?.countryCode || countryCode}
    />
  )
}
