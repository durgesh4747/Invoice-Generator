"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  Trash2,
  Plus,
  LucideBanknote,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createInvoiceAction } from "@/app/actions/invoice";

type LineItem = {
  type: "Service" | "Product";
  description: string;
  quantity: string;
  price: string;
};

interface Client {
  id: number;
  name: string;
  email: string;
}

export default function GenerateInvoice({
  savedClients = [],
}: {
  savedClients?: Client[];
}) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const clientId = searchParams.get("clientId");
  const preSelectedClient = clientId
    ? savedClients.find((c) => c.id === Number(clientId))
    : null;

  const [sender, setSender] = useState({ name: "", email: "" });
  const [client, setClient] = useState({
    name: preSelectedClient?.name || "",
    email: preSelectedClient?.email || "",
  });

  const [currency, setCurrency] = useState("USD");
  const [taxLabel, setTaxLabel] = useState("Tax");
  const [taxRate, setTaxRate] = useState("0");
  const [discount, setDiscount] = useState("0");

  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [items, setItems] = useState<LineItem[]>([
    { type: "Service", description: "", quantity: "1", price: "" },
  ]);

  // Math Logic
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) * Number(item.price) || 0),
    0,
  );
  const discountAmount = Number(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (Number(taxRate) / 100);
  const total = taxableAmount + taxAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(val);
  };

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    startTransition(async () => {
      await createInvoiceAction({
        fromName: sender.name,
        fromEmail: sender.email,
        clientName: client.name,
        clientEmail: client.email,
        currency,
        taxLabel,
        taxRate: Number(taxRate),
        discountAmount,
        issueDate,
        items,
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative">
      {/* Confirmation for submission */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-center">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Finalize Invoice?
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              This record will be permanent for audit integrity.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`mx-auto max-w-4xl bg-white border border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden transition-all ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="bg-blue-950 p-10 text-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">
              GetInv.
            </h1>
            <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-[0.2em]">
              New Invoice Generation
            </p>
          </div>
          <LucideBanknote size={32} className="text-blue-400" />
        </div>

        <div className="p-10">
          {/* Client and User Details */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <section>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                From (You)
              </h2>
              <div className="space-y-3">
                <input
                  placeholder="Your Name"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  value={sender.name}
                  onChange={(e) =>
                    setSender({ ...sender, name: e.target.value })
                  }
                />
                <input
                  placeholder="Your Email"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  value={sender.email}
                  onChange={(e) =>
                    setSender({ ...sender, email: e.target.value })
                  }
                />
              </div>
            </section>
            <section>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                To (Client)
              </h2>
              <div className="space-y-3">
                <input
                  placeholder="Client Name"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                />
                <input
                  placeholder="Client Email"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
              </div>
            </section>
          </div>

          {/* Currency, Tax and Discount row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                Tax Label
              </label>
              <input
                value={taxLabel}
                onChange={(e) => setTaxLabel(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
                placeholder="VAT/GST"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                Tax Rate %
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                Discount Amt
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
              />
            </div>
          </div>

          {/* ITems */}
          <section className="mb-10">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              Services & Products
            </h2>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-3 items-end border-b border-slate-50 pb-6 group"
                >
                  <div className="col-span-2">
                    <select
                      className="w-full border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                      value={item.type}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].type = e.target.value as any;
                        setItems(copy);
                      }}
                    >
                      <option>Service</option>
                      <option>Product</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <input
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].description = e.target.value;
                        setItems(copy);
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm text-center font-bold"
                      value={item.quantity}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].quantity = e.target.value;
                        setItems(copy);
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm font-bold text-right"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].price = e.target.value;
                        setItems(copy);
                      }}
                    />
                  </div>
                  <div className="col-span-2 flex justify-between items-center pl-4">
                    <span className="text-sm font-bold">
                      {formatCurrency(
                        Number(item.quantity) * Number(item.price) || 0,
                      )}
                    </span>
                    <button
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== idx))
                      }
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setItems([
                  ...items,
                  {
                    type: "Service",
                    description: "",
                    quantity: "1",
                    price: "",
                  },
                ])
              }
              className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Plus size={14} /> Add Line Item
            </button>
          </section>

          {/* Total */}
          <div className="flex justify-end pt-10 border-t border-slate-100">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {Number(discount) > 0 && (
                <div className="flex justify-between text-sm text-red-500 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(Number(discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-500">
                <span>
                  {taxLabel} ({taxRate}%)
                </span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t-2 border-slate-900 text-xl font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              disabled={isPending}
              onClick={() => setShowConfirm(true)}
              className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Generate & Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
