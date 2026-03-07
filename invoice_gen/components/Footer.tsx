import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { Github, Linkedin, ExternalLink, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Detaild */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-slate-900">
              GetInv<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 max-w-xs leading-relaxed">
              High-performance invoicing for modern freelancers. Built with
              Next.js 16 and Prisma in Vadodara.
            </p>
            <div className="mt-6 flex gap-4 text-slate-400">
              <a
                href="https://github.com/durgesh4747"
                target="_blank"
                className="hover:text-slate-900 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://in.linkedin.com/in/durgesh-sutariya-929b82333"
                target="_blank"
                className="hover:text-slate-900 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:durgeshsutariya07@gmail.com"
                className="hover:text-slate-900 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <Show when="signed-in">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-slate-500 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/generateInvoice"
                    className="text-sm text-slate-500 hover:text-blue-600"
                  >
                    Create Invoice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clients"
                    className="text-sm text-slate-500 hover:text-blue-600"
                  >
                    Manage Clients
                  </Link>
                </li>
              </Show>
              <Show when="signed-out">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-slate-500 hover:text-blue-600"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-slate-500 hover:text-blue-600"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-500 hover:text-blue-600 font-medium"
                  >
                    Get Started
                  </a>
                </li>
              </Show>
            </ul>
          </div>

          {/* Developer Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Developer
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://durgeshdev.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  My Portfolio <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://durgeshdev.in/vault/invoice-generation-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-blue-600"
                >
                  About Project
                </a>
              </li>
              <li>
                <a
                  href="https://durgeshdev.in/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-blue-600"
                >
                  Let&apos;s Connect
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} GetInv. Created by Durgesh.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-600">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
