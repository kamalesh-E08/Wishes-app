import { Link } from "react-router-dom";
import { Check, ChevronDown } from "lucide-react";

export default function CTASection() {
  const pricing = [
    {
      name: "Starter",
      price: "$0",
      features: ["100 AI generations", "1 cloud connection", "Community support"],
      button: "Choose Starter",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      features: ["Unlimited generations", "Priority queue", "All integrations", "Approval workflow"],
      button: "Choose Pro",
      highlight: true
    },
    {
      name: "Team",
      price: "$99",
      features: ["Seats & roles", "Shared history", "SAML SSO", "Audit logs"],
      button: "Choose Team",
      highlight: false
    }
  ];

  const faqs = [
    "Which AI providers do you support?",
    "Do you store my images?",
    "Can I invite my team?",
    "Is there an API?"
  ];

  return (
    <div className="bg-transparent">
      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-16">Simple, generous pricing</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((tier, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${tier.highlight ? 'border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-500/10 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md' : 'border-slate-200/60 dark:border-slate-800 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-md'} flex flex-col`}>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Check size={14} className="text-teal-500 dark:text-teal-400" /> {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-full text-xs font-bold transition-colors cursor-pointer ${tier.highlight ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                {tier.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto border-t border-slate-200/60 dark:border-slate-800">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-12">Questions & answers</h2>
        <div className="space-y-4">
          {faqs.map((q, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{q}</span>
              <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Ready to automate what matters?</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-10">Start free. Upgrade when you're ready.</p>
        
        <div className="flex items-center justify-center gap-4 mb-32">
          <Link to="/register" className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors shadow-sm">
            Create account
          </Link>
          <button className="px-6 py-3 rounded-full bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer">
            Open demo
          </button>
        </div>

        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">© 2026 Nova Labs. Crafted with cosmic care.</p>
      </section>
    </div>
  );
}
