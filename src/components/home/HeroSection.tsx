import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishStore } from "../../store/wishesStore";

export default function HeroSection() {
  const { resetWish } = useWishStore();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[calc(100vh-72px)] sm:min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-0">
      <div className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-[600px] md:h-[600px] bg-purple-600/20 blur-[160px] rounded-full" />
      <div className="absolute right-0 bottom-0 w-36 h-36 sm:w-56 sm:h-56 md:w-[500px] md:h-[500px] bg-cyan-500/20 blur-[160px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles size={18} />
            AI Powered Wishes Generator
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">
            Create
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Magical Wishes{" "}
            </span>
            In Seconds
          </h1>

          <p className="text-white/70 mt-8 text-xl max-w-3xl mx-auto">
            Upload a photo, select a theme, personalize the scene, and generate
            beautiful greeting cards, animations, and shareable wishes powered
            by AI.
          </p>

          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <button
              onClick={() => {
                resetWish();
                navigate("/create");
              }}
              className="
              px-8 py-4
              rounded-2xl
              bg-gradient-to-r
              from-purple-500
              to-cyan-500
              font-semibold
              flex
              items-center
              gap-2
              "
            >
              Start Creating
              <ArrowRight size={18} />
            </button>

            <button
              className="
              px-8 py-4
              rounded-2xl
              border
              border-white/20
              bg-white/5
              "
            >
              Explore Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
