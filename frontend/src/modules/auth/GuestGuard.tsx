"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAppSelector((state) => state.auth);
  const effectiveToken = accessToken ?? getStoredAccessToken();

  useEffect(() => {
    if (!effectiveToken) return;

    const next = searchParams.get("next");
    router.replace(next || "/dashboard/overview");
  }, [effectiveToken, router, searchParams]);

  if (effectiveToken) return null;
  return <>{children}</>;
}
