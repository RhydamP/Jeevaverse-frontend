"use client"

import { useEffect, useState } from "react"
import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "../product-preview/price"
import { listProducts, listProductsWithSort } from "@lib/data/products"
import { VariantPrice } from "types/global"

export default function FeaturedPet({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [sortproducts, setSortProducts] = useState<HttpTypes.StoreProduct[]>([])
  const queryParams = { limit: 100 }


  const defaultPriceObject: VariantPrice = {
    calculated_price_number: 0,
    calculated_price: "0",
    original_price_number: 0,
    original_price: "0",
    currency_code: "INR",
    price_type: "default",
    percentage_diff: "0",
  }
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!region) return
  
      const response = await listProducts({
        regionId: region.id,
        queryParams: { ...queryParams },
      })
  
      const fetchedProducts = response?.response.products ?? []
      setProducts(fetchedProducts)
  
      const sortedProducts = fetchedProducts
        .map((product) => ({
          ...product,
          price: getProductPrice({ product }).cheapestPrice?.calculated_price_number ?? 0,
        }))
        .filter((product) => product.price > 0)
        .sort((a, b) => b.price - a.price)
  
      setSortProducts(sortedProducts.slice(0,4))
    }
  
    fetchProducts()
  }, [region]) 
  


  if (!sortproducts.length) {
    return <Text className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent">Loading featured pets...</Text>
  }

  return (
    <>
      <h1 className="text-4xl mt-5 text-center uppercase tracking-widest relative">
        <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent">
          Featured Pets
        </span>
        <span className="absolute -bottom-2 left-1/2 w-16 h-1 bg-gradient-to-r from-green-500 to-green-800 transform -translate-x-1/2"></span>
      </h1>
      <div className="grid grid-cols-2 gap-6 p-6">
      {sortproducts.map((product) => (
        <LocalizedClientLink key={product.id} href={`/products/${product.handle}`} className="group">
          <div className="relative w-90 h- rounded-xl overflow-hidden shadow-lg">
            {/* Product Image */}
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              isFeatured
              size="fit" />

            {/* Overlay (Gradient for better readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* Product Details */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <div className="text-md font-semibold">
                <PreviewPrice price={getProductPrice({ product })?.cheapestPrice ?? defaultPriceObject} />

              </div>
            </div>
          </div>
        </LocalizedClientLink>
      ))}
    </div></>
  )
}
