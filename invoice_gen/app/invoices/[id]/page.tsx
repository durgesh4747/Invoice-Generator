import getInvoicebyID from "@/lib/getInvoicebyID";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DownloadButton from "@/components/DownloadPDFButton";

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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          {/*  Head */}
          <div className="bg-slate-900 px-8 py-10 text-white flex justify-between items-center">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                Invoice
              </p>
              <h1 className="text-3xl font-black">{invoice.invoiceNumber}</h1>
              <p className="text-slate-400 text-sm mt-2">
                Issued on{" "}
                {new Date(invoice.issueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Address */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Billed From
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {invoice.fromName}
                </p>
                <p className="text-sm text-slate-500">{invoice.fromEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Billed To
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {invoice.clientName}
                </p>
                <p className="text-sm text-slate-500">{invoice.clientEmail}</p>
              </div>
            </div>

            {/* Items  */}
            <div className="mb-10">
              <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-900 pb-4 text-xs font-black uppercase tracking-widest text-slate-900">
                {invoice.items.map((item) => (
                  <div className="col-span-6" key={item.id}>
                    {item.type}
                  </div>
                ))}
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>

              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 py-5 text-sm border-b border-slate-100 items-center"
                >
                  <div className="col-span-6">
                    <p className="font-semibold text-slate-800">
                      {item.description}
                    </p>
                  </div>
                  <div className="col-span-2 text-center text-slate-500">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-slate-500">
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>
                  <div className="col-span-2 text-right font-bold text-slate-900">
                    ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calci */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">
                    ₹{invoice.subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">GST (18%)</span>
                  <span className="text-slate-900 font-bold">
                    ₹{invoice.taxAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-4">
                  <span className="text-base font-black uppercase tracking-tight text-slate-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{invoice.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <DownloadButton
                invoice={JSON.parse(JSON.stringify(invoice))}
                user={{
                  fullName: user.fullName,
                  primaryEmail: user.emailAddresses[0].emailAddress,
                }}
              >
                <Download size={18} /> Download PDF
              </DownloadButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
