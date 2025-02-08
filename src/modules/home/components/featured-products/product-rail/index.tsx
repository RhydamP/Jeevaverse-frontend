"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { listProducts } from "@lib/data/products"

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

  if (loading) return <p>Loading...</p>
  if (!pricedProducts.length) return null

  return (
    <div className="content-container py-3 small:py-14">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <div className="overflow-x-auto md:overflow-visible snap-x snap-mandatory">
        <ul className="flex gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
          {pricedProducts.map((product) => (
            <li key={product.id} className="snap-center">
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )       
}
