import Link from "next/link";
import { FeaturesSection } from "./FeaturesSection";
import { PricingSection } from "./PricingSection";
import { SignUpButton } from "@clerk/nextjs";

export default function HomepageNotOnLogin() {
  return (
    <div className="relative isolate bg-slate-50">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#90cdf4] to-[#63b3ed] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pt-40 text-center flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
          Professional Invoices <br className="hidden sm:block" />
          <span className="text-blue-600">in seconds.</span>
        </h1>

        <p className="mt-8 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
          Focus on your craft, not the paperwork. Create, manage, and track your
          billing without the headache of complex accounting software.
        </p>

        <div className="mt-12 flex items-center justify-center gap-x-6">
          <SignUpButton mode="modal">
            <button className="rounded-full bg-blue-600 px-10 py-4 text-base font-bold text-white shadow-xl hover:bg-blue-500 transition-all">
              Start Invoicing Free
            </button>
          </SignUpButton>
          <Link
            href="#features"
            className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            See how it works <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Features & Pricing */}
      <FeaturesSection />
      <PricingSection />
    </div>
  );
}
