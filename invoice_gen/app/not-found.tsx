import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-blue-100 blur-3xl rounded-full opacity-50 scale-150" />
          <div className="relative p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
            <FileQuestion size={64} className="text-blue-600 animate-pulse" />
          </div>
        </div> 

        <div className="space-y-3">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">
            404<span className="text-blue-600">.</span>
          </h1>
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            The invoice or page you are looking for doesn&apos;t exist or has
            been moved to a different vault.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl hover:scale-105 active:scale-95 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </Link>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pt-8">
          GetInv Precision Invoicing System
        </p>
      </div>
    </div>
  );
}
