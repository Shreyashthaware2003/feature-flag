import type { ReactNode } from "react";
import RootLayout from "@/layout/RootLayout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <RootLayout title="Feature Flag Dashboard">{children}</RootLayout>;
}
