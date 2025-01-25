import { useEffect, useState } from "react"
import CartDropdown from "../cart-dropdown"
import { enrichLineItems, retrieveCart } from "@lib/data/cart"
import { StoreCart } from "@medusajs/types"

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

export default function CartButton() {
  const [cart, setCart] = useState<StoreCart | null>(null)

  useEffect(() => {
    const getCart = async () => {
      const cartData = await fetchCart()
      setCart(cartData)
    }

    getCart()
  }, [])

  return <CartDropdown cart={cart} />
}
