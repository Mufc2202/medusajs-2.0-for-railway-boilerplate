"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { InstagramFeedResponse } from "types/global"

export const getInstagramFeed = async (): Promise<InstagramFeedResponse> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await sdk.client.fetch<InstagramFeedResponse>(
      `/store/instagram-feed`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (response) {
      return {
        handle: response.handle || "dolgins_jewelry",
        profile_url:
          response.profile_url || "https://www.instagram.com/dolgins_jewelry/",
        title: response.title || "Follow Our Journey",
        subtitle:
          response.subtitle ||
          "@dolgins_jewelry — Handcrafted custom jewelry, diamonds & heirloom restorations in Overland Park & Kansas City",
        posts: response.posts || [],
        count: (response.posts || []).length,
      }
    }
  } catch (error: any) {
    console.warn(
      "Error fetching Instagram feed from API:",
      error?.message || error
    )
  }

  return {
    handle: "dolgins_jewelry",
    profile_url: "https://www.instagram.com/dolgins_jewelry/",
    title: "Follow Our Journey",
    subtitle:
      "@dolgins_jewelry — Handcrafted custom jewelry, diamonds & heirloom restorations in Overland Park & Kansas City",
    posts: [],
    count: 0,
  }
}
