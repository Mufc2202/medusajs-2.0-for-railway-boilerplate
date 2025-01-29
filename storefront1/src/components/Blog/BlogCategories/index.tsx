"use client"

import { Button } from "@medusajs/ui"
import styles from "./BlogCategories.module.css"
import { useRouter } from "next/navigation"

const BlogCategories = ({ categories }: { categories: string[] }) => {
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
    <div className={styles.categoryContainer}>
      <div className={styles.scrollContainer}>
        {categories &&
          categories?.map((category, index) => (
            <Button
              key={index}
              size="large"
              className="h-12"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        {categories &&
          categories?.map((category, index) => (
            <Button
              key={index}
              size="large"
              className="h-12"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        {categories &&
          categories?.map((category, index) => (
            <Button
              key={index}
              size="large"
              className="h-12"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        {categories &&
          categories?.map((category, index) => (
            <Button
              key={index}
              size="large"
              className="h-12"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
      </div>
    </div>
  )
}

export default BlogCategories
