import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-24 bg-slate-50 border-y border-slate-200"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start for free and upgrade as your business grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900">Starter</h3>
            <p className="mt-4 text-4xl font-black text-slate-900">
              $0{" "}
              <span className="text-sm font-medium text-slate-400">
                / forever
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Perfect for new freelancers.
            </p>

            <ul className="mt-8 space-y-4 flex-1">
              {[
                "5 Invoices per month",
                "Standard PDF Template",
                "Client Management",
                "Email Support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <Check size={16} className="text-blue-600" /> {item}
                </li>
              ))}
            </ul>

            <button className="mt-10 w-full py-3 px-6 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Plan (Beta) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl relative flex flex-col scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              OPEN BETA
            </div>
            <h3 className="text-lg font-bold text-slate-900">Professional</h3>
            <p className="mt-4 text-4xl font-black text-slate-900">
              $0{" "}
              <span className="text-sm font-medium text-slate-400">
                / beta access
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              For established professionals.
            </p>

            <ul className="mt-8 space-y-4 flex-1">
              {[
                "Unlimited Invoices",
                "Custom Branding",
                "Advanced Analytics",
                "Priority Support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <Check size={16} className="text-blue-600 font-bold" /> {item}
                </li>
              ))}
            </ul>

            <button className="mt-10 w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              Join Beta Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
