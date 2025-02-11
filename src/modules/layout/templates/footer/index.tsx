import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-green-700 bg-gray-900 text-gray-300 w-full">
      <div className="content-container flex flex-col w-full py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16">
          {/* Logo / Branding */}
          <div className="flex flex-col items-start">
            <LocalizedClientLink
              href="/"
              className="text-green-400 text-xl font-semibold hover:text-green-300 transition-colors"
            >
              Jeevaverse  
            </LocalizedClientLink>
            <Text className="text-sm text-gray-400 mt-2">
              Empowering Indian Exotic Pet Lifestyle.
            </Text>
          </div>

          {/* Categories & Collections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 text-sm">
            {productCategories && productCategories.length > 0 && (
              <div>
                <span className="text-green-400 font-medium">Categories</span>
                <ul className="mt-2 space-y-1">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-gray-400 hover:text-green-300 transition-colors"
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {collections && collections.length > 0 && (
              <div>
                <span className="text-green-400 font-medium">Collections</span>
                <ul className="mt-2 space-y-1">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-gray-400 hover:text-green-300 transition-colors"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            <div>
              <span className="text-green-400 font-medium">Resources</span>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-green-300 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-green-300 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-green-300 transition-colors"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-700 mt-6 mb-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <Text>
            © {new Date().getFullYear()} Jeevaverse. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  )
}
