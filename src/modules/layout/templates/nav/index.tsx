"use client";
import { Suspense, useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import { clx } from "@medusajs/ui";
import { usePathname } from "next/navigation";
import LottieAnimation from "@lib/util/chameleongif";
import Image from "next/image";
import { SearchField } from "@lib/util/search-table";

type NavProps = {
  regions: HttpTypes.StoreRegion[];
  productCategories: HttpTypes.StoreProductCategory[];
};

export default function Nav({ regions, productCategories }: NavProps) {
  const [scrolling, setScrolling] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > window.innerHeight * (0.2));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if on homepage
  const isHomePage = pathname === "/in";
  const logo = "/assets/gif/logo.jpg";

  return (
    <header className="bg-white fixed top-0 inset-x-0 w-full z-[50] shadow-md transition-all duration-300">
      <nav className=" content-container header-nav flex items-center justify-between w-full h-13 text-small-regular  p-2">

        {/* Left: Side Menu */}
        <div className="flex-1 basis-0 h-full flex items-start justify-start">
          <div className="h-full w-full p-2 text-xl z-[100]">
            <SideMenu regions={regions} />
          </div>
        </div>

        <div className={`search-full-nav transition-all duration-300 `}>
          <div className="search flex items-center justify-center w-[90%] ">
            <SearchField />
          </div>
          <LocalizedClientLink
            href="/"
            data-testid="nav-store-link"
            className="logo"
          >
            <Image
              src={logo}
              alt='logo'
              width={isHomePage ? (scrolling ? 180 : 500) : 180}
              height={isHomePage ? (scrolling ? 180 : 500) : 180}
              className="rounded-full transition-all duration-300 "
            />
          </LocalizedClientLink>
          <div className=" w-full flex flex-row justify-center items-center">
          <LocalizedClientLink
            href="/store"
            data-testid="nav-store-link"
            className=""
          >
            <div className="hidden max-[800px]:flex max-[520px]:hidden justify-center items-center text-ui-fg-subtle text-gray-800 font-italic text-md">
              See all Products
            </div>
            </LocalizedClientLink>
            {productCategories && productCategories.length > 0 && (
              <div className={`w-[50%] h-10 flex items-center justify-center bg-white border-gray-300 max-[800px]:hidden`}>
                <ul className="flex gap-x-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null;

                    const children = c.category_children?.map((child) => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id,
                    })) || null;

                    return (
                      <li
                        className={`flex flex-col gap-1 text-ui-fg-subtle txt-lg text-black`}
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
            <div className="flex items-end gap-x-6 h-full flex-1 basis-0 justify-end header-cart">
              <div className="hidden small:flex items-center h-full">
                <LocalizedClientLink
                  className={`hover:text-ui-fg-base text-sm font-italic w-20`}
                  href="/contact"
                  data-testid="nav-contact-link"
                >
                  Contact Us
                </LocalizedClientLink>
              </div>
              <div className="hidden small:flex items-center h-full">
                <LocalizedClientLink
                  className={`hover:text-ui-fg-base text-bold text-sm font-italic `}
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
          </div>
        </div>

      </nav>

      {/* Product Categories Inside Header */}

    </header>
  );
}
