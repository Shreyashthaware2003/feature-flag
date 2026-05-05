import FeatureFlagsPanel from "../components/feature-flags-panel";
import OverviewStats from "../components/overview-stats";
import QuickEvaluatePanel from "../components/quick-evaluate-panel";

export default function DashboardLayoutContent() {
  return (
    <div className="space-y-6">
      <OverviewStats />
      <div className="grid gap-6 lg:grid-cols-2">
        <FeatureFlagsPanel />
        <QuickEvaluatePanel />
      </div>
    </div>
  );
}
