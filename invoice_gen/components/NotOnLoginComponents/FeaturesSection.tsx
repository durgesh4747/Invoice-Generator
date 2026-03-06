import { Zap, ShieldCheck, MousePointerClick } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Rapid Generation",
      description: "Create a professional PDF invoice in under 60 seconds. No complex accounting knowledge required.",
      icon: <Zap className="text-blue-600" size={24} />,
    },
    {
      title: "Client Directory",
      description: "Save client details once and reuse them for future billing. Manage your contacts in one place.",
      icon: <MousePointerClick className="text-blue-600" size={24} />,
    },
    {
      title: "Secure & Private",
      description: "Your data is protected. We use industry-standard encryption to keep your financial records safe.",
      icon: <ShieldCheck className="text-blue-600" size={24} />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to get paid
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Focus on your work and let <span className="font-bold">GetInv</span> handle the paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}