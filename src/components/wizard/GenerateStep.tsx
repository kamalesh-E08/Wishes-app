import { Sparkle } from "lucide-react";

export default function GenerateStep() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl aspect-video rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 animate-pulse flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/20">
        <Sparkle size={32} className="mb-4 animate-spin-slow" />
        <p className="text-sm font-bold tracking-widest uppercase">Rendered preview</p>
      </div>
    </div>
  );
}
