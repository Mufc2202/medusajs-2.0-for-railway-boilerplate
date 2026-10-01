"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { HomeVideoData } from "@lib/data/home-video"

export default function HomeVideo({
  video,
}: {
  video: HomeVideoData | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const isAutoplayConfigured = Boolean(video?.autoplay)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [showControls, setShowControls] = useState<boolean>(!isAutoplayConfigured)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [isSeeking, setIsSeeking] = useState<boolean>(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  if (!video || !video.is_active || !video.video_url) {
    return null
  }

  const isVimeo =
    video.provider === "vimeo" || video.video_url.includes("vimeo.com")
  const isYouTube =
    video.provider === "youtube" ||
    video.video_url.includes("youtube.com") ||
    video.video_url.includes("youtu.be")

  // Generate clean embed URL respecting the autoplay flag strictly
  const getCleanEmbedUrl = (url: string) => {
    // 1. Vimeo: https://vimeo.com/1151439885/8c19318c2b
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
    if (vimeoMatch) {
      const id = vimeoMatch[1]
      const hash = vimeoMatch[2]
      const params = new URLSearchParams()
      if (hash) params.set("h", hash)

      // Strip default Vimeo chrome, title, and buttons
      params.set("title", "0")
      params.set("byline", "0")
      params.set("portrait", "0")
      params.set("badge", "0")
      params.set("controls", "0") // Hide native Vimeo controls
      params.set("autopause", "0")
      params.set("dnt", "1")
      params.set("playsinline", "1")
      params.set("api", "1")
      params.set("player_id", "dolgins_vimeo_player")

      // Autoplay only if explicitly enabled in admin panel
      if (isAutoplayConfigured) {
        params.set("autoplay", "1")
        params.set("muted", "1")
      } else {
        params.set("autoplay", "0")
        params.set("muted", "0")
      }

      if (video.loop) params.set("loop", "1")

      return `https://player.vimeo.com/video/${id}?${params.toString()}`
    }

    // 2. YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )
    if (ytMatch) {
      const id = ytMatch[1]
      const params = new URLSearchParams()
      params.set("controls", "0") // Hide native YouTube controls
      params.set("modestbranding", "1")
      params.set("rel", "0")
      params.set("showinfo", "0")
      params.set("iv_load_policy", "3")
      params.set("enablejsapi", "1")
      params.set("playsinline", "1")

      // Autoplay only if explicitly enabled in admin panel
      if (isAutoplayConfigured) {
        params.set("autoplay", "1")
        params.set("mute", "1")
      } else {
        params.set("autoplay", "0")
      }

      if (video.loop) {
        params.set("loop", "1")
        params.set("playlist", id)
      }

      return `https://www.youtube.com/embed/${id}?${params.toString()}`
    }

    return url
  }

  // Send message to player
  const postPlayerMessage = useCallback(
    (action: "play" | "pause" | "mute" | "unmute" | "seek", value?: number) => {
      const iframe = iframeRef.current
      if (!iframe || !iframe.contentWindow) return

      if (isVimeo) {
        if (action === "play") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: "play" }),
            "*"
          )
        } else if (action === "pause") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: "pause" }),
            "*"
          )
        } else if (action === "mute") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: "setVolume", value: 0 }),
            "*"
          )
        } else if (action === "unmute") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: "setVolume", value: 1 }),
            "*"
          )
        } else if (action === "seek" && typeof value === "number") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: "setCurrentTime", value }),
            "*"
          )
        }
      } else if (isYouTube) {
        if (action === "play") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*"
          )
        } else if (action === "pause") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "*"
          )
        } else if (action === "mute") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "mute", args: [] }),
            "*"
          )
        } else if (action === "unmute") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "unMute", args: [] }),
            "*"
          )
        } else if (action === "seek" && typeof value === "number") {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "seekTo", args: [value, true] }),
            "*"
          )
        }
      }
    },
    [isVimeo, isYouTube]
  )

  // Listen to postMessage events from Vimeo and YouTube
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data

        if (!data) return

        // 1. Vimeo events
        if (data.event === "timeupdate" && data.data && !isSeeking) {
          const current = data.data.seconds || 0
          const dur = data.data.duration || duration || 0
          setCurrentTime(current)
          if (dur > 0) {
            setDuration(dur)
            setProgress((current / dur) * 100)
          }
        } else if (data.event === "play") {
          setIsPlaying(true)
        } else if (data.event === "pause") {
          setIsPlaying(false)
        } else if (data.event === "ready") {
          // Subscribe to Vimeo events
          const iframe = iframeRef.current
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
              "*"
            )
            iframe.contentWindow.postMessage(
              JSON.stringify({ method: "addEventListener", value: "play" }),
              "*"
            )
            iframe.contentWindow.postMessage(
              JSON.stringify({ method: "addEventListener", value: "pause" }),
              "*"
            )
          }
        }

        // 2. YouTube events (via enablejsapi)
        if (data.event === "infoDelivery" && data.info && !isSeeking) {
          if (typeof data.info.currentTime === "number") {
            setCurrentTime(data.info.currentTime)
          }
          if (typeof data.info.duration === "number" && data.info.duration > 0) {
            setDuration(data.info.duration)
          }
          if (
            typeof data.info.currentTime === "number" &&
            typeof data.info.duration === "number" &&
            data.info.duration > 0
          ) {
            setProgress((data.info.currentTime / data.info.duration) * 100)
          }
          if (data.info.playerState === 1) {
            setIsPlaying(true)
          } else if (data.info.playerState === 2 || data.info.playerState === 0) {
            setIsPlaying(false)
          }
        }
      } catch (e) {
        // Non-JSON message, ignore
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [duration, isSeeking])

  // Setup event listeners when iframe finishes loading
  const handleIframeLoad = () => {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return

    if (isVimeo) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
        "*"
      )
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: "addEventListener", value: "play" }),
        "*"
      )
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: "addEventListener", value: "pause" }),
        "*"
      )
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: "getDuration" }),
        "*"
      )
    } else if (isYouTube) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "listening", id: 1 }),
        "*"
      )
    }
  }

  // Fallback timer when playing to keep track moving smoothly if postMessage is quiet
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isPlaying && !isSeeking && duration > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5
          if (next >= duration) {
            return video.loop ? 0 : duration
          }
          setProgress((next / duration) * 100)
          return next
        })
      }, 500)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, isSeeking, duration, video.loop])

  // Intersection Observer for Scroll-into-view Autoplay (STRICTLY respects video.autoplay)
  useEffect(() => {
    const target = containerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            // ONLY autoplay if video.autoplay is enabled in admin!
            if (isAutoplayConfigured) {
              postPlayerMessage("play")
              setIsPlaying(true)
            }
          } else if (!entry.isIntersecting) {
            // Scrolled out of view: pause
            postPlayerMessage("pause")
            setIsPlaying(false)
          }
        })
      },
      {
        threshold: [0, 0.35, 0.7],
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [isAutoplayConfigured, postPlayerMessage])

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      postPlayerMessage("pause")
      setIsPlaying(false)
      setShowControls(true)
    } else {
      postPlayerMessage("play")
      setIsPlaying(true)
      resetControlsTimer()
    }
  }

  // Sound toggle (Mute / Unmute)
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isMuted) {
      postPlayerMessage("unmute")
      setIsMuted(false)
    } else {
      postPlayerMessage("mute")
      setIsMuted(true)
    }
    resetControlsTimer()
  }

  // Fullscreen toggle
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  // Click / Drag on Track to Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const totalDur = duration > 0 ? duration : 49
    const targetSeconds = percent * totalDur

    setIsSeeking(true)
    setProgress(percent * 100)
    setCurrentTime(targetSeconds)
    postPlayerMessage("seek", targetSeconds)

    setTimeout(() => {
      setIsSeeking(false)
    }, 300)

    resetControlsTimer()
  }

  // Auto-hide controls after inactivity while playing
  const resetControlsTimer = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3500)
    }
  }

  // Cursor handling: Hide IMMEDIATELY when cursor leaves the player
  const handleMouseEnter = () => {
    setShowControls(true)
    resetControlsTimer()
  }

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    if (isPlaying) {
      // Hide all controls immediately when cursor leaves
      setShowControls(false)
    }
  }

  // Format seconds to mm:ss
  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec <= 0) return "0:00"
    const m = Math.floor(timeInSec / 60)
    const s = Math.floor(timeInSec % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  const embedUrl = getCleanEmbedUrl(video.video_url)

  return (
    <section className="relative py-12 sm:py-16 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          {video.title && (
            <h2 className="text-3xl sm:text-4xl font-serif text-dolginsblue tracking-tight">
              {video.title}
            </h2>
          )}
          {video.subtitle && (
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              {video.subtitle}
            </p>
          )}
        </div>

        {/* Custom Dolgins Video Player Container */}
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={resetControlsTimer}
          onMouseLeave={handleMouseLeave}
          onClick={togglePlay}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-gold/20 border-2 border-gold/40 bg-dolginsblue group cursor-pointer select-none"
        >
          {/* 16:9 Video Embed */}
          <div className="relative w-full aspect-video pointer-events-none">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              onLoad={handleIframeLoad}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              loading="lazy"
              title={video.title || "Dolgins Fine Jewelry Story"}
            />
          </div>

          {/* Central Play/Pause Watermark Overlay (shows when paused) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
              !isPlaying ? "opacity-100 bg-black/35" : "opacity-0"
            }`}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-dolginsblue/95 border-2 border-gold flex items-center justify-center shadow-2xl text-gold group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 ml-1 text-gold"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Custom Player Controls & Timeline Track Overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-200 flex flex-col gap-y-2.5 text-white ${
              showControls || !isPlaying
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Interactive Video Progress / Scrubber Track */}
            <div
              className="relative w-full py-2 cursor-pointer group/track flex items-center"
              onClick={handleSeek}
              title="Click or drag to seek"
            >
              {/* Track background rail */}
              <div className="w-full h-1.5 group-hover/track:h-2 bg-white/25 rounded-full relative transition-all duration-150">
                {/* Active progress bar */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gold rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
                {/* Clean scrubber thumb handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3.5 h-3.5 bg-white border-2 border-gold rounded-full shadow-md transition-opacity duration-150"
                  style={{
                    left: `${Math.min(100, Math.max(0, progress))}%`,
                  }}
                />
              </div>
            </div>

            {/* Bottom Bar: Buttons & Time Display */}
            <div className="flex items-center justify-between">
              {/* Left: Play/Pause Button & Time Display */}
              <div className="flex items-center space-x-3.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-gold hover:text-dolginsblue backdrop-blur-md flex items-center justify-center transition"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm10.5 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 ml-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-mono text-gray-200">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-300">
                    {duration > 0 ? formatTime(duration) : "--:--"}
                  </span>
                </div>

                <span className="text-xs font-serif tracking-wider text-gold/90 hidden md:inline-block pl-2 border-l border-white/20">
                  Dolgins Heritage Film
                </span>
              </div>

              {/* Right: Sound Toggle & Fullscreen */}
              <div className="flex items-center space-x-2.5">
                {/* Unmute / Mute Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-gold hover:text-dolginsblue backdrop-blur-md flex items-center space-x-1.5 text-xs font-semibold transition"
                  title={isMuted ? "Click to Unmute Sound" : "Mute Sound"}
                >
                  {isMuted ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H9z"
                        />
                      </svg>
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H9z"
                        />
                      </svg>
                      <span>Mute</span>
                    </>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-gold hover:text-dolginsblue backdrop-blur-md flex items-center justify-center transition"
                  title="Fullscreen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
