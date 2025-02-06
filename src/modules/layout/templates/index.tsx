import React from "react"
import Footer from "@modules/layout/templates/footer"
import NavWrapper from "./nav/navWrapper"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div>
      <NavWrapper />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
