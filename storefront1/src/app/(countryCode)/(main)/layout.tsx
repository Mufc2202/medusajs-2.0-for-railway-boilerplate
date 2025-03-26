import { Metadata } from "next"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"
import { enrichLineItems, retrieveCart } from "@lib/data/cart"
import Banner from "@components/Banner"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (!cart) {
    return null
  }

  if (cart?.items?.length) {
    const enrichedItems = await enrichLineItems(cart.items, cart.region_id!)
    cart.items = enrichedItems
  }

  return cart
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const cartData = await fetchCart()

  return (
    <>
      <Banner />
      <Nav cartData={cartData} />
      {props.children}
      <Footer />
    </>
  )
}
