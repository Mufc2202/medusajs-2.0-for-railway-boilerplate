import BlogInfoBanner from "@components/Blog/BlogInfoBanner"
import MarkdownRenderer from "@components/MarkdownRenderer"
import { notFound } from "next/navigation"
import BlogAuthor from "@components/Blog/BlogAuthor"
import BlogImageSection from "@components/Blog/BlogImageSection"
import { getBlogByHandle, getCategoriesById } from "@lib/data/blog"
import NotFound from "app/not-found"
import { Metadata } from "next"
import {
  APPLICATION_NAME,
  BASE_URL,
  FB_APP_ID,
  FB_USER_ID,
  GENERATOR,
  PUBLISHER,
  SITE_NAME,
  TWITTER_CREATER,
  TWITTER_SITE_ID,
} from "@lib/constants"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const data = await getBlogByHandle(slug)

  if (!data?.blogs[0]) {
    notFound()
  }

  return {
    title: data?.blogs[0]?.seo_details?.metaTitle,
    description: data?.blogs[0]?.seo_details?.metaDescription,
    keywords: data?.blogs[0]?.seo_details?.keywords,
    robots: data?.blogs[0]?.seo_details?.metaRobots,
    openGraph: {
      title: data?.blogs[0]?.seo_details?.metaTitle,
      description: data?.blogs[0]?.seo_details?.metaDescription,
      url: `${BASE_URL}/blogs/${data?.blogs[0]?.handle}`,
      siteName: SITE_NAME,
      images: data?.blogs[0]?.seo_details?.metaImage,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        data?.blogs[0]?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.title || data?.blogs[0]?.seo_details?.metaTitle,
      description:
        data?.blogs[0]?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.description || data?.blogs[0]?.seo_details?.metaDescription,
      images: [
        {
          url:
            data?.blogs[0]?.seo_details?.metaSocial?.find(
              (meta) => meta.socialNetwork === "Twitter"
            )?.image || data?.blogs[0]?.seo_details?.metaImage,
          alt: data?.blogs[0]?.seo_details?.metaTitle,
        },
      ],
      site: SITE_NAME,
      siteId: TWITTER_SITE_ID,
      creator: TWITTER_CREATER,
      creatorId: TWITTER_SITE_ID,
    },
    facebook: {
      admins: FB_USER_ID,
      appId: FB_APP_ID as unknown as undefined,
    },
    viewport: data?.blogs[0]?.seo_details?.metaViewport,
    alternates: { canonical: data?.blogs[0]?.seo_details?.canonicalURL },
    metadataBase: new URL(`${BASE_URL}/blogs/${slug}`),
    applicationName: APPLICATION_NAME,
    authors: [{ name: "The Special Character" }],
    publisher: PUBLISHER,
    generator: GENERATOR,
    referrer: "origin-when-cross-origin",
  }
}

const Page = async ({ params: { slug } }: Props) => {
  const data = await getBlogByHandle(slug)

  const categories =
    data?.blogs[0] &&
    (await Promise.all(
      data?.blogs[0]?.product_categories?.map((category) =>
        getCategoriesById(category.id)
      )
    ))

  if (!data?.blogs[0]) {
    return <NotFound />
  }

  return (
    <div>
      <BlogImageSection blog={data?.blogs[0]} />
      <BlogInfoBanner blog={data?.blogs[0]} categories={categories} />
      <MarkdownRenderer
        content={data?.blogs[0]?.content}
        className="mx-auto max-w-4xl flex flex-col gap-6 py-6 px-4"
      />
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <BlogAuthor author={data?.blogs[0]?.user} />
      </div>
    </div>
  )
}

export default Page
