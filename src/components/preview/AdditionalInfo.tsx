import { useWishStore } from "../../store/wishesStore";

export default function AdditionalInfo() {
  const { additionalInformation, setAdditionalInformation } = useWishStore();

  return (
    <div
      className="
      border
      border-white/10
      rounded-3xl
      p-8
      bg-white/5
      "
    >
      <h2 className="text-2xl font-bold mb-4">Additional Information</h2>

      <p className="text-white/60 mb-4">Help AI personalize the design.</p>

      <textarea
        value={additionalInformation}
        onChange={(e) => setAdditionalInformation(e.target.value)}
        rows={6}
        placeholder={`Examples:
            • Works at Google
            • Loves travelling
            • Favorite color is blue
            • Cricket fan
            • Photographer
            • Loves luxury lifestyle
            • Software Engineer`}
        className="
        w-full
        bg-black/30
        border
        border-white/10
        rounded-2xl
        p-4
        outline-none
        resize-none
        "
      />
    </div>
  );
}
