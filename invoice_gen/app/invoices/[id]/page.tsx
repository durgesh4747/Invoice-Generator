import getInvoicebyID from "@/lib/getInvoicebyID";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>; // The params are passed as a promise, so we need to await it to get the actual id value.
}) {
  const { id } = await params;

  const invoiceId = Number(id);

  if (!Number.isInteger(invoiceId)) {
    return redirect("/dashboard");
  }
  const user = await currentUser();
  if (!user) {
    return redirect("/login");
  }
  const invoice = await getInvoicebyID(invoiceId);
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm border border-slate-200">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Issued on {invoice.issueDate.toDateString()}
            </p>
          </div>

          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 hover:cursor-pointer">
            Download PDF
          </button>
        </div>

        <div className="flex justify-start">
          {/* CLIENT INFO */}
          <div className="mb-8 px-3">
            <p className="text-sm text-slate-500">Billed From</p>
            <p className="text-base text-slate-900">{user.fullName}</p>
            <p className="text-sm text-slate-600">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
          {/* CLIENT INFO */}
          <div className="mb-8 px-3">
            <p className="text-sm text-slate-500">Billed To</p>
            <p className="text-base text-slate-900">{invoice.client.name}</p>
            <p className="text-sm text-slate-600">{invoice.client.email}</p>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-4 border-b border-slate-200 pb-2 text-sm font-medium text-slate-600">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* ITEM ROW */}
          {invoice.items.map((item) => {
            return (
              <div key={item.id}>
                <ul className="grid grid-cols-12 gap-4 py-3 text-sm border-b border-slate-100">
                  <li className="col-span-6 text-slate-800">
                    {item.description}
                  </li>
                  <li className="col-span-2 text-right">{item.quantity}</li>
                  <li className="col-span-2 text-right">{item.price}</li>
                  <li className="col-span-2 text-right">{item.price}</li>
                </ul>
              </div>
            );
          })}

          {/* TOTAL */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{invoice.totalAmount}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹1,440</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>₹9,440</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
