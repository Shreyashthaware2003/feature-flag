import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardFlags } from "../data/mock-dashboard-data";
import { Card } from "@/components/ui/card";

export default function FeatureFlagsPanel() {
  return (
    <Card id="flags" className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-card-foreground">
          Feature Flags
        </h2>
        <Button className="h-8 px-3 text-xs">Create Flag</Button>
      </div>

      <div className="space-y-3">
        {dashboardFlags.map((flag) => (
          <div key={flag.key} className="rounded-md border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-card-foreground">{flag.key}</p>
              <Badge
                className={
                  flag.enabled
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-muted text-muted-foreground"
                }
              >
                {flag.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Rollout: {flag.rollout}% | Rule Type: {flag.ruleType}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
