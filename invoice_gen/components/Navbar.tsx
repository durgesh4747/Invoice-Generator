"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-around px-2">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-slate-900">
            GetInv<span className="text-blue-600">.</span>
          </Link>
        </div>
        <div>
          <nav className="hidden md:flex items-center gap-6">
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-white p-3 rounded-3xl hover:bg-blue-500"
              >
                Dashboard
              </Link>
              <Link
                href="/generateInvoice"
                className="text-sm font-medium text-slate-600 hover:text-white p-3 rounded-3xl hover:bg-blue-500 flex items-center gap-1"
              >
                Create Invoice
              </Link>
            </Show>

            <a
              href="https://durgeshdev.in/"
              target="_blank"
              className="text-sm font-medium text-slate-500 hover:text-white p-3 rounded-3xl hover:bg-blue-500 flex items-center gap-1 transition-colors"
            >
              Developer <ExternalLink size={14} />
            </a>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 shadow-sm transition-all cursor-pointer">
                Get started
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: { avatarBox: "h-9 w-9 border border-slate-200" },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}
