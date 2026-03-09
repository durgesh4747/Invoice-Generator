"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface LoaderContextType {
  setIsGlobalLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      if (isGlobalLoading) {
        setIsGlobalLoading(false);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, [pathname, searchParams, isGlobalLoading]);

  return (
    <LoaderContext.Provider value={{ setIsGlobalLoading }}>
      {isGlobalLoading && (
        // Removed 'cursor-wait' from this div
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/40 backdrop-blur-[2px] transition-all">
          <div className="relative flex items-center justify-center">
            {/* Background Ring */}
            <div className="h-10 w-10 rounded-full border-[3px] border-slate-200" />
            {/* Animated Ring */}
            <div className="absolute h-10 w-10 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
          </div>

          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0);
              }
              to {
                transform: rotate(360deg);
              }
            }
            .animate-spin {
              animation: spin 0.8s linear infinite;
            }
          `}</style>
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(LoaderContext);
  if (!context)
    throw new Error("useGlobalLoader must be used within LoaderProvider");
  return context;
};
