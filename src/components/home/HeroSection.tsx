import { Link } from "react-router-dom";
import { Sparkle, Cloud, Command, Settings } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative pt-24 pb-16 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      
      {/* Floating Background Elements */}
      <motion.div 
        variants={floatingVariants} animate="animate"
        className="absolute top-20 left-10 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        variants={floatingVariants} animate="animate" style={{ animationDelay: "2s" }}
        className="absolute bottom-40 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider mb-8 shadow-sm">
          <Sparkle size={12} className="text-white" /> Now with Gemini & FLUX providers
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          The automation center for <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">AI-powered celebration</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-slate-500 font-medium mb-10 max-w-2xl mx-auto">
          Nova connects your events, cloud storage, and generative AI into one silky workflow. Design, generate, approve, and send — all from one place.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 w-full sm:w-auto px-4 sm:px-0">
          <Link to="/register" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center">
            Start free &rarr;
          </Link>
          <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-center">
            Live demo &rarr;
          </button>
        </motion.div>

        {/* Dashboard Mockup Graphic */}
        <motion.div 
          variants={itemVariants}
          className="relative mx-auto w-full max-w-5xl rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden mb-24"
        >
          <div className="h-10 bg-white/50 border-b border-white/40 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 bg-slate-50/30">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left transition-shadow hover:shadow-md cursor-default">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EVENTS SYNCED</h4>
               <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 md:mt-2 tracking-tight">128</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left transition-shadow hover:shadow-md cursor-default">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WISHES GENERATED</h4>
               <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 md:mt-2 tracking-tight">512</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center sm:text-left transition-shadow hover:shadow-md cursor-default">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EMAILS DELIVERED</h4>
               <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 md:mt-2 tracking-tight">892</p>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 sm:col-span-3 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm mt-2 md:mt-4 text-left relative overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex items-center gap-2 mb-6 md:mb-8 relative z-10">
                <Settings size={14} className="text-slate-900 animate-spin-slow" />
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Nova flow</span>
              </div>
              
              <div className="overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <div className="flex items-center justify-between min-w-[600px] md:min-w-0 relative z-10">
                  {[
                    { step: 1, label: "Detect event", active: true },
                    { step: 2, label: "Pick template", active: false },
                    { step: 3, label: "Generate wish", active: false },
                    { step: 4, label: "Render image", active: false },
                    { step: 5, label: "Approve", active: false },
                    { step: 6, label: "Send", active: false }
                  ].map((item, index, arr) => (
                    <div key={item.step} className="flex items-center w-full">
                      <div className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors text-sm md:text-base ${
                            item.active ? "bg-teal-500 text-white" : "bg-white border border-slate-200 text-slate-400 hover:border-teal-300"
                          }`}
                        >
                          {item.step}
                        </motion.div>
                        <span className={`text-[10px] md:text-xs font-bold ${item.active ? "text-slate-900" : "text-slate-500"}`}>{item.label}</span>
                      </div>
                      {index < arr.length - 1 && (
                        <div className="flex-1 h-px bg-slate-200 mx-2 md:mx-4 relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-0 bg-teal-500 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: item.active ? 1 : 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trusted By */}
        <motion.div variants={itemVariants}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">TRUSTED BY TEAMS SHIPPING FAST</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2 cursor-pointer text-black"><Cloud size={24} className="text-sky-500" /><span className="font-bold text-xl">Stratos</span></motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2 cursor-pointer text-black"><Sparkle size={24} className="text-amber-500" /><span className="font-bold text-xl">Lumina</span></motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2 cursor-pointer text-black"><Command size={24} className="text-slate-900" /><span className="font-bold text-xl">Vercel</span></motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2 cursor-pointer text-black"><Settings size={24} className="text-indigo-500" /><span className="font-bold text-xl">Acme Corp</span></motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
