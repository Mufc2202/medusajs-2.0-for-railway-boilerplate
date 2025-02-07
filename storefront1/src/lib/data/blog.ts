"use server"

import { BlogProps } from "types/global"
import { getAuthHeaders } from "./cookies"
import { sdk } from "@lib/config"

export const getBlogsList = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  try {
    const response = await sdk.client.fetch<{
      blogs: BlogProps[]
      count: number
    }>(`/store/blogs`, {
      method: "GET",
      headers,
    })

    return response
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
  }
}

export const getBlogByHandle = async (handle: string) => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<{
      blogs: BlogProps[]
      count: number
    }>(`/store/blogs?handle=${handle}`, {
      method: "GET",
      headers,
    })

    return response
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
  }
}

// export const getBlogByHandle = async (handle: string) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blogs?handle=${handle}`,
//       {
//         headers: {
//           "x-publishable-api-key":
//             process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
//         },
//       }
//     )

//     if (!response.ok) {
//       throw new Error("failed to fetch blog.")
//     }
//     const { blogs } = await response.json()
//     return blogs[0]
//   } catch (error: any) {
//     console.log("Error fetching blogs:", error)
//     throw new Error(`Failed to fetch blogs : ${error.message}`)
//   }
// }

export const getCategoriesById = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories/${id}`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
      }
    )
    if (!response.ok) throw new Error(`Failed to fetch category with id ${id}`)
    return response.json()
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}
