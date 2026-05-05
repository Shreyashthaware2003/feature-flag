export type DashboardStat = {
  id: "overview" | "flags" | "evaluate";
  label: string;
  value: string;
};

export type DashboardFlag = {
  key: string;
  enabled: boolean;
  rollout: number;
  ruleType: "AND" | "OR";
};

export const dashboardStats: DashboardStat[] = [
  { id: "overview", label: "Total Flags", value: "12" },
  { id: "flags", label: "Live Rollouts", value: "5" },
  { id: "evaluate", label: "Evaluations Today", value: "24.7K" },
];

export const dashboardFlags: DashboardFlag[] = [
  { key: "new_dashboard", enabled: true, rollout: 65, ruleType: "AND" },
  { key: "pricing_experiment", enabled: false, rollout: 15, ruleType: "OR" },
];
