"use client"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment, useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  "Contact-Us": "/contact",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [scrolling, setScrolling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/in";

  return (
    <div className="h-full ">
      <div className="flex items-center h-full">
      <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base text-xl p-1"
        >
          {isOpen ? (
            <ArrowRightMini className="w-8 h-8 text-white absolute top-4 right-4" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              className={`w-8 h-8 menu-sidebar-black`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen lg:w-1/5 sm:w-1/4 md:w-1/4 bg-[rgba(3,7,18,0.9)] text-white shadow-lg z-[9999] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)}>
              <XMark className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col gap-6 items-center justify-center">
            {Object.entries(SideMenuItems).map(([name, href]) => (
              <li key={name}>
                <LocalizedClientLink
                  href={href}
                  className="md:text-2xl leading-10 hover:text-ui-fg-disabled sm:text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          {/* Country Select & Footer */}
          <div className="flex flex-col gap-y-6">
            <div
              className="flex justify-between"
              onMouseEnter={toggleState.open}
              onMouseLeave={toggleState.close}
            >
              {regions && (
                <CountrySelect toggleState={toggleState} regions={regions} />
              )}
              <ArrowRightMini
                className={clx(
                  "transition-transform duration-150",
                  toggleState.state ? "-rotate-90" : ""
                )}
              />
            </div>
            <Text className="flex justify-between txt-compact-small">
              © {new Date().getFullYear()} Jeeva Verse. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
