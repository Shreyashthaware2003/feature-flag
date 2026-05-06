"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createFlag,
  deleteFlag,
  fetchFlags,
  updateFlag,
} from "@/redux/features/dashboard/flags/flags.slice";
import type { Rule, Variant } from "@/redux/features/dashboard/flags/flags.types";
import { toast } from "sonner";

const RULE_OPERATORS: Rule["operator"][] = [
  "equals",
  "not_equals",
  "greater_than",
  "greater_than_equal",
  "less_than",
  "less_than_equal",
  "includes",
];

export default function FeatureFlagsPanel() {
  const dispatch = useAppDispatch();
  const { items, fetchStatus, createStatus, updateStatus, deleteStatus, error } =
    useAppSelector((state) => state.dashboard.flags);

  const [query, setQuery] = useState("");
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [newFlagKey, setNewFlagKey] = useState("");
  const [newRollout, setNewRollout] = useState("100");
  const [newRuleType, setNewRuleType] = useState<"AND" | "OR">("AND");
  const [newRules, setNewRules] = useState<Rule[]>([
    { field: "", operator: "equals", value: "" },
  ]);
  const [newVariants, setNewVariants] = useState<Variant[]>([
    { name: "", weight: 100 },
  ]);

  useEffect(() => {
    if (fetchStatus === "idle") {
      void dispatch(fetchFlags());
    }
  }, [dispatch, fetchStatus]);

  const filteredFlags = useMemo(() => {
    return items.filter((flag) => {
      const matchesQuery = flag.flag_key
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesEnabled = showOnlyEnabled ? flag.enabled : true;
      return matchesQuery && matchesEnabled;
    });
  }, [items, query, showOnlyEnabled]);

  const isBusy =
    createStatus === "loading" ||
    updateStatus === "loading" ||
    deleteStatus === "loading";

  const handleCreate = async () => {
    if (!newFlagKey.trim()) {
      toast.error("Flag key is required");
      return;
    }

    const rollout = Number(newRollout);
    if (!Number.isFinite(rollout) || rollout < 0 || rollout > 100) {
      toast.error("Rollout must be between 0 and 100");
      return;
    }

    const hasPartialRules = newRules.some(
      (rule) =>
        rule.field.trim().length > 0 ||
        rule.value.trim().length > 0,
    );
    const sanitizedRules = newRules.filter(
      (rule) => rule.field.trim().length > 0 && rule.value.trim().length > 0,
    );

    if (hasPartialRules && sanitizedRules.length !== newRules.length) {
      toast.error("Each rule must have field and value, or be empty.");
      return;
    }

    const hasPartialVariants = newVariants.some(
      (variant) => variant.name.trim().length > 0 || variant.weight > 0,
    );
    const sanitizedVariants = newVariants.filter(
      (variant) => variant.name.trim().length > 0,
    );

    if (hasPartialVariants && sanitizedVariants.length !== newVariants.length) {
      toast.error("Each variant must have name and weight.");
      return;
    }

    const invalidWeight = sanitizedVariants.some(
      (variant) => !Number.isFinite(variant.weight) || variant.weight < 0,
    );
    if (invalidWeight) {
      toast.error("Variant weights must be 0 or greater.");
      return;
    }

    const totalVariantWeight = sanitizedVariants.reduce(
      (sum, variant) => sum + Number(variant.weight),
      0,
    );
    if (sanitizedVariants.length > 0 && totalVariantWeight !== 100) {
      toast.error("Total variant weight must be exactly 100.");
      return;
    }

    const result = await dispatch(
      createFlag({
        flag_key: newFlagKey.trim(),
        enabled: true,
        type: "boolean",
        rollout_percentage: rollout,
        rule_type: sanitizedRules.length > 0 ? newRuleType : "AND",
        rules: sanitizedRules.length > 0 ? sanitizedRules : undefined,
        variants: sanitizedVariants.length > 0 ? sanitizedVariants : undefined,
      }),
    );

    if (createFlag.fulfilled.match(result)) {
      setNewFlagKey("");
      setNewRollout("100");
      setNewRuleType("AND");
      setNewRules([{ field: "", operator: "equals", value: "" }]);
      setNewVariants([{ name: "", weight: 100 }]);
      toast.success("Flag created");
    } else {
      toast.error(result.error.message ?? "Failed to create flag");
    }
  };

  const addRuleRow = () => {
    setNewRules((prev) => [
      ...prev,
      { field: "", operator: "equals", value: "" },
    ]);
  };

  const removeRuleRow = (index: number) => {
    setNewRules((prev) => {
      if (prev.length === 1) {
        return [{ field: "", operator: "equals", value: "" }];
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const updateRuleRow = (index: number, next: Partial<Rule>) => {
    setNewRules((prev) =>
      prev.map((rule, idx) => (idx === index ? { ...rule, ...next } : rule)),
    );
  };

  const addVariantRow = () => {
    setNewVariants((prev) => [...prev, { name: "", weight: 0 }]);
  };

  const removeVariantRow = (index: number) => {
    setNewVariants((prev) => {
      if (prev.length === 1) {
        return [{ name: "", weight: 100 }];
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const updateVariantRow = (index: number, next: Partial<Variant>) => {
    setNewVariants((prev) =>
      prev.map((variant, idx) =>
        idx === index ? { ...variant, ...next } : variant,
      ),
    );
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    const result = await dispatch(updateFlag({ id, payload: { enabled: !enabled } }));
    if (updateFlag.fulfilled.match(result)) {
      toast.success(`Flag ${enabled ? "disabled" : "enabled"}`);
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
        <Button onClick={() => void dispatch(fetchFlags())} className="h-9 px-3 text-xs">
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_160px_120px_auto]">
        <Input
          value={newFlagKey}
          onChange={(event) => setNewFlagKey(event.target.value)}
          placeholder="new_checkout_ui"
          className="h-9"
        />
        <Input
          type="number"
          min={0}
          max={100}
          value={newRollout}
          onChange={(event) => setNewRollout(event.target.value)}
          placeholder="100"
          className="h-9"
        />
        <Button
          variant={showOnlyEnabled ? "default" : "outline"}
          onClick={() => setShowOnlyEnabled((prev) => !prev)}
          className="h-9"
        >
          {showOnlyEnabled ? "Enabled" : "All"}
        </Button>
        <Button onClick={handleCreate} disabled={isBusy} className="h-9 px-3 text-xs">
          {createStatus === "loading" ? "Creating..." : "Create Flag"}
        </Button>
      </div>

      <div className="space-y-3 rounded-md border border-border p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Rules Builder
          </p>
          <div className="flex items-center gap-2">
            <label
              htmlFor="rule-type"
              className="text-xs text-muted-foreground"
            >
              Rule Type
            </label>
            <select
              id="rule-type"
              value={newRuleType}
              onChange={(event) => setNewRuleType(event.target.value as "AND" | "OR")}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
        </div>

        {newRules.map((rule, index) => (
          <div
            key={`rule-${index}`}
            className="grid gap-2 md:grid-cols-[1fr_180px_1fr_auto]"
          >
            <Input
              value={rule.field}
              onChange={(event) =>
                updateRuleRow(index, { field: event.target.value })
              }
              placeholder="field (example: country)"
              className="h-9"
            />
            <select
              value={rule.operator}
              onChange={(event) =>
                updateRuleRow(index, {
                  operator: event.target.value as Rule["operator"],
                })
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {RULE_OPERATORS.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
            <Input
              value={rule.value}
              onChange={(event) =>
                updateRuleRow(index, { value: event.target.value })
              }
              placeholder="value (example: IN)"
              className="h-9"
            />
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => removeRuleRow(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="h-9" onClick={addRuleRow}>
            Add Rule
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-border p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Variants Builder
          </p>
          <p className="text-xs text-muted-foreground">
            Total weight:{" "}
            {newVariants
              .filter((variant) => variant.name.trim().length > 0)
              .reduce((sum, variant) => sum + Number(variant.weight), 0)}
            /100
          </p>
        </div>

        {newVariants.map((variant, index) => (
          <div
            key={`variant-${index}`}
            className="grid gap-2 md:grid-cols-[1fr_160px_auto]"
          >
            <Input
              value={variant.name}
              onChange={(event) =>
                updateVariantRow(index, { name: event.target.value })
              }
              placeholder="variant name (example: control)"
              className="h-9"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={variant.weight}
              onChange={(event) =>
                updateVariantRow(index, {
                  weight: Number(event.target.value || 0),
                })
              }
              placeholder="weight"
              className="h-9"
            />
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => removeVariantRow(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="h-9" onClick={addVariantRow}>
            Add Variant
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by flag key..."
          className="h-9"
        />
        <p className="self-center text-xs text-muted-foreground">
          {fetchStatus === "loading" ? "Loading..." : `${items.length} total flags`}
        </p>
      </div>

      {fetchStatus === "loading" && (
        <div className="space-y-2 rounded-md border border-border p-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`flags-skeleton-${index}`} className="grid grid-cols-5 gap-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      )}

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
                    className={
                      flag.enabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {flag.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handleToggle(flag.id, flag.enabled)}
                      disabled={isBusy}
                    >
                      Toggle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handleDelete(flag.id)}
                      disabled={isBusy}
                    >
                      Delete
                    </Button>
                  </div>
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

      {filteredFlags.length === 0 && fetchStatus !== "loading" && (
        <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          No flags found. Create one and evaluate it from the panel.
        </div>
      )}
    </Card>
  );
}
