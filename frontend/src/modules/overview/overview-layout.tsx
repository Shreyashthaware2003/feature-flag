import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardStats } from "../dashboard/data/mock-dashboard-data";

const recentActivity = [
  { title: "Enabled new_dashboard", meta: "2 minutes ago", status: "Live" },
  { title: "Updated pricing_experiment rollout to 15%", meta: "20 minutes ago", status: "Updated" },
  { title: "Evaluation volume crossed 24K today", meta: "1 hour ago", status: "Insight" },
];

export default function OverviewLayoutContent() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.id} className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0">
            <CardHeader className="pb-1">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-semibold">{stat.value}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Release Health</CardTitle>
              <CardDescription>Quick status for current flag operations.</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Stable
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Flags with active rollout</span>
              <span className="font-medium text-foreground">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rules evaluated today</span>
              <span className="font-medium text-foreground">78.2K</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Config flags in production</span>
              <span className="font-medium text-foreground">3</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Common tasks for daily rollout operations.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary">Create Flag</Button>
            <Button variant="secondary">Run Evaluation</Button>
            <Button variant="secondary">Edit Rollout %</Button>
            <Button variant="secondary">Check SDK Health</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest changes across your flag workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={item.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
                {index < recentActivity.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
