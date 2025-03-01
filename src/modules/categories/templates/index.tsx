import { notFound } from "next/navigation"
import { Suspense, memo, useMemo } from "react"
import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

// Memoize child components that don't need frequent updates
const MemoizedRefinementList = memo(RefinementList)
const MemoizedPaginatedProducts = memo(PaginatedProducts)

// Extract CategoryBreadcrumb to its own component
const CategoryBreadcrumb = memo(({ 
  parents 
}: { 
  parents: HttpTypes.StoreProductCategory[] 
}) => (
  <>
    {parents.map((parent) => (
      <span key={parent.id} className="text-ui-fg-subtle">
        <LocalizedClientLink
          className="mr-4 hover:text-black"
          href={`/categories/${parent.handle}`}
          data-testid="sort-by-link"
        >
          {parent.name}
        </LocalizedClientLink>
        /
      </span>
    ))}
  </>
))

CategoryBreadcrumb.displayName = 'CategoryBreadcrumb'

interface CategoryTemplateProps {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: CategoryTemplateProps) {
  if (!category || !countryCode) return notFound()

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Move parent calculation to a memoized value
  const parents = useMemo(() => {
    const parentsList = [] as HttpTypes.StoreProductCategory[]
    const getParents = (cat: HttpTypes.StoreProductCategory) => {
      if (cat.parent_category) {
        parentsList.push(cat.parent_category)
        getParents(cat.parent_category)
      }
    }
    getParents(category)
    return parentsList
  }, [category])

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <MemoizedRefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          <CategoryBreadcrumb parents={parents} />
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>

        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}

        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <MemoizedPaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}