import { useWishStore } from "../../store/wishesStore";

const steps = [
  "Upload",
  "Occasion",
  "Theme",
  "People",
  "Decor",
  "Animation",
  "Engine",
];

export default function ProgressBar() {
  const { currentStep } = useWishStore();

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center min-w-[64px]">
          <div
            className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
              currentStep >= index + 1
                ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                : "bg-white/10"
            }`}
          >
            {index + 1}
          </div>

          <span className="text-xs sm:text-sm mt-2">{step}</span>
        </div>
      ))}
    </div>
  );
}
