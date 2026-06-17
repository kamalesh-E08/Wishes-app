import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-40 px-6">
      <div
        className="
        max-w-5xl
        mx-auto
        rounded-[40px]
        border
        border-white/10
        bg-gradient-to-r
        from-purple-900/40
        to-cyan-900/40
        backdrop-blur-xl
        p-16
        text-center
        "
      >
        <h2 className="text-6xl font-bold">Ready To Create Wishes?</h2>

        <p className="text-white/70 mt-6 text-lg">
          Turn memories into beautiful AI generated greetings.
        </p>

        <button
          onClick={()=>{navigate("/create")}}
          className="
          mt-10
          px-8
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-purple-500
          to-cyan-500
          font-semibold
          inline-flex
          items-center
          gap-2
          "
        >
          Create Now
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
