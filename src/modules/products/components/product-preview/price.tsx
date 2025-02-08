"use client"

import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price , textColor = "text-black"}: { price: VariantPrice;  textColor?: string } ) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted text-md sm:text-sm font-semibold "
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx(
          "text-ui-fg-muted",
          { "text-ui-fg-interactive": price.price_type === "sale" }, 
          textColor 
        )}
        data-testid="price"
      >
        <span className="product-title">{price.calculated_price}</span>
      </Text>
    </>
  )
}
