import type { CreateFlagPayload, FeatureFlag } from "../flags.types";
import { api } from "@/lib/api";

export async function fetchFlagsApi(): Promise<FeatureFlag[]> {
  return api.get<FeatureFlag[]>("/feature/flags", {
    cache: "no-store",
  });
}

export async function createFlagApi(
  payload: CreateFlagPayload,
): Promise<FeatureFlag> {
  return api.post<FeatureFlag>("/feature/flags", payload);
}
