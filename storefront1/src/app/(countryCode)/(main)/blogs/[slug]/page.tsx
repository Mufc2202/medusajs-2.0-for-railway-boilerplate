import BlogInfoBanner from "@components/Blog/BlogInfoBanner"
import MarkdownRenderer from "@components/MarkdownRenderer"
import { notFound } from "next/navigation"
import BlogAuthor from "@components/Blog/BlogAuthor"
import BlogImageSection from "@components/Blog/BlogImageSection"
import { getBlogByHandle, getCategoriesById } from "@lib/data/blog"
import NotFound from "app/not-found"

type Props = {
  params: {
    slug: string
  }
}

const Page = async ({ params: { slug } }: Props) => {
  const blogs = await getBlogByHandle(slug)

  if (blogs.length === 0) {
    return <NotFound />
  }

  const categories = await Promise.all(
    blogs[0]?.product_categories?.map((category: any) =>
      getCategoriesById(category.id)
    )
  )

  return (
    <div>
      <BlogImageSection blog={blogs[0]} />
      <BlogInfoBanner blog={blogs[0]} categories={categories} />
      <MarkdownRenderer
        content={blogs[0]?.content}
        className="mx-auto max-w-4xl flex flex-col gap-6 py-6 px-4"
      />
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <BlogAuthor author={blogs[0]?.user} />
      </div>
    </div>
  )
}

export default Page
