import BlogInfoBanner from "@components/Blog/BlogInfoBanner"
import MarkdownRenderer from "@components/MarkdownRenderer"
import { notFound } from "next/navigation"
import BlogAuthor from "@components/Blog/BlogAuthor"
import BlogImageSection from "@components/Blog/BlogImageSection"
import { getBlogByHandle, getCategoriesById } from "@lib/data/blog"

type Props = {
  params: {
    slug: string
  }
}

const Page = async ({ params: { slug } }: Props) => {
  const blogs = await getBlogByHandle(slug)

  const categories = await Promise.all(
    blogs[0]?.product_categories?.map((category) =>
      getCategoriesById(category.id)
    )
  )

  return (
    <div>
      <BlogImageSection blog={blogs[0]} />
      <BlogInfoBanner blog={blogs[0]} categories={categories} />
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
