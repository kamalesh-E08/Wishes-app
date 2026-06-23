import { useWishStore } from "../../store/wishesStore";

const engines = [
  {
    id: "flux",
    name: "FLUX",
    available: true,
    description: "Creative & Detailed",
  },
  {
    id: "gemini",
    name: "Gemini",
    available: false,
    description: "Billing Issue",
  },
];

export default function EngineStep() {
  const { aiEngine, setAIEngine } = useWishStore();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {engines.map((engine) => (
        <button
          key={engine.id}
          disabled={!engine.available}
          onClick={() => setAIEngine(engine.id)}
          className={`
            p-8
            rounded-3xl
            border
            relative
            transition-all
            duration-300

            ${
              aiEngine === engine.id
                ? "border-cyan-500 bg-cyan-500/20 scale-105"
                : "border-white/10 bg-white/5"
            }

            ${
              !engine.available
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-cyan-400 hover:bg-white/10"
            }
          `}
        >
          {engine.id === "stability" && (
            <span
              className="
              absolute
              top-3
              right-3
              text-xs
              px-2
              py-1
              rounded-full
              bg-green-500/20
              text-green-400
              "
            >
              Recommended
            </span>
          )}

          <h3 className="text-xl font-bold mb-2">{engine.name}</h3>

          <p className="text-sm text-white/60">{engine.description}</p>

          {!engine.available && (
            <span className="block mt-3 text-xs text-yellow-400">
              Coming Soon
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
