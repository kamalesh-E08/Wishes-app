import ProgressBar from "../components/wizard/ProgressBar";
import UploadStep from "../components/wizard/UploadStep";
import OccasionStep from "../components/wizard/OccasionStep";
import ThemeStep from "../components/wizard/ThemeStep";
import WizardNavigation from "../components/wizard/WizardNavigation";
import PeopleStep from "../components/wizard/PeopleStep";
import DecorationStep from "../components/wizard/DecorationStep";
import AnimationStep from "../components/wizard/AnimationStep";
import EngineStep from "../components/wizard/EngineStep";
import { useWishStore } from "../store/wishesStore";
import { useEffect } from "react";
import { useEventStore } from "../store/eventStore";
export default function CreateWishPage() {

  const { selectedEvent } = useEventStore();

  const { setOccasion, setCustomMessage } = useWishStore();

  useEffect(() => {
    if (!selectedEvent) return;

    setOccasion(selectedEvent.EventType);

    setCustomMessage(`Happy ${selectedEvent.EventType} ${selectedEvent.Name}`);
  }, [selectedEvent]);

  const { currentStep } = useWishStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep />;

      case 2:
        return <OccasionStep />;

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

      default:
        return <div className="text-center text-3xl">Coming Soon</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-12">Create Wish</h1>

      <ProgressBar />

      {renderStep()}

      <WizardNavigation />
    </div>
  );
}
