import { Search, Bell, Command, History, Settings, CheckCheck, Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHistoryStore } from "../../store/historyStore";
import { useEventStore } from "../../store/eventStore";

export default function Topbar() {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const { history } = useHistoryStore();
  const { manualEvents, oneDriveEvents } = useEventStore();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    const notifs: any[] = [];
    const allEvents = [...manualEvents, ...oneDriveEvents];
    
    // Add sent emails
    const sentEvents = allEvents.filter(e => e.status === 'sent');
    sentEvents.forEach((e, i) => {
      notifs.push({
        id: `email-${e._id || i}`,
        title: "Automated Email Sent",
        desc: `Wish sent to ${e.Name || e.email}`,
        time: e.generatedAt ? new Date(e.generatedAt).toLocaleDateString() : 'Recently',
        icon: Mail,
        color: "text-teal-500 bg-teal-50 dark:bg-teal-950/40",
        date: new Date(e.generatedAt || e.EventDate || Date.now())
      });
    });

    // Add recent generations
    history.forEach((h, i) => {
      notifs.push({
        id: `gen-${h._id || i}`,
        title: "AI Generation Ready",
        desc: `Generated ${h.occasion} wish`,
        time: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'Recently',
        icon: Sparkles,
        color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
        date: new Date(h.createdAt || Date.now())
      });
    });

    // Sort by date descending
    notifs.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return notifs.slice(0, 5).map(n => ({ ...n, read: readIds.has(n.id) }));
  }, [manualEvents, oneDriveEvents, history, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const newReadIds = new Set(readIds);
    notifications.forEach(n => newReadIds.add(n.id));
    setReadIds(newReadIds);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      
      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group flex items-center">
          <Search size={14} className="absolute left-3 text-slate-400 dark:text-slate-500 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search events, wishes, templates..."
            className="w-full pl-9 pr-12 py-1.5 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 focus:bg-white dark:focus:bg-slate-900 rounded-md text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800 transition-all placeholder-slate-400 dark:placeholder-slate-500"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-3 pl-2 sm:pl-4 relative">
        <Link to="/history" className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
          <History size={16} />
        </Link>
        <Link to="/settings" className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
          <Settings size={16} />
        </Link>

        {/* Notifications Trigger */}
        <div className="relative" ref={popoverRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Popover */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck size={14} /> Mark read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto mt-1">
                  {notifications.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                          );
                        }}
                        className={`p-3 flex items-start gap-3 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          !item.read ? "bg-teal-50/30 dark:bg-teal-950/20" : ""
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${item.color}`}>
                          <IconComp size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* User Profile Avatar Link */}
        <Link 
          to="/profile" 
          className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 py-1 px-2 rounded-md transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-semibold text-[11px] shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              initials || "U"
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-none">{displayName}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
