import React from "react"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { enrichLineItems, retrieveCart } from "@lib/data/cart"

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

const Layout: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const cartData = await fetchCart()

  return (
    <div>
      <Nav cartData={cartData} />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
