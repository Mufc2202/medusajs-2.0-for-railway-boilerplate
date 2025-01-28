import { BlogBadge } from "../BlogBadge"
import Image from "next/image"
import { convertDateFormat } from "@lib/convertBlogDate"
import { calculateReadingTime } from "@lib/getReadingTime"

type Props = {
  blog: any
}

// TODO: author name and reading time
const BlogInfoBanner = async ({ blog }: Props) => {
  const BASE_API_URL =
    "https://62zgzp09-9000.inc1.devtunnels.ms/store/product-categories"
  const API_KEY =
    "pk_ed259c7035a5d2060cbc0df14844a4bf05d123dfa6569d4dd80e5e765fbdc083"

  const fetchCategory = async (id: string) => {
    const response = await fetch(`${BASE_API_URL}/${id}`, {
      headers: {
        "x-publishable-api-key": API_KEY,
      },
    })
    if (!response.ok) throw new Error(`Failed to fetch category with id ${id}`)
    return response.json()
  }

  const categories = await Promise.all(
    blog?.product_categories?.map((category) => fetchCategory(category.id))
  )

  return (
    <section className="mx-auto max-w-4xl flex flex-col gap-6">
      <h1 className="text-blue-500 text-5xl font-bold font-serif">
        {blog?.title}
      </h1>
      <div className="flex max-sm:flex-col gap-8 justify-between sm:items-center border-b pb-20">
        <div className="flex gap-2 items-center">
          <div className="relative aspect-square w-16">
            <Image src="/images/defualtProfile.png" alt="author-name" fill />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary text-caption1">
              {blog?.attributes?.author?.name}
            </span>
            <span className="text-gray-500 text-base">
              {convertDateFormat(blog?.created_at)}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {/* {blog?.product_categories && (
            <BlogBadge variant="outline" size="lg">
              {blog?.attributes?.category}
            </BlogBadge>
          )} */}
          <BlogBadge variant="secondary" size="lg">
            {calculateReadingTime(blog?.content)} m
          </BlogBadge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold">Categories:</p>
        <div className="flex gap-2">
          {categories.map((category, index) => (
            <BlogBadge key={index} variant="outline" size="lg">
              {category?.product_category?.name || ""}
            </BlogBadge>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogInfoBanner
