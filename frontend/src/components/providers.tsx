"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/redux/provider";
import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
