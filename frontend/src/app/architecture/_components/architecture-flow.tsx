"use client";

import { memo } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppWindow, Binary, Database, LineChart, ScanSearch, ShieldCheck, Workflow } from "lucide-react";

type NodeData = {
  title: string;
  lane: string;
  icon: "app" | "sdk" | "auth" | "engine" | "store" | "analytics" | "api" | "service";
};

const iconMap = {
  app: AppWindow,
  sdk: Binary,
  auth: ShieldCheck,
  engine: Workflow,
  store: Database,
  analytics: LineChart,
  api: ScanSearch,
  service: ScanSearch,
};

const DiagramNode = memo(({ data }: NodeProps<Node<NodeData>>) => {
  const Icon = iconMap[data.icon];

  return (
    <div className="relative min-w-[190px] rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-transparent !opacity-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-transparent !opacity-0 pointer-events-none"
      />
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-md border border-gray-200 bg-gray-100 p-1.5">
          <Icon className="h-3.5 w-3.5 text-gray-700" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{data.lane}</span>
      </div>
      <p className="text-xs font-semibold text-gray-900">{data.title}</p>
    </div>
  );
});
DiagramNode.displayName = "DiagramNode";

const nodeTypes = { architectureNode: DiagramNode };

type ArchitectureFlowProps = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  height?: number;
};

export default function ArchitectureFlow({ nodes, edges, height = 420 }: ArchitectureFlowProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnPinch
          zoomOnScroll
          defaultEdgeOptions={{
            animated: true,
            type: "smoothstep",
            style: { stroke: "#374151", strokeWidth: 2.2 },
            labelStyle: { fill: "#374151", fontSize: 10, fontWeight: 600 },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#374151",
              width: 18,
              height: 18,
            },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#e5e7eb" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
