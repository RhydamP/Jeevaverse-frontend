"use client"

import { lazy, useEffect, useState } from "react"
import Image from "next/image"

export default function ReviewRail({
  review
}: {
  review: any
}) {

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${index < rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
    );
  };


  return (
    <div className="content-container flex w-full h-full py-3 small:py-14">
      <article
        key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-[68vh] w-full overflow-y-scroll article-template">
        <div className="flex items-center mb-4">
          <Image
            src={review.avatar}
            alt={`${review.name} avatar`}
            width={40}
            height={40}
            className="w-10 h-10 me-4 rounded-full"
            priority
          />
          <div className="font-medium dark:text-white">
            <p className="text-xs sm:text-xs">
              {review.name}
              {review.verified && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">
                  Verified
                </span>
              )}
              <span className="block text-sm text-gray-500 dark:text-gray-400 article-text-view">
                Joined on {review.joinDate}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center mb-2 review-star">
          <RatingStars rating={review.rating} />
          <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white review-star-comment">
            {review.title}
          </h3>
        </div>

        <footer className="mb-5 text-sm sm:text-xs text-gray-500 dark:text-gray-400 article-text-view">
          <span>
            Reviewed in {review.location} on <p>{review.date}</p>
          </span>
        </footer>

        <p className="mb-2 text-gray-500 dark:text-gray-400">{review.content}</p>
        {review.additionalContent && (
          <p className="mb-3 text-gray-500 dark:text-gray-400">{review.additionalContent}</p>
        )}

        <aside>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {review.helpfulCount} people found this helpful
          </p>
          <div className="flex items-center mt-3">
            <button className="px-2 py-1.5 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Helpful
            </button>
            <button className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600">
              Report abuse
            </button>
          </div>
        </aside>
      </article>
      
    </div>
  )
}
