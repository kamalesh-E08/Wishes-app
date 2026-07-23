import { useWishStore } from "../../store/wishesStore";

export default function AdditionalInfo() {
  const { additionalInformation, setAdditionalInformation } = useWishStore();

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h2 className="text-sm font-bold text-slate-700 mb-1">Additional Information</h2>

      <p className="text-xs text-slate-500 mb-3 font-semibold">Help AI personalize the design.</p>

      <textarea
        maxLength={100}
        value={additionalInformation}
        onChange={(e) => setAdditionalInformation(e.target.value)}
        rows={5}
        placeholder={`Examples:
            • Works as Software Engineer
            • Loves travelling & mountains
            • Favorite color is teal
            • Cricket / photography fan`}
        className="
        w-full
        bg-slate-50
        border
        border-slate-200
        text-slate-850
        placeholder-slate-400
        focus:bg-white
        focus:border-teal-500
        focus:ring-2
        focus:ring-teal-500/20
        transition-all
        rounded-xl
        p-4
        outline-none
        font-medium
        text-sm
        resize-none
        "
      />
      <div className="text-xs text-slate-400 font-semibold text-right mt-1">
        {additionalInformation.length}/100
      </div>
    </div>
  );
}
