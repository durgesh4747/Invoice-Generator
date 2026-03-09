"use client";

import { useRouter } from "next/navigation";

import React from "react";
import { useGlobalLoader } from "../GlobalLoader";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function RedirectButton({
  href,
  children,
  className,
}: NavButtonProps) {
  const { setIsGlobalLoading } = useGlobalLoader();
  const router = useRouter();

  const handleNavigation = () => {
    setIsGlobalLoading(true);

    router.push(href);

    setTimeout(() => setIsGlobalLoading(false));
  };

  return (
    <button onClick={handleNavigation} className={className}>
      {children}
    </button>
  );
}
