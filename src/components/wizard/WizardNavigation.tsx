import { useNavigate } from "react-router-dom";
import { useWishStore } from "../../store/wishesStore";

export default function WizardNavigation() {
  const { currentStep, uploadedImage, occasion, theme, setCurrentStep } =
    useWishStore();
  const navigate = useNavigate();

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return !!uploadedImage;

      case 2:
        return !!occasion;

      case 3:
        return !!theme;

      default:
        return true;
    }
  };

  const next = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);

    if (currentStep === 7) navigate("/preview");
  };

  const prev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-8">
      <button
        onClick={prev}
        className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/10 w-full sm:w-auto"
      >
        Previous
      </button>

      <button
        disabled={!canContinue()}
        onClick={next}
        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl w-full sm:w-auto ${
          canContinue()
            ? "bg-gradient-to-r from-purple-500 to-cyan-500"
            : "bg-gray-700 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
