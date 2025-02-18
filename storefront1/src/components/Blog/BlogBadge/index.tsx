import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@lib/utils"

const blogBadgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-caption2 disabled:opacity-50 duration-500",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:scale-95",
        outline:
          "text-primary border border-input bg-background shadow-sm hover:bg-primary hover:text-primary-foreground hover:scale-95 duration-500",
        secondary: "bg-gray-200 text-secondary-foreground shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        jpd: "bg-dolginsblue text-white hover:text-white outline-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-5 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SpanProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof blogBadgeVariants> {}

const BlogBadge = React.forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        className={cn(blogBadgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  }
)
BlogBadge.displayName = "BlogBadge"

export { BlogBadge, blogBadgeVariants }
