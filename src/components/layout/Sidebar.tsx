import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Cloud, 
  FileSpreadsheet, 
  Sparkles, 
  History, 
  User, 
  Settings,
  Sparkle,
  PanelLeftClose,
  PanelLeftOpen,
  Zap
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "OneDrive", path: "/onedrive", icon: Cloud },
    { name: "Excel Import", path: "/import", icon: FileSpreadsheet },
    { name: "AI Studio", path: "/create", icon: Sparkles },
    { name: "History", path: "/history", icon: History },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={`
      ${isOpen ? 'md:w-64' : 'md:w-20'} w-full
      h-16 md:h-screen flex flex-row md:flex-col flex-shrink-0 transition-all duration-300 z-50
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-slate-200/80 dark:border-slate-800/80 
      shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:shadow-[4px_0_24px_rgba(0,0,0,0.06)]
      order-last md:order-first fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
    `}>
      {/* Logo & Toggle - Hidden on mobile */}
      <div className={`hidden md:flex p-6 items-center ${isOpen ? 'justify-between' : 'justify-center flex-col'} gap-3`}>
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-md shadow-teal-500/10">
              <Sparkle size={16} className="fill-white dark:fill-slate-900" />
            </div>
            <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight whitespace-nowrap">Wishes AI</h1>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm cursor-pointer"
          >
            {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`
        flex-1 px-2 md:px-3 py-1 md:py-4 
        flex flex-row md:flex-col 
        items-center justify-around md:justify-start md:space-y-1 
        overflow-x-auto md:overflow-x-hidden md:overflow-y-auto scrollbar-hide 
        ${isOpen ? 'md:items-stretch' : 'md:items-center'}
      `}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && item.path !== "/";
          const isMobileSecondary = ["History", "Profile", "Settings"].includes(item.name);

          return (
            <Link
              key={item.name}
              to={item.path}
              title={!isOpen ? item.name : undefined}
              className={`
                relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3.5 
                px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded-xl text-[10px] md:text-[13px] font-bold 
                transition-all duration-200 flex-1 md:flex-initial min-w-[56px] md:min-w-0
                ${isMobileSecondary ? "hidden md:flex" : "flex"}
                ${!isOpen ? 'md:justify-center md:w-11 md:h-11 md:px-0' : 'md:w-full'}
                ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }
              `}
            >
              {/* Animated Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarTab"
                  className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              {/* Animated Top Glow Line for Mobile Bottom Nav */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full md:hidden"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <item.icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 ${isActive ? "text-teal-600 dark:text-teal-400 scale-110" : "text-slate-400 dark:text-slate-500"}`} />
              <span className={`whitespace-nowrap font-semibold tracking-tight ${!isOpen ? 'md:hidden' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Live Engine Status Widget - Replaces generic upgrade card */}
      {isOpen && (
        <div className="hidden md:block p-4 m-3 bg-gradient-to-br from-teal-500/10 via-indigo-500/5 to-purple-500/10 rounded-2xl border border-teal-500/20 dark:border-teal-500/30 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">AI Engine</span>
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-300">ONLINE</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Gemini 1.5 & Flux</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-3 font-medium">99.9% automated delivery active</p>
          
          <Link to="/create" className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
            <Zap size={13} className="fill-current" /> Studio AI
          </Link>
        </div>
      )}
    </aside>
  );
}
