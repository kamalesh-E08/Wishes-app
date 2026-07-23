import { useWishStore } from "../../store/wishesStore";

export default function AnimationStep() {
  const { animationEnabled, setAnimation } = useWishStore();

  return (
    <div className="flex justify-center py-12">
      <button
        onClick={() => setAnimation(!animationEnabled)}
        className={`
          px-12
          py-5
          rounded-2xl
          text-lg
          font-bold
          transition-all
          duration-200
          cursor-pointer
          shadow-sm
          ${animationEnabled ? "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/10" : "bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300"}
        `}
      >
        Animation: {animationEnabled ? "✓ Enabled" : "✗ Disabled"}
      </button>
    </div>
  );
}
