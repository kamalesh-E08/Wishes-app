import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Sparkle, Mail, Lock } from "lucide-react";
import { loginUser, loginWithGoogle } from "../services/auth";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const currentUser = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      login({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });
      navigate("/dashboard");
    } catch (error: any) {
      alert("Login Failed: " + (error?.message || "Unknown error"));
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      login({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });
      navigate("/dashboard");
    } catch (error: any) {
      alert("Google Login Failed: " + (error?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Sparkle size={16} fill="white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">Nova</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Sign in to your automation center.</p>
        </div>

        {/* Google Auth */}
        <button 
          onClick={handleGoogle}
          className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer mb-6"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale opacity-70 dark:opacity-100" />
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <span className="relative px-2 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">or</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                placeholder="you@work.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer bg-slate-50 dark:bg-slate-800" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <Link to="#" className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            Sign in &rarr;
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            No account? <Link to="/register" className="text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 dark:hover:text-teal-300">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
