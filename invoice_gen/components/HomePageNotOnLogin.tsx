import { Show } from "@clerk/nextjs";
import Link from "next/link";

export default function HomepageNotOnLogin() {
  return (
    <Show when={"signed-out"}>
      <div className="relative isolate overflow-hidden bg-slate-50">
        <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Professional Invoices <br className="hidden sm:block" />
            <span className="text-blue-600">in seconds.</span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            Focus on your craft, not the paperwork. Create, manage, and track
            your billing without the headache of complex accounting software.
          </p>

          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Link
              href="/sign-up"
              className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-all hover:scale-105"
            >
              Start Invoicing Free
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors"
            >
              Sign in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </Show>
  );
}
