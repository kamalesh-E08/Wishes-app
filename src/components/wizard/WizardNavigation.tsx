import { useNavigate } from "react-router-dom";
import { useWishStore } from "../../store/wishesStore";

export default function WizardNavigation() {

    const { currentStep, uploadedImage, occasion, theme, setCurrentStep } = useWishStore();
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
    <div className="flex justify-between mt-12">
      <button
        onClick={prev}
        className="
        px-6 py-3 rounded-xl
        bg-white/10
        "
      >
        Previous
      </button>

      <button
        disabled={!canContinue()}
        onClick={next}
        className={`
                px-6
                py-3
                rounded-xl

                ${
                canContinue()
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                    : "bg-gray-700 cursor-not-allowed"
                }
            `}
      >
        Next
      </button>
    </div>
  );
}
