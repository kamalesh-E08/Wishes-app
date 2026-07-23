import React, { useEffect, useRef, useState } from "react";
import { Gift, Heart, Sparkles, Star, PartyPopper, Mail, Flower2, type LucideProps } from "lucide-react";

interface SeededItem {
  id: number;
  type: "icon" | "word";
  Icon?: React.ComponentType<LucideProps>;
  text?: string;
  left: string;
  dur: string;
  delay: string;
  rot: string;
  drift: string;
  driftX: string;
  size: number;
  colorClass: string;
}

const WISH_WORDS = [
  "Happy Birthday",
  "Congrats!",
  "Best Wishes",
  "Cheers! 🎉",
  "Warmest Wishes",
  "With Love ❤️",
  "Celebration",
  "Success!",
];

const ICON_CONFIGS = [
  { Icon: Gift, colorClass: "text-amber-500 dark:text-amber-400 opacity-80 dark:opacity-60" },
  { Icon: Heart, colorClass: "text-rose-500 dark:text-rose-400 opacity-80 dark:opacity-60" },
  { Icon: Sparkles, colorClass: "text-teal-500 dark:text-teal-300 opacity-80 dark:opacity-60" },
  { Icon: Star, colorClass: "text-yellow-500 dark:text-yellow-300 opacity-80 dark:opacity-60" },
  { Icon: PartyPopper, colorClass: "text-emerald-500 dark:text-emerald-400 opacity-80 dark:opacity-60" },
  { Icon: Mail, colorClass: "text-indigo-500 dark:text-indigo-400 opacity-80 dark:opacity-60" },
  { Icon: Flower2, colorClass: "text-purple-500 dark:text-purple-400 opacity-80 dark:opacity-60" },
];

const WORD_CONFIGS: Record<string, string> = {
  "Happy Birthday": "border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Congrats!": "border border-amber-400/40 text-amber-600 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Best Wishes": "border border-teal-400/40 text-teal-600 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Cheers! 🎉": "border border-rose-400/40 text-rose-600 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Warmest Wishes": "border border-cyan-400/40 text-cyan-600 dark:text-cyan-300 bg-cyan-50/70 dark:bg-cyan-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "With Love ❤️": "border border-pink-400/40 text-pink-600 dark:text-pink-300 bg-pink-50/70 dark:bg-pink-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Celebration": "border border-purple-400/40 text-purple-600 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/40 opacity-90 dark:opacity-75 shadow-sm",
  "Success!": "border border-indigo-400/40 text-indigo-600 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 opacity-90 dark:opacity-75 shadow-sm",
};

