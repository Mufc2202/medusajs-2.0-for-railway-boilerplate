import { BlogBadge } from "../BlogBadge"
import Image from "next/image"
import { convertDateFormat } from "@lib/convertBlogDate"
import { calculateReadingTime } from "@lib/getReadingTime"
import defaultImg from "@images/defualtProfile.png"

type Props = {
  blog: any
  categories: any
}

// TODO: author name and reading time
const BlogInfoBanner = async ({ blog, categories }: Props) => {
  return (
    <section className="mx-auto max-w-4xl flex flex-col gap-6 px-4">
      <h1 className="text-dolginsblue text-5xl capitalize font-bold font-serif">
        {blog?.title}
      </h1>
      <div className="flex max-sm:flex-col gap-8 justify-between sm:items-center border-b-2 border-gold pb-10">
        <div className="flex gap-4 items-center">
          <div className="relative aspect-square w-16">
            <Image
              src={blog?.user?.metadata?.image || defaultImg}
              alt="Avatar Image of Joseph Dolginow in Dolgins Jewelry in Kansas City"
              fill
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-dolginsblue capitalize">
              Written By: Joseph Dolginow
            </span>
            <span className="text-gray-500 text-base">
              {convertDateFormat(blog?.created_at)}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <BlogBadge variant="secondary" size="lg">
            Reading Time: {calculateReadingTime(blog?.content)} m
          </BlogBadge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {categories && categories.length > 0 && (
          <p className="text-2xl font-bold text-dolginsblue">Categories:</p>
        )}
        <div className="flex gap-2 flex-wrap">
          {categories?.length > 0 &&
            categories?.map((category: any) => (
              <BlogBadge
                key={category?.product_category?.id}
                variant="jpd"
                size="default"
              >
                {category?.product_category?.name || ""}
              </BlogBadge>
            ))}
        </div>
      </div>
    </section>
  )
}

export default BlogInfoBanner
