export type AnalyticsSummary = {
  totalFlags: number;
  liveRollouts: number;
  evaluationsToday: number;
};

export type ActivityItem = {
  id: string;
  eventType: string;
  flagKey: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type AnalyticsState = {
  summary: AnalyticsSummary | null;
  activity: ActivityItem[];
  summaryStatus: "idle" | "loading" | "succeeded" | "failed";
  activityStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
