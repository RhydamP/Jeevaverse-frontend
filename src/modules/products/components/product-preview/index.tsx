"use client"

import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <div data-testid="product-wrapper" className="product-preview">
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <div className="">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="contain"
          isFeatured={isFeatured}
          className="product-preview-thumbnail"
        />
        </div>
        
        <div className="flex flex-col txt-compact-medium mt-4 justify-between product-price-rail">
          <Text className="text-ui-fg-subtle product-title" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2 ">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} textColor="text-black"  />}
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
