"use client";

import Link from "next/link";
import { Plus, FileText, ExternalLink } from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  issueDate: Date;
  status?: "PAID" | "PENDING" | "OVERDUE";
  client: {
    id: number;
    name: string;
    email: string | null;
  };
}

export default function DashboardUI({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Manage and track your business billing.
            </p>
          </div>

          <Link
            href="/generateInvoice"
            className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Invoice
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-2 md:grid-cols-5 border-b border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Invoice</span>
            <span className="hidden md:block">Client</span>
            <span className="hidden md:block text-center">Status</span>
            <span className="text-right md:text-left">Amount</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Body */}
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                <FileText size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No invoices yet
              </h3>
              <p className="text-slate-500 mt-1 max-w-xs">
                Create your first professional invoice to see it appear here in
                your dashboard.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-2 md:grid-cols-5 items-center px-6 py-5 text-sm transition-colors hover:bg-slate-50/80 group"
                >
                  {/* ID & Number */}
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      #{invoice.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400 md:hidden">
                      {invoice.client.name}
                    </span>
                  </div>

                  {/* Client Info (Desktop) */}
                  <div className="hidden md:flex flex-col">
                    <span className="font-semibold text-slate-700">
                      {invoice.client.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {invoice.client.email}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="hidden md:flex justify-center">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase">
                      Paid
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="text-right md:text-left">
                    <span className="font-black text-slate-900">
                      ₹{invoice.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                    >
                      View <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
