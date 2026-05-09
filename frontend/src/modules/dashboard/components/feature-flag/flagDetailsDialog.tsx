import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function FlagDetailsDialog({
    flag,
}: {
    flag: {
        flag_key: string;
        type: string;
        enabled: boolean;
        rollout_percentage?: number;
        rule_type?: string;
        value?: Record<string, unknown> | null;
        rules?: Array<{ field: string; operator: string; value: string }>;
        variants?: Array<{ name: string; weight: number }>;
    };
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="w-full justify-start gap-2">
                    <Info />  Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{flag.flag_key}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="grid gap-2 rounded-md border border-border p-3">
                        <p>
                            <span className="font-medium">Type:</span> {flag.type}
                        </p>
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            {flag.enabled ? "Enabled" : "Disabled"}
                        </p>
                        <p>
                            <span className="font-medium">Rollout:</span>{" "}
                            {flag.rollout_percentage ?? 0}%
                        </p>
                        <p>
                            <span className="font-medium">Rule Type:</span>{" "}
                            {flag.rule_type ?? "AND"}
                        </p>
                    </div>

                    <div className="rounded-md border border-border p-3">
                        <p className="mb-2 font-medium">Rules</p>
                        {flag.rules && flag.rules.length > 0 ? (
                            <div className="space-y-1">
                                {flag.rules.map((rule, index) => (
                                    <p key={`${flag.flag_key}-rule-line-${index}`}>
                                        {index + 1}. {rule.field} {rule.operator} {rule.value}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No rules configured.</p>
                        )}
                    </div>

                    <div className="rounded-md border border-border p-3">
                        <p className="mb-2 font-medium">Variants</p>
                        {flag.variants && flag.variants.length > 0 ? (
                            <div className="space-y-1">
                                {flag.variants.map((variant, index) => (
                                    <p key={`${flag.flag_key}-variant-line-${index}`}>
                                        {index + 1}. {variant.name} ({variant.weight}%)
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No variants configured.</p>
                        )}
                    </div>

                    <div className="rounded-md border border-border p-3">
                        <p className="mb-2 font-medium">Config Value</p>
                        <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                            {JSON.stringify(flag.value ?? null, null, 2)}
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}