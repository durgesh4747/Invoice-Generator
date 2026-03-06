// import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { FileText, Users, CreditCard, Plus, ArrowUpRight } from "lucide-react";

export default async function HomepageOnLogin() {
  const user = await currentUser();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      {/* 1. Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.firstName || "there"}</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Here is what&apos;s happening with your invoices today.
          </p>
        </div>
        <Link
          href="/generateInvoice"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-500 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Create New Invoice
        </Link>
      </header>

      {/* 2. Stat Grid (The "Visual Filler") */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "Total Revenue",
            value: "$0.00",
            icon: CreditCard,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Active Invoices",
            value: "0",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Clients",
            value: "0",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
          >
            <div
              className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard"
          className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all hover:shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Manage Invoices
            </h3>
            <p className="text-slate-500 mt-2 max-w-[250px]">
              View your full history, track payments, and edit existing records.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-blue-600">
              Go to Dashboard <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
          {/* Subtle background icon for design flare */}
          <FileText
            className="absolute -bottom-4 -right-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
            size={160}
          />
        </Link>

        <Link
          href="/clients"
          className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 transition-all hover:shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Client Directory
            </h3>
            <p className="text-slate-500 mt-2 max-w-[250px]">
              Store client details and addresses for faster invoice generation.
            </p>
            <div className="mt-6 flex items-center text-sm font-bold text-purple-600">
              View Clients <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
          <Users
            className="absolute -bottom-4 -right-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
            size={160}
          />
        </Link>
      </div>
    </section>
  );
}
