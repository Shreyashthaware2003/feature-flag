"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAnalyticsActivity } from "@/redux/features/dashboard/analytics/analytics.slice";
import type { ActivityItem } from "@/redux/features/dashboard/analytics/analytics.types";

function labelForEvent(eventType: string): string {
  if (eventType.includes("create")) return "Created";
  if (eventType.includes("update")) return "Updated";
  if (eventType.includes("delete")) return "Deleted";
  if (eventType.includes("evaluate")) return "Evaluated";
  return "Activity";
}

function readableEventTitle(item: ActivityItem): string {
  const key = item.flagKey ?? "flag";
  switch (item.eventType) {
    case "create_flag":
      return `Created ${key}`;
    case "update_flag":
      return `Updated ${key}`;
    case "delete_flag":
      return `Deleted ${key}`;
    case "evaluate_flag":
      return `Evaluated ${key}`;
    default:
      return item.flagKey ? `${item.eventType} (${item.flagKey})` : item.eventType;
  }
}

function readableMeta(item: ActivityItem): string | null {
  const meta = item.metadata;
  if (!meta || typeof meta !== "object") return null;

  const enabled =
    typeof meta.enabled === "boolean" ? `enabled: ${String(meta.enabled)}` : null;
  const variant =
    typeof meta.variant === "string" && meta.variant.length > 0
      ? `variant: ${meta.variant}`
      : null;
  const rollout =
    typeof meta.rolloutPercentage === "number"
      ? `rollout: ${meta.rolloutPercentage}%`
      : null;

  const parts = [enabled, variant, rollout].filter(Boolean);
  return parts.length > 0 ? parts.join(" | ") : null;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  const day = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const time = date
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .replace(/\s/g, "")
    .toLowerCase();

  return `${day}, ${time}`;
}

export default function RecentActivity() {
  const dispatch = useAppDispatch();
  const { activity, activityStatus, error } = useAppSelector(
    (state) => state.dashboard.analytics,
  );

  useEffect(() => {
    if (activityStatus === "idle") {
      void dispatch(fetchAnalyticsActivity());
    }
  }, [activityStatus, dispatch]);

  return (
    <Card className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]">
      <div>
        <h2 className="text-base font-semibold text-card-foreground">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest tracking events from backend.
        </p>
      </div>

      {activityStatus === "loading" && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`activity-skeleton-${index}`} className="space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-72" />
              <Skeleton className="h-3 w-36" />
              {index < 3 && <Separator className="mt-3" />}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {activityStatus !== "loading" && activity.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          No activity yet. Create or evaluate a flag to see events.
        </p>
      )}

      <div className="space-y-4">
        {activity.slice(0, 8).map((item, index) => (
          <div key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {readableEventTitle(item)}
                </p>
                {readableMeta(item) && (
                  <p className="text-xs text-muted-foreground">{readableMeta(item)}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </p>
              </div>
              <Badge variant="outline">{labelForEvent(item.eventType)}</Badge>
            </div>
            {index < Math.min(activity.length, 8) - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
