import { currentUser } from "@clerk/nextjs/server";
import { FileText, Users, CreditCard, Plus, ArrowUpRight } from "lucide-react";
import RedirectButton from "./Loader";
import { getStatsNow } from "@/app/actions/stats";

export default async function HomepageOnLogin(props: {
  searchParams: Promise<{ curr?: string }>;
}) {
  const user = await currentUser();

  const sParams = await props.searchParams;

  const selectedCurr = sParams?.curr || "USD";

  const { totalRevenue, totalInvoices, totalClients } =
    await getStatsNow(selectedCurr);

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "INR", symbol: "₹" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
  ];

  const currentSymbol =
    currencies.find((c) => c.code === selectedCurr)?.symbol || "$";

  return (
    <section
      key={`${selectedCurr}-${totalRevenue}`}
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome,{" "}
            <span className="text-blue-600">{user?.firstName || "there"}</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Managing your business invoicing and financial growth.
          </p>
        </div>

        <RedirectButton
          href="/generateInvoice"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Create New Invoice
        </RedirectButton>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {/* Revenue Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CreditCard size={20} />
            </div>

            {/* Currency Switcher*/}
            <div className="flex bg-slate-50 border border-slate-100 rounded-md p-0.5">
              {currencies.map((c) => (
                <RedirectButton
                  key={c.code}
                  href={`?curr=${c.code}`}
                  className={`px-2 py-1 text-[9px] font-black rounded transition-all cursor-pointer ${
                    selectedCurr === c.code
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {c.code}
                </RedirectButton>
              ))}
            </div>
          </div>

          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {currentSymbol}
            {totalRevenue.toLocaleString(
              selectedCurr === "INR" ? "en-IN" : "en-US",
            )}
          </p>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
        </div>

        {/* Invoice Count */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-end">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalInvoices}
          </p>
        </div>

        {/* Client Count */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-end">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Users size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Clients</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalClients}
          </p>
        </div>
      </div>

      {/* Navigation Cards*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <RedirectButton
          href="/dashboard"
          className="group flex flex-col h-full p-8 bg-white border border-slate-200 rounded-4xl hover:border-blue-300 transition-all hover:shadow-xl text-left"
        >
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 tracking-tight">
            Manage Invoices
          </h3>
          <p className="text-slate-500 mt-2 text-sm">
            View and track your payments.
          </p>
          <div className="mt-8 flex items-center text-sm font-bold text-blue-600">
            Go to Dashboard <ArrowUpRight size={16} className="ml-1" />
          </div>
        </RedirectButton>

        <RedirectButton
          href="/client-directory"
          className="group flex flex-col h-full p-8 bg-white border border-slate-200 rounded-4xl hover:border-purple-300 transition-all hover:shadow-xl text-left"
        >
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 tracking-tight">
            Client Directory
          </h3>
          <p className="text-slate-500 mt-2 text-sm">
            Manage your global client list.
          </p>
          <div className="mt-8 flex items-center text-sm font-bold text-purple-600">
            View Clients <ArrowUpRight size={16} className="ml-1" />
          </div>
        </RedirectButton>
      </div>
    </section>
  );
}
