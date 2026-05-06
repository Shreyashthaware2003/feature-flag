import type { ReactNode } from "react";
import RootLayout from "@/layout/RootLayout";
import AuthGuard from "@/modules/auth/AuthGuard";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <RootLayout title="Feature Flag Dashboard">{children}</RootLayout>
    </AuthGuard>
  );
}
