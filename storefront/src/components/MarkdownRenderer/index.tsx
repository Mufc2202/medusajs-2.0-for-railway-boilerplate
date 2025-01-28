import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import styles from "./MarkdownRenderer.module.css" // Import your CSS module
import { AlignVerticalDistributeCenter } from "lucide-react"
import clsx from "clsx"
import { cn } from "@lib/utils"

type Props = {
  content: any
  className?: clsx.ClassValue
}

const MarkdownRenderer = ({ content, className }: Props) => {
  return (
    <article
      className={cn(styles.markdownContainer, {
        [`${className}`]: !!className,
      })}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        children={content}
        // components={{
        //   blockquote({ node, className, children, ...props }) {
        //     return (
        //       <blockquote className={className} {...props}>
        //         {children}
        //       </blockquote>
        //     )
        //   },
        // }}
      />
    </article>
  )
}

export default MarkdownRenderer
