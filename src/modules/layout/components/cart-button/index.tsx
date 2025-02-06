"use client"

import { useEffect, useState } from "react"
import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import { StoreCart } from "@medusajs/types";

export default function CartButton() {
  const [cart, setCart] = useState<StoreCart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await retrieveCart()
        setCart(response)
      } catch (error) {
        console.error("Error fetching cart:", error)
        setCart(null)
      }
    }

    fetchCart()
  }, [])

  return <CartDropdown cart={cart} />
}
