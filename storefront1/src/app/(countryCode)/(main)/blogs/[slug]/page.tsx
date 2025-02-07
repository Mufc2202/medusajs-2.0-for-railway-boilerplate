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
  const { blogs } = await getBlogByHandle(slug)
  const blog = blogs[0]

  return {
    title: blog?.seo_details?.metaTitle,
    description: blog?.seo_details?.metaDescription,
    keywords: blog?.seo_details?.keywords,
    robots: blog?.seo_details?.metaRobots,
    openGraph: {
      title: blog?.seo_details?.metaTitle,
      description: blog?.seo_details?.metaDescription,
      url: `${BASE_URL}/blogs/${blog?.handle}`,
      siteName: SITE_NAME,
      images: blog?.seo_details?.metaImage,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        blog?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.title || blog?.seo_details?.metaTitle,
      description:
        blog?.seo_details?.metaSocial?.find(
          (meta) => meta.socialNetwork === "Twitter"
        )?.description || blog?.seo_details?.metaDescription,
      images: [
        {
          url:
            blog?.seo_details?.metaSocial?.find(
              (meta) => meta.socialNetwork === "Twitter"
            )?.image || blog?.seo_details?.metaImage,
          alt: blog?.seo_details?.metaTitle,
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
    viewport: blog?.seo_details?.metaViewport,
    alternates: { canonical: blog?.seo_details?.canonicalURL },
    metadataBase: new URL(`${BASE_URL}/blogs/${slug}`),
    applicationName: APPLICATION_NAME,
    authors: [{ name: "The Special Character" }],
    publisher: PUBLISHER,
    generator: GENERATOR,
    referrer: "origin-when-cross-origin",
  }
}

const Page = async ({ params: { slug } }: Props) => {
  const { blogs } = await getBlogByHandle(slug)
  const blog = blogs[0]

  if (!blog) {
    return <NotFound />
  }

  const categories = await Promise.all(
    blog?.product_categories?.map((category) => getCategoriesById(category.id))
  )

  return (
    <div>
      <BlogImageSection blog={blog} />
      <BlogInfoBanner blog={blog} categories={categories} />
      <MarkdownRenderer
        content={blog?.content}
        className="mx-auto max-w-4xl flex flex-col gap-6 py-6 px-4"
      />
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <BlogAuthor author={blog?.user} />
      </div>
    </div>
  )
}

export default Page
