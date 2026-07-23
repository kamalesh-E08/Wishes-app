import { useAuthStore } from "../store/authStore";
import { User, CheckCircle2 } from "lucide-react";
import { useProfileStore } from "../store/profileStore";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import { auth } from "../services/auth";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const profileState = useProfileStore();
  
  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(" ")[0] || "Ava",
    lastName: user?.displayName?.split(" ")[1] || "Chen",
    jobTitle: profileState.jobTitle,
    company: profileState.company,
    defaultSignature: profileState.defaultSignature,
    aiModelPref: profileState.aiModelPref,
    emailHeaderTitle: profileState.emailHeaderTitle || "🎉 Happy {occasion} {name}!",
    emailCompanyFooter: profileState.emailCompanyFooter || "DIAN Technology Solutions",
    emailAccentColor: profileState.emailAccentColor || "#0d9488",
  });
  
  const [showToast, setShowToast] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, GIF)");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Update Firebase auth user photoURL
        if (auth.currentUser) {
          try {
            await updateProfile(auth.currentUser, { photoURL: base64 });
          } catch (err) {
            console.error("Firebase avatar update error", err);
          }
        }

        // Update local authStore
        updateUser({ photoURL: base64 });
        setIsUploadingAvatar(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Avatar upload failed", error);
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    profileState.setProfile({
      jobTitle: formData.jobTitle,
      company: formData.company,
      defaultSignature: formData.defaultSignature,
      aiModelPref: formData.aiModelPref,
      emailHeaderTitle: formData.emailHeaderTitle,
      emailCompanyFooter: formData.emailCompanyFooter,
      emailAccentColor: formData.emailAccentColor,
    });

    const newDisplayName = `${formData.firstName} ${formData.lastName}`.trim();
    
    // Update in Firebase
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName
        });
      } catch (error) {
        console.error("Failed to update Firebase profile", error);
      }
    }

    // Update locally in Zustand store
    updateUser({
      displayName: newDisplayName
    });
    
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl relative pb-16">
      <input 
        type="file"
        ref={avatarInputRef}
        accept="image/png, image/jpeg, image/gif, image/webp"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-0 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl shadow-sm border border-emerald-100 text-sm font-bold z-20"
          >
            <CheckCircle2 size={16} /> Profile & Avatar updated!
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Profile & Email Settings</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">Manage personal information and customize automated email templates.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-500/10 text-teal-500 dark:text-teal-500 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 shadow-sm overflow-hidden relative">
            {isUploadingAvatar ? (
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            ) : user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <User size={32} />
            )}
          </div>
          <div>
            <button 
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors shadow-sm mb-2 cursor-pointer disabled:opacity-50"
            >
              {isUploadingAvatar ? "Uploading..." : "Change avatar"}
            </button>
            <p className="text-[10px] font-medium text-slate-400">JPG, GIF or PNG. 2MB max.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">First Name</label>
              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Last Name</label>
              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
            <input type="email" defaultValue={user?.email || "ava@nova.io"} disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed" />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Application Preferences</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Job Title</label>
                <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Company</label>
                <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Preferred AI Model</label>
            <select value={formData.aiModelPref} onChange={e => setFormData({...formData, aiModelPref: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all appearance-none cursor-pointer">
              <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Fastest)</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Best Quality)</option>
              <option value="Flux">Flux (Images Only)</option>
            </select>
          </div>

          {/* Email Template Customization */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Email Template Customization</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize the template used when wishes are automatically sent via email.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Header Title Format</label>
                <input 
                  type="text" 
                  value={formData.emailHeaderTitle} 
                  onChange={e => setFormData({...formData, emailHeaderTitle: e.target.value})} 
                  placeholder="🎉 Happy {occasion} {name}!"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" 
                />
                <p className="text-[10px] text-slate-400 mt-1 ml-1">Use {"{name}"} and {"{occasion}"} variables.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Accent Theme Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={formData.emailAccentColor} 
                    onChange={e => setFormData({...formData, emailAccentColor: e.target.value})} 
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white" 
                  />
                  <input 
                    type="text" 
                    value={formData.emailAccentColor} 
                    onChange={e => setFormData({...formData, emailAccentColor: e.target.value})} 
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Default Email Signature</label>
              <textarea 
                value={formData.defaultSignature} 
                onChange={e => setFormData({...formData, defaultSignature: e.target.value})} 
                rows={3} 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Company / Organization Footer</label>
              <input 
                type="text" 
                value={formData.emailCompanyFooter} 
                onChange={e => setFormData({...formData, emailCompanyFooter: e.target.value})} 
                placeholder="DIAN Technology Solutions"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white focus:border-teal-500 transition-all" 
              />
            </div>

            {/* Live Template Preview */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Live Email Card Preview</label>
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div 
                  className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border"
                  style={{ borderColor: `${formData.emailAccentColor}30` }}
                >
                  <h4 
                    className="text-lg font-bold mb-3"
                    style={{ color: formData.emailAccentColor }}
                  >
                    {formData.emailHeaderTitle.replace("{name}", "John").replace("{occasion}", "Birthday")}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                    Wishing you success, happiness, and wonderful memories on your special day!
                  </p>

                  <div className="w-full h-32 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-inner mb-4">
                    [ Generated Wish Artwork ]
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 whitespace-pre-line">
                    {formData.defaultSignature}
                    <div className="font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {formData.emailCompanyFooter}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer">
              Save settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
