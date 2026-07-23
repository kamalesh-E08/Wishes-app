import { Link } from "react-router-dom";
import { Sparkle, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-100/50 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Sparkle size={16} fill="white" />
          </div>
          <h1 className="font-bold tracking-tight text-slate-900 dark:text-white">Wishes-AI</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-[13px] font-semibold text-slate-500 dark:text-slate-400">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[13px] font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-2">
              <LayoutDashboard size={14} /> Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-[13px] font-bold transition-colors shadow-sm cursor-pointer">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${open ? "block" : "hidden"} px-6 pb-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800`}>
        <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300 pt-4">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
          <hr className="border-slate-100 dark:border-slate-800" />
          {user ? (
            <Link to="/dashboard" onClick={() => setOpen(false)} className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-2">
              <LayoutDashboard size={16} /> Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-teal-600 dark:text-teal-400">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
