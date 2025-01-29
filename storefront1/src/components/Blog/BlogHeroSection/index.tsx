import React from "react"
import styles from "./BlogHeroSection.module.css"

const BlogHeroSection = () => {
  return (
    <div className={styles.blogHero}>
      <div className={styles.contentContainer}>
        <h1 className="font-bold text-5xl text-primary font-serif">Blog</h1>
        <p className="mt-4 text-lg text-markdown max-w-lg text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna.
        </p>
      </div>
    </div>
  )
}

export default BlogHeroSection
