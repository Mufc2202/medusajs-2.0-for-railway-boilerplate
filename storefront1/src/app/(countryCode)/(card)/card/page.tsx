import { Metadata } from "next"
import { getBusinessCardData } from "@lib/data/business-card"
import BusinessCard from "@modules/card/components/business-card"
import { BASE_URL } from "@lib/constants"

export async function generateMetadata(): Promise<Metadata> {
  const card = await getBusinessCardData()
  const fullName = `${card.first_name} ${card.last_name}`.trim()
  const description = `${card.bio}. ${card.company}.`

  return {
    title: `${fullName} | Digital Business Card`,
    description,
    alternates: {
      canonical: `${BASE_URL}/card`,
    },
    openGraph: {
      title: `${fullName} | Digital Business Card`,
      description,
      url: `${BASE_URL}/card`,
      siteName: card.company,
      locale: "en_US",
      type: "profile",
      images: card.avatar_url ? [{ url: card.avatar_url }] : [],
    },
  }
}

export default async function CardPage() {
  const cardData = await getBusinessCardData()

  return <BusinessCard card={cardData} />
}
