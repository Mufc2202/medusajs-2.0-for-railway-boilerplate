import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

export const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
export const SITE_NAME = "Dolgins Fine Jewelry"
export const SITE_TITLE = "Dolgins | Welcome - Dolgins Fine Jewelry Store"
export const SITE_DESC =
  "A trusted, 4th generation jewelry store serving Kansas City from a private office in Overland Park. We sell & custom-make beautiful diamond engagement rings, wedding bands & other jewelry. We also buy your unwanted gold and diamonds and repair jewelry."
export const KEYWORDS = "Fine Jewelry, Diamonds, Custom Jewelry, Jewelry Repair"
export const APPLICATION_NAME = "Dolgins"
export const PUBLISHER = "Dolgins Fine Jewelry Kansas City, MO"
export const GENERATOR = "Dolgins Jewelry API"
export const TWITTER_CREATER = "@DolginsJewelry"
export const TWITTER_SITE_ID = ""
export const FB_APP_ID = ""
export const FB_USER_ID = ""
//TheSpecialChar special character
export const AUTHOR = "Joseph Dolginow"
export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION! || "us"
