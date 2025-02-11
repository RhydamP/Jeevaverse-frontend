
import { Metadata } from "next"
import ContactUs from "@modules/common/components/contact"
import { getBaseURL } from "@lib/util/env"
import Footer from "@modules/layout/templates/footer"

import NavWrapper from "@modules/layout/templates/nav/navWrapper"


export default async function ContactPageLayout() {
  return (
    <>
      <ContactUs/>
    </>
  )
}
