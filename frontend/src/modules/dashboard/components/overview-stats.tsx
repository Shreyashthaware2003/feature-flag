import { Card } from "@/components/ui/card";
import { dashboardStats } from "../data/mock-dashboard-data";

export default function OverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {dashboardStats.map((stat) => (
        <Card
          key={stat.id}
          id={stat.id}
          className="rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0"
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">
            {stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
