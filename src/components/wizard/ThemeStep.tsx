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
    <div className="grid md:grid-cols-3 gap-6">
      {themes.map((item) => (
        <div
          key={item}
          onClick={() => setTheme(item)}
          className={`
            h-48
            rounded-3xl
            flex
            items-center
            justify-center
            cursor-pointer
            transition-all
            border

            ${
              theme === item
                ? "border-purple-500 ring-2 ring-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5 hover:border-purple-400"
            }
          `}
        >
          <h3 className="text-xl font-semibold">{item}</h3>
        </div>
      ))}
    </div>
  );
}
