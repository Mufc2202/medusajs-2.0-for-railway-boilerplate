import { NextResponse } from "next/server"
import { getBusinessCardData } from "@lib/data/business-card"

export async function GET() {
  const card = await getBusinessCardData()

  const fullName = `${card.first_name} ${card.last_name}`.trim()
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${card.last_name};${card.first_name};;;`,
    `FN:${fullName}`,
    `ORG:${card.company}`,
    `TITLE:${card.bio}`,
    `TEL;TYPE=CELL,VOICE,TEXT:${card.phone}`,
    `EMAIL;TYPE=PREF,INTERNET:${card.email}`,
    `URL;TYPE=WORK:https://${card.website.replace(/^https?:\/\//, "")}`,
    `ADR;TYPE=WORK,PREF:;;${card.street};${card.city};${card.state};${card.zip};${card.country}`,
    `LABEL;TYPE=WORK,PREF:${card.street}\\n${card.city}, ${card.state} ${card.zip}\\n${card.country}`,
    `NOTE:${card.company} - ${card.bio}`,
    "END:VCARD",
  ].join("\r\n")

  const filename = `${card.first_name.toLowerCase()}-${card.last_name.toLowerCase()}.vcf`

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
