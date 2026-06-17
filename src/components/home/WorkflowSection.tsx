import { Upload, Palette, Users, Gift, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Photo",
  },
  {
    icon: Palette,
    title: "Choose Theme",
  },
  {
    icon: Users,
    title: "Add People",
  },
  {
    icon: Gift,
    title: "Decorations",
  },
  {
    icon: Sparkles,
    title: "Generate Wish",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-5xl font-bold mb-20">
          How Wishes AI Works
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="
              p-8
              rounded-3xl
              bg-white/5
              border
              border-white/10
              backdrop-blur-xl
              hover:scale-105
              transition
              "
            >
              <step.icon size={40} className="text-purple-400 mb-4" />

              <h3 className="font-semibold text-xl">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
