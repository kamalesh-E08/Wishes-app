import { useWishStore } from "../../store/wishesStore";

export default function CustomMessage() {
  const { customMessage, setCustomMessage } = useWishStore();

  return (
    <div className="mt-8">
      <label className="block mb-2 text-slate-700 font-bold text-sm">Greeting Message</label>

      <textarea
        rows={4}
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        placeholder="Happy Birthday Dad ❤️"
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
        "
      />
    </div>
  );
}
