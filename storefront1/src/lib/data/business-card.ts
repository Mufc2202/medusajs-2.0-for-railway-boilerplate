import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export interface BusinessCardData {
  id?: string
  first_name: string
  last_name: string
  company: string
  bio: string
  phone: string
  email: string
  website: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  color_primary: string
  color_accent: string
  avatar_url?: string | null
  is_active: boolean
}

export const DEFAULT_BUSINESS_CARD: BusinessCardData = {
  first_name: "Joseph",
  last_name: "Dolginow",
  company: "Joseph Dolgin Jeweler LLC",
  bio: "Custom Fine Jewelry, Jewelry Repair, Appraisals",
  phone: "(913) 228-2808",
  email: "joseph@dolgins.com",
  website: "dolgins.com",
  street: "West 119th Street 4901",
  city: "Leawood",
  state: "KS",
  zip: "66209",
  country: "United States",
  color_primary: "#222943",
  color_accent: "#C7A88C",
  avatar_url: "https://qrcgcustomers.s3-eu-west-1.amazonaws.com/account51902472/59042606_1.png?0.2004734367969231",
  is_active: true,
}

export const getBusinessCardData = async (): Promise<BusinessCardData> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<{ card: BusinessCardData }>(
      `/store/business-card`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (response && "card" in response) {
      return response.card
    }
  } catch (error: any) {
    console.warn(
      "Could not fetch business card from Medusa backend (using client fallback):",
      error?.message || error
    )
  }

  return DEFAULT_BUSINESS_CARD
}
