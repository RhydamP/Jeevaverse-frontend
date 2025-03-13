"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import sanitizeHtml from "sanitize-html";

export default function BlogByIdTemplate({ data }: { data: any }) {
  const [index, setIndex] = useState(0);
  const images = [data.thumbnail_image1, data.thumbnail_image2, data.thumbnail_image3].filter(Boolean);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);


  let descriptionText = "";
  try {
    const parsedDescription = JSON.parse(data.description);
    descriptionText = parsedDescription.content || "";
  } catch (error) {
    descriptionText = data.description || "";
  }

  const cleanedDescription = sanitizeHtml(descriptionText, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      a: ["href", "title", "target"]
    },
    disallowedTagsMode: "discard"
  })

  return (
    <>
      <Head>
        <title>{data.seo_title}</title>
        <meta name="description" content={data.seo_description} />
        <meta name="keywords" content={data.seo_keywords} />
      </Head>

      <header className="text-center">
        <h1 className="featured-pets text-4xl font-bold text-center uppercase tracking-widest relative ">
          <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-lime-400 bg-clip-text text-transparent">
            {data.title}
          </span>
          <span className="absolute -bottom-2 left-1/2 w-16 h-1 bg-gradient-to-r from-gray-900 to-lime-400 transform -translate-x-1/2"></span>
        </h1>
      </header>

      <div className="container mx-auto flex flex-wrap py-6">
        <div className="w-full md:w-2/3 px-3">
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-20"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <Image
                    src={image}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    alt={`Article Image ${idx + 1}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar with author info */}
        <aside className="w-full md:w-1/3 px-3">
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold">Author: {data.author}</h3>
            <h2 className="text-md italic text-gray-700">{data.subtitle}</h2>
            <p className="text-sm pb-3">Published on {new Date(data.published_date).toDateString()}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            <h3 className="text-xl mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  #{tag.replace(/\[|\]|\"/g, '')}
                </span>
              ))}
            </div>

            <div className="text-md mt-6 flex items-center">
              <p className="mr-5">Share on: </p>
              <span className="flex space-x-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.canonical_url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
                    <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                  </svg>
                </a>
                <a
                  href={`https://www.instagram.com/?url=${encodeURIComponent(data.canonical_url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#304ffe" d="M41.67,13.48c-0.4,0.26-0.97,0.5-1.21,0.77c-0.09,0.09-0.14,0.19-0.12,0.29v1.03l-0.3,1.01l-0.3,1l-0.33,1.1 l-0.68,2.25l-0.66,2.22l-0.5,1.67c0,0.26-0.01,0.52-0.03,0.77c-0.07,0.96-0.27,1.88-0.59,2.74c-0.19,0.53-0.42,1.04-0.7,1.52 c-0.1,0.19-0.22,0.38-0.34,0.56c-0.4,0.63-0.88,1.21-1.41,1.72c-0.41,0.41-0.86,0.79-1.35,1.11c0,0,0,0-0.01,0 c-0.08,0.07-0.17,0.13-0.27,0.18c-0.31,0.21-0.64,0.39-0.98,0.55c-0.23,0.12-0.46,0.22-0.7,0.31c-0.05,0.03-0.11,0.05-0.16,0.07 c-0.57,0.27-1.23,0.45-1.89,0.54c-0.04,0.01-0.07,0.01-0.11,0.02c-0.4,0.07-0.79,0.13-1.19,0.16c-0.18,0.02-0.37,0.03-0.55,0.03 l-0.71-0.04l-3.42-0.18c0-0.01-0.01,0-0.01,0l-1.72-0.09c-0.13,0-0.27,0-0.4-0.01c-0.54-0.02-1.06-0.08-1.58-0.19 c-0.01,0-0.01,0-0.01,0c-0.95-0.18-1.86-0.5-2.71-0.93c-0.47-0.24-0.93-0.51-1.36-0.82c-0.18-0.13-0.35-0.27-0.52-0.42 c-0.48-0.4-0.91-0.83-1.31-1.27c-0.06-0.06-0.11-0.12-0.16-0.18c-0.06-0.06-0.12-0.13-0.17-0.19c-0.38-0.48-0.7-0.97-0.96-1.49 c-0.24-0.46-0.43-0.95-0.58-1.49c-0.06-0.19-0.11-0.37-0.15-0.57c-0.01-0.01-0.02-0.03-0.02-0.05c-0.1-0.41-0.19-0.84-0.24-1.27 c-0.06-0.33-0.09-0.66-0.09-1c-0.02-0.13-0.02-0.27-0.02-0.4l1.91-2.95l1.87-2.88l0.85-1.31l0.77-1.18l0.26-0.41v-1.03 c0.02-0.23,0.03-0.47,0.02-0.69c-0.01-0.7-0.15-1.38-0.38-2.03c-0.22-0.69-0.53-1.34-0.85-1.94c-0.38-0.69-0.78-1.31-1.11-1.87 C14,7.4,13.66,6.73,13.75,6.26C14.47,6.09,15.23,6,16,6h16c4.18,0,7.78,2.6,9.27,6.26C41.43,12.65,41.57,13.06,41.67,13.48z"></path>
                    <g>
                      <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M30,11H18c-3.9,0-7,3.1-7,7v12c0,3.9,3.1,7,7,7h12c3.9,0,7-3.1,7-7V18C37,14.1,33.9,11,30,11z"></path>
                      <circle cx="31" cy="16" r="1" fill="#fff"></circle>
                    </g>
                    <g>
                      <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></circle>
                    </g>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(data.canonical_url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </aside>
      </div>
      <div className="w-full max-w-3xl text-gray-700 pb-6 m-2 p-5">
        <article className="prose prose-lg prose-gray max-w-none">
          <div  className="flex flex-col text-gray-700 pb-6 prose prose-lg prose-headings:text-black prose-headings:font-bold prose-headings:text-2xl sm:prose-headings:text-3xl" dangerouslySetInnerHTML={{ __html: cleanedDescription }} />
        </article>
      </div>

    </>
  );
}
