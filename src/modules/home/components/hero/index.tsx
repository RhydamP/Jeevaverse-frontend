"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/assets/gif/Image.jpg",
  "/assets/gif/parrot.jpg",
  "/assets/gif/iguana.jpg",
]; 

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[120vh] w-full border-b border-ui-border-base bg-ui-bg-subtle relative overflow-hidden hero-home">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 w-12 h-12 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
      >
        ◀
      </button>
      <button
        onClick={() => setIndex((prevIndex) => (prevIndex + 1) % images.length)}
        className="absolute right-4 top-1/2 w-12 h-12transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
      >
        ▶
      </button>
    </div>
  );
};

export default Hero;
