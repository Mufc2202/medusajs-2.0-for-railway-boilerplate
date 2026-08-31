"use client"

import React, { useState } from "react"
import { InstagramFeedResponse, InstagramPostProps } from "types/global"
import InstagramCard from "./instagram-card"
import InstagramModal from "./instagram-modal"

type InstagramFeedProps = {
  feedData?: InstagramFeedResponse
}

export default function InstagramFeed({ feedData }: InstagramFeedProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPostProps | null>(null)

  const posts = feedData?.posts || []
  const handle = feedData?.handle || "dolgins_jewelry"
  const profileUrl = feedData?.profile_url || "https://www.instagram.com/dolgins_jewelry/"
  const title = feedData?.title || "Follow Our Journey"
  const subtitle =
    feedData?.subtitle ||
    `@${handle} — Handcrafted custom jewelry, diamonds & heirloom restorations in Overland Park & Kansas City`

  if (!posts || posts.length === 0) {
    return null
  }

  // Adaptive layout so 1, 2, 3, or 4+ posts always look perfectly balanced & centered
  const getGridClasses = (count: number) => {
    switch (count) {
      case 1:
        return "grid grid-cols-1 max-w-md mx-auto"
      case 2:
        return "grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-4 sm:gap-6"
      case 3:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-4 sm:gap-6"
      default:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    }
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b-2 border-gold pb-6 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-gold">
              FINE JEWELRY & INSPIRATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dolginsblue tracking-tight mt-1">
              {title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-dolginsblue hover:bg-dolginslightblue text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>@{handle}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gold">Follow</span>
            </a>
          </div>
        </div>

        {/* Adaptive Grid */}
        <div className={getGridClasses(posts.length)}>
          {posts.slice(0, 8).map((post) => (
            <InstagramCard
              key={post.id}
              post={post}
              onSelect={(p) => setSelectedPost(p)}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="flex items-center gap-2">
            <span className="text-gold font-bold">#DolginsJewelry</span>
            <span>— Tag us in your engagement and fine jewelry moments</span>
          </p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-dolginslightblue hover:text-dolginsblue transition-colors flex items-center gap-1"
          >
            Explore Full Gallery on Instagram →
          </a>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <InstagramModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  )
}
