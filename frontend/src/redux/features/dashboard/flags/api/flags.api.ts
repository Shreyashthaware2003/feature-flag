import type { CreateFlagPayload, FeatureFlag } from "../flags.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api/v1";

export async function fetchFlagsApi(): Promise<FeatureFlag[]> {
  const response = await fetch(`${API_BASE_URL}/feature/flags`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch flags (${response.status})`);
  }

  return (await response.json()) as FeatureFlag[];
}

export async function createFlagApi(
  payload: CreateFlagPayload,
): Promise<FeatureFlag> {
  const response = await fetch(`${API_BASE_URL}/feature/flags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create flag (${response.status})`);
  }

  return (await response.json()) as FeatureFlag;
}
