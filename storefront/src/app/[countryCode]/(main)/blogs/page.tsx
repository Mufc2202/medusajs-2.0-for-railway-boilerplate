import BlogCard from "@components/Blog/BlogCard"
import BlogCategories from "@components/Blog/BlogCategories"
import BlogHeroSection from "@components/Blog/BlogHeroSection"
import { getBlogCategories, getBlogsList } from "@lib/data/blog"

const Page = async () => {
  const response = await getBlogsList()
  const { blogs } = await response.json()

  // const categories = await getBlogCategories()
  return (
    <>
      <BlogHeroSection />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex max-md:flex-col gap-6 md:items-center justify-between py-10">
          <h2 className="text-primary text-3xl font-serif font-bold whitespace-nowrap">
            Resources & News
          </h2>
          {/* {categories && <BlogCategories categories={categories} />} */}
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          {blogs?.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Page
