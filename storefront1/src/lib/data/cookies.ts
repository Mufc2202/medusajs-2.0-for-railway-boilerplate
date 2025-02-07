import "server-only"
import { cookies } from "next/headers"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  const token = (await cookies()).get("_medusa_jwt")?.value

  if (token) {
    return { authorization: `Bearer ${token}` }
  }

  return {}
}

export const setAuthToken = async (token: string) => {
  ;(await cookies()).set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  ;(await cookies()).set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  return (await cookies()).get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  ;(await cookies()).set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  ;(await cookies()).set("_medusa_cart_id", "", { maxAge: -1 })
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookieStore = await cookies()
    const cacheId = cookieStore.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}
