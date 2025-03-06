import { NextResponse } from "next/server";
import { SitemapStream, streamToPromise } from "sitemap";
import { listProducts } from "@lib/data/products";
import { listCollections } from "@lib/data/collections";
import { HttpTypes } from "@medusajs/types";
import { fetchBlogs , fetchBlogById } from "api/blog";
import { listCategories } from "@lib/data/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const smStream = new SitemapStream({ hostname: process.env.SITE_URL || "https://jeevaverse.in" });


    const staticRoutes = ["/",  "/contact"];
    staticRoutes.forEach((route) => smStream.write({ url: route, changefreq: "monthly", priority: 0.8 }));

    
    const [{ response }, { collections } ,  categories ] = await Promise.all([
      listProducts({ pageParam: 1, countryCode: "in", queryParams: { limit: 100 } }),
      listCollections(),
      listCategories()
    ]);

    const blogs: any = await fetchBlogs(100, 0);

    response.products.forEach((product: HttpTypes.StoreProduct) => {
      smStream.write({ url: `/products/${product.handle}`, changefreq: "weekly", priority: 0.9 });
    });

    categories.forEach((category: HttpTypes.StoreProductCategory) => {
      smStream.write({ url: `/categories/${category.handle}`, changefreq: "weekly", priority: 0.9 });
    });

    
    collections.forEach((collection: HttpTypes.StoreCollection) => {
      smStream.write({ url: `/collections/${collection.handle}`, changefreq: "weekly", priority: 0.9 });
    });

    blogs.blogs.forEach((blog: { id: string }) => {
      smStream.write({ url: `/blog/${blog.id}`, changefreq: "daily", priority: 0.8 });
    });
    smStream.end();

    const sitemap = await streamToPromise(smStream);

    return new NextResponse(sitemap.toString(), {
      headers: { "Content-Type": "application/xml" },
    });

  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Failed to generate sitemap", { status: 500 });
  }
}
