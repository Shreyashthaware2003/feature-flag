"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearLatestCreatedKey,
  createAccessKey,
  fetchAccessKeys,
  revokeAccessKey,
} from "@/redux/features/dashboard/access-keys/access-keys.slice";
import { toast } from "sonner";

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatTime(value: string | null): string {
  if (!value) return "-";
  return new Date(value)
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .replace(/\s/g, "")
    .toLowerCase();
}

function formatMaskedKey(prefix: string, last4: string): string {
  const start = prefix.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3) || "key";
  return `${start}....${last4}`;
}

export default function AccessKeysPanel() {
  const dispatch = useAppDispatch();
  const { items, latestCreatedKey, listStatus, createStatus, revokeStatus, error } =
    useAppSelector((state) => state.dashboard.accessKeys);
  const [newKeyName, setNewKeyName] = useState("");

  useEffect(() => {
    void dispatch(fetchAccessKeys());
  }, [dispatch]);

  const handleGenerate = async () => {
    const action = await dispatch(
      createAccessKey({
        name: newKeyName.trim() || undefined,
      }),
    );

    if (createAccessKey.fulfilled.match(action)) {
      setNewKeyName("");
      toast.success("Access key generated");
      return;
    }
    toast.error(action.error.message ?? "Failed to generate access key");
  };

  const handleCopy = async () => {
    if (!latestCreatedKey?.accessKey) return;

    try {
      await navigator.clipboard.writeText(latestCreatedKey.accessKey);
      toast.success("Access key copied");
    } catch {
      toast.error("Copy failed. Please copy manually.");
    }
  };

  const handleRevoke = async (id: string) => {
    const action = await dispatch(revokeAccessKey(id));
    if (revokeAccessKey.fulfilled.match(action)) {
      toast.success("Access key revoked");
      return;
    }
    toast.error(action.error.message ?? "Failed to revoke access key");
  };

  const isBusy = createStatus === "loading" || revokeStatus === "loading";

  return (
    <Card className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            Access Keys
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and share consumer access keys securely. Keys are shown
            once at creation time.
          </p>
        </div>
        <Button onClick={() => void dispatch(fetchAccessKeys())} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={newKeyName}
          onChange={(event) => setNewKeyName(event.target.value)}
          placeholder="Key name (example: B2B Healthcare App)"
          className="h-9"
        />
        <Button onClick={() => void handleGenerate()} disabled={isBusy}>
          {createStatus === "loading" ? "Generating..." : "Generate Access Key"}
        </Button>
      </div>

      {latestCreatedKey && (
        <div className="rounded-md border border-blue-400/40 bg-blue-50 p-3 dark:bg-blue-950/30">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Save this access key now. It will not be shown again.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="max-w-full overflow-x-auto rounded bg-blue-100/70 px-2 py-1 text-xs text-blue-900 dark:bg-blue-900/40 dark:text-blue-100">
              {latestCreatedKey.accessKey}
            </code>
            <Button size="sm" variant="outline" onClick={() => void handleCopy()}>
              Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch(clearLatestCreatedKey())}
            >
              Hide
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3 md:hidden">
        {listStatus === "loading" &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`keys-mobile-skeleton-${index}`}
              className="space-y-2 rounded-md border border-border p-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}

        {listStatus !== "loading" &&
          items.map((key) => (
            <div
              key={`mobile-${key.id}`}
              className="space-y-2 rounded-md border border-border bg-background/50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{key.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMaskedKey(key.prefix, key.last4)}
                  </p>
                </div>
                <Badge
                  className={
                    key.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {key.isActive ? "Active" : "Revoked"}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Created: {formatDate(key.createdAt)} {formatTime(key.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Revoked: {formatDate(key.revokedAt)} {formatTime(key.revokedAt)}
              </p>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => void handleRevoke(key.id)}
                disabled={isBusy || !key.isActive}
              >
                Revoke
              </Button>
            </div>
          ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-border md:block">
        {listStatus === "loading" && (
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`keys-skeleton-${index}`} className="grid grid-cols-7 gap-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        )}
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 font-medium text-muted-foreground">Name</th>
              <th className="px-3 py-2 font-medium text-muted-foreground">Key</th>
              <th className="px-3 py-2 font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 font-medium text-muted-foreground">Created</th>
              <th className="px-3 py-2 font-medium text-muted-foreground">Revoked At</th>
              <th className="px-3 py-2 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((key) => (
              <tr key={key.id} className="border-t border-border">
                <td className="px-3 py-3 font-medium text-foreground">{key.name}</td>
                <td className="px-3 py-3 text-muted-foreground">
                  {formatMaskedKey(key.prefix, key.last4)}
                </td>
                <td className="px-3 py-3">
                  <Badge
                    className={
                      key.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {key.isActive ? "Active" : "Revoked"}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {formatDate(key.createdAt)} {formatTime(key.createdAt)}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {formatDate(key.revokedAt)} {formatTime(key.revokedAt)}
                </td>
                <td className="px-3 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleRevoke(key.id)}
                    disabled={isBusy || !key.isActive}
                  >
                    Revoke
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {items.length === 0 && listStatus !== "loading" && !error && (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          No access keys yet. Generate one and share it with consumer apps.
        </div>
      )}
    </Card>
  );
}
