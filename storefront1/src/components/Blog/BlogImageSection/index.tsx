import Image from "next/image"
import React from "react"

const BlogImageSection = ({ blog }: { blog: any }) => {
  // TODO: need to appy scroll scale down effect

  return (
    <div className="relative py-10 pt-32">
      <div className="w-full bg-blue-500 aspect-[5/1] absolute inset-0"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl relative w-full aspect-video overflow-hidden">
          <Image
            className="scale-105 hover:scale-100 duration-500"
            src={blog?.image ? blog?.image : ""}
            alt={blog?.title ?? blog?.title}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default BlogImageSection
