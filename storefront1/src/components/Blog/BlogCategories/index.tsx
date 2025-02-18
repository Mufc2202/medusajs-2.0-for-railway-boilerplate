"use client"

import { Button } from "@medusajs/ui"
import styles from "./BlogCategories.module.css"
import { useRouter } from "next/navigation"
import { StoreProductCategory } from "@medusajs/types"

const BlogCategories = ({
  categories,
}: {
  categories: StoreProductCategory[]
}) => {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    if (category === "all") {
      return router.push("/blogs")
    }
    router.push(`/blogs?category=${category}`, {
      scroll: false,
    })
  }

  return (
    <div className="max-w-1/2 p-3 flex overflow-scroll no-scrollbar">
      <div className="flex gap-4 items-center flex-1 no-scrollbar">
        {categories &&
          categories?.map((category, index) => (
            <Button
              key={index}
              size="large"
              className="h-10 w-full bg-dolginsblue text-white hover:bg-dolginslightblue hover:text-white outline-none"
              onClick={() => handleCategoryClick(category?.handle)}
            >
              {category?.name}
            </Button>
          ))}
      </div>
    </div>
  )
}

export default BlogCategories
