import { Show } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, FilePlus2 } from "lucide-react";

export default async function HomepageOnLogin() {
  const user = await currentUser();

  return (
    <Show when={"signed-in"}>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.firstName || "there"}</span>!
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            You have 3 pending invoices this week.
          </p>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Go to Dashboard
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View history, clients, and analytics.
                </p>
              </div>
            </div>
            <ArrowRight
              className="absolute bottom-6 right-6 text-slate-300 group-hover:text-blue-500 transition-colors"
              size={20}
            />
          </Link>

          <Link
            href="/generateInvoice"
            className="group relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white transition-all hover:bg-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/10 p-3 text-white group-hover:bg-blue-500 transition-colors">
                <FilePlus2 size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  Create Invoice
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Generate a professional PDF in seconds.
                </p>
              </div>
            </div>
            <ArrowRight
              className="absolute bottom-6 right-6 text-slate-500 group-hover:text-white transition-colors"
              size={20}
            />
          </Link>
        </div>
      </section>
    </Show>
  );
}
