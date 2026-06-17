import { useWishStore } from "../../store/wishesStore";

export default function CustomMessage() {
  const { customMessage, setCustomMessage } = useWishStore();

  return (
    <div className="mt-8">
      <label className="block mb-2">Greeting Message</label>

      <textarea
        rows={4}
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        placeholder="Happy Birthday Dad ❤️"
        className="
        w-full
        bg-white/5
        border
        border-white/10
        rounded-xl
        p-4
        outline-none
        "
      />
    </div>
  );
}
