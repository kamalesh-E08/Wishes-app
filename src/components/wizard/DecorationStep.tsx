import { useWishStore } from "../../store/wishesStore";

const decorationsList = [
  "🎂 Cake",
  "🎈 Balloons",
  "🎉 Confetti",
  "🌸 Flowers",
  "🪔 Diyas",
];

export default function DecorationStep() {
  const { decorations, setDecorations } = useWishStore();

  const toggleDecoration = (decoration: string) => {
    if (decorations.includes(decoration)) {
      setDecorations(decorations.filter((d) => d !== decoration));
    } else {
      setDecorations([...decorations, decoration]);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {decorationsList.map((item) => (
        <button
          key={item}
          onClick={() => toggleDecoration(item)}
          className={`
            p-8
            rounded-3xl
            border
            transition
            ${
              decorations.includes(item)
                ? "border-purple-500 bg-purple-500/20"
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
