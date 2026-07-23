import { useWishStore } from "../../store/wishesStore";

const themes = [
  "Beach",
  "Luxury Hotel",
  "Office",
  "Mountain",
  "Home",
  "Travel",
];

export default function ThemeStep() {
  const { theme, setTheme } = useWishStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {themes.map((item) => (
        <div
          key={item}
          onClick={() => setTheme(item)}
          className={`
            h-36 sm:h-48
            rounded-3xl
            flex
            items-center
            justify-center
            cursor-pointer
            transition-all
            border
            ${
              theme === item
                ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 text-teal-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-teal-550/40 hover:text-teal-650 hover:shadow-sm"
            }
          `}
        >
          <h3 className="text-lg sm:text-xl font-bold">{item}</h3>
        </div>
      ))}
    </div>
  );
}
