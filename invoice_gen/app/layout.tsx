import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LoaderProvider } from "@/components/GlobalLoader";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetInv | Generate Professional Invoices",
  description:
    "The fastest way to generate, manage, and download professional invoices for free.",
  openGraph: {
    title: "GetInv",
    description: "Professional Invoice Generator for modern businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <ClerkProvider afterSignOutUrl="/">
          <Suspense fallback={<div className="fixed inset-0 bg-white" />}>
            <LoaderProvider>
              <Navbar />
              {children}
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
              <Footer />
            </LoaderProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
