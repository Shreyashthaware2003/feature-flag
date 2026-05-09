"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createFlag } from "@/redux/features/dashboard/flags/flags.slice";
import type { Rule, Variant } from "@/redux/features/dashboard/flags/flags.types";
import { toast } from "sonner";
import { Trash } from "lucide-react";

const RULE_OPERATORS: Rule["operator"][] = [
    "equals",
    "not_equals",
    "greater_than",
    "greater_than_equal",
    "less_than",
    "less_than_equal",
    "includes",
];

type CreateFlagDialogProps = {
    onCreated?: () => void;
};

export default function CreateFlagDialog({ onCreated }: CreateFlagDialogProps) {
    const dispatch = useAppDispatch();
    const { createStatus } = useAppSelector((state) => state.dashboard.flags);

    const [isOpen, setIsOpen] = useState(false);
    const [newFlagKey, setNewFlagKey] = useState("");
    const [newRollout, setNewRollout] = useState("100");
    const [newRuleType, setNewRuleType] = useState<"AND" | "OR">("AND");
    const [newRules, setNewRules] = useState<Rule[]>([
        { field: "", operator: "equals", value: "" },
    ]);
    const [newVariants, setNewVariants] = useState<Variant[]>([
        { name: "", weight: 100 },
    ]);

    const isCreating = createStatus === "loading";

    const resetForm = () => {
        setNewFlagKey("");
        setNewRollout("100");
        setNewRuleType("AND");
        setNewRules([{ field: "", operator: "equals", value: "" }]);
        setNewVariants([{ name: "", weight: 100 }]);
    };

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

        const hasPartialRules = newRules.some((rule) => {
            const hasAnyRuleInput =
                rule.field.trim().length > 0 || rule.value.trim().length > 0;
            const hasCompleteRule =
                rule.field.trim().length > 0 && rule.value.trim().length > 0;
            return hasAnyRuleInput && !hasCompleteRule;
        });
        const sanitizedRules = newRules.filter(
            (rule) => rule.field.trim().length > 0 && rule.value.trim().length > 0,
        );

        if (hasPartialRules) {
            toast.error("Each rule must have field and value, or be empty.");
            return;
        }

        const hasPartialVariants = newVariants.some((variant) => {
            const hasAnyVariantInput = variant.name.trim().length > 0;
            const hasCompleteVariantInput =
                variant.name.trim().length > 0 && Number.isFinite(Number(variant.weight));
            return hasAnyVariantInput && !hasCompleteVariantInput;
        });
        const sanitizedVariants = newVariants.filter(
            (variant) => variant.name.trim().length > 0,
        );

        if (hasPartialVariants) {
            toast.error("Each variant must have name and weight.");
            return;
        }

        if (sanitizedRules.length === 0 && sanitizedVariants.length === 0) {
            toast.error("Add at least one rule or one variant.");
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
            resetForm();
            setIsOpen(false);
            onCreated?.();
            toast.success("Flag created");
            return;
        }

        toast.error(result.error.message ?? "Failed to create flag");
    };

    const addRuleRow = () => {
        setNewRules((prev) => [...prev, { field: "", operator: "equals", value: "" }]);
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
            prev.map((variant, idx) => (idx === index ? { ...variant, ...next } : variant)),
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-9 px-3 text-xs">Create Flag</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Feature Flag</DialogTitle>
                    <DialogDescription>
                        Configure rollout, rules, and variants for this flag.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="create-flag-key">Flag Key</Label>
                        <Input
                            id="create-flag-key"
                            value={newFlagKey}
                            onChange={(event) => setNewFlagKey(event.target.value)}
                            placeholder="new_checkout_ui"
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="create-flag-rollout">Rollout Percentage</Label>
                        <Input
                            id="create-flag-rollout"
                            type="number"
                            min={0}
                            max={100}
                            value={newRollout}
                            onChange={(event) => setNewRollout(event.target.value)}
                            placeholder="100"
                            className="h-9"
                        />
                    </div>
                </div>

                <div className="space-y-3 rounded-md border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Rules Builder
                        </p>
                        <div className="flex items-center gap-2">
                            <label htmlFor="rule-type" className="text-xs text-muted-foreground">
                                Rule Type
                            </label>
                            <Select
                                value={newRuleType}
                                onValueChange={(value) => setNewRuleType(value as "AND" | "OR")}
                            >
                                <SelectTrigger id="rule-type" className="h-9 w-[120px]">
                                    <SelectValue placeholder="Rule Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {newRules.map((rule, index) => (
                        <div key={`rule-${index}`} className="grid gap-2 md:grid-cols-[1fr_180px_1fr_auto] items-end">
                            <div className="space-y-1">
                                <Label htmlFor={`rule-field-${index}`}>Field</Label>
                                <Input
                                    id={`rule-field-${index}`}
                                    value={rule.field}
                                    onChange={(event) => updateRuleRow(index, { field: event.target.value })}
                                    placeholder="country"
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`rule-operator-${index}`}>Operator</Label>
                                <Select
                                    value={rule.operator}
                                    onValueChange={(value) =>
                                        updateRuleRow(index, {
                                            operator: value as Rule["operator"],
                                        })
                                    }
                                >
                                    <SelectTrigger id={`rule-operator-${index}`} className="h-9 w-full">
                                        <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RULE_OPERATORS.map((operator) => (
                                            <SelectItem key={operator} value={operator}>
                                                {operator}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`rule-value-${index}`}>Value</Label>
                                <Input
                                    id={`rule-value-${index}`}
                                    value={rule.value}
                                    onChange={(event) => updateRuleRow(index, { value: event.target.value })}
                                    placeholder="IN"
                                    className="h-9"
                                />
                            </div>
                            <Button type="button" variant="destructive" className="h-9" onClick={() => removeRuleRow(index)}>
                                <Trash className="w-4 h-4" />  Remove
                            </Button>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" className="h-9" onClick={addRuleRow}>
                            Add Rule
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Optional. Provide at least one rule or at least one variant before creating.
                    </p>
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
                        <div key={`variant-${index}`} className="grid gap-2 md:grid-cols-[1fr_160px_auto] items-end">
                            <div className="space-y-1">
                                <Label htmlFor={`variant-name-${index}`}>Variant Name</Label>
                                <Input
                                    id={`variant-name-${index}`}
                                    value={variant.name}
                                    onChange={(event) => updateVariantRow(index, { name: event.target.value })}
                                    placeholder="control"
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`variant-weight-${index}`}>Weight (%)</Label>
                                <Input
                                    id={`variant-weight-${index}`}
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={variant.weight}
                                    onChange={(event) =>
                                        updateVariantRow(index, {
                                            weight: Number(event.target.value || 0),
                                        })
                                    }
                                    placeholder="50"
                                    className="h-9"
                                />
                            </div>
                            <Button type="button" variant="destructive" className="h-9" onClick={() => removeVariantRow(index)}>
                                <Trash className="w-4 h-4" />  Remove
                            </Button>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" className="h-9" onClick={addVariantRow}>
                            Add Variant
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Optional. Provide at least one variant or at least one rule before creating.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Flag"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
