import type {
  CreateFlagPayload,
  FeatureFlag,
  UpdateFlagPayload,
} from "../flags.types";
import { api } from "@/lib/api";

export async function fetchFlagsApi(accessToken: string): Promise<FeatureFlag[]> {
  return api.get<FeatureFlag[]>("/feature/flags", {
    token: accessToken,
    cache: "no-store",
  });
}

export async function createFlagApi(
  accessToken: string,
  payload: CreateFlagPayload,
): Promise<FeatureFlag> {
  return api.post<FeatureFlag>("/feature/flags", payload, {
    token: accessToken,
  });
}

export async function updateFlagApi(
  accessToken: string,
  id: string,
  payload: UpdateFlagPayload,
): Promise<FeatureFlag> {
  return api.patch<FeatureFlag>(`/feature/flags/${id}`, payload, {
    token: accessToken,
  });
}

export async function deleteFlagApi(
  accessToken: string,
  id: string,
): Promise<{ affected?: number }> {
  return api.delete<{ affected?: number }>(`/feature/flags/${id}`, {
    token: accessToken,
  });
}
