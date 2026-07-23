import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWishStore } from "../../store/wishesStore";

export default function WizardNavigation() {
  const { currentStep, nextStep, prevStep } = useWishStore();

  const totalSteps = 9;

  return (
    <div className="flex justify-between items-center mt-10">
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          currentStep === 1
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <button
        onClick={nextStep}
        disabled={currentStep === totalSteps}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
          currentStep === totalSteps
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}
      >
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
}
