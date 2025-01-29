"use server"

export const getBlogsList = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blogs`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
      }
    )

    if (!response.ok) {
      throw new Error("failed to fetch blogs.")
    }
    const { blogs } = await response.json()

    return blogs
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}

export const getBlogByHandle = async (handle: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blogs?handle=${handle}`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
      }
    )

    if (!response.ok) {
      throw new Error("failed to fetch blog.")
    }
    const { blogs } = await response.json()
    return blogs
  } catch (error: any) {
    console.log("Error fetching blogs:", error)
    throw new Error(`Failed to fetch blogs : ${error.message}`)
  }
}

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
