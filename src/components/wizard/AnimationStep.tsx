import { useWishStore } from "../../store/wishesStore";

export default function AnimationStep() {
  const { animationEnabled, setAnimation } = useWishStore();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setAnimation(!animationEnabled)}
        className={`
          px-12
          py-5
          rounded-2xl
          text-xl
          font-semibold
          transition
          ${animationEnabled ? "bg-green-500" : "bg-red-500"}
        `}
      >
        Animation: {animationEnabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}
