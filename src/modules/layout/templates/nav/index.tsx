"use client";
import { Suspense, useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import { clx } from "@medusajs/ui";
import { usePathname } from "next/navigation";
import LottieAnimation from "@lib/util/chameleongif";

type NavProps = {
  regions: HttpTypes.StoreRegion[];
  productCategories: HttpTypes.StoreProductCategory[];
};

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
    <header className={`top-0 inset-x-0 w-full z-[50] shadow-md transition-all duration-300  ${
      isHomePage
        ? scrolling
          ? "home-page-white-shadow sticky" 
          : "home-page-black-shadow fixed"
        : "home-page-white-shadow sticky"
    }`}>
      <nav className="content-container header-nav flex items-center justify-between w-full h-16 text-small-regular">
        
        {/* Left: Side Menu */}
        <div className="flex-1 basis-0 h-full flex items-center">
          <div className="h-full p-2 text-xl z-[100]"> {/* Ensure SideMenu stays above everything */}
            <SideMenu regions={regions} />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center h-full">
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
            data-testid="nav-store-link"
          >
            <div className="flex items-center space-x-2">
              <span className="masking-container flex items-center p-2">
                <h1 className={`${
                  isHomePage
                    ? scrolling
                      ? "masked-text" 
                      : "unmasked-text"
                    : "masked-text"
                }`}>
                  Jeeva Verse
                </h1>
                <LottieAnimation />
              </span>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Right: Account & Cart */}
        <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
          <div className="hidden small:flex items-center gap-x-6 h-full">
            <LocalizedClientLink
              className={`hover:text-ui-fg-base text-bold text-lg font-italic ${
                isHomePage
        ? scrolling
          ? "text-black" 
          : "text-white"
        : "text-black"
              } `}
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
          </div>
          <div className="cart-home">
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
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
        </div>

      </nav>

      {/* Product Categories Inside Header */}
      {productCategories && productCategories.length > 0 && (
        <div className={`w-full h-10 flex items-center justify-center bg-gray-100 border-gray-300 ${isHomePage
        ? scrolling
          ? "category-header-white-shadow" 
          : "category-header-black-shadow"
        : "category-header-white-shadow"
        }`}>
          <ul className="flex gap-x-6" data-testid="footer-categories">
            {productCategories.slice(0, 6).map((c) => {
              if (c.parent_category) return null;

              const children = c.category_children?.map((child) => ({
                name: child.name,
                handle: child.handle,
                id: child.id,
              })) || null;

              return (
                <li
                  className={`flex flex-col gap-1 text-ui-fg-subtle txt-lg ${
                    isHomePage ? 
                      scrolling ? "categories-text-black" : "categories-text-white"
                    : "categories-text-black"
                  }`}
                  key={c.id}
                >
                  <LocalizedClientLink
                    className={clx("hover:text-ui-fg-base", children && "txt-small-plus")}
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
    </header>
  );
}
``