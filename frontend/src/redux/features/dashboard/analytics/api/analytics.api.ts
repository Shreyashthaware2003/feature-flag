import { api } from "@/lib/api";
import type { ActivityItem, AnalyticsSummary } from "../analytics.types";

export async function fetchSummaryApi(
  accessToken: string,
): Promise<AnalyticsSummary> {
  return api.get<AnalyticsSummary>("/analytics/summary", {
    token: accessToken,
    cache: "no-store",
  });
}

export async function fetchActivityApi(
  accessToken: string,
): Promise<ActivityItem[]> {
  return api.get<ActivityItem[]>("/analytics/activity", {
    token: accessToken,
    cache: "no-store",
  });
}
