import { NextResponse } from "next/server"
import { getProductsListWithSort } from "@lib/data/products"

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Cache for storing pricing data
const pricingCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category_id = searchParams.get("category_id")

  if (!category_id) {
    return NextResponse.json(
      { error: "Category ID parameter is required" },
      { status: 400 }
    )
  }

  // Check cache first
  const cachedData = pricingCache.get(category_id)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedData.data)
  }

  try {
    const { response: serverRes } = await getProductsListWithSort({
      page: 0,
      queryParams: {
        category_id: category_id,
        order: "created_at",
      },
      countryCode: "us",
    })

    const getPriceByType = (variants: any[], type: string) => {
      const variant = variants.find((v) => v.title === type)
      return variant
        ? formatPrice(variant.calculated_price.calculated_amount)
        : null
    }

    const filteredProducts = (serverRes?.products || []).filter(
      (product: any) => product.metadata?.shape && product.metadata?.size
    )

    filteredProducts.sort((a: any, b: any) => {
      const sizeA = parseFloat(a.metadata.size)
      const sizeB = parseFloat(b.metadata.size)
      return sizeA - sizeB
    })

    const pricingData = filteredProducts.map((product: any) => ({
      size: product.metadata.size,
      prices: {
        best: getPriceByType(product.variants, "Highest Quality"),
        better: getPriceByType(product.variants, "Great Quality & Value"),
        good: getPriceByType(product.variants, "Love The Size"),
        lab: getPriceByType(product.variants, "Laboratory Created"),
      },
      link: `/products/${product.handle}`,
    }))

    // Store in cache
    pricingCache.set(category_id, {
      data: pricingData,
      timestamp: Date.now(),
    })

    return NextResponse.json(pricingData)
  } catch (error) {
    console.error("Error fetching pricing data:", error)
    return NextResponse.json(
      { error: "Failed to fetch pricing data" },
      { status: 500 }
    )
  }
} 