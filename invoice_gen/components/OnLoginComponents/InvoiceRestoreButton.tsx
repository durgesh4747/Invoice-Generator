"use client";

import { useTransition } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { unarchiveInvoiceAction } from "@/app/actions/invoice";

export default function InvoiceRestoreButton({ invoiceId }: { invoiceId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => unarchiveInvoiceAction(invoiceId))}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-green-600 transition-colors flex items-center gap-2 text-xs font-bold"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
      Restore
    </button>
  );
}