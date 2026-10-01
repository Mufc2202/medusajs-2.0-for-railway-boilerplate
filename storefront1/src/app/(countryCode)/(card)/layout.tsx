import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Joseph Dolginow - Digital Business Card",
  description:
    "Custom Fine Jewelry, Jewelry Repair, Appraisals. Joseph Dolgin Jeweler LLC.",
}

export default function CardStandaloneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-[#323032] font-sans antialiased">
      {children}
    </div>
  )
}
