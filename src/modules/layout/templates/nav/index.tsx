"use client";
import { Suspense, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { clx } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import LottieAnimation from "@lib/util/chameleongif";


type NavProps = {
  regions: HttpTypes.StoreRegion[]
  productCategories: HttpTypes.StoreProductCategory[]
}

export default function Nav({ regions, productCategories }: NavProps) {
  const [scrolling, setScrolling] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if on homepage
  const isHomePage = pathname === "/in"; 


  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isHomePage
        ? scrolling
          ? "bg-white shadow-md text-black" 
          : "bg-gradient-to-b from-black to-transparent text-white"
        : "bg-white shadow-md sticky"
      }`}
    >    
      <header className="relative h-16 mx-auto duration-200 ">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center mt-7">
            <div className="h-full p-2 text-xl">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <div className="flex items-center space-x-2">
                <span className="masking-container">
                  <h1 className="masked-text p-2">Jeeva Verse</h1>
                </span>
                <LottieAnimation />
                
              </div>
            </LocalizedClientLink>
          </div>

          <div className={`flex items-center gap-x-6 h-full flex-1 basis-0 justify-end  mt-2 ${
            isHomePage
            ? scrolling
              ? "text-black" 
              : "text-white"
            : "textblack"
            }`}>
              <div className="hidden small:flex items-center gap-x-6 h-full">
                <LocalizedClientLink
                  className="hover:text-ui-fg-base text-bold text-lg font-italic"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  Account
                </LocalizedClientLink>
              </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2 "
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <header className="relative h-8 mx-auto duration-200 border-ui-border-base">
        <nav className="content-container text-ui-fg-subtle flex items-center justify-center w-full h-full ">
        {productCategories && productCategories?.length > 0 && (
            <div className="flex flex-col gap-y-2 ">
              <ul
                className="flex gap-x-4 gap-y-2"
                data-testid="footer-categories"
              >
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) {
                    return null;
                  }

                  const children =
                    c.category_children?.map((child) => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id,
                    })) || null;

                  return (
                    <li
                      className={`flex flex-col gap-2 text-ui-fg-subtle txt-lg ${
                        isHomePage ? 
                          scrolling ? 
                           "text-black font-mono"
                          : "text-white font-mono"
                        : "text-black font-mono"
                      }` }
                      key={c.id}
                    >
                      <LocalizedClientLink
                        className={clx(
                          "hover:text-ui-fg-base",
                          children && "txt-small-plus"
                        )}
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                      {children && (
                        <ul className="flex flex-wrap gap-x-3 ml-3">
                          {children.map((child) => (
                            <li key={child.id}>
                              <LocalizedClientLink
                                className="hover:text-ui-fg-base"
                                href={`/categories/${child.handle}`}
                                data-testid="category-link"
                              >
                                {child.name}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </nav>
        </header>
    </div>
  )
}
