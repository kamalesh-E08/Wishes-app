import { useWishStore } from "../../store/wishesStore";

import CustomMessage from "./CustomMessage";
import GenerateButton from "./GenerateButton";
import AdditionalInfo from "./AdditionalInfo";


export default function PreviewSidebar() {
  const store = useWishStore();

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      "
    >
      <h2 className="text-2xl font-bold mb-6">Wish Summary</h2>

      <SummaryItem label="Occasion" value={store.occasion} />

      <SummaryItem label="Theme" value={store.theme} />

      <SummaryItem
        label="Animation"
        value={store.animationEnabled ? "Enabled" : "Disabled"}
      />

      <SummaryItem label="AI Engine" value={store.aiEngine} />

      <CustomMessage />
      <AdditionalInfo/>
      <GenerateButton />
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-white/50 text-sm">{label}</p>

      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
