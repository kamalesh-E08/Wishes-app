import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Reveal the logo after the corner blocks meet in the center
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const blockVariants: Variants = {
    initial: (custom: number) => ({
      x: custom % 2 === 0 ? "-100vw" : "100vw",
      y: custom < 2 ? "-100vh" : "100vh",
      scale: 1,
      opacity: 1,
    }),
    animate: {
      x: 0,
      y: 0,
      scale: [1, 0.5, 0],
      opacity: [1, 1, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.6, 1],
      },
    },
  };

  const containerVariants: Variants = {
    initial: { backgroundColor: "rgba(250, 250, 250, 1)", zIndex: 100 },
    animate: {
      backgroundColor: "rgba(250, 250, 250, 0)",
      zIndex: -1,
      transition: {
        delay: 1.8,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => {
        setTimeout(onComplete, 500); // slight delay to let background fade
      }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* 4 Corner Blocks moving to center */}
      <motion.div
        custom={0}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        className="absolute w-1/2 h-1/2 bg-teal-500 origin-bottom-right"
      />
      <motion.div
        custom={1}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        className="absolute w-1/2 h-1/2 bg-slate-900 origin-bottom-left"
      />
      <motion.div
        custom={2}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        className="absolute w-1/2 h-1/2 bg-slate-900 origin-top-right"
      />
      <motion.div
        custom={3}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        className="absolute w-1/2 h-1/2 bg-teal-500 origin-top-left"
      />

      {/* Center Logo Reveal */}
      {showLogo && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: [0, 1.2, 5], opacity: [0, 1, 0], rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute z-10 w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Sparkle size={48} fill="white" className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
