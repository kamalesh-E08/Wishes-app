import { Sparkles, Cloud, Zap, CheckCircle2, LayoutGrid, Command } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles size={24} className="text-white" />,
      title: "Generative AI Studio",
      desc: "Multi-provider generation with Gemini and FLUX. Prompt preview, live progress, and instant approval.",
      color: "bg-teal-500",
      shadow: "shadow-teal-500/30"
    },
    {
      icon: <Cloud size={24} className="text-white" />,
      title: "Cloud Sync",
      desc: "Bind OneDrive and Cloudinary to auto-import assets and sync your rendered outputs.",
      color: "bg-sky-500",
      shadow: "shadow-sky-500/30"
    },
    {
      icon: <Zap size={24} className="text-white" />,
      title: "Wishes Automation",
      desc: "Detect upcoming events, schedule wishes, and send with pixel-perfect templates.",
      color: "bg-amber-500",
      shadow: "shadow-amber-500/30"
    },
    {
      icon: <CheckCircle2 size={24} className="text-white" />,
      title: "Approval Workflow",
      desc: "Human-in-the-loop review with regenerate, edit, and one-click approve.",
      color: "bg-emerald-500",
      shadow: "shadow-emerald-500/30"
    },
    {
      icon: <LayoutGrid size={24} className="text-white" />,
      title: "History",
      desc: "A gorgeous masonry archive of every generation with lazy loading and infinite scroll.",
      color: "bg-indigo-500",
      shadow: "shadow-indigo-500/30"
    },
    {
      icon: <Command size={24} className="text-white" />,
      title: "Command Palette",
      desc: "Everything a keystroke away — jump routes, run actions, and search in milliseconds.",
      color: "bg-slate-900",
      shadow: "shadow-slate-900/30"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          Everything you need to automate joy
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-slate-500 dark:text-slate-400 font-medium"
        >
          A complete suite of tools to manage events, generate content, and deliver seamlessly.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, translateY: -5 }}
            className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl cursor-default relative overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className={`absolute -inset-1 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl ${feature.color}`} />
            
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.1 }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${feature.color} ${feature.shadow}`}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 relative z-10">{feature.title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
