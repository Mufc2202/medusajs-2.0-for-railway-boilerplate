import { getBannersList } from "@lib/data/banner"
import { BannerData } from "@modules/layout/BannerData"
import React from "react"

type Props = {}

const Banner = async (props: Props) => {
  const data = await getBannersList()
  return <BannerData data={data} />
}

export default Banner
