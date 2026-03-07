"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { InvoicePDF } from "./InvoicePDF";

export default function DownloadButton({ invoice, user }: any) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} user={user} />}
      fileName={`${invoice.invoiceNumber}.pdf`}
      className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95"
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          {loading ? "Preparing PDF..." : "Download PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
}
