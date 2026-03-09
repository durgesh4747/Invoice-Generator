"use client";

import {
  Plus,
  FileText,
  ExternalLink,
  PencilLine,
  ChevronRight,
} from "lucide-react";
import { useGlobalLoader } from "../GlobalLoader";
import { useRouter } from "next/navigation";
import InvoiceRestoreButton from "./InvoiceRestoreButton";
import ArchiveInvoiceButton from "./InvoiceArchiveButton";

interface Invoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  amountPaid: number;
  currency: string;
  issueDate: Date;
  status: string;
  client?: {
    name: string | null;
    email: string | null;
  } | null;
  clientName: string | null;
  clientEmail: string | null;
}

export default function DashboardUI({
  invoices,
  archivedInvoices,
}: {
  invoices: Invoice[];
  archivedInvoices: Invoice[];
}) {
  const { setIsGlobalLoading } = useGlobalLoader();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsGlobalLoading(true);
    router.push(href);
    setTimeout(() => setIsGlobalLoading(false), 2000);
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case "USD":
        return "$";
      case "INR":
        return "₹";
      case "GBP":
        return "£";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
              Dashboard<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Manage and track your business billing.
            </p>
          </div>

          <button
            onClick={() => handleNavigation("/generateInvoice")}
            className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-slate-900 hover:-translate-y-0.5 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Plus size={18} /> New Invoice
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-3xl md:rounded-4xl border border-slate-200 bg-white shadow-sm">
          {/* Header Grid - 6 Columns on Desktop */}
          <div className="grid grid-cols-3 md:grid-cols-6 border-b border-slate-100 bg-slate-50/50 px-4 md:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Invoice</span>
            <span className="hidden md:block">Client</span>
            <span className="hidden md:block text-center">Status</span>
            <span className="text-right md:text-left">Total</span>
            <span className="hidden md:block">Paid</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Body */}
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-300">
                <FileText size={48} />
              </div>
              <h3 className="text-xl font-black text-slate-900 italic">
                No invoices found
              </h3>
              <p className="text-slate-400 mt-2 max-w-xs text-sm font-medium">
                Start by creating your first global invoice.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-3 md:grid-cols-6 items-center px-4 md:px-8 py-6 text-sm transition-colors hover:bg-slate-50/50 group"
                >
                  {/* ID & Number Section */}
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      #{invoice.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold md:hidden mt-1 uppercase truncate">
                      {invoice.client?.name || invoice.clientName || "Manual"}
                    </span>
                  </div>

                  {/* Client Info (Desktop Only) */}
                  <div className="hidden md:flex flex-col">
                    <span className="font-bold text-slate-700 truncate">
                      {invoice.client?.name || invoice.clientName || "N/A"}
                    </span>
                  </div>

                  {/* Status Badge (Desktop Only) */}
                  <div className="hidden md:flex justify-center">
                    <span
                      className={`rounded-xl px-3 py-1 text-[9px] font-black border uppercase tracking-wider ${
                        invoice.status === "PAID"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : invoice.status === "VOID"
                            ? "text-slate-400 bg-slate-100 border-slate-200"
                            : "text-amber-500 bg-amber-50 border-amber-100"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="text-right md:text-left">
                    <span className="font-black text-slate-900 text-sm md:text-base">
                      {getCurrencySymbol(invoice.currency)}
                      {invoice.totalAmount.toLocaleString()}
                    </span>
                    {/* Paid Info - Mobile View*/}
                    <div className="md:hidden text-[9px] font-bold text-emerald-600 mt-0.5">
                      Paid: {getCurrencySymbol(invoice.currency)}
                      {invoice.amountPaid.toLocaleString()}
                    </div>
                  </div>

                  {/* Paid Info - Desktop View */}
                  <div className="hidden md:block">
                    <span
                      className={`font-bold text-slate-500 `}
                    >
                      {getCurrencySymbol(invoice.currency)}
                      {invoice.amountPaid.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center gap-1 md:gap-2">
                    {invoice.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleNavigation(
                            `/generateInvoice/edit/${invoice.id}`,
                          )
                        }
                        className="p-1.5 md:p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <PencilLine size={16} />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleNavigation(`/invoices/${invoice.id}`)
                      }
                      className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <ArchiveInvoiceButton invoiceId={Number(invoice.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Archive Section*/}
        {archivedInvoices && archivedInvoices.length > 0 && (
          <div className="mt-12">
            <details className="group">
              <summary className="cursor-pointer text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all list-none flex items-center gap-2">
                <ChevronRight
                  size={14}
                  className="group-open:rotate-90 transition-transform"
                />
                Archive Bin ({archivedInvoices.length})
              </summary>

              <div className="mt-4 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                <div className="divide-y divide-slate-50">
                  {archivedInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600">
                          #{invoice.invoiceNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {invoice.clientName || "Manual"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-400">
                          {getCurrencySymbol(invoice.currency)}
                          {invoice.totalAmount.toLocaleString()}
                        </span>
                        <InvoiceRestoreButton invoiceId={Number(invoice.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
