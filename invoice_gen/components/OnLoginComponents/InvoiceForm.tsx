"use client";

import { useState, useTransition } from "react";
import {
  Trash2,
  Plus,
  Loader2,
  Save,
  Send,
  Info,
  CreditCard,
} from "lucide-react";
import { createInvoiceAction } from "@/app/actions/invoice";
import { useSearchParams } from "next/navigation";
import { InvoiceItem, InvoicePayload, SavedClient } from "@/types";

export default function GenerateInvoice({
  userData,
  savedClients,
  initialData,
}: {
  userData: { name: string; email: string };
  savedClients: SavedClient[];
  initialData?: InvoicePayload;
}) {
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initial State Logic
  const clientIdFromUrl = searchParams.get("clientId");
  const preSelected = clientIdFromUrl
    ? savedClients.find((c) => c.id === Number(clientIdFromUrl))
    : null;

  const [sender, setSender] = useState({
    name: initialData?.fromName || userData.name || "",
    email: initialData?.fromEmail || userData.email || "",
  });

  const [clientData, setClientData] = useState({
    name:
      initialData?.clientName ||
      preSelected?.name ||
      searchParams.get("name") ||
      "",
    email:
      initialData?.clientEmail ||
      preSelected?.email ||
      searchParams.get("email") ||
      "",
    region:
      initialData?.clientRegion ||
      preSelected?.country ||
      searchParams.get("region") ||
      "",
  });

  const [status, setStatus] = useState(initialData?.status || "PENDING");
  const [discount, setDiscount] = useState(
    initialData?.discountAmount?.toString() || "0",
  );
  const [taxRate, setTaxRate] = useState(
    initialData?.taxRate?.toString() || "0",
  );
  const [taxLabel, setTaxLabel] = useState(initialData?.taxLabel || "VAT");
  const [amountPaid, setAmountPaid] = useState(
    initialData?.amountPaid?.toString() || "0",
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [currency, setCurrency] = useState(initialData?.currency || "USD");

  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate
      ? new Date(initialData.issueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0],
  );

  const [items, setItems] = useState(
    initialData?.items || [
      { type: "Service", description: "", quantity: "1", price: "" },
    ],
  );

  const addItem = () =>
    setItems([
      ...items,
      { type: "Service", description: "", quantity: "1", price: "" },
    ]);
  const removeItem = (index: number) =>
    setItems(items.filter((_: unknown, i: number) => i !== index));
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as unknown as Record<string, string>)[field as string] =
      value;
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum: number, item: InvoiceItem) =>
      sum + (Number(item.quantity) * Number(item.price) || 0),
    0,
  );

  const totalAmount =
    (subtotal - Number(discount)) * (1 + Number(taxRate) / 100);
  const balanceDue = totalAmount - Number(amountPaid);

  const symbol =
    currency === "USD"
      ? "$"
      : currency === "GBP"
        ? "£"
        : currency === "EUR"
          ? "€"
          : "₹";

  const handleSubmit = (isDraftMode: boolean, forceSubmit = false) => {
    const invoiceNumber = initialData?.invoiceNumber || "";
    if (
      !sender.name.trim() ||
      !clientData.name.trim() ||
      items.some((item) => !item.description.trim())
    ) {
      alert(
        "Required Fields Missing: Please ensure your name, client name, and item descriptions are filled out.",
      );
      return;
    }
    if (status === "PAID" && balanceDue > 0 && !forceSubmit) {
      setShowBalanceWarning(true);
      return;
    }

    if (isDraftMode) setIsSavingDraft(true);
    else setIsGenerating(true);

    startTransition(async () => {
      try {
        const payload: InvoicePayload = {
          id: initialData?.id,
          fromName: sender.name,
          fromEmail: sender.email,
          clientName: clientData.name,
          clientEmail: clientData.email,
          clientRegion: clientData.region,
          items: items.map((item) => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
          })),
          currency,
          taxRate: Number(taxRate),
          taxLabel,
          discountAmount: Number(discount),
          amountPaid: Number(amountPaid),
          notes,
          invoiceNumber: invoiceNumber,
          subtotal: subtotal,
          totalAmount: totalAmount,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          status: status as "PAID" | "PENDING",
        };

        await createInvoiceAction(payload);
      } finally {
        setIsSavingDraft(false);
        setIsGenerating(false);
        setShowBalanceWarning(false);
      }
    });
  };
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-center tracking-tighter italic">
              GetInv<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {initialData
                ? `Editing Draft: #${initialData.invoiceNumber}`
                : `Create professional Invoices for your Business.`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  From (You)
                </h3>
                <input
                  value={sender.name}
                  onChange={(e) =>
                    setSender({ ...sender, name: e.target.value })
                  }
                  placeholder="Your Name"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                />
                <input
                  value={sender.email}
                  onChange={(e) =>
                    setSender({ ...sender, email: e.target.value })
                  }
                  placeholder="Your Email"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  Bill To
                </h3>
                <input
                  value={clientData.name}
                  onChange={(e) =>
                    setClientData({ ...clientData, name: e.target.value })
                  }
                  placeholder="Client Name"
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={clientData.email}
                    onChange={(e) =>
                      setClientData({ ...clientData, email: e.target.value })
                    }
                    placeholder="Client Email"
                    className="p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                  />
                  <input
                    value={clientData.region}
                    onChange={(e) =>
                      setClientData({ ...clientData, region: e.target.value })
                    }
                    placeholder="Region"
                    className="p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none text-sm"
                />
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-yellow-600 outline-none text-sm"
                />
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                  Invoice Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "PAID" | "PENDING")
                  }
                  className="w-full bg-transparent font-bold outline-none text-sm text-slate-900 cursor-pointer"
                >
                  <option value="PENDING">Mark as Pending</option>
                  <option value="PAID">Mark as Paid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 p-6 bg-blue-50/50 rounded-4xl border border-blue-100">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                  Tax Label
                </label>
                <input
                  value={taxLabel}
                  onChange={(e) => setTaxLabel(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none"
                />
              </div>
              <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                <label className="text-[10px] font-black text-emerald-600 uppercase block mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full bg-transparent font-bold text-emerald-700 outline-none"
                />
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">
                Line Items
              </h3>
              <div className="space-y-4">
                {items.map((item: InvoiceItem, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col md:grid md:grid-cols-12 gap-4 p-5 md:p-6 bg-slate-50 md:bg-white rounded-3xl border border-slate-100"
                  >
                    <div className="md:col-span-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                        Type
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateItem(index, "type", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="Service">Service</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>
                    <div className="md:col-span-5">
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                        Description
                      </label>
                      <input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none"
                      />
                    </div>
                    <div className="flex gap-4 md:col-span-3">
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                          Qty
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-center outline-none"
                        />
                      </div>
                      <div className="flex-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                          Price
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(index, "price", e.target.value)
                          }
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                      <span className="font-bold text-slate-900">
                        {symbol}
                        {(
                          Number(item.quantity) * Number(item.price)
                        ).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-6 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest"
              >
                <Plus size={14} /> Add Line Item
              </button>
            </div>

            <div className="mb-10">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 px-1">
                Notice / Payment Terms
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-6 bg-slate-50 border-none rounded-4xl text-sm h-32 outline-none resize-none"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-8  ">
                <div className="flex gap-4 text-slate-900 text-sm">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Info size={18} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col justify-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Total Amount
                    </span>
                    <span className="text-xl font-black">
                      {symbol}
                      {totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                {Number(amountPaid) > 0 && (
                  <div className="flex items-center gap-4 text-emerald-700 text-sm">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                      <CreditCard size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-emerald-400 uppercase">
                        Balance Due
                      </span>
                      <span className="text-xl font-black">
                        {symbol}
                        {balanceDue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Button */}
              <div className="flex justify-end w-full md:w-auto">
                {status === "PENDING" ? (
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isSavingDraft || isGenerating}
                    className="w-full md:w-64 px-8 py-4 rounded-2xl font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingDraft ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Save size={18} />
                        {initialData ? "Update Draft" : "Save Draft"}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSavingDraft || isGenerating}
                    className="w-full md:w-80 px-12 py-5 bg-slate-900 text-white rounded-4xl font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={18} />
                        Finalize & Save Record
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showBalanceWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <Info size={24} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 italic tracking-tight">
                Unpaid Balance Detected!
              </h2>
            </div>

            <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-8">
              You are marking this as{" "}
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                Paid
              </span>
              , but there is still
              <span className="font-black text-slate-900">
                {" "}
                {symbol}
                {balanceDue.toLocaleString()}
              </span>{" "}
              left as due amount. Once finalized, you won&apos;t be able to
              change these details. Would you like to save it as a draft
              instead?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setStatus("PENDING");
                  setShowBalanceWarning(false);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm  shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                Save as Draft for Now
              </button>

              <button
                onClick={() => handleSubmit(false, true)}
                className="w-full group py-4 bg-white text-red-700 rounded-2xl font-bold text-xs border-black border hover:text-red-900 transition-all"
              >
                Finalize & Save Anyways
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
