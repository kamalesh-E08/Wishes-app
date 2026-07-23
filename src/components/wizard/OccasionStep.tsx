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
            transition-all
            font-bold
            text-base
            ${
              occasion === item
                ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 text-teal-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-sm"
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
