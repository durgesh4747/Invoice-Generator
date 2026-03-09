import {
  getArchivedClientsAction,
  getClientsAction,
} from "@/app/actions/clients";
import AddClientForm from "@/components/OnLoginComponents/AddClientForm";
import ClientArchiveButton from "@/components/OnLoginComponents/ClientArchiveButton";
import ClientRestoreButton from "@/components/OnLoginComponents/ClientRestoreButton";
import { User, Globe, ReceiptText } from "lucide-react";
import Link from "next/link";

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
export default async function ClientsPage() {
  const clients = await getClientsAction();
  const archivedClients = await getArchivedClientsAction();
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Head */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter ">
              GetInv <span className="italic">Directory</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your global network and track lifetime value.
            </p>
          </div>
        </div>
        {/* Add Client Section */}
        <AddClientForm />

        {/* 3. Client Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Region</th>
                <th className="px-8 py-5 text-center">Invoices</th>
                <th className="px-8 py-5 text-right">LTV (Billed)</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((client) => {
                return (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                          {client.name??"Client".charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
                        <Globe size={10} /> {client.country || "Global"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-bold text-slate-600">
                      {client.invoiceCount}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">
                      {getCurrencySymbol(client.invoiceCurrency)}
                      {client.totalBilled.toLocaleString("en-IN")}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/generateInvoice?clientId=${client.id}&name=${encodeURIComponent(client.name??"Client")}&email=${client.email}&region=${encodeURIComponent(client.country || "")}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                        >
                          <ReceiptText size={14} />
                          Bill Client
                        </Link>
                        <ClientArchiveButton clientId={client.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <User size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold">No clients in your directory yet.</p>
              <p className="text-xs">Start by adding one above!</p>
            </div>
          )}
        </div>
      </div>
      {archivedClients.length > 0 && (
        <details className="mt-12 group">
          <summary className="cursor-pointer text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all list-none flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform">▶</span>
            View Archived Clients ({archivedClients.length})
          </summary>

          <div className="mt-4 bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {archivedClients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-8 py-4 text-sm font-bold text-slate-600">
                      {client.name}
                    </td>
                    <td className="px-8 py-4 text-xs text-slate-400">
                      {client.email}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <ClientRestoreButton clientId={client.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
