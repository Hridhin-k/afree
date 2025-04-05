"use client";
import { motion, useTransform, useScroll, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const balloonVariants = {
  initial: { y: 10, opacity: 0, scale: 0.3 },
  animate: { y: -80, opacity: 1, scale: 0.8 },
  exit: { y: -150, opacity: 0, scale: 0.6 },
};

const giftVariants = {
  initial: { rotateZ: -15, y: 30, opacity: 0, scale: 0.5 },
  animate: { rotateZ: 0, y: 0, opacity: 1, scale: 0.8 },
  exit: { y: -80, opacity: 0, scale: 0.7 },
};

const cakeVariants = {
  initial: { y: 20, opacity: 0, scale: 0.4 },
  animate: { y: 0, opacity: 1, scale: 0.8, rotate: 360 },
  exit: { y: -100, opacity: 0, scale: 0.5 },
};

const confettiVariants = {
  initial: (i) => ({
    x: `calc(${i * 5}px - 25px)`,
    y: -10,
    opacity: 0,
    scale: 0.2,
    rotate: Math.random() * 360,
  }),
  animate: {
    y: "100vh",
    opacity: [0, 1, 0],
    scale: [0.2, 0.8, 0.4],
    rotate: [0, 720],
    transition: {
      duration: 1.5,
      delay: Math.random() * 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    y: "120vh",
    opacity: 0,
    scale: 0.1,
    transition: { duration: 0.3 },
  },
};

const floatingBalloonVariants = {
  initial: (i) => ({
    x: 0, // Default value for server-side
    y: 10,
    scale: 0.4 + Math.random() * 0.3,
    opacity: 0,
    rotate: (Math.random() - 0.5) * 30,
  }),
  animate: {
    y: -150,
    opacity: 1,
    transition: {
      duration: 6 + Math.random() * 3,
      ease: "linear",
      delay: Math.random() * 1.5,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  exit: {
    y: -200,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const fireworkColors = ["#f44336", "#3f51b5", "#4caf50", "#ff9800", "#9c27b0"];

const balloonColors = ["#ff69b4", "#add8e6", "#90ee90", "#ffff00", "#ffa07a"];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showFireworks, setShowFireworks] = useState(true);
  const backgroundHueLight = useTransform(
    scrollYProgress,
    [0, 1],
    [300, 390] // Pinkish to Yellowish in HSL
  );
  const backgroundSaturationLight = useTransform(
    scrollYProgress,
    [0, 1],
    [80, 90]
  );
  const backgroundLightnessLight = useTransform(
    scrollYProgress,
    [0, 1],
    [70, 80]
  );

  const backgroundHueDark = useTransform(
    scrollYProgress,
    [0, 1],
    [220, 270] // Bluish to Purplish in HSL for dark mode
  );
  const backgroundSaturationDark = useTransform(
    scrollYProgress,
    [0, 1],
    [60, 70]
  );
  const backgroundLightnessDark = useTransform(
    scrollYProgress,
    [0, 1],
    [15, 20]
  );

  const backgroundColor = isDarkMode
    ? `hsl(${backgroundHueDark}, ${backgroundSaturationDark}%, ${backgroundLightnessDark}%)`
    : `hsl(${backgroundHueLight}, ${backgroundSaturationLight}%, ${backgroundLightnessLight}%)`;

  const textColor = isDarkMode ? "white" : "black";
  const shadowColor = isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)";
  const buttonBgColor = isDarkMode ? "#333" : "white";
  const buttonTextColor = isDarkMode ? "white" : "black";

  const videoRef = useRef(null);
  const imageScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  const floatingBalloons = useRef([]); // Ref to store balloon elements
  const [floatingBalloonsState, setFloatingBalloonsState] = useState([]);

  useEffect(() => {
    const duration = 2;
    const interval = 0.1;
    let count = 0;

    const confettiInterval = setInterval(() => {
      const confettiContainer = document.getElementById("confetti-container");
      if (confettiContainer && count < 30) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-2 h-2 rounded-full";
        confetti.style.backgroundColor = isDarkMode
          ? fireworkColors[Math.floor(Math.random() * fireworkColors.length)]
          : "white";
        confettiContainer.appendChild(confetti);

        const randomX = Math.random() * window.innerWidth;
        const randomDelay = Math.random() * 0.6;
        const randomScale = 0.4 + Math.random() * 0.6;
        const randomRotate = Math.random() * 360;

        animate(
          {
            y: window.innerHeight + 30,
            x: randomX,
            opacity: [1, 0],
            scale: randomScale,
            rotate: randomRotate,
            transition: {
              duration: 1.5 + Math.random() * 0.8,
              delay: randomDelay,
              ease: "easeIn",
            },
          },
          { node: confetti }
        );
        count++;
      } else if (count >= 30) {
        clearInterval(confettiInterval);
      }
    }, interval * 1000);

    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }

    // Initialize floating balloons with window dimensions on the client-side
    floatingBalloons.current = [...Array(3)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth - window.innerWidth / 2,
    }));
    // Force a re-render to apply the initial client-side positions
    setFloatingBalloonsState([...floatingBalloons.current]);

    if (showFireworks) {
      const fireworkInterval = setInterval(() => {
        triggerFirework();
      }, 1500); // Trigger a firework every 1.5 seconds
      return () => {
        clearInterval(confettiInterval);
        clearInterval(fireworkInterval);
      };
    } else {
      return () => clearInterval(confettiInterval);
    }
  }, [isDarkMode, showFireworks]);

  const triggerFirework = () => {
    const fireworksContainer = document.getElementById("fireworks-container");
    if (fireworksContainer) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6); // Start in the top 60% of the screen
      const color =
        fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      const particleCount = 50 + Math.random() * 50;
      const velocity = 5 + Math.random() * 5;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute w-2 h-2 rounded-full";
        particle.style.backgroundColor = color;
        fireworksContainer.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        const gravity = 0.1;
        const fadeOutTime = 1 + Math.random() * 1;

        animate(
          {
            x: x + vx * fadeOutTime * 10,
            y:
              y +
              vy * fadeOutTime * 10 +
              0.5 * gravity * Math.pow(fadeOutTime * 10, 2),
            opacity: [1, 0],
            scale: [1, 0.1],
          },
          {
            node: particle,
            duration: fadeOutTime,
            ease: "easeOut",
            onComplete: () => {
              if (fireworksContainer && fireworksContainer.contains(particle)) {
                fireworksContainer.removeChild(particle);
              }
            },
          }
        );
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden relative transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
      }`}
      style={{ backgroundColor }}
    >
      <div
        id="confetti-container"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      ></div>
      <div
        id="fireworks-container"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      ></div>

      {floatingBalloonsState.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute w-8 h-12 sm:w-12 sm:h-16 rounded-full pointer-events-none"
          style={{
            backgroundColor: balloonColors[balloon.id % balloonColors.length],
          }}
          variants={floatingBalloonVariants}
          initial={{
            x: balloon.x,
            y: window?.innerHeight + 30 + balloon.id * 30 || 10,
            scale: 0.4 + Math.random() * 0.3,
            opacity: 0,
            rotate: (Math.random() - 0.5) * 30,
          }}
          animate="animate"
          custom={balloon.id}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="text-center mb-6 sm:mb-8 z-10"
      >
        <motion.h1
          className={`text-2xl sm:text-5xl font-bold transition-colors duration-300 mb-1 sm:mb-2 drop-shadow-md ${
            isDarkMode ? "text-white" : "text-white"
          }`}
          style={{ color: textColor, textShadow: `2px 2px 4px ${shadowColor}` }}
          initial={{ y: -100, opacity: 0, rotate: -5 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          🎉 Birthday wishes Afree! 🎂
        </motion.h1>
        <motion.p
          className={`text-base sm:text-2xl transition-colors duration-300 drop-shadow-md ${
            isDarkMode ? "text-white" : "text-white"
          }`}
          style={{ color: textColor, textShadow: `2px 2px 4px ${shadowColor}` }}
          initial={{ y: 100, opacity: 0, rotate: 5 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          Have a great day! 🎈🎁🎊
        </motion.p>
      </motion.div>

      <motion.div
        className="mb-4 sm:mb-8 relative w-64 h-64 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 z-10"
        style={{ scale: imageScale, opacity: imageOpacity }}
        initial={{ rotate: 5, scale: 0.7 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut", delay: 0.5 }}
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
        className={`text-sm sm:text-xl transition-colors duration-300 mt-3 sm:mt-5 drop-shadow-md z-10 ${
          isDarkMode ? "text-white" : "text-white"
        }`}
        style={{ color: textColor, textShadow: `2px 2px 4px ${shadowColor}` }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Wishing you a very happy birthday! ✨
      </motion.p>

      {/* <div className="fixed top-4 right-4 z-20">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-md shadow-md transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => setShowFireworks(!showFireworks)}
          className={`mt-2 p-2 rounded-md shadow-md transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {showFireworks ? "Stop Fireworks" : "Show Fireworks"}
        </button>
      </div> */}

      <motion.div
        className="fixed bottom-2 sm:bottom-5 flex space-x-2 sm:space-x-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <motion.div
          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl cursor-pointer transition-colors duration-300 ${buttonBgColor}`}
          style={{ color: buttonTextColor }}
          variants={balloonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.1,
          }}
        >
          🎈
        </motion.div>
        <motion.div
          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex itemsjustify-center shadow-lg text-lg sm:text-xl cursor-pointer transition-colors duration-300 ${buttonBgColor}`}
          style={{ color: buttonTextColor }}
          variants={giftVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.3,
          }}
        >
          🎁
        </motion.div>
        <motion.div
          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl cursor-pointer transition-colors duration-300 ${buttonBgColor}`}
          style={{ color: buttonTextColor }}
          variants={cakeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.5,
          }}
        >
          🎂
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
