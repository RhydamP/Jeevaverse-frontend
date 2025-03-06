"use client";
import React, { useState, useEffect } from "react";
import { fetchBlogs } from "../../../../api/blog";
import LocalizedClientLink from "../localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";

interface Blog {
  id: string;
  thumbnail_image1: any;
  author: string;
  title: string;
  description: string | { content: string };
}

interface FetchBlogsResponse {
  blogs: Blog[];
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const limit = 6;
  const offset = 0;

  useEffect(() => {
    fetchBlogs(limit, offset)
      .then((response) => {
        const data = response as FetchBlogsResponse;
        setBlogs(data.blogs);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [limit, offset]);

  return (
    <>
      <h1 className="featured-pets text-4xl font-bold mt-7 text-center uppercase tracking-widest relative mb-5">
        <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-lime-400 bg-clip-text text-transparent">
          Popular Blogs
        </span>
        <span className="absolute -bottom-2 left-1/2 w-16 h-1 bg-gradient-to-r from-gray-900 to-lime-400 transform -translate-x-1/2"></span>
      </h1>
      <div className="flex items-center justify-center">
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 max-w-7xl">
          {blogs && blogs.map((blog) => {
            // Extract the text from blog.description if it's an object
            const descriptionText =
              typeof blog.description === "object" && blog.description !== null
                ? blog.description.content
                : blog.description;

            return (
              <div key={blog.id} className="pet-thumbnail relative w-90 h-full rounded-xl border-gray-900 overflow-hidden shadow-lg">
                <LocalizedClientLink href={`/blogs/${blog.id}`} className="group">
                  <Thumbnail
                    thumbnail={blog.thumbnail_image1}
                    images={blog?.thumbnail_image1}
                    isFeatured
                    size="fit"
                    className="w-[90vw] h-[50vh]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                  <div className="absolute top-4 left-4 text-white font-semibold">{blog.title}</div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold text-white mb-2 underline">{blog.author}</h3>
                    <div className="text-sm text-white font-semibold">
                      {descriptionText.slice(0, 200)}
                    </div>
                  </div>
                </LocalizedClientLink>
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
};

export default Blogs;
