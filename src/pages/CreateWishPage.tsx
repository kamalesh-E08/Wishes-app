import ProgressBar from "../components/wizard/ProgressBar";
import OccasionStep from "../components/wizard/OccasionStep";
import UploadStep from "../components/wizard/UploadStep";
import ThemeStep from "../components/wizard/ThemeStep";
import PeopleStep from "../components/wizard/PeopleStep";
import DecorationStep from "../components/wizard/DecorationStep";
import AnimationStep from "../components/wizard/AnimationStep";
import EngineStep from "../components/wizard/EngineStep";
import ReviewStep from "../components/wizard/ReviewStep";
import GenerateStep from "../components/wizard/GenerateStep";
import WizardNavigation from "../components/wizard/WizardNavigation";
import { useWishStore } from "../store/wishesStore";

export default function CreateWishPage() {
  const { currentStep } = useWishStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OccasionStep />;
      case 2:
        return <UploadStep />;
      case 3:
        return <ThemeStep />;
      case 4:
        return <PeopleStep />;
      case 5:
        return <DecorationStep />;
      case 6:
        return <AnimationStep />;
      case 7:
        return <EngineStep />;
      case 8:
        return <ReviewStep />;
      case 9:
        return <GenerateStep />;
      default:
        return <div className="text-center text-3xl">Invalid Step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">AI Studio</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs md:text-sm">Craft a wish. Nova will design and render it for you.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative z-0">
        <ProgressBar />
        <div className="mt-16 mb-8 relative z-10">
          {renderStep()}
        </div>
      </div>

      <WizardNavigation />
    </div>
  );
}
