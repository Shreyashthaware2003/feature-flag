import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RefreshPayload,
  SignupPayload,
} from "../auth.types";
import { api } from "@/lib/api";

export async function signupApi(payload: SignupPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/signup", payload);
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", payload);
}

export async function refreshApi(payload: RefreshPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/refresh", payload);
}

export async function meApi(accessToken: string): Promise<AuthUser> {
  return api.get<AuthUser>("/auth/me", {
    token: accessToken,
    cache: "no-store",
  });
}

export async function logoutApi(accessToken: string): Promise<{ message: string }> {
  return api.post<{ message: string }>("/auth/logout", undefined, {
    token: accessToken,
  });
}
