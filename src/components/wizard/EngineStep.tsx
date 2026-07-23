import { useEventStore } from "../../store/eventStore";
import { useWishStore } from "../../store/wishesStore";

export default function EngineStep() {
  const { selectedEvent } = useEventStore();
  const { aiEngine, setAIEngine } = useWishStore();
  
  const targetName = selectedEvent?.Name || "your contact";
  const targetEvent = selectedEvent?.EventType?.toLowerCase() || "special occasion";

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-8">Choose an AI provider</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div 
          onClick={() => setAIEngine("gemini")}
          className={`border-2 rounded-2xl p-6 cursor-pointer shadow-sm relative overflow-hidden transition-colors ${aiEngine === "gemini" ? "border-teal-500 bg-teal-50/10" : "border-slate-200 bg-white hover:border-slate-300"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-sm ${aiEngine === "gemini" ? "text-teal-900" : "text-slate-800"}`}>Gemini</h3>
            <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-md">RECOMMENDED</span>
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">Cinematic imagery, strong text rendering.</p>
        </div>

        <div 
          onClick={() => setAIEngine("flux")}
          className={`border-2 rounded-2xl p-6 cursor-pointer transition-colors shadow-sm relative overflow-hidden ${aiEngine === "flux" ? "border-teal-500 bg-teal-50/10" : "border-slate-200 bg-white hover:border-slate-300"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-sm ${aiEngine === "flux" ? "text-teal-900" : "text-slate-800"}`}>FLUX</h3>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">FAST</span>
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">Painterly, high stylization, fast.</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Prompt preview</p>
        <div className="bg-slate-100 rounded-xl p-4 text-xs font-medium text-slate-600 leading-relaxed">
          Generate a warm, elegant {targetEvent} illustration for <span className="text-teal-600 font-bold">{targetName}</span> in a cinematic style, cinematic light, gentle particles.
        </div>
      </div>
    </div>
  );
}
