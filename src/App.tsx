import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  MarkerType
} from "reactflow";
import ColoredNode from "./components/ColoredNode";
import type { Node, Edge, NodeMouseHandler } from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import { searchDatamuse } from "./api/datamuse";

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export default function WordMap() {
  return (
    <div className="relative w-screen h-screen bg-[#fdf6e3] overflow-hidden">
      {/* Centered, unclickable, unselectable wordweb. icon */}
      <div
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ opacity: 0.15 }}>
        <span className="text-4xl font-extrabold tracking-tight text-[#4c5c68]">wordweb.</span>
      </div>

      <ReactFlowProvider>
        <WordWebFlow />
      </ReactFlowProvider>
    </div>
  );
}

function WordWebFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlow = useReactFlow();

  // Color palette for each depth
  const colors = useMemo(
    () => [
      { bg: "#4a5568", text: "#fff" }, // lighter gray
      { bg: "#3b82f6", text: "#fff" }, // bright blue
      { bg: "#10b981", text: "#fff" }, // emerald
      { bg: "#f97316", text: "#fff" }, // orange
      { bg: "#8b5cf6", text: "#fff" }, // violet
      { bg: "#ef4444", text: "#fff" }, // red
      { bg: "#06b6d4", text: "#fff" }, // cyan
      { bg: "#f59e0b", text: "#fff" } // amber
    ],
    []
  );

  // Helper: check if a position is too close to any node
  const isOverlapping = useCallback((x: number, y: number, nodes: Node[], minDist = 140) => {
    return nodes.some((n) => {
      const dx = n.position.x - x;
      const dy = n.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }, []);

  // Helper: Find a non-overlapping position using spiral placement if random fails
  const findNonOverlappingPosition = useCallback(
    (startX: number, startY: number, baseRadius: number, depth: number, spreadStep: number, placed: Node[]) => {
      // First try random placement
      const minDist = 140; // Increased minimum distance between nodes
      let tries = 0;
      while (tries < 50) {
        // Increased number of tries
        const angle = Math.random() * 2 * Math.PI;
        const jitter = Math.random() * 40 - 20; // Add some randomness to radius
        const radius = baseRadius + (depth - 1) * spreadStep + jitter;
        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
        tries++;
      }

      // If random placement fails, try spiral placement
      const spiralStart = 0;
      const spiralEnd = 4 * Math.PI; // Two full rotations
      const spiralSteps = 36; // Number of positions to try along spiral

      for (let i = 0; i < spiralSteps; i++) {
        const t = spiralStart + (spiralEnd - spiralStart) * (i / spiralSteps);
        const spiralRadius = baseRadius + (depth - 1) * spreadStep + (t / (2 * Math.PI)) * 30;
        const x = startX + spiralRadius * Math.cos(t);
        const y = startY + spiralRadius * Math.sin(t);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // If all else fails, place it further out
      const fallbackAngle = Math.random() * 2 * Math.PI;
      const fallbackRadius = baseRadius + (depth - 1) * spreadStep + 200; // Place it far out
      return {
        x: startX + fallbackRadius * Math.cos(fallbackAngle),
        y: startY + fallbackRadius * Math.sin(fallbackAngle)
      };
    },
    [isOverlapping]
  );

  // Handler to create a word web
  const createWordWeb = useCallback(
    (centerWord: string, related: string[]) => {
      // Center node
      const centerId = `center-${centerWord}`;
      const centerNode: Node = {
        id: centerId,
        data: { label: centerWord, depth: 0, color: colors[0] },
        position: { x: center.x, y: center.y },
        type: "colored"
      };

      setNodes([centerNode]);
      setEdges([]);
      reactFlow.setViewport({
        x: 0,
        y: 0,
        zoom: 1
      });

      // After 0.5s, add related nodes around the center
      setTimeout(() => {
        const baseRadius = 180; // Increased for more spread between layers
        const spreadStep = 120; // Doubled to create more space between each layer
        const depth = 1;
        const placed: Node[] = [centerNode];
        const relatedNodes: Node[] = related.slice(0, 8).map((word) => {
          const position = findNonOverlappingPosition(center.x, center.y, baseRadius, depth, spreadStep, placed);
          const node = {
            id: `related-${centerWord}-${word}`,
            data: { label: word, depth, color: colors[depth % colors.length] },
            position,
            type: "colored" as const
          };
          placed.push(node);
          return node;
        });
        setNodes([centerNode, ...relatedNodes]);
        const initialEdges = relatedNodes.map((n) => ({
          id: `e-${centerId}-${n.id}`,
          source: centerId,
          target: n.id,
          style: {
            stroke: "#475569",
            strokeWidth: 4
          },
          type: "straight",
          animated: false
        }));
        setEdges(initialEdges);
        // Refocus on new nodes
        reactFlow.fitView({ nodes: relatedNodes, duration: 500 });
      }, 500);
    },
    [reactFlow, colors, findNonOverlappingPosition]
  );

  // Node click handler to expand web
  const onNodeClick: NodeMouseHandler = async (_event, node) => {
    // Only expand if not the center node and not already expanded
    if (node.id.startsWith("related-") || node.id.startsWith("expanded-")) {
      if (nodes.some((n) => n.id.startsWith(`expanded-${node.id}-`))) return;
      const results = await searchDatamuse(node.data.label);
      const related = results.slice(0, 4).map((w: { word: string }) => w.word);
      const parentDepth = node.data.depth ?? 1;
      const depth = parentDepth + 1;
      const baseRadius = 140; // Increased for more spread between layers
      const spreadStep = 100; // Increased to match the larger spacing
      const placed: Node[] = [node, ...nodes];
      const newNodes: Node[] = related.map((word) => {
        const position = findNonOverlappingPosition(
          node.position.x,
          node.position.y,
          baseRadius,
          depth,
          spreadStep,
          placed
        );
        const n = {
          id: `expanded-${node.id}-${word}`,
          data: { label: word, depth, color: colors[depth % colors.length] },
          position,
          type: "colored" as const
        };
        placed.push(n);
        return n;
      });
      // Add edges from parent node to each new node
      const newEdges = newNodes.map((n) => ({
        id: `e-${node.id}-${n.id}`,
        source: node.id,
        target: n.id,
        style: {
          stroke: "#475569",
          strokeWidth: 4
        },
        type: "straight",
        animated: false
      }));
      setNodes((prev) => [...prev, ...newNodes]);
      setEdges((prev) => [...prev, ...newEdges]);
      // Refocus on new nodes
      reactFlow.fitView({ nodes: newNodes, duration: 500 });
    }
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ colored: ColoredNode }}
        fitView
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        minZoom={0.5}
        maxZoom={2}
        className="w-full h-full"
        onNodeClick={onNodeClick}
        defaultEdgeOptions={{
          style: { stroke: "#475569", strokeWidth: 4 },
          type: "straight",
          animated: false
        }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}>
        <Background variant={BackgroundVariant.Lines} gap={40} size={1} color="rgba(0, 0, 0, 0.1)" />
        <Controls />
      </ReactFlow>
      <Sidebar onSearch={createWordWeb} />
    </>
  );
}
