"use client";

import { useTransition } from "react";
import { Archive, Loader2 } from "lucide-react";
import { archiveClientAction } from "@/app/actions/clients";

export default function ClientArchiveButton({
  clientId,
}: {
  clientId: number;
}) {
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    if (confirm("Archive this client?")) {
      startTransition(async () => {
        await archiveClientAction(clientId);
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
