import BlogCard from "@components/Blog/BlogCard"
import BlogCategories from "@components/Blog/BlogCategories"
import BlogHeroSection from "@components/Blog/BlogHeroSection"
import { getBlogsList } from "@lib/data/blog"
import { listCategoriesList } from "@lib/data/categories"

const Page = async () => {
  const data = await getBlogsList()

  const categoryIds =
    data?.blogs &&
    data?.blogs?.flatMap((blog: any) =>
      blog?.product_categories?.map((category: any) => category?.id)
    )
  const uniqueCategoryIds = [...new Set(categoryIds)]
  let categories
  if (uniqueCategoryIds?.length > 0) {
    categories = await listCategoriesList({
      id: uniqueCategoryIds,
    })
  }

  if (!data?.blogs || data?.blogs.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center">
        <p className="text-3xl font-semibold">No Blogs Found</p>
      </div>
    )
  }

  return (
    <>
      <BlogHeroSection />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2>Find By Category:</h2>
        <div className="flex max-md:flex-col gap-6 md:items-center justify-between py-10">
          {uniqueCategoryIds?.length > 0 && categories && (
            <BlogCategories categories={categories} />
          )}
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          {data?.blogs?.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Page
