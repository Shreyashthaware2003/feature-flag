"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAnalyticsSummary } from "@/redux/features/dashboard/analytics/analytics.slice";

export default function OverviewStats() {
  const dispatch = useAppDispatch();
  const { summary, summaryStatus, error } = useAppSelector(
    (state) => state.dashboard.analytics,
  );

  useEffect(() => {
    if (summaryStatus === "idle") {
      void dispatch(fetchAnalyticsSummary());
    }
  }, [dispatch, summaryStatus]);

  const stats = [
    { id: "overview", label: "Total Flags", value: summary?.totalFlags ?? 0 },
    { id: "flags", label: "Live Rollouts", value: summary?.liveRollouts ?? 0 },
    {
      id: "evaluate",
      label: "Evaluations Today",
      value: summary?.evaluationsToday ?? 0,
    },
    {
      id: "deploy",
      label: "Last Deploy",
      value: summaryStatus === "loading" ? "Loading..." : "N/A",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            id={stat.id}
            className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {summaryStatus === "loading" ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <p className="mt-2 text-2xl font-semibold text-card-foreground">
                {String(stat.value)}
              </p>
            )}
          </Card>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
