import React from "react"
import styles from "./BlogCard.module.css"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@lib/utils"
import { convertDateFormat } from "@lib/convertBlogDate"
import { BlogBadge } from "@components/Blog/BlogBadge"
const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <Link
      href={`/blogs/${blog?.handle}`}
      className={cn(
        styles.blogCard,
        "block group hover:-translate-y-[5%] duration-500"
      )}
    >
      <div className={styles.blogImage}>
        {/* <BlogBadge
          variant="outline"
          size="lg"
          className="absolute top-6 right-6 hover:bg-background hover:text-primary"
        >
          {blog?.attributes?.category}
        </BlogBadge> */}
        <Image
          src={
            "https://minio.thespecialcharacter.com/auco/banner_1_736d029c8d.jpg"
          }
          // src={blog?.image ? blog?.image : ""}
          alt={
            blog?.attributes?.image?.data?.attributes?.alternativeText ??
            blog?.attributes?.title
          }
          fill
          className="-z-10 group-hover:scale-105 duration-500"
        />
      </div>
      <div className={styles.blogInfo}>
        <span className={styles.blogDate}>
          {convertDateFormat(blog?.created_at)}
        </span>
        <h3 className={styles.blogTitle}>{blog?.title}</h3>
      </div>
    </Link>
  )
}

export default BlogCard
