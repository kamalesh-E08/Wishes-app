import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AuroraBackground from "../nova/AuroraBackground";
import AppShell from "../nova/AppShell";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans">
        <AuroraBackground />
        
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
          <Topbar />
          
          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}
