import Image from "next/image"
import styles from "./BlogAuthor.module.css"
// import type { BlogAuthor } from "types/blog"
import defaultImg from "@images/defualtProfile.png"

const BlogAuthor = ({ author }: { author: any }) => {
  return (
    <div
      className={`${styles.container} group hover:-translate-y-[5%] duration-300`}
    >
      <div className="relative w-full max-w-48 sm:max-w-[25%] aspect-square overflow-hidden rounded-full">
        <Image
          src={author?.metadata?.image || defaultImg}
          fill
          alt=""
          className="object-cover group-hover:scale-105 duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex max-sm:flex-col gap-4 items-center justify-between">
          <h2 className="text-3xl font-bold text-primary">
            {author?.first_name || author?.last_name
              ? `${author?.first_name} ${author?.last_name}`
              : "Author"}
          </h2>
          {/* <Button className="rounded-full px-6">Content</Button> */}
        </div>
        {author?.metadata?.about && (
          <p className="text-markdown max-sm:text-center">
            {author?.metadata?.about}
          </p>
        )}
        {/* <p className="text-markdown max-sm:text-center">{author?.about}</p> */}
        {/* <div></div> */}
      </div>
    </div>
  )
}

export default BlogAuthor
