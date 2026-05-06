"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthState, fetchMe } from "@/redux/features/auth/auth.slice";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { accessToken, user, meStatus } = useAppSelector((state) => state.auth);
  const effectiveToken = accessToken ?? getStoredAccessToken();

  useEffect(() => {
    if (!effectiveToken) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!user && meStatus === "idle") {
      void dispatch(fetchMe({ accessToken: effectiveToken }));
    }
  }, [dispatch, effectiveToken, meStatus, pathname, router, user]);

  useEffect(() => {
    if (meStatus !== "failed") return;
    dispatch(clearAuthState());
    router.replace("/auth/login");
  }, [dispatch, meStatus, router]);

  if (!effectiveToken) return null;
  if (!user && meStatus === "loading") return null;

  return <>{children}</>;
}
