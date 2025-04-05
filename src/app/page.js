"use client";
import { motion, useTransform, useScroll, animate } from "framer-motion";
import Image from "next/image"; // Removed Image import
import { useEffect, useRef } from "react";

const balloonVariants = {
  initial: { y: 20, opacity: 0, scale: 0.5 },
  animate: { y: -100, opacity: 1, scale: 1 },
  exit: { y: -200, opacity: 0, scale: 0.8 },
};

const giftVariants = {
  initial: { rotateZ: -20, y: 50, opacity: 0, scale: 0.7 },
  animate: { rotateZ: 0, y: 0, opacity: 1, scale: 1 },
  exit: { y: -100, opacity: 0, scale: 0.9 },
};

const cakeVariants = {
  initial: { y: 30, opacity: 0, scale: 0.6 },
  animate: { y: 0, opacity: 1, scale: 1, rotate: 360 },
  exit: { y: -150, opacity: 0, scale: 0.7 },
};

const confettiVariants = {
  initial: (i) => ({
    x: `calc(${i * 10}px - 50px)`,
    y: -20,
    opacity: 0,
    scale: 0.3,
    rotate: Math.random() * 360,
  }),
  animate: {
    y: "120vh",
    opacity: [0, 1, 0],
    scale: [0.3, 1, 0.5],
    rotate: [0, 720],
    transition: {
      duration: 2,
      delay: Math.random() * 0.5,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    y: "150vh",
    opacity: 0,
    scale: 0.2,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundHue = useTransform(
    scrollYProgress,
    [0, 1],
    [300, 390] // Pinkish to Yellowish in HSL
  );
  const backgroundSaturation = useTransform(scrollYProgress, [0, 1], [80, 90]);
  const backgroundLightness = useTransform(scrollYProgress, [0, 1], [70, 80]);

  const videoRef = useRef(null); // Ref for the video element
  const imageScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    const duration = 2; // seconds
    const interval = 0.1; // seconds
    let count = 0;

    const confettiInterval = setInterval(() => {
      const confettiContainer = document.getElementById("confetti-container");
      if (confettiContainer && count < 50) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-3 h-3 rounded-full bg-white";
        confettiContainer.appendChild(confetti);

        const randomX = Math.random() * window.innerWidth;
        const randomDelay = Math.random() * 0.8;
        const randomScale = 0.5 + Math.random() * 0.8;
        const randomRotate = Math.random() * 360;

        animate(
          {
            y: window.innerHeight + 50,
            x: randomX,
            opacity: [1, 0],
            scale: randomScale,
            rotate: randomRotate,
            transition: {
              duration: 2 + Math.random() * 1,
              delay: randomDelay,
              ease: "easeIn",
            },
          },
          { node: confetti }
        );
        count++;
      } else if (count >= 50) {
        clearInterval(confettiInterval);
      }
    }, interval * 1000);

    // Autoplay the video when the component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Handle the autoplay being prevented (e.g., due to browser policies)
        console.error("Autoplay prevented:", error);
      });
    }

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 overflow-hidden relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div
        id="confetti-container"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-center mb-8 sm:mb-10" // Reduced mobile margin
      >
        <motion.h1
          className="text-3xl sm:text-7xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md" // Reduced mobile margin and font size
          initial={{ y: -150, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          🎉 Its Birthday Time! 🎂
        </motion.h1>
        <motion.p
          className="text-lg sm:text-3xl text-white drop-shadow-md" // Adjusted mobile font size
          initial={{ y: 150, opacity: 0, rotate: 10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          Get ready for some fun! 🎈🎁🎊
        </motion.p>
      </motion.div>

      <motion.div
        className=" mb-[20px] relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-xl cursor-pointer hover:scale-100 transition-transform duration-300 mb-6 sm:mb-0" // Added mobile margin
        style={{ scale: imageScale, opacity: imageOpacity }}
        initial={{ rotate: 10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut", delay: 0.7 }}
      >
        <video
          ref={videoRef}
          src="/video/afree.mp4" // Replace with the actual path to your video
          autoPlay
          loop
          muted // Important for autoplay in many browsers
          className="rounded-full object-contain w-full h-full"
        />
      </motion.div>
      <motion.p
        className="text-base sm:text-2xl text-white  mt-[20px] drop-shadow-md" // Adjusted mobile font size and margin
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Celebrating someone special! ✨
      </motion.p>

      <motion.div
        className="fixed bottom-4 sm:bottom-10 flex space-x-3 sm:space-x-4" // Reduced mobile bottom and spacing
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-xl sm:text-2xl cursor-pointer" // Reduced mobile size
          variants={balloonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.5,
          }}
        >
          🎈
        </motion.div>
        <motion.div
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-xl sm:text-2xl cursor-pointer" // Reduced mobile size
          variants={giftVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.7,
          }}
        >
          🎁
        </motion.div>
        <motion.div
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-xl sm:text-2xl cursor-pointer" // Reduced mobile size
          variants={cakeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.9,
          }}
        >
          🎂
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
