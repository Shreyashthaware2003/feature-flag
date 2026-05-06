export type DashboardStat = {
  id: "overview" | "flags" | "evaluate" | "deploy";
  label: string;
  value: string;
};

export type DashboardFlag = {
  key: string;
  type: "boolean" | "config";
  enabled: boolean;
  rollout: number;
  ruleType: "AND" | "OR";
  updatedAt: string;
};

export const dashboardStats: DashboardStat[] = [
  { id: "overview", label: "Total Flags", value: "12" },
  { id: "flags", label: "Live Rollouts", value: "5" },
  { id: "evaluate", label: "Evaluations Today", value: "24.7K" },
  { id: "deploy", label: "Last Deploy", value: "12m ago" },
];

export const dashboardFlags: DashboardFlag[] = [
  {
    key: "new_dashboard",
    type: "boolean",
    enabled: true,
    rollout: 65,
    ruleType: "AND",
    updatedAt: "2m ago",
  },
  {
    key: "pricing_experiment",
    type: "boolean",
    enabled: false,
    rollout: 15,
    ruleType: "OR",
    updatedAt: "18m ago",
  },
  {
    key: "checkout_theme",
    type: "config",
    enabled: true,
    rollout: 100,
    ruleType: "AND",
    updatedAt: "1h ago",
  },
];

export type DashboardActivityItem = {
  id: string;
  title: string;
  meta: string;
  status: "Live" | "Updated" | "Insight";
};

export const dashboardActivity: DashboardActivityItem[] = [
  {
    id: "a1",
    title: "Enabled new_dashboard for 65% rollout",
    meta: "2 minutes ago",
    status: "Live",
  },
  {
    id: "a2",
    title: "Updated pricing_experiment targeting rules",
    meta: "20 minutes ago",
    status: "Updated",
  },
  {
    id: "a3",
    title: "Evaluation volume crossed 24K today",
    meta: "1 hour ago",
    status: "Insight",
  },
];
