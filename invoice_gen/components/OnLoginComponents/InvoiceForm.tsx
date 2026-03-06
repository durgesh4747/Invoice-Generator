"use client";

import { useState } from "react";

type LineItem = {
  description: string;
  quantity: string;
  price: string;
};

const GST_RATE = 0.18;

export default function GenerateInvoice() {
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: "1", price: "" },
  ]);

  function updateItem(index: number, field: keyof LineItem, value: string) {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    setItems(copy);
  }

  function addItem() {
    setItems([...items, { description: "", quantity: "1", price: "" }]);
  }

  /* ---------- UI Calculations ---------- */

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

  const gstAmount = subtotal * GST_RATE;
  const total = subtotal + gstAmount;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="mx-auto max-w-3xl bg-white p-8 border border-slate-200 shadow-sm rounded-3xl">
        <h1 className="text-2xl font-semibold text-slate-900 mb-8 flex justify-center">
          Create Invoice
        </h1>

        {/* CLIENT DETAILS */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-slate-600 mb-3">
            Client Details
          </h2>

          <input
            placeholder="Client Name"
            className="w-full border border-slate-300 rounded-md p-2 mb-3"
          />

          <input
            placeholder="Client Email"
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </section>

        {/* INVOICE META */}
        <section className="mb-8 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Invoice Number</label>
            <input
              value="INV-0001"
              disabled
              className="w-full border border-slate-200 rounded-md p-2 mt-1 bg-slate-50 text-slate-600"
            />
            <p className="text-xs text-slate-500 mt-1">Auto-generated</p>
          </div>

          <div>
            <label className="text-sm text-slate-600">Issue Date</label>
            <input
              type="date"
              className="w-full border border-slate-300 rounded-md p-2 mt-1"
            />
          </div>
        </section>

        {/* LINE ITEMS */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-slate-600 mb-3">
            Line Items
          </h2>

          {items.map((item, index) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const lineTotal = qty * price;

            return (
              <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-6">
                  <label className="text-xs text-slate-500">Item</label>
                  <input
                    className="w-full border border-slate-300 rounded-md p-2"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-slate-500">Qty</label>
                  <input
                    type="number"
                    step={1}
                    className="w-full border border-slate-300 rounded-md p-2"
                    value={item.quantity}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || Number(v) >= 1) {
                        updateItem(index, "quantity", v);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        updateItem(index, "quantity", "1");
                      }
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-slate-500">Price</label>
                  <input
                    type="number"
                    step={0.01}
                    className="w-full border border-slate-300 rounded-md p-2"
                    value={item.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || Number(v) >= 0) {
                        updateItem(index, "price", v);
                      }
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-slate-500">Total</label>
                  <input
                    disabled
                    value={lineTotal.toFixed(2)}
                    className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-700"
                  />
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addItem}
            className="text-sm text-slate-600 hover:text-slate-900 mt-2"
          >
            + Add another item
          </button>
        </section>

        {/* TOTALS */}
        <section className="mb-8 flex justify-end">
          <div className="w-full max-w-xs space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* ACTION */}
        <div className="flex justify-end">
          <button className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800">
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
