import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkflowSection() {
  const testimonials = [
    {
      quote: "Nova replaced three tools and a spreadsheet. My team ships greetings in minutes.",
      author: "Priya S. — Ops Lead"
    },
    {
      quote: "The AI studio is genuinely the best generation UX I've used this year.",
      author: "Marcus T. — Creative Director"
    },
    {
      quote: "The dashboard just feels premium. The animations are chef's kiss.",
      author: "Lena K. — Founder"
    }
  ];

  return (
    <section className="py-24 px-4 bg-slate-50/30 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800 relative overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-16"
        >
          Loved by operators and creatives
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg cursor-default"
            >
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, j) => (
                  <motion.div 
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + j * 0.1, duration: 0.3, type: "spring" }}
                  >
                    <Star size={16} fill="currentColor" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-6">"{t.quote}"</p>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