// Deterministic seed generator for stable SSR/hydration rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default function AuroraBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [lazyMounted, setLazyMounted] = useState(false);
  const [floaties, setFloaties] = useState<SeededItem[]>([]);

  // Performance Guardrail 1: IntersectionObserver & VisibilityChange
  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(rootEl);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Performance Guardrail 2: Seeded items + Lazy mounting via requestIdleCallback
  useEffect(() => {
    let seed = 42;
    const items: SeededItem[] = [];

    // Seeded floating icons (12 items)
    for (let i = 0; i < 12; i++) {
      const iconConfig = ICON_CONFIGS[Math.floor(seededRandom(seed++) * ICON_CONFIGS.length)];
      items.push({
        id: i,
        type: "icon",
        Icon: iconConfig.Icon,
        colorClass: iconConfig.colorClass,
        left: `${Math.floor(seededRandom(seed++) * 90 + 5)}%`,
        dur: `${(seededRandom(seed++) * 12 + 18).toFixed(1)}s`,
        delay: `-${(seededRandom(seed++) * 20).toFixed(1)}s`,
        rot: `${Math.floor(seededRandom(seed++) * 60 - 30)}deg`,
        drift: `${Math.floor(seededRandom(seed++) * 50 + 20)}deg`,
        driftX: `${Math.floor(seededRandom(seed++) * 60 - 30)}px`,
        size: Math.floor(seededRandom(seed++) * 16 + 22),
      });
    }

    // Seeded floating words (8 items)
    for (let i = 0; i < 8; i++) {
      const word = WISH_WORDS[Math.floor(seededRandom(seed++) * WISH_WORDS.length)];
      const colorClass = WORD_CONFIGS[word] || "border border-teal-400/40 text-teal-600 bg-teal-50/70";
      items.push({
        id: i + 100,
        type: "word",
        text: word,
        colorClass,
        left: `${Math.floor(seededRandom(seed++) * 85 + 5)}%`,
        dur: `${(seededRandom(seed++) * 14 + 22).toFixed(1)}s`,
        delay: `-${(seededRandom(seed++) * 25).toFixed(1)}s`,
        rot: `${Math.floor(seededRandom(seed++) * 30 - 15)}deg`,
        drift: `${Math.floor(seededRandom(seed++) * 40 + 10)}deg`,
        driftX: `${Math.floor(seededRandom(seed++) * 40 - 20)}px`,
        size: 13,
      });
    }

    setFloaties(items);

    if ("requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(() => setLazyMounted(true));
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setLazyMounted(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      data-active={isActive}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
      style={{
        contain: "strict",
        contentVisibility: "auto",
        animationPlayState: isActive ? "running" : "paused",
      }}
    >
      {/* Three Aurora Blobs */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 dark:opacity-30 dark:mix-blend-screen animate-drift-a transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle, var(--brand-cyan) 0%, var(--primary) 70%, transparent 100%)",
          willChange: "transform",
        }}
      />
      <div
        className="absolute top-[40%] -right-40 w-[550px] h-[550px] rounded-full blur-[160px] opacity-35 dark:opacity-25 dark:mix-blend-screen animate-drift-b transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle, var(--brand-blue) 0%, var(--accent) 70%, transparent 100%)",
          willChange: "transform",
        }}
      />
      <div
        className="absolute -bottom-32 left-[30%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-30 dark:opacity-20 dark:mix-blend-screen animate-drift-c transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle, var(--brand-violet) 0%, var(--primary) 70%, transparent 100%)",
          willChange: "transform",
        }}
      />

      {/* Radial Vignette */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--background) 100%)",
        }}
      />

      {/* Panning Grid */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      >
        <div className="w-full h-full animate-grid-pan" style={{ willChange: "transform" }} />
      </div>

      {/* Floating Wish Icons & Words */}
      {lazyMounted &&
        floaties.map((item) => {
          if (item.type === "icon" && item.Icon) {
            const IconComp = item.Icon;
            return (
              <div
                key={item.id}
                className={`absolute animate-rise ${item.colorClass || "text-[var(--wish-ink)] opacity-40"}`}
                style={{
                  left: item.left,
                  fontSize: item.size,
                  willChange: "transform",
                  // CSS variables for rise animation
                  ["--dur" as any]: item.dur,
                  ["--delay" as any]: item.delay,
                  ["--rot" as any]: item.rot,
                  ["--drift" as any]: item.drift,
                  ["--drift-x" as any]: item.driftX,
                }}
              >
                <IconComp style={{ width: item.size, height: item.size }} strokeWidth={1.75} />
              </div>
            );
          }

          if (item.type === "word") {
            return (
              <div
                key={item.id}
                className={`absolute animate-rise font-bold text-[11px] tracking-wide uppercase px-3 py-1 rounded-full ${item.colorClass || "glass-panel text-[var(--wish-ink)]"}`}
                style={{
                  left: item.left,
                  willChange: "transform",
                  ["--dur" as any]: item.dur,
                  ["--delay" as any]: item.delay,
                  ["--rot" as any]: item.rot,
                  ["--drift" as any]: item.drift,
                  ["--drift-x" as any]: item.driftX,
                }}
              >
                {item.text}
              </div>
            );
          }

          return null;
        })}

      {/* SVG Grain Noise */}
      <svg className="hidden">
        <filter id="nova-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ filter: "url(#nova-noise)" }}
      />
    </div>
  );
}
