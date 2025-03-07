import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: 0,
}

/**
 * Fetch the region map and cache it for an hour.
 */
async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    console.error(
      "Middleware.ts: Error fetching regions. Ensure MEDUSA_BACKEND_URL is set."
    )
    return regionMap
  }

  // Refresh region map only if it is stale
  if (!regionMap.size || regionMapUpdated < Date.now() - 3600 * 1000) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        cache: "force-cache",
      })

      if (!response.ok) {
        console.error("Failed to fetch regions:", await response.text())
        return regionMap
      }

      const { regions } = await response.json()
      if (!regions?.length) {
        console.error("No regions found in Medusa backend.")
        return regionMap
      }

      // Clear existing map and update
      regionMapCache.regionMap.clear()
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error("Error fetching regions:", error)
    }
  }

  return regionMapCache.regionMap
}

/**
 * Determines the best country code based on the request.
 */
async function getCountryCode(request: NextRequest, regionMap: Map<string, HttpTypes.StoreRegion>) {
  try {
    const vercelCountryCode = request.headers.get("x-vercel-ip-country")?.toLowerCase()
    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      return urlCountryCode
    }

    if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      return vercelCountryCode
    }

    if (regionMap.has(DEFAULT_REGION)) {
      return DEFAULT_REGION
    }

    return regionMap.keys().next().value || null
  } catch (error) {
    console.error("Middleware.ts: Error determining country code", error)
    return null
  }
}

/**
 * Main middleware function to manage region-based routing.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  let cacheIdCookie = request.cookies.get("_medusa_cache_id")

  let cacheId = cacheIdCookie?.value || crypto.randomUUID()
  const regionMap = await getRegionMap(cacheId)

  if (!regionMap.size) {
    return response // No regions available, let the request proceed
  }

  const countryCode = await getCountryCode(request, regionMap)
  const urlHasCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase() === countryCode

  if (!countryCode) {
    return response // If no valid country code, proceed without redirecting
  }

  if (!urlHasCountryCode) {
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(redirectUrl, 307)
  }

  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

/**
 * Match all routes except for Next.js assets and API routes.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
