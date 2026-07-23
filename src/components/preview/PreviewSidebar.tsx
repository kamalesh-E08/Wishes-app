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
      border-slate-200/60
      bg-white
      p-6
      shadow-sm
      "
    >
      <h2 className="text-xl font-bold text-slate-850 mb-6">Wish Summary</h2>

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
      <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">{label}</p>

      <p className="font-bold text-slate-800 text-sm mt-0.5">{value || "-"}</p>
    </div>
  );
}
