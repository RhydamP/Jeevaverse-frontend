"use client"

import { useEffect, useState, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { motion } from "framer-motion"
import FeaturedPet from "@modules/products/components/FeaturedPets.tsx"
import CustomerReview from "@modules/checkout/components/customer-review/review"

type FeaturedProductsProps = {
  region: HttpTypes.StoreRegion
  collections: HttpTypes.StoreCollection[]
}

export default function FeaturedProducts({ region, collections }: FeaturedProductsProps) {
  const [collectionsState, setCollections] = useState<HttpTypes.StoreCollection[]>(collections)
  const [regionSelected, setRegion] = useState<HttpTypes.StoreRegion | null>(region)
  const [index, setIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCollections(collections)
    setRegion(region)
  }, [collections, region])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % collections.length)
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * ((index + 1) % collections.length), behavior: "smooth" })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [collections.length, index])

  if (!collectionsState.length || !regionSelected) return <p className="flex items-center justify-center">No products available</p>

  return (
    <div>
    <div className="relative flex items-center justify-center w-full">
      <button
        onClick={() => {
          setIndex((prevIndex) => (prevIndex - 1 + collections.length) % collections.length);
          if (sliderRef.current) {
            sliderRef.current.scrollTo({
              left: sliderRef.current.clientWidth * ((index - 1 + collections.length) % collections.length),
              behavior: "smooth",
            });
          }
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10"
      >
        ◀
      </button>

      {/* Slideshow Container */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
        <div ref={sliderRef} className="flex w-full overflow-x-scroll scroll-smooth no-scrollbar">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 w-full"
            >
              <ProductRail collection={collection} region={regionSelected} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => {
          setIndex((prevIndex) => (prevIndex + 1) % collections.length);
          if (sliderRef.current) {
            sliderRef.current.scrollTo({
              left: sliderRef.current.clientWidth * ((index + 1) % collections.length),
              behavior: "smooth",
            });
          }
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10"
      >
        ▶
      </button>
    </div>
    <FeaturedPet region={region} />
    <CustomerReview/>
    </div>
  )
}
