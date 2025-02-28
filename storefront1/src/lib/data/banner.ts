"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { BannerProps } from "types/global"

export const getBannersList = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  try {
    const response = await sdk.client.fetch<{
      banners: BannerProps[]
      count: number
    }>(`/store/banner-images`, {
      method: "GET",
      headers,
    })

    return response
  } catch (error: any) {
    console.log("Error fetching banner:", error)
  }
}
