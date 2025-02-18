import React from "react"
import styles from "./BlogCard.module.css"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@lib/utils"
import { convertDateFormat } from "@lib/convertBlogDate"
import { BlogBadge } from "@components/Blog/BlogBadge"
import { getCategoriesById } from "@lib/data/blog"
import defaultImg from "@images/no_image.jpg"

const BlogCard = async ({ blog }: { blog: any }) => {
  const categories = await Promise.all(
    blog?.product_categories?.map((category: any) =>
      getCategoriesById(category.id)
    )
  )

  return (
    <Link
      href={`/blogs/${blog?.handle}`}
      className={cn(
        styles.blogCard,
        "block group hover:-translate-y-[5%] duration-500"
      )}
    >
      <div className={styles.blogImage}>
        <Image
          src={blog?.image ? blog?.image : defaultImg}
          alt={blog?.title ?? "Blog Image"}
          fill
          className="-z-10 group-hover:scale-105 duration-500"
        />
      </div>
      <div className={styles.blogInfo}>
        <span className={styles.blogDate}>
          {convertDateFormat(blog?.created_at)}
        </span>
        <div className="flex gap-2 overflow-x-scroll no-scrollbar">
          {categories?.length > 0 &&
            categories?.map((category: any) => (
              <BlogBadge
                key={category?.product_category?.id}
                variant="jpd"
                size="sm"
                className="px-2"
              >
                {category?.product_category?.name || ""}
              </BlogBadge>
            ))}
        </div>
        <h3 className={styles.blogTitle}>{blog?.title}</h3>
      </div>
    </Link>
  )
}

export default BlogCard
