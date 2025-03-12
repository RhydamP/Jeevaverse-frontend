import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, frame, motion } from "framer-motion";
import ReviewRail from "./templateReview";

const reviewsData = [
  {
    id: 1,
    name: "Amit Sharma",
    joinDate: "February 2025",
    avatar: "/assets/gif/avatar.png",
    rating: 5,
    date: "February 25, 2024",
    title: "Amazing experience with my Macaw!",
    location: "Mumbai, India",
    content: "I got a beautiful blue and gold macaw from Jeevaverse, and I couldn't be happier! The bird is healthy, active, and well-socialized. The team guided me on diet and care, and their support was excellent. Highly recommend for exotic pet lovers!",
    helpfulCount: 22,
    verified: true
  },
  {
    id: 2,
    name: "Priya Verma",
    joinDate: "July 2024",
    avatar: "/assets/gif/avatar.png",
    rating: 4,
    date: "March 5, 2024",
    title: "Beautiful Iguana, but delivery took time",
    location: "Bangalore, India",
    content: "I purchased a green iguana, and it arrived in perfect health. The packaging was excellent, and the team provided all necessary care instructions. However, the delivery took a bit longer than expected. Overall, a great experience!",
    helpfulCount: 15,
    verified: true
  },
  {
    id: 3,
    name: "Rahul Mehta",
    joinDate: "October 2024",
    avatar: "/assets/gif/avatar.png",
    rating: 5,
    date: "March 8, 2024",
    title: "Best place for exotic pets in India!",
    location: "Delhi, India",
    content: "I recently got a Sulcata tortoise from Jeevaverse, and I must say, their service is top-notch. The tortoise was healthy, active, and exactly as described. I also appreciated their post-purchase support. Will definitely buy again!",
    helpfulCount: 18,
    verified: true
  },
  {
    id: 4,
    name: "Sneha Reddy",
    joinDate: "January 2025",
    avatar: "/assets/gif/avatar.png",
    rating: 5,
    date: "March 1, 2024",
    title: "My dream pet - Marmoset Monkey!",
    location: "Hyderabad, India",
    content: "Jeevaverse made my dream come true! I got a marmoset monkey from them, and he is just adorable. The pet arrived in perfect condition, and the team was very helpful in explaining how to take care of him. Totally recommend them!",
    helpfulCount: 25,
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