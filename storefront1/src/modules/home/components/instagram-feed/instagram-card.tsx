"use client"

import React, { useState } from "react"
import { InstagramPostProps } from "types/global"

type InstagramCardProps = {
  post: InstagramPostProps
  onSelect: (post: InstagramPostProps) => void
}

export default function InstagramCard({ post, onSelect }: InstagramCardProps) {
  const [imageError, setImageError] = useState(false)

  // Prioritize poster thumbnail for videos or slides, or direct media_url
  const imageSrc =
    post.thumbnail_url ||
    (post.metadata?.carousel_images && post.metadata.carousel_images[0]) ||
    post.media_url

  return (
    <div
      onClick={() => onSelect(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(post)
        }
      }}
      className="group relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-900 cursor-pointer shadow-sm hover:shadow-2xl border border-gray-100 hover:border-gold/50 transition-all duration-500 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold"
      aria-label={post.caption || "View Dolgins Instagram post"}
    >
      {/* Background Media (Clean 3:4 Aspect Ratio) */}
      <img
        src={
          imageError || !imageSrc || imageSrc.includes("/embed")
            ? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop"
            : imageSrc
        }
        alt={post.caption || "Dolgins Fine Jewelry"}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Shoppable Tag Pill */}
      {post.product_title && (
        <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-dolginsblue text-[11px] font-semibold px-3 py-1 rounded-full shadow-md border border-gold/40">
            <span className="text-gold text-xs">✦</span>
            <span>Shop Look</span>
          </span>
        </div>
      )}

      {/* Dark Luxury Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dolginsblue/95 via-dolginsblue/55 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white pointer-events-none">
        {/* Top Hover IG Logo */}
        <div className="flex items-center justify-end">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        </div>

        {/* Bottom Caption & Action */}
        <div className="space-y-2">
          {post.product_title && (
            <p className="text-xs font-bold text-gold flex items-center gap-1 truncate">
              <span>✦</span> {post.product_title}
            </p>
          )}

          <p className="text-xs text-gray-100 line-clamp-3 leading-relaxed">
            {post.caption || "View post on Instagram @dolgins_jewelry"}
          </p>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-gray-300">
            <span className="text-gold font-medium">View lookbook item →</span>
            {post.likes_count > 0 && <span>♥ {post.likes_count}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
