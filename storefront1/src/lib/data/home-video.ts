"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export interface HomeVideoData {
  id?: string
  title?: string | null
  subtitle?: string | null
  video_url: string
  provider: "vimeo" | "youtube" | "custom"
  thumbnail_url?: string | null
  is_active: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  duration?: number
}

// Client's primary Vimeo video fallback so homepage is 100% resilient
const FALLBACK_HOME_VIDEO: HomeVideoData = {
  title: "A 4th Generation Kansas City Jewelry Legacy",
  subtitle:
    "See inside our Overland Park private studio where decades of passion, custom craftsmanship, and diamond expertise come to life.",
  video_url: "https://vimeo.com/1151439885/8c19318c2b",
  provider: "vimeo",
  thumbnail_url: null,
  is_active: true,
  autoplay: false,
  muted: true,
  loop: false,
  duration: 49,
}

export const getHomeVideo = async (): Promise<HomeVideoData | null> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<{ video: HomeVideoData }>(
      `/store/home-video`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (response && "video" in response) {
      return response.video
    }
  } catch (error: any) {
    // If backend is booting or unreachable, safely return fallback
    console.warn(
      "Could not fetch home video from Medusa backend (using client fallback):",
      error?.message || error
    )
  }

  return FALLBACK_HOME_VIDEO
}
