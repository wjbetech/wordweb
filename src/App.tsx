import { useState, useCallback, useMemo } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider, useReactFlow, BackgroundVariant } from "reactflow";
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

type LineStyle = "default" | "straight" | "smoothstep" | "step" | "bezier";

function WordWebFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [lineStyle, setLineStyle] = useState<LineStyle>("smoothstep");
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
      const minDist = 140;

      // Calculate the average direction of existing nodes relative to the start point
      const existingNodes = placed.filter((n) => n.position.x !== startX || n.position.y !== startY);
      let avgAngle = Math.PI / 2; // Default to growing upward if no existing nodes

      if (existingNodes.length > 0) {
        const angles = existingNodes.map((n) => {
          const dx = n.position.x - startX;
          const dy = n.position.y - startY;
          return Math.atan2(dy, dx);
        });
        avgAngle = angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
        // Add PI to point in the opposite direction of existing nodes
        avgAngle += Math.PI;
      }

      // Try positions in an arc facing away from existing nodes
      const arcRange = Math.PI / 2; // 90-degree arc
      const numTries = 12;

      for (let i = 0; i < numTries; i++) {
        const angleOffset = arcRange / 2 - arcRange * (i / (numTries - 1));
        const angle = avgAngle + angleOffset;
        const jitter = Math.random() * 20 - 10; // Reduced jitter for more organized layout
        const radius = baseRadius + (depth - 1) * spreadStep + jitter;

        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // If arc placement fails, try wider arc
      const widerArcRange = Math.PI; // 180-degree arc
      for (let i = 0; i < numTries; i++) {
        const angleOffset = widerArcRange / 2 - widerArcRange * (i / (numTries - 1));
        const angle = avgAngle + angleOffset;
        const radius = baseRadius + (depth - 1) * spreadStep;

        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // If all else fails, place it further out in the average direction
      const fallbackRadius = baseRadius + (depth - 1) * spreadStep + 200;
      return {
        x: startX + fallbackRadius * Math.cos(avgAngle),
        y: startY + fallbackRadius * Math.sin(avgAngle)
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
            stroke: "#94a3b8",
            strokeWidth: 1.5
          },
          type: lineStyle,
          animated: false
        }));
        setEdges(initialEdges);
        // Refocus on new nodes
        reactFlow.fitView({ nodes: relatedNodes, duration: 500 });
      }, 500);
    },
    [reactFlow, colors, findNonOverlappingPosition, lineStyle]
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
          stroke: "#94a3b8",
          strokeWidth: 1.5
        },
        type: lineStyle,
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
        minZoom={0.5}
        maxZoom={2}
        className="w-full h-full"
        onNodeClick={onNodeClick}
        onWheel={(event) => {
          if (!event.ctrlKey) {
            // Allow regular scroll only when Ctrl is pressed
            const { deltaY } = event;
            const zoom = reactFlow.getZoom();
            const newZoom = deltaY > 0 ? zoom * 0.9 : zoom * 1.1;
            reactFlow.zoomTo(Math.min(Math.max(newZoom, 0.5), 2));
            event.preventDefault();
          }
        }}
        defaultEdgeOptions={{
          style: { stroke: "#94a3b8", strokeWidth: 1.5 },
          type: lineStyle,
          animated: false
        }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}>
        <Background variant={BackgroundVariant.Lines} gap={40} size={1} color="rgba(0, 0, 0, 0.1)" />
        <Controls />
      </ReactFlow>
      <Sidebar onSearch={createWordWeb} onLineStyleChange={setLineStyle} currentLineStyle={lineStyle} />
    </>
  );
}
