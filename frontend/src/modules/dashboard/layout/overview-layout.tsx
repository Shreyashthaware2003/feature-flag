import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OverviewStats from "../components/overview-stats";
import RecentActivity from "../components/recent-activity";

export default function OverviewLayout() {
  return (
    <div className="space-y-6">
      <OverviewStats />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-card-foreground">
                Release Health
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick status for current flag operations.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Stable
            </Badge>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Flags with active rollout</span>
              <span className="font-medium text-foreground">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rules evaluated today</span>
              <span className="font-medium text-foreground">24.7K</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Config flags in production</span>
              <span className="font-medium text-foreground">3</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-border bg-gray-100 ring-0 dark:bg-[#252525]">
          <div>
            <h2 className="text-base font-semibold text-card-foreground">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Common rollout actions for daily usage.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary">Create Flag</Button>
            <Button variant="secondary">Run Evaluation</Button>
            <Button variant="secondary">Edit Rollout %</Button>
            <Button variant="secondary">Check SDK Health</Button>
          </div>
        </Card>
      </section>

      <RecentActivity />
    </div>
  );
}
