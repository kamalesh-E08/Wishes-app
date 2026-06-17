import { useWishStore } from "../../store/wishesStore";

const engines = [
  {
    name: "ChatGPT",
    available: true,
  },
  {
    name: "Gemini",
    available: false,
  },
  {
    name: "Claude",
    available: false,
  },
  {
    name: "Grok",
    available: false,
  },
];

export default function EngineStep() {
  const { aiEngine, setAIEngine } = useWishStore();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {engines.map((engine) => (
        <button
          key={engine.name}
          disabled={!engine.available}
          onClick={() => setAIEngine(engine.name)}
          className={`
            p-8
            rounded-3xl
            border
            relative
            transition
            ${
              aiEngine === engine.name
                ? "border-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5"
            }
            ${!engine.available ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <h3 className="text-xl font-bold">{engine.name}</h3>

          {!engine.available && (
            <span className="text-xs text-yellow-400">Coming Soon</span>
          )}
        </button>
      ))}
    </div>
  );
}
