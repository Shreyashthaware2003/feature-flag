"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, Trash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteFlag,
  fetchFlags,
  updateFlag,
} from "@/redux/features/dashboard/flags/flags.slice";
import { toast } from "sonner";
import CreateFlagDialog from "./createFlagDialog";
import { FlagDetailsDialog } from "./flagDetailsDialog";
import { Switch } from "@/components/ui/switch";

export default function FeatureFlagsPanel() {
  const dispatch = useAppDispatch();
  const { items, fetchStatus, updateStatus, deleteStatus, error } =
    useAppSelector((state) => state.dashboard.flags);

  const [query, setQuery] = useState("");
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);

  useEffect(() => {
    void dispatch(fetchFlags());
  }, [dispatch]);

  const filteredFlags = items.filter((flag) => {
    const matchesQuery = flag.flag_key
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesEnabled = showOnlyEnabled ? flag.enabled : true;
    return matchesQuery && matchesEnabled;
  });

  const isBusy = updateStatus === "loading" || deleteStatus === "loading";

  const handleToggle = async (id: string, nextEnabled: boolean) => {
    const result = await dispatch(
      updateFlag({ id, payload: { enabled: nextEnabled } }),
    );
    if (updateFlag.fulfilled.match(result)) {
      toast.success(`Flag ${nextEnabled ? "enabled" : "disabled"}`);
    } else {
      toast.error(result.error.message ?? "Failed to update flag");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteFlag(id));
    if (deleteFlag.fulfilled.match(result)) {
      toast.success("Flag deleted");
    } else {
      toast.error(result.error.message ?? "Failed to delete flag");
    }
  };

  return (
    <Card
      id="flags"
      className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            Feature Flags
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real data from backend for your signed-in user.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => void dispatch(fetchFlags())}
            className="h-9 px-3 text-xs"
          >
            Refresh
          </Button>
          <CreateFlagDialog onCreated={() => void dispatch(fetchFlags())} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by flag key..."
          className="h-9"
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            variant={showOnlyEnabled ? "default" : "outline"}
            onClick={() => setShowOnlyEnabled((prev) => !prev)}
            className="h-9"
          >
            {showOnlyEnabled ? "Enabled" : "All"}
          </Button>
          <p className="text-xs text-muted-foreground">
            {fetchStatus === "loading" ? "Loading..." : `${items.length} total flags`}
          </p>
        </div>
      </div>

      {fetchStatus === "loading" ? (
        <div className="space-y-2 rounded-md border border-border p-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`flags-skeleton-${index}`} className="grid grid-cols-5 gap-3">
              <Skeleton className="h-6 w-full bg-gray-300 dark:bg-[#302f2f]" />
              <Skeleton className="h-6 w-full bg-gray-300 dark:bg-[#302f2f]" />
              <Skeleton className="h-6 w-full bg-gray-300 dark:bg-[#302f2f]" />
              <Skeleton className="h-6 w-full bg-gray-300 dark:bg-[#302f2f]" />
              <Skeleton className="h-6 w-full bg-gray-300 dark:bg-[#302f2f]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 font-medium text-muted-foreground">
                  Flag Key
                </th>
                <th className="px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="px-3 py-2 font-medium text-muted-foreground">
                  Rollout %
                </th>
                <th className="px-3 py-2 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-3 py-2 font-medium text-muted-foreground">
                  Actions
                </th>
                <th className="px-3 py-2 font-medium text-muted-foreground">
                  Toggle
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFlags.map((flag) => (
                <tr key={flag.id} className="border-t border-border align-middle">
                  <td className="px-3 py-3 font-medium text-card-foreground">
                    {flag.flag_key}
                  </td>
                  <td className="px-3 py-3 uppercase text-muted-foreground">
                    {flag.type}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {flag.rollout_percentage ?? 0}% ({flag.rule_type ?? "AND"})
                    {flag.rules && flag.rules.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {flag.rules.map((rule, ruleIndex) => (
                          <span
                            key={`${flag.id}-rule-${ruleIndex}`}
                            className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px]"
                          >
                            {rule.field} {rule.operator} {rule.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {flag.variants && flag.variants.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {flag.variants.map((variant, variantIndex) => (
                          <span
                            key={`${flag.id}-variant-${variantIndex}`}
                            className="rounded border border-border bg-blue-100/60 px-1.5 py-0.5 text-[11px] text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                          >
                            {variant.name}: {variant.weight}%
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <Badge
                      className={` p-2
                      ${flag.enabled
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}
                    `}
                    >
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Open actions menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-40 p-2 text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            <FlagDetailsDialog flag={flag} />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full justify-start gap-2 border-none shadow-none"
                              onClick={() => void handleDelete(flag.id)}
                              disabled={isBusy}
                            >
                              <Trash className="w-4 h-4" /> Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                  <td>
                    <Switch
                      className="data-checked:bg-black dark:data-checked:bg-white"
                      checked={flag.enabled}
                      onCheckedChange={(checked) =>
                        void handleToggle(flag.id, checked)
                      }
                      aria-label={`Toggle ${flag.flag_key}`}
                      disabled={isBusy}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {filteredFlags.length === 0 && fetchStatus !== "loading" && (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          No flags found. Create one and evaluate it from the panel.
        </div>
      )}
    </Card>
  );
}
