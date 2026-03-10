import getInvoicebyID from "@/lib/getInvoicebyID";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Download, ArrowLeft, Calendar } from "lucide-react";
import DownloadButton from "@/components/DownloadPDFButton";
import { InvoiceItem } from "@/types";
import RedirectButton from "@/components/OnLoginComponents/Loader";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoiceId = Number(id);

  if (!Number.isInteger(invoiceId)) return redirect("/dashboard");

  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const invoice = await getInvoicebyID(invoiceId);
  if (!invoice) return redirect("/dashboard");

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case "USD":
        return "$";
      case "GBP":
        return "£";
      case "EUR":
        return "€";
      default:
        return "₹";
    }
  };

  const symbol = getCurrencySymbol(invoice.currency);

  const balanceDue = (invoice.totalAmount || 0) - (invoice.amountPaid || 0);
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <RedirectButton
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-8 transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </RedirectButton>

        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-slate-200 overflow-hidden">
          {/* HEADER SECTION */}
          <div className="bg-slate-900 px-8 md:px-12 py-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      invoice.status === "PAID"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    #{invoice.invoiceNumber}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">
                  Invoice<span className="text-blue-500">.</span>
                </h1>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-2 text-slate-400 text-sm font-medium uppercase tracking-widest">
                  <Calendar size={14} /> Issued:{" "}
                  {new Date(invoice.issueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center justify-end gap-2 text-yellow-400 text-sm font-bold uppercase tracking-widest">
                  <Calendar size={14} /> Due:{" "}
                  {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* ADDRESS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  Billed From
                </p>
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {invoice.fromName}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {invoice.fromEmail}
                  </p>
                </div>
              </div>
              <div className="space-y-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 text-right">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  Billed To
                </p>
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {invoice.clientName}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {invoice.clientEmail}
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    {invoice.clientRegion}
                  </p>
                </div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="mb-12 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-900">
                    <th className="py-4 px-2 text-center">Type</th>
                    <th className="py-4 px-2">Description</th>
                    <th className="py-4 px-2 text-center">Qty</th>
                    <th className="py-4 px-2 text-right">Price</th>
                    <th className="py-4 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item: InvoiceItem) => (
                    <tr
                      key={item.id}
                      className="text-sm group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-6 px-2 text-center">
                        <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-500 uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-6 px-2">
                        <p className="font-bold text-slate-900">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-6 px-2 text-center font-medium text-slate-500">
                        {item.quantity}
                      </td>
                      <td className="py-6 px-2 text-right font-medium text-slate-500">
                        {symbol}
                        {item.price.toLocaleString()}
                      </td>
                      <td className="py-6 px-2 text-right font-black text-slate-900">
                        {symbol}
                        {(
                          Number(item.quantity) * Number(item.price)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 max-w-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Notes / Terms
                </p>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  {invoice.notes || "No additional notes provided."}
                </p>
              </div>

              <div className="w-full md:w-96 space-y-3 p-8 bg-slate-50 rounded-4xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold pt-2">
                  <span className="text-slate-500 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-slate-900">
                    {symbol}
                    {invoice.subtotal?.toLocaleString()}
                  </span>
                </div>

                {invoice.taxRate && invoice.taxLabel ? (
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">
                      {invoice.taxLabel} ({invoice.taxRate}%)
                    </span>
                    <span className="text-slate-900">
                      {symbol}
                      {(
                        (invoice.subtotal - invoice.discountAmount) *
                        (invoice.taxRate / 100)
                      ).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span className="uppercase tracking-widest text-slate-500">
                      Discount
                    </span>
                    <span className="text-slate-900">
                      {symbol}
                      {invoice.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-slate-300 border-t">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Total Amount
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {symbol}
                    {invoice.totalAmount.toLocaleString()}
                  </span>
                </div>

                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between items-center border-slate-200 text-xs font-bold text-slate-900">
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
                      Amount Paid
                    </span>
                    <span className="text-xs font-bold">
                      {symbol}
                      {invoice.amountPaid.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-y py-3">
                  <span className="text-xs font-bold uppercase tracking-tighter text-slate-700">
                    Balance Due
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {symbol}
                    {balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-center md:justify-end mt-12 gap-4">
              <DownloadButton
                invoice={invoice}
                user={{
                  fullName: user.fullName ?? "User",
                  primaryEmail: user?.emailAddresses[0]?.emailAddress ?? "",
                }}
              >
                <div className="flex items-center gap-2 text-white px-2 py-2 rounded-full font-black text-sm shadow-xl transition-all active:scale-95">
                  <Download size={18} /> Download PDF
                </div>
              </DownloadButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
