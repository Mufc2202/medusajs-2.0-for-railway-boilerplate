import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
      <GoogleAnalytics gaId="AW-10856306482" />
    </html>
  )
}
