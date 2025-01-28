import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export const getBlogsList = async () => {
  try {
    // const headers = {
    //   ...(await getAuthHeaders()),
    // }

    //   const response = await sdk.client.fetch<{
    //     blogs: any
    //     count: number
    //   }>(`/store/blogs`, {
    //     method: "GET",
    //     headers,
    //   })

    const response = await fetch(
      "https://62zgzp09-9000.inc1.devtunnels.ms/store/blogs",
      {
        headers: {
          "x-publishable-api-key":
            "pk_ed259c7035a5d2060cbc0df14844a4bf05d123dfa6569d4dd80e5e765fbdc083",
        },
      }
    )

    return response
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}

export const getBlogByHandle = async (handle: string) => {
  try {
    // const headers = {
    //   ...(await getAuthHeaders()),
    // }

    //   const response = await sdk.client.fetch<{
    //     blogs: any
    //     count: number
    //   }>(`/store/blogs`, {
    //     method: "GET",
    //     headers,
    //   })

    const response = await fetch(
      `https://62zgzp09-9000.inc1.devtunnels.ms/store/blogs?handle=${handle}`,
      {
        headers: {
          "x-publishable-api-key":
            "pk_ed259c7035a5d2060cbc0df14844a4bf05d123dfa6569d4dd80e5e765fbdc083",
        },
      }
    )

    return response
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}

export const getBlogCategories = async (handle: string) => {
  try {
    // const headers = {
    //   ...(await getAuthHeaders()),
    // }

    //   const response = await sdk.client.fetch<{
    //     blogs: any
    //     count: number
    //   }>(`/store/blogs`, {
    //     method: "GET",
    //     headers,
    //   })

    const response = await fetch(
      `https://62zgzp09-9000.inc1.devtunnels.ms/store/product-categories/${handle}`,
      {
        headers: {
          "x-publishable-api-key":
            "pk_ed259c7035a5d2060cbc0df14844a4bf05d123dfa6569d4dd80e5e765fbdc083",
        },
      }
    )

    return response
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}
