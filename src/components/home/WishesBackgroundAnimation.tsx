import { motion } from "framer-motion";
import { Gift, Heart, Sparkles, Star, Mail } from "lucide-react";

export default function WishesBackgroundAnimation() {
  const particleColors = [
    "from-teal-500/20 to-cyan-500/30",
    "from-amber-500/20 to-yellow-500/30",
    "from-rose-500/20 to-pink-500/30",
    "from-purple-500/20 to-indigo-500/30",
    "from-sky-500/20 to-teal-500/30",
  ];

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * -25,
    color: particleColors[i % particleColors.length],
  }));

  const floaters = [
    { Icon: Gift, size: 48, x: "8%", y: "15%", delay: 0, color: "text-amber-500/40 dark:text-amber-400/50" },
    { Icon: Star, size: 40, x: "88%", y: "12%", delay: 2, color: "text-yellow-500/40 dark:text-yellow-400/50" },
    { Icon: Heart, size: 44, x: "82%", y: "60%", delay: 4, color: "text-rose-500/40 dark:text-rose-400/50" },
    { Icon: Mail, size: 46, x: "12%", y: "70%", delay: 1, color: "text-indigo-500/40 dark:text-indigo-400/50" },
    { Icon: Sparkles, size: 52, x: "42%", y: "82%", delay: 3, color: "text-teal-500/40 dark:text-teal-400/50" },
    { Icon: Heart, size: 36, x: "25%", y: "30%", delay: 1.5, color: "text-pink-500/40 dark:text-pink-400/50" },
    { Icon: Sparkles, size: 32, x: "70%", y: "25%", delay: 3.5, color: "text-cyan-500/40 dark:text-cyan-400/50" },
    { Icon: Gift, size: 42, x: "60%", y: "75%", delay: 0.5, color: "text-amber-500/40 dark:text-amber-400/50" },
    { Icon: Star, size: 38, x: "30%", y: "65%", delay: 2.5, color: "text-amber-400/40 dark:text-yellow-300/50" },
    { Icon: Mail, size: 34, x: "50%", y: "10%", delay: 4.5, color: "text-sky-500/40 dark:text-sky-400/50" },
    { Icon: Heart, size: 40, x: "90%", y: "85%", delay: 1.2, color: "text-rose-500/40 dark:text-rose-400/50" },
    { Icon: Sparkles, size: 48, x: "5%", y: "45%", delay: 2.8, color: "text-purple-500/40 dark:text-purple-400/50" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft pulsing radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] bg-teal-500/10 dark:bg-teal-400/15 blur-[130px] rounded-full animate-pulse duration-[8s]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] bg-teal-600/10 dark:bg-teal-500/15 blur-[150px] rounded-full animate-pulse duration-[12s]" />

      {/* Floating themed icons */}
      {floaters.map(({ Icon, x, y, delay, color }, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${color || "text-teal-600/30 dark:text-teal-400/40"}`}
          style={{ left: x, top: y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18 + idx * 4,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-4 h-4 md:w-8 md:h-8 lg:w-10 lg:h-10 opacity-70" strokeWidth={2} />
        </motion.div>
      ))}

      {/* Celebratory drifting particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full bg-gradient-to-tr ${p.color} blur-[0.5px]`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: [0, Math.sin(p.id) * 25, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
