import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Add caching for data fetching
import { cache } from 'react'

// Cache the expensive data fetching operations
const cachedListCategories = cache(listCategories)
const cachedListRegions = cache(listRegions)
const cachedGetCategoryByHandle = cache(getCategoryByHandle)

// Implement pagination for generateStaticParams
const BATCH_SIZE = 50 // Adjust based on your needs

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const [product_categories, regions] = await Promise.all([
      cachedListCategories(),
      cachedListRegions(),
    ])

    if (!product_categories) {
      return []
    }

    const countryCodes = regions?.map((r: StoreRegion) => 
      r.countries?.map((c) => c.iso_2)
    ).flat()

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    // Generate params in batches to prevent memory issues
    const staticParams = []
    for (let i = 0; i < countryCodes.length; i += BATCH_SIZE) {
      const countryBatch = countryCodes.slice(i, i + BATCH_SIZE)
      const batchParams = countryBatch
        .map((countryCode: string | undefined) =>
          categoryHandles.map((handle: any) => ({
            countryCode,
            category: [handle],
          }))
        )
        .flat()
      staticParams.push(...batchParams)
    }

    return staticParams
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const productCategory = await cachedGetCategoryByHandle(params.category)

    if (!productCategory) {
      return notFound()
    }

    const title = productCategory.name
    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    return notFound()
  }
}

// Add interface for better type safety
interface CategoryPageProps {
  params: Promise<{ 
    category: string[]
    countryCode: string 
  }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function CategoryPage(props: CategoryPageProps) {
  try {
    const [searchParams, params] = await Promise.all([
      props.searchParams,
      props.params
    ])

    const { sortBy, page } = searchParams
    const productCategory = await cachedGetCategoryByHandle(params.category)

    if (!productCategory) {
      return notFound()
    }

    return (
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    return notFound()
  }
}