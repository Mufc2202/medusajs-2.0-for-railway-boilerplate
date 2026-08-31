"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { InstagramPostProps } from "types/global"

type InstagramModalProps = {
  post: InstagramPostProps | null
  onClose: () => void
}

export default function InstagramModal({ post, onClose }: InstagramModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)

  // Reset index when opening a new post
  useEffect(() => {
    setActiveImageIndex(0)
    setBookmarked(false)
  }, [post])

  const images: string[] = React.useMemo(() => {
    if (!post) return []
    const list: string[] = []
    if (Array.isArray(post.metadata?.carousel_images)) {
      list.push(...post.metadata.carousel_images)
    }
    if (post.carousel_images && Array.isArray(post.carousel_images)) {
      list.push(...post.carousel_images)
    }
    if (post.media_url && !list.includes(post.media_url)) {
      list.unshift(post.media_url)
    }
    return Array.from(new Set(list.filter(Boolean)))
  }, [post])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        if (images.length > 1) {
          setActiveImageIndex((prev) => (prev + 1) % images.length)
        }
      } else if (e.key === "ArrowLeft") {
        if (images.length > 1) {
          setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
        }
      }
    }
    if (post) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [post, onClose, images.length])

  if (!post) return null

  const isEmbed =
    post.media_url?.includes("/embed") ||
    post.media_url?.includes("instagram.com/p/")

  const currentImage = images[activeImageIndex] || post.media_url

  // Case 1: Pure Instagram Embed (Single clean centered framed widget)
  if (isEmbed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-top"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Instagram Post Lookbook"
      >
        <div
          className="relative flex flex-col w-full max-w-[440px] max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 animate-enter"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white shadow-md transition-all hover:scale-105"
            aria-label="Close dialog"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Native Instagram Live Embed */}
          <div className="w-full h-[520px] bg-black relative">
            <iframe
              src={
                post.media_url.includes("/embed")
                  ? post.media_url
                  : `${post.permalink || post.media_url}embed/`
              }
              className="w-full h-full border-0"
              title="Dolgins Instagram Post"
              scrolling="no"
            />
          </div>

          {/* Shoppable Tag Bottom Bar */}
          {(post.product_title || post.product_handle) ? (
            <div className="p-4 bg-gray-50 border-t border-gold/30 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gold flex items-center gap-1">
                  <span>✦</span> Tagged Jewelry Piece
                </span>
                <p className="font-semibold text-dolginsblue text-xs truncate">
                  {post.product_title}
                </p>
                {post.product_price && (
                  <p className="text-[11px] text-gray-500 font-medium">{post.product_price}</p>
                )}
              </div>
              <Link
                href={post.custom_cta_link || (post.product_handle ? `/products/${post.product_handle}` : "/store")}
                className="px-3.5 py-1.5 rounded-lg bg-dolginsblue hover:bg-dolginslightblue text-white text-xs font-bold transition-colors shadow-sm flex-shrink-0"
              >
                {post.custom_cta_text || "Shop"}
              </Link>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">@dolgins_jewelry</span>
              <a
                href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-dolginslightblue hover:text-dolginsblue transition-colors flex items-center gap-1"
              >
                Open in Instagram →
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  const isVideo =
    post.media_type === "VIDEO" ||
    post.media_url?.endsWith(".mp4") ||
    post.media_url?.includes(".mp4?") ||
    Boolean(post.metadata?.video_url) ||
    Boolean(post.video_url)

  const videoSrc =
    post.metadata?.video_url ||
    post.video_url ||
    (post.media_url?.includes(".mp4") ? post.media_url : "")

  // Case 2: Curated Media Post with Native Instagram 1:1 Responsive Geometry
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in-top"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instagram-modal-title"
    >
      <div
        className="relative flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-enter max-w-[calc(100vw-32px)] max-h-[calc(100vh-40px)] md:h-[min(calc(100vh-80px),620px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md transition-all hover:scale-105"
          aria-label="Close dialog"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Container: Proportional 1:1 Square locked to dialog height */}
        <div className="relative w-full md:w-auto md:h-full aspect-square bg-black flex items-center justify-center flex-shrink-0 select-none overflow-hidden">
          {/* Main Jewelry Media: Video or High-Res Image */}
          {isVideo && videoSrc ? (
            <video
              src={videoSrc}
              poster={post.thumbnail_url || (images.length > 0 ? images[0] : post.media_url)}
              controls
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-contain bg-black"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentImage}
              alt={post.caption || "Dolgins Fine Jewelry"}
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Carousel Arrows (if multi-image post) */}
          {images.length > 1 && (
            <>
              {activeImageIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveImageIndex((prev) => Math.max(0, prev - 1))
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {activeImageIndex < images.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveImageIndex((prev) => Math.min(images.length - 1, prev + 1))
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Carousel Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex(idx)
                    }}
                    className={`rounded-full transition-all ${
                      idx === activeImageIndex
                        ? "bg-white w-2.5 h-2.5"
                        : "bg-white/50 hover:bg-white/80 w-1.5 h-1.5"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Details: Native Instagram Structure */}
        <div className="flex flex-col justify-between flex-1 bg-white min-w-[300px] max-w-[420px] h-full overflow-hidden">
          {/* Header (border-b) */}
          <div className="p-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex items-center justify-center shadow-sm">
                <div className="w-full h-full rounded-full bg-dolginsblue flex items-center justify-center text-white font-bold text-[11px]">
                  DJ
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span id="instagram-modal-title" className="font-bold text-gray-900 text-xs sm:text-sm hover:underline cursor-pointer">
                    dolgins_jewelry
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <a
                    href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Follow
                  </a>
                </div>
                <p className="text-[11px] text-gray-500">Overland Park, Kansas</p>
              </div>
            </div>
          </div>

          {/* Scrollable Middle Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {/* Author Post Line & Full Caption */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-dolginsblue flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 mt-0.5">
                DJ
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-gray-900 leading-relaxed">
                  <span className="font-bold text-gray-900 mr-2">dolgins_jewelry</span>
                  <span className="text-gray-400 text-xs mr-2">9w</span>
                  <span className="text-gray-800 whitespace-pre-line">
                    {post.caption || "Parents designed and we made this custom medallion pendant in sterling silver. They included some subtle details as well as some obvious ones. #kstate"}
                  </span>
                </p>
              </div>
            </div>

            {/* Shoppable Tagged Jewelry Piece */}
            {(post.product_title || post.product_handle) && (
              <div className="mt-2 p-3.5 rounded-xl bg-gray-50 border border-gold/40 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gold uppercase tracking-wider">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tagged Jewelry Piece
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-dolginsblue text-xs sm:text-sm truncate">{post.product_title || "Featured Jewelry"}</h4>
                    {post.product_price && <p className="text-xs font-medium text-gray-600">{post.product_price}</p>}
                  </div>

                  <Link
                    href={post.custom_cta_link || (post.product_handle ? `/products/${post.product_handle}` : "/store")}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-dolginsblue text-white hover:bg-dolginslightblue transition-colors shadow-sm flex-shrink-0"
                  >
                    {post.custom_cta_text || "View Piece"}
                  </Link>
                </div>
              </div>
            )}

            {/* Comments Placeholder */}
            <div className="pt-8 pb-4 flex flex-col items-center justify-center text-center space-y-1 text-gray-400">
              <p className="font-bold text-gray-800 text-sm">No comments yet.</p>
              <p className="text-xs">Start the conversation.</p>
            </div>
          </div>

          {/* Sticky Footer: Social Action Bar & CTA */}
          <div className="p-3.5 border-t border-gray-100 bg-white space-y-2.5">
            {/* Social Icons Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-700">
                {/* Heart / Like on Instagram Button */}
                <a
                  href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 text-gray-700 hover:text-red-500 transition-all active:scale-125 inline-flex items-center justify-center"
                  aria-label="Like on Instagram"
                >
                  <svg
                    className="w-6 h-6 fill-none stroke-current hover:text-red-500 hover:fill-red-50 transition-colors"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    />
                  </svg>
                </a>

                {/* Comment Bubble */}
                <a
                  href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 text-gray-700 transition-transform active:scale-125"
                  aria-label="Comment on Instagram"
                >
                  <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                    />
                  </svg>
                </a>

                {/* Share Paper Plane */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(post.permalink || window.location.href)
                    alert("Post link copied to clipboard!")
                  }}
                  className="hover:opacity-70 text-gray-700 transition-transform active:scale-125"
                  aria-label="Share post"
                >
                  <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>

              {/* Bookmark / Save on Instagram Button */}
              <a
                href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 text-gray-700 hover:text-gray-900 transition-all active:scale-125 inline-flex items-center justify-center"
                aria-label="Save on Instagram"
                title="Save on Instagram"
              >
                <svg
                  className="w-6 h-6 fill-none stroke-current hover:fill-gray-900 transition-colors"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </a>
            </div>

            {/* Dynamic Like count & Genuine Post Date */}
            <div>
              {post.likes_count > 0 ? (
                <p className="font-bold text-gray-900 text-xs">
                  {post.likes_count.toLocaleString()} {post.likes_count === 1 ? "like" : "likes"}
                </p>
              ) : (
                <a
                  href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-900 text-xs hover:underline"
                >
                  View on Instagram
                </a>
              )}
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                {post.metadata?.posted_at
                  ? post.metadata.posted_at
                  : post.created_at
                  ? new Date(post.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Dolgins Lookbook"}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-1 flex items-center gap-2">
              <a
                href={post.permalink || "https://www.instagram.com/dolgins_jewelry/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                View on Instagram
              </a>

              <button
                onClick={onClose}
                className="py-2 px-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
