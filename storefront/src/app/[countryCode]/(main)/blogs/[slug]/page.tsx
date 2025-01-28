import BlogInfoBanner from "@components/Blog/BlogInfoBanner"
import MarkdownRenderer from "@components/MarkdownRenderer"
import { notFound } from "next/navigation"
import BlogAuthor from "@components/Blog/BlogAuthor"
import BlogImageSection from "@components/Blog/BlogImageSection"
import { getBlogByHandle } from "@lib/data/blog"

type Props = {
  params: {
    slug: string
  }
}

const Page = async ({ params: { slug } }: Props) => {
  const response = await getBlogByHandle(slug)
  const { blogs } = await response.json()

  return (
    <div>
      <BlogImageSection blog={blogs[0]} />
      <BlogInfoBanner blog={blogs[0]} />
      <MarkdownRenderer
        content={blogs[0]?.content}
        className="mx-auto max-w-4xl flex flex-col gap-6 py-8"
      />
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <BlogAuthor author={blogs[0]} />
      </div>
    </div>
  )
}

export default Page
