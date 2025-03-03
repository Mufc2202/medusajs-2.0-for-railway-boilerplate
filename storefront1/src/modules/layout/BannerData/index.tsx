"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { BannerProps } from "types/global"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
// import "./styles.css"

import { Autoplay } from "swiper/modules"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

type Props = {
  data: { bannerList: BannerProps[] }
}

export const BannerData = ({ data }: Props) => {
  const bannerData = data?.bannerList?.filter((item) => item.isActive)

  return (
    <>
      <Swiper
        speed={1500}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          // disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {bannerData.map((item) => {
          return (
            <SwiperSlide>
              <div className="bg-dolginsblue">
                {item.link ? (
                  <Link href={item.link}>
                    <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                      <div
                        key={item.id}
                        className="flex items-center gap-4 text-sm font-medium text-white hover:text-gray-100"
                      >
                        <Markdown rehypePlugins={[rehypeRaw]}>
                          {item.text}
                        </Markdown>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-dolginsblue">
                    <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                      <div
                        key={item.id}
                        className="flex items-center space-x-6 text-sm font-medium text-white hover:text-gray-100"
                      >
                        {item.image && (
                          <div className="relative">
                            <Image
                              alt={item.name}
                              src={item.image || ""}
                              className=""
                              fill
                            />
                          </div>
                        )}
                        <Markdown>{item.text}</Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
