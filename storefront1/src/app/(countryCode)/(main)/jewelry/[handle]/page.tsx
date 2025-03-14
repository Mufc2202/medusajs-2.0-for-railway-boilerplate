import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import {
  APPLICATION_NAME,
  BASE_URL,
  countryCode,
  DEFAULT_REGION,
  FB_APP_ID,
  FB_USER_ID,
  GENERATOR,
  PUBLISHER,
  SITE_NAME,
  TWITTER_CREATER,
  TWITTER_SITE_ID,
} from "@lib/constants"
import { CustomProduct } from "types/global"

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  if (!countryCodes) {
    return null
  }

  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsList({ countryCode })
    })
  ).then((responses) =>
    responses.map(({ response }) => response.products).flat()
  )

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(DEFAULT_REGION)

  if (!region) {
    notFound()
  }

  const product = (await getProductByHandle(handle, region.id)) as CustomProduct

  if (!product) {
    notFound()
  }
  return {
    title: product?.title + " | Dolgins Jewelry",
    description: product?.seo_details?.metaDescription,
    keywords: product?.seo_details?.keywords,
    robots: product?.seo_details?.metaRobots,
    openGraph: {
      title: product?.seo_details?.metaTitle,
      description: product?.seo_details?.metaDescription,
      url: `${BASE_URL}/jewelry/${product?.handle}`,
      siteName: SITE_NAME,
      images: product?.seo_details?.metaImage,
      locale: "en_US",
      type: "website",
    },
    facebook: {
      admins: FB_USER_ID,
      appId: FB_APP_ID as unknown as undefined,
    },
    twitter: {
      card: "summary_large_image",
      title:
        product?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.title || product?.seo_details?.metaTitle,
      description:
        product?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.description || product?.seo_details?.metaDescription,
      images: [
        {
          url:
            product?.seo_details?.metaSocial?.find(
              (meta) => meta.socialNetwork === "Twitter"
            )?.image || (product?.seo_details?.metaImage as string),
          alt: product?.seo_details?.metaTitle,
        },
      ],
      site: SITE_NAME,
      siteId: TWITTER_SITE_ID,
      creator: TWITTER_CREATER,
      creatorId: TWITTER_SITE_ID,
    },
    category: product?.categories?.[0]?.name,
    viewport: product?.seo_details?.metaViewport,
    metadataBase: new URL(`${BASE_URL}/jewelry/${product?.handle}`),
    applicationName: APPLICATION_NAME,
    authors: [{ name: "Dolgins Jewelry" }],
    publisher: PUBLISHER,
    generator: GENERATOR,
    referrer: "origin-when-cross-origin",
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }
  const { handle } = await params

  const pricedProduct = await getProductByHandle(handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
    />
  )
}
