"use client";

import { useTransition } from "react";
import { Archive, Loader2 } from "lucide-react";
import { archiveInvoiceAction } from "@/app/actions/invoice";

export default function ArchiveInvoiceButton({
  invoiceId,
}: {
  invoiceId: number;
}) {
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    if (confirm("Archive this Invoice?")) {
      startTransition(async () => {
        await archiveInvoiceAction(invoiceId);
      });
    }
  };

  return (
    <button
      onClick={handleArchive}
      disabled={isPending}
      className="p-2 text-slate-300 hover:text-amber-500 transition-colors"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Archive size={16} />
      )}
    </button>
  );
}
