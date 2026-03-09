"use client";

import { useState, useTransition } from "react";
import { saveClientAction } from "@/app/actions/clients";
import { Loader2, UserPlus } from "lucide-react";

export default function AddClientForm() {
  const [isPending, startTransition] = useTransition();
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    country: "",
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;

    startTransition(async () => {
      await saveClientAction(newClient);
      setNewClient({ name: "", email: "", country: "" });
    });
  };

  return (
    <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 transition-all">
      <div className="flex items-center justify-center md:justify-normal gap-3 mb-2">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
          <UserPlus size={18} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
          Add New Client
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <input
          placeholder="Full Name"
          value={newClient.name}
          className="border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
        />
        <input
          placeholder="Email Address"
          value={newClient.email}
          className="border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          onChange={(e) =>
            setNewClient({ ...newClient, email: e.target.value })
          }
        />
        <select
          value={newClient.country}
          className="border border-slate-200 p-3 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          onChange={(e) =>
            setNewClient({ ...newClient, country: e.target.value })
          }
        >
          <option value="">Select Region</option>
          <option value="United States">United States</option>
          <option value="Germany">Germany</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="India">India</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAddClient}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            "Save Client"
          )}
        </button>
      </div>
    </div>
  );
}
