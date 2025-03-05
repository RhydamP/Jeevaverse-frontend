import { notFound } from "next/navigation";
import BlogTemplate from "@modules/common/components/blog-component";
import { fetchBlogById } from "api/blog";
import Blogs from "@modules/common/components/blog-component/all-blogs";

type Blog = {
  id: string;
  author: string;
  tags: string[];
  seo_title: string;
  seo_keywords: string;
  seo_description: string;
  url_slug: string;
  title: string;
  subtitle: string;
  description: string;
  draft: boolean;
  thumbnail_image1: string;
  thumbnail_image2: string;
  thumbnail_image3: string;
  published_date: string;
  updated_date: string;
  social_media_meta: string;
  canonical_url: string;
  alt_tags: string;
  internal_links: string;
  external_links: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type ApiResponse = {
  blog: Blog;
};

type Props = {
  params: { id: string };
};

export default async function BlogPage() {
  
    return <Blogs/>;
}
