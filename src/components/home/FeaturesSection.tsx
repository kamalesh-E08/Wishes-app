export default function FeaturesSection() {
  const features = [
    "AI Generated Greeting Cards",
    "Photo Personalization",
    "Animation Support",
    "Festival Themes",
    "Birthday Templates",
    "Social Sharing",
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-20">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="
              p-8
              rounded-3xl
              bg-gradient-to-br
              from-white/10
              to-white/5
              border
              border-white/10
              "
            >
              <h3 className="text-xl font-semibold">{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
