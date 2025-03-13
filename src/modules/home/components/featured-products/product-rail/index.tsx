"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { listProducts } from "@lib/data/products"
import HomeProductPreview from "@modules/products/components/home-product-preview"

export default function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const [pricedProducts, setPricedProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const { response } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: collection.id,
          fields: "*variants.calculated_price",
        },
      })

      if (response?.products) {
        setPricedProducts(response.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [collection.id, region.id]) // Re-run when collection or region changes


  return (
    <div className="content-container py-3 mx-3 sm:py-5 ">
      <div className="flex justify-between mb-8">
        <Text className="text-xl font-italic text-lime-800">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <div className="">
        <ul className="flex flex-row items-start gap-6 overflow-x-auto scroll-smooth no-scrollbar product-rail-card ">
          {pricedProducts.map((product) => (
            <li key={product.id} className="snap-center ">
              <HomeProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )       
}
