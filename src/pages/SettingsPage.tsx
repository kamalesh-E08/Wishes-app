import { Settings, Bell, Lock } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useSettingsStore } from "../store/settingsStore";
import { useAuthStore } from "../store/authStore";
import { auth } from "../services/auth";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { 
    autoApprove, setAutoApprove,
    notificationsEnabled, setNotificationsEnabled,
    emailNotifications, setEmailNotifications,
    twoFactorAuth, setTwoFactorAuth
  } = useSettingsStore();

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("general");
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={16} className="text-teal-400 dark:text-teal-500" />
            Logged out successfully
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Manage your application preferences and security.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <div 
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${activeTab === 'general' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
          >
            <Settings size={16} className={activeTab === 'general' ? 'text-teal-500' : ''} /> General
          </div>
          <div 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${activeTab === 'notifications' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
          >
            <Bell size={16} className={activeTab === 'notifications' ? 'text-teal-500' : ''} /> Notifications
          </div>
          <div 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
          >
            <Lock size={16} className={activeTab === 'security' ? 'text-teal-500' : ''} /> Security
          </div>

          <div className="pt-8 mt-8 border-t border-slate-200/60 dark:border-slate-800/60">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full rounded-xl font-bold text-sm cursor-pointer transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === "general" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">General Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Dark Mode</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Switch to a premium dark aesthetic.</p>
                  </div>
                  <div 
                    onClick={toggleTheme}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${isDark ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isDark ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Auto-approve Generations</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Skip human review and auto-approve AI renders.</p>
                  </div>
                  <div 
                    onClick={() => setAutoApprove(!autoApprove)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${autoApprove ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${autoApprove ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Push Notifications</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Receive alerts in your browser when events are near.</p>
                  </div>
                  <div 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notificationsEnabled ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notificationsEnabled ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Alerts</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Get an email digest of scheduled wishes.</p>
                  </div>
                  <div 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${emailNotifications ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${emailNotifications ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Require an extra step for login.</p>
                  </div>
                  <div 
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${twoFactorAuth ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${twoFactorAuth ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
