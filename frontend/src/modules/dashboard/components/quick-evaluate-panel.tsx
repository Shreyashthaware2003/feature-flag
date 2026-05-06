"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearEvaluationError, evaluateFlag } from "@/redux/features/dashboard/evaluation/evaluation.slice";
import { fetchFlags } from "@/redux/features/dashboard/flags/flags.slice";
import { toast } from "sonner";

export default function QuickEvaluatePanel() {
  const dispatch = useAppDispatch();
  const { items: flags, fetchStatus } = useAppSelector((state) => state.dashboard.flags);
  const { result, status, error } = useAppSelector(
    (state) => state.dashboard.evaluation,
  );

  const [flagKey, setFlagKey] = useState("");
  const [userId, setUserId] = useState("user_123");
  const [country, setCountry] = useState("IN");

  useEffect(() => {
    if (fetchStatus === "idle") {
      void dispatch(fetchFlags());
    }
  }, [dispatch, fetchStatus]);

  const suggestedFlagKey = flags[0]?.flag_key ?? "";
  const resolvedFlagKey = flagKey.trim() || suggestedFlagKey;

  const canEvaluate = useMemo(() => {
    return resolvedFlagKey.trim().length > 0 && userId.trim().length > 0;
  }, [resolvedFlagKey, userId]);

  const handleEvaluate = async () => {
    if (!canEvaluate) {
      toast.error("Flag key and user ID are required.");
      return;
    }

    const payload = {
      flagKey: resolvedFlagKey.trim(),
      user: {
        id: userId.trim(),
        country: country.trim().toUpperCase(),
      },
    };

    const action = await dispatch(evaluateFlag(payload));
    if (evaluateFlag.fulfilled.match(action)) {
      toast.success("Evaluation completed.");
    } else {
      toast.error(action.error.message ?? "Evaluation failed");
    }
  };

  return (
    <Card
      id="evaluate"
      className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]"
    >
      <h2 className="text-base font-semibold text-card-foreground">
        Quick Evaluate
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Evaluate a real flag against backend decision engine.
      </p>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div>
          <Label className="mb-1 block text-xs font-medium text-muted-foreground">
            Flag Key
          </Label>
          <Input
            list="flag-keys"
            value={flagKey}
            placeholder={suggestedFlagKey || "Enter flag key (example: sidebar_enabled)"}
            onChange={(event) => {
              if (error) {
                dispatch(clearEvaluationError());
              }
              setFlagKey(event.target.value);
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
          <datalist id="flag-keys">
            {flags.map((flag) => (
              <option key={flag.id} value={flag.flag_key} />
            ))}
          </datalist>
          {flagKey.trim().length === 0 && suggestedFlagKey && (
            <p className="mt-1 text-xs text-muted-foreground">
              Using suggested flag key: <span className="font-medium">{suggestedFlagKey}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block text-xs font-medium text-muted-foreground">
              User ID
            </Label>
            <Input
              value={userId}
              onChange={(event) => {
                if (error) {
                  dispatch(clearEvaluationError());
                }
                setUserId(event.target.value);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs font-medium text-muted-foreground">
              Country
            </Label>
            <Input
              value={country}
              onChange={(event) => {
                if (error) {
                  dispatch(clearEvaluationError());
                }
                setCountry(event.target.value);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        {fetchStatus === "loading" && (
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {fetchStatus !== "loading" && flags.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
            No flags found yet. Create one from{" "}
            <Link href="/dashboard/flags" className="font-medium underline">
              Feature Flags
            </Link>{" "}
            page, or enter a flag key manually.
          </div>
        )}

        <Button
          onClick={() => void handleEvaluate()}
          className="w-full"
          disabled={status === "loading" || !canEvaluate}
        >
          {status === "loading" ? "Evaluating..." : "Evaluate Flag"}
        </Button>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {!result && status !== "failed" && (
          <div className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
            Run evaluation to see enabled, variant, and config output.
          </div>
        )}

        {result && (
          <div className="rounded-md border border-blue-500/40 bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-200">
            <p>enabled: {String(result.enabled)}</p>
            <p>variant: {result.variant ?? "default"}</p>
            {typeof result.reason === "string" && <p>reason: {result.reason}</p>}
            {result.config ? (
              <pre className="mt-2 overflow-x-auto rounded bg-blue-100/60 p-2 text-xs dark:bg-blue-900/20">
                {JSON.stringify(result.config, null, 2)}
              </pre>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
