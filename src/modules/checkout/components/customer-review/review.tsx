import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, frame, motion } from "framer-motion";
import ReviewRail from "./templateReview";

const reviewsData = [
  {
    id: 1,
    name: "Jese Leos",
    joinDate: "August 2014",
    avatar: "/assets/gif/avatar.png",
    rating: 5,
    date: "March 3, 2017",
    title: "Exceptional quality and value!",
    location: "United Kingdom",
    content: "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.",
    additionalContent: "It is obviously not the same build quality as those very expensive watches. But that is like comparing a Citroën to a Ferrari. This watch was well under £100! An absolute bargain.",
    helpfulCount: 19,
    verified: true
  },
  {
    id: 2,
    name: "Sarah Johnson",
    joinDate: "May 2015",
    avatar: "/assets/gif/avatar.png",
    rating: 4,
    date: "January 15, 2024",
    title: "Great product with minor issues",
    location: "United States",
    content: "The quality is excellent for the price point. The only reason I'm giving it 4 stars instead of 5 is because the delivery took longer than expected. Otherwise, the product itself exceeds expectations.",
    helpfulCount: 8,
    verified: true
  },
  {
    id: 3,
    name: "Michael Chen",
    joinDate: "December 2023",
    avatar: "/assets/gif/avatar.png",
    rating: 5,
    date: "February 1, 2024",
    title: "Absolutely worth every penny!",
    location: "Canada",
    content: "I was skeptical at first, but this product has completely won me over. The attention to detail is impressive, and the customer service was outstanding when I had questions.",
    helpfulCount: 12,
    verified: true
  }
];

export default function CustomerReview() {
  const [reviews, setReviews] = useState(reviewsData);
  const [sortBy, setSortBy] = useState('highest');
  const [index, setIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sortedReviews = [...reviewsData].sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });
    setReviews(sortedReviews);
  }, [sortBy]);


  const reviewThumnail = "/assets/gif/review-thumnail.jpg";

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length)
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * ((index + 1) % reviews.length), behavior: "smooth" })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [reviews.length, index])



  return (
    <div className="container px-4 sm:px-1 w-full mx-auto">
      <h1 className="featured-pets text-4xl mt-5 text-center uppercase tracking-widest relative mb-2">
        <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent">
          Our Happy Customers
        </span>
        <span className="absolute -bottom-2 left-1/2 w-16 h-1 bg-gradient-to-r from-green-500 to-green-800 transform -translate-x-1/2"></span>
      </h1>
      <div className="flex article-review">
        <div className="relative flex items-center justify-center w-[50%] h-[80vh]  article-card">
          <button
            onClick={() => {
              setIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: sliderRef.current.clientWidth * ((index - 1 + reviews.length) % reviews
                    .length),
                  behavior: "smooth",
                });
              }
            }}
            className="absolute left-4 sm:left-1 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10 scroll-left-button"
          >
            ◀
          </button>

          <div className=" article-card p-6 sm:p-1 w-full h-full"
            ref={sliderRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${reviews[index].id}-${index}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex-shrink-0 w-full "
              >
                <ReviewRail review={reviews[index]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={() => {
              setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: sliderRef.current.clientWidth * ((index + 1) % reviews.length),
                  behavior: "smooth",
                });
              }
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-12 h-12 text-white p-3 rounded-full hover:bg-black/70 z-10 scroll-right-button"
          >
            ▶
          </button>
        </div>
        <div  className="bg-white dark:bg-gray-800 p-3 mt-14 rounded-lg shadow-lg w-[50%] h-[68vh] review-image">
          <div className="relative w-full h-full p-12">
            <Image
              src={reviewThumnail}
              alt="review-thumbnail"
              loading="lazy"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}