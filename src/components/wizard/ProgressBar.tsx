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
    <div className="flex justify-between mb-12">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center flex-1">
          <div
            className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${
              currentStep >= index + 1
                ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                : "bg-white/10"
            }
            `}
          >
            {index + 1}
          </div>

          <span className="text-sm mt-2">{step}</span>
        </div>
      ))}
    </div>
  );
}
