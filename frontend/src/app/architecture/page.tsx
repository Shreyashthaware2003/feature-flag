import { Badge } from "@/components/ui/badge";
import ArchitectureFlow from "./_components/architecture-flow";
import { MarkerType, type Edge, type Node } from "@xyflow/react";
import SiteHeader from "@/components/site-header";

type NodeData = {
  title: string;
  lane: string;
  icon: "app" | "sdk" | "auth" | "engine" | "store" | "analytics" | "api" | "service";
};

const hldNodes: Node<NodeData>[] = [
  { id: "apps", type: "architectureNode", position: { x: 40, y: 80 }, data: { title: "Apps & Services", lane: "Client", icon: "app" } },
  { id: "sdk", type: "architectureNode", position: { x: 300, y: 80 }, data: { title: "SDK + Local Cache", lane: "Client", icon: "sdk" } },
  { id: "auth", type: "architectureNode", position: { x: 560, y: 80 }, data: { title: "Auth Gateway", lane: "Control Plane", icon: "auth" } },
  { id: "engine", type: "architectureNode", position: { x: 820, y: 80 }, data: { title: "Rule Engine", lane: "Control Plane", icon: "engine" } },
  { id: "store", type: "architectureNode", position: { x: 1110, y: 260 }, data: { title: "Flag Store", lane: "Data", icon: "store" } },
  { id: "analytics", type: "architectureNode", position: { x: 790, y: 260 }, data: { title: "Analytics Stream", lane: "Data", icon: "analytics" } },
];

const hldEdges: Edge[] = [
  {
    id: "apps-sdk",
    source: "apps",
    target: "sdk",
    label: "Evaluation Call",
    animated: true,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "sdk-auth",
    source: "sdk",
    target: "auth",
    label: "Authenticate",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "auth-engine",
    source: "auth",
    target: "engine",
    label: "Validate",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "engine-store",
    source: "engine",
    target: "store",
    label: "Read / Write",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "engine-analytics",
    source: "engine",
    target: "analytics",
    label: "Publish Events",
    animated: true,
    type: "smoothstep",
  },
];

const lldNodes: Node<NodeData>[] = [
  { id: "frontend", type: "architectureNode", position: { x: 30, y: 40 }, data: { title: "Frontend App", lane: "Client", icon: "app" } },
  { id: "sdkClient", type: "architectureNode", position: { x: 300, y: 40 }, data: { title: "FeatureSDK Client", lane: "Client", icon: "sdk" } },
  { id: "evaluateApi", type: "architectureNode", position: { x: 560, y: 170 }, data: { title: "POST /api/v1/evaluate", lane: "API", icon: "api" } },
  { id: "evaluationService", type: "architectureNode", position: { x: 860, y: 170 }, data: { title: "EvaluationService", lane: "Service", icon: "service" } },
  { id: "flagStore", type: "architectureNode", position: { x: 1120, y: 300 }, data: { title: "FeatureFlag + Rules", lane: "Data", icon: "store" } },
  { id: "tracking", type: "architectureNode", position: { x: 760, y: 300 }, data: { title: "TrackingService", lane: "Data", icon: "analytics" } },
];

const lldEdges: Edge[] = [
  { id: "l1", source: "frontend", target: "sdkClient", type: "smoothstep", label: "evaluate()" },
  { id: "l2", source: "sdkClient", target: "evaluateApi", type: "smoothstep", label: "POST /evaluate" },
  { id: "l3", source: "evaluateApi", target: "evaluationService", type: "smoothstep", label: "delegate" },
  { id: "l4", source: "evaluationService", target: "flagStore", type: "smoothstep", label: "query rules" },
  { id: "l5", source: "evaluationService", target: "tracking", type: "smoothstep", label: "track event" },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#121212] dark:text-gray-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Badge variant="secondary" className="mb-4 text-xs dark:bg-[#202020] dark:text-gray-200">
            System Design
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-gray-100">Architecture Blueprint</h1>
          <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
            Showcase-ready architecture with high-level and low-level node diagrams.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-gray-100">High-Level Design</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              End-to-end product flow from SDK evaluation call to storage and analytics.
            </p>
          </div>
          <ArchitectureFlow nodes={hldNodes} edges={hldEdges} />
        </section>

        <section className="mt-10 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-gray-100">Low-Level Design</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Concrete service-level flow mapped to current implementation components.
            </p>
          </div>
          <ArchitectureFlow nodes={lldNodes} edges={lldEdges} />
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-b from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#151515] p-5">
          <h3 className="text-sm font-semibold text-black dark:text-gray-100">Current API Contract</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] p-4 text-xs text-gray-800 dark:text-gray-200">
            <code>{`POST /api/v1/evaluate
Headers:
  x-access-key: ff_live_...
  or Authorization: Bearer <jwt>
Body:
  { "flagKey": "new_dashboard", "user": { "id": "user_92", "country": "US" } }
Response:
  { "enabled": true, "variant": "A", "config": {...}, "reason": "Flag enabled" }`}</code>
          </pre>
        </section>
      </main>
    </div>
  );
}
