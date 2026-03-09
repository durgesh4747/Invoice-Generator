"use client";

import { Loader2 } from "lucide-react";
import { InvoicePDF } from "./InvoicePDF";
import dynamic from "next/dynamic";
import { InvoicePayload } from "@/types";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button className="inline-flex items-center gap-2 bg-slate-900/50 text-white px-8 py-4 rounded-2xl font-bold opacity-50 cursor-not-allowed">
        <Loader2 className="animate-spin" size={18} /> Initializing...
      </button>
    ),
  },
);

interface UserProfile {
  name: string;
  email: string;
}

interface DownloadButtonProps {
  invoice: InvoicePayload;
  user: UserProfile;
  children: React.ReactNode;
}

export default function DownloadButton({
  invoice,
  user,
  children,
}: DownloadButtonProps) {
  // No need currently as ssr: false and import is safe without this it makes it better without the below redundancy.
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) return null;

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} user={user} />}
      fileName={`${invoice.invoiceNumber || "invoice"}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <div
          className={`inline-flex items-center gap-2 bg-slate-700 text-white px-8 py-2 hover:scale-105 rounded-2xl font-bold shadow-lg cursor-pointer ${loading ? "opacity-70" : ""}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Preparing...</span>
            </>
          ) : (
            children
          )}
        </div>
      )}
    </PDFDownloadLink>
  );
}
