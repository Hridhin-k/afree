"use client";
import { motion, useTransform, useScroll, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

const confettiPieceVariants = {
  initial: {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.5,
    rotate: 0,
  },
  animate: {
    y: ["-20vh", "120vh"],
    x: () => [
      `${Math.random() * 200 - 100}px`,
      `${Math.random() * 200 - 100}px`,
    ],
    opacity: [1, 0],
    scale: [0.7, 0.9],
    rotate: () => [Math.random() * 360 - 180, Math.random() * 720 - 360],
    transition: {
      duration: 2,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};

const floatingUpBalloonVariants = {
  initial: (i) => ({
    x: 0, // Default for server-side
    y: 20, // Placeholder
    scale: 0.6 + Math.random() * 0.4,
    opacity: 0,
    rotate: (Math.random() - 0.5) * 40,
  }),
  animate: {
    y: -200,
    opacity: 1,
    transition: {
      duration: 8 + Math.random() * 4,
      ease: "linear",
      delay: Math.random() * 2,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  exit: {
    y: -300,
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const flyingBalloonVariants = {
  initial: (i) => ({
    x: -100, // Placeholder
    y: 50, // Placeholder
    scale: 0.4 + Math.random() * 0.3,
    opacity: 0.8 + Math.random() * 0.2,
    rotate: (Math.random() - 0.5) * 60,
  }),
  animate: {
    x: "100vw", // Use viewport width for dynamic movement
    transition: {
      duration: 10 + Math.random() * 5,
      ease: "easeInOut",
      delay: Math.random() * 2,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const balloonColors = ["#ff69b4", "#add8e6", "#90ee90", "#ffff00", "#ffa07a"];
const confettiColors = ["#fce77d", "#aee1e1", "#f78ca0", "#99f2c8", "#f47fff"];

const generateConfetti = (container, count = 30) => {
  if (typeof window !== "undefined") {
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "absolute w-3 h-3 rounded-full";
      confetti.style.backgroundColor =
        confettiColors[i % confettiColors.length];
      container.appendChild(confetti);

      const startX = window.innerWidth / 2 + Math.random() * 100 - 50;
      const startY = window.innerHeight / 3;

      animate(confettiPieceVariants.animate, {
        from: {
          ...confettiPieceVariants.initial,
          x: startX,
          y: startY,
        },
        transition: {
          ...confettiPieceVariants.animate.transition,
          delay: Math.random() * 0.5,
        },
        onComplete: () => {
          if (container && confetti.parentNode === container) {
            container.removeChild(confetti);
          }
        },
        node: confetti,
      });
    }
  }
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

  const videoRef = useRef(null);
  const imageScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const floatingUpBalloons = useRef([]);
  const [floatingUpBalloonsState, setFloatingUpBalloonsState] = useState([]);
  const [showPartyPopper, setShowPartyPopper] = useState(false);
  const partyPopperRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const duration = 2;
      const interval = 0.1;
      let count = 0;

      const confettiInterval = setInterval(() => {
        const confettiContainer = document.getElementById("confetti-container");
        if (confettiContainer && count < 20) {
          // Reduced continuous confetti
          const confetti = document.createElement("div");
          confetti.className = "absolute w-2 h-2 rounded-full bg-white";
          confettiContainer.appendChild(confetti);

          const randomX = Math.random() * window.innerWidth;
          const randomDelay = Math.random() * 0.8;
          const randomScale = 0.4 + Math.random() * 0.6;
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
        } else if (count >= 20) {
          clearInterval(confettiInterval);
        }
      }, interval * 1000);

      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error("Autoplay prevented:", error);
        });
      }

      // Initialize floating up balloons
      floatingUpBalloons.current = [...Array(5)].map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth - window.innerWidth / 2,
        y: window.innerHeight + 50 + i * 50, // Initial Y for client-side
      }));
      setFloatingUpBalloonsState([...floatingUpBalloons.current]);

      return () => clearInterval(confettiInterval);
    }
  }, []);

  // Update initial balloon positions after client-side rendering
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFloatingUpBalloonsState((prev) =>
        prev.map((balloon, i) => ({
          ...balloon,
          y: window.innerHeight + 50 + i * 50,
        }))
      );
    }
  }, []);

  const triggerPartyPopper = () => {
    setShowPartyPopper(true);
    const popperContainer = partyPopperRef.current;
    if (popperContainer && typeof window !== "undefined") {
      generateConfetti(popperContainer);
    }
    setTimeout(() => setShowPartyPopper(false), 2000); // Hide popper after animation
  };

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 overflow-hidden relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div
        id="confetti-container"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      ></div>
      <div
        ref={partyPopperRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        {showPartyPopper && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center text-white text-xl"
          >
            🎉
          </motion.div>
        )}
      </div>

      {floatingUpBalloonsState.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute w-12 h-16 sm:w-16 sm:h-20 rounded-full pointer-events-none"
          style={{
            backgroundColor: balloonColors[balloon.id % balloonColors.length],
          }}
          variants={floatingUpBalloonVariants}
          initial={{
            x: balloon.x,
            y: 20, // Placeholder for server-side
            scale: 0.6 + Math.random() * 0.4,
            opacity: 0,
            rotate: (Math.random() - 0.5) * 40,
          }}
          animate={{
            ...floatingUpBalloonVariants.animate,
            y: -200,
          }}
          custom={balloon.id}
        />
      ))}

      {/* Flying Balloons with more randomness */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`flying-balloon-${i}`}
          className="absolute w-10 h-14 sm:w-12 sm:h-16 rounded-full pointer-events-none"
          style={{
            backgroundColor: balloonColors[(i * 2) % balloonColors.length],
          }}
          variants={flyingBalloonVariants}
          initial={{
            x: -150 - Math.random() * 100,
            y: 50, // Placeholder for server-side
            scale: 0.3 + Math.random() * 0.4,
            opacity: 0.7 + Math.random() * 0.3,
            rotate: (Math.random() - 0.5) * 90,
          }}
          animate={{
            x:
              typeof window !== "undefined"
                ? window.innerWidth + 150 + Math.random() * 100
                : 1000,
            transition: {
              duration: 12 + Math.random() * 7,
              ease: "easeInOut",
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
          custom={i}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-center mb-8 sm:mb-10 z-10 cursor-pointer"
        onClick={triggerPartyPopper}
      >
        <motion.h1
          className="text-3xl sm:text-7xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md animate-pulse" // Added pulse animation
          initial={{ y: -150, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          🎉 Birthday wishes Afree! 🎂
        </motion.h1>
        <motion.p
          className="text-lg sm:text-3xl text-white drop-shadow-md"
          initial={{ y: 150, opacity: 0, rotate: 10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          Have lots of fun! 🎈🎁🎊
        </motion.p>
      </motion.div>

      <motion.div
        className=" mb-[20px] relative w-64 h-64 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-xl cursor-pointer hover:scale-100 transition-transform duration-300 sm:mb-0 z-10"
        style={{ scale: imageScale, opacity: imageOpacity }}
        initial={{ rotate: 10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut", delay: 0.7 }}
      >
        <video
          ref={videoRef}
          src="/video/afree.mp4"
          autoPlay
          loop
          muted
          className="rounded-full object-contain w-full h-full mb-[20px]"
        />
      </motion.div>
      <motion.p
        className="text-base sm:text-2xl text-white  mt-[20px] drop-shadow-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Wishing you a very happy birthday! ✨
      </motion.p>

      <motion.div
        className="fixed bottom-4 sm:bottom-10 flex space-x-3 sm:space-x-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-xl sm:text-2xl cursor-pointer hover:scale-110 transition-transform"
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
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-xl sm:text-2xl cursor-pointer hover:scale-110 transition-transform"
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
          className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-sm:text-2xl cursor-pointer hover:scale-110 transition-transform"
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
