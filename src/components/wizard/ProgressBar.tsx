import { Check } from "lucide-react";
import { useWishStore } from "../../store/wishesStore";

const steps = [
  "Occasion",
  "Photo",
  "Theme",
  "People",
  "Decor",
  "Animation",
  "Engine",
  "Preview",
  "Output"
];

export default function ProgressBar() {
  const { currentStep } = useWishStore();

  return (
    <div className="w-full overflow-x-auto pb-8 scrollbar-hide -mb-8">
      <div className="flex items-center justify-between w-full min-w-[500px] md:min-w-0 max-w-3xl mx-auto relative z-0">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 -z-10 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => {
        const isActive = currentStep === index + 1;
        const isCompleted = currentStep > index + 1;

        return (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isCompleted
                  ? "bg-teal-500 text-white shadow-sm"
                  : isActive
                    ? "bg-teal-500 text-white ring-4 ring-teal-500/30 dark:ring-teal-500/20 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
            </div>

            <span className={`absolute top-10 text-[10px] sm:text-xs font-bold tracking-wide text-center whitespace-nowrap ${
              isActive || isCompleted
                ? "text-slate-800 dark:text-slate-200"
                : "text-slate-400 dark:text-slate-500"
            }`}>
              {step}
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
}
