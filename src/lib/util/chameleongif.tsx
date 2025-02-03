"use client"; 

import { Player } from "@lottiefiles/react-lottie-player";

const LottieAnimation = () => {
  return (
    <Player
      autoplay
      loop
      src="/assets/chameleon.json" 
      style={{ width: 50, height: 50 }}
    />
  );
};

export default LottieAnimation;
