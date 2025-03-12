"use client"

import { useState, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { motion, AnimatePresence } from "framer-motion"
import FeaturedPet from "@modules/products/components/FeaturedPets.tsx"
import CustomerReview from "@modules/checkout/components/customer-review/review"

type FeaturedProductsProps = {
  region: HttpTypes.StoreRegion
  collections: HttpTypes.StoreCollection[]
}

export default function FeaturedProducts({ region, collections }: FeaturedProductsProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleNext = () => {
    setDirection(1)
    setIndex((prev) => (prev + 1) % collections.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setIndex((prev) => (prev - 1 + collections.length) % collections.length)
  }

  return (
    <div>
      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10"
        >
          ◀
        </button>

        {/* Slideshow Container */}
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
          <div ref={sliderRef} className="relative flex w-full overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={collections[index].id}
                initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: direction === 1 ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
                className=" w-full"
              >
                <div className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar">
                  <ProductRail collection={collections[index]} region={region} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10"
        >
          ▶
        </button>
      </div>

      <FeaturedPet region={region} />
      <CustomerReview />
    </div>
  )
}
