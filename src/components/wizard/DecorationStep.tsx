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
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-8">Add decorations</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {decorationsList.map((item) => (
          <button
            key={item}
            onClick={() => toggleDecoration(item)}
            className={`
              p-6
              rounded-xl
              border
              transition-all
              font-bold
              text-base
              cursor-pointer
              shadow-sm
              ${
                decorations.includes(item)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
