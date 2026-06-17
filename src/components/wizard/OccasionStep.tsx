import { useWishStore } from "../../store/wishesStore";

const occasions = [
  "Birthday",
  "Anniversary",
  "Festival",
  "Achievement",
  "New Job",
];

export default function OccasionStep() {
  const { occasion, setOccasion } = useWishStore();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {occasions.map((item) => (
        <button
          key={item}
          onClick={() => setOccasion(item)}
          className={`
            p-6
            rounded-3xl
            border
            cursor-pointer
            transition

            ${
              occasion === item
                ? "border-purple-500 ring-2 ring-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5"
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
