import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"


type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams

}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const productCategory = await getCategoryByHandle(params.category)
    if (!productCategory) {
      return notFound()
    }

    const title = productCategory.name
    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} `,
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
    const productCategory = await getCategoryByHandle(params.category)

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