import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import AppShell from "../components/nova/AppShell";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white overflow-hidden transition-colors">
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center"
          >
            <h1 className="text-[8rem] font-bold tracking-tighter bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none drop-shadow-sm">
              404
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">
                Page not found
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-medium shadow-lg shadow-indigo-500/20"
                >
                  <Home size={18} />
                  Back to Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AppShell>
    </div>
  );
}
