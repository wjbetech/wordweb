import { useState, useCallback } from "react";
import ReactFlow, { Background, Controls, useReactFlow, BackgroundVariant } from "reactflow";
import ColoredNode from "./ColoredNode";
import type { Node, Edge, NodeMouseHandler } from "reactflow";
import Sidebar from "./Sidebar";
import { searchDatamuse } from "../api/datamuse";
import { useColorPalette } from "../hooks/useColorPalette";

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

type LineStyle = "default" | "straight" | "smoothstep" | "step" | "bezier";

type WordWebFlowProps = {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
};

export function WordWebFlow({ isDark, onThemeChange }: WordWebFlowProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [lineStyle, setLineStyle] = useState<LineStyle>("smoothstep");
  const reactFlow = useReactFlow();
  const colors = useColorPalette();

  const edgeColor = isDark ? "#6b7280" : "#94a3b8"; // Lighter gray for dark, darker for light

  // Set ReactFlow canvas background color based on theme
  const canvasBg = isDark ? "bg-gray-800" : "bg-white";

  // Helper: check if a position is too close to any node
  const isOverlapping = useCallback((x: number, y: number, nodes: Node[], minDist = 180) => {
    return nodes.some((n) => {
      const dx = n.position.x - x;
      const dy = n.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }, []);

  // Helper: Find a non-overlapping position using spiral placement if random fails
  const findNonOverlappingPosition = useCallback(
    (startX: number, startY: number, baseRadius: number, depth: number, spreadStep: number, placed: Node[]) => {
      const minDist = 180;

      // For initial layer (depth 1), use evenly distributed angles with some randomness
      if (depth === 1) {
        const nodeIndex = placed.length - 1; // Subtract 1 to account for center node
        const totalNodes = 8; // We typically place up to 8 nodes
        const baseAngle = (nodeIndex * 2 * Math.PI) / totalNodes;
        const angleVariation = (Math.PI / 6) * (Math.random() - 0.5); // ±30 degrees variation
        const angle = baseAngle + angleVariation;

        const radiusVariation = Math.random() * 60 - 30; // ±30px variation
        const radius = baseRadius + radiusVariation;

        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        // Ensure it doesn't overlap
        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // For deeper layers or fallback, use directional placement away from parent
      const existingNodes = placed.filter((n) => n.position.x !== startX || n.position.y !== startY);

      // Calculate direction away from center and existing nodes
      let preferredAngle = Math.atan2(startY - center.y, startX - center.x); // Direction from center

      // If there are nearby nodes, avoid their directions
      const nearbyNodes = existingNodes.filter((n) => {
        const dx = n.position.x - startX;
        const dy = n.position.y - startY;
        return Math.sqrt(dx * dx + dy * dy) < baseRadius * 2;
      });

      if (nearbyNodes.length > 0) {
        const avoidAngles = nearbyNodes.map((n) => {
          const dx = n.position.x - startX;
          const dy = n.position.y - startY;
          return Math.atan2(dy, dx);
        });

        // Find the largest gap between avoid angles
        let maxGap = 0;
        let bestAngle = preferredAngle;

        for (let testAngle = 0; testAngle < 2 * Math.PI; testAngle += Math.PI / 12) {
          let minDistance = Math.PI;
          for (const avoidAngle of avoidAngles) {
            let angleDiff = Math.abs(testAngle - avoidAngle);
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
            minDistance = Math.min(minDistance, angleDiff);
          }
          if (minDistance > maxGap) {
            maxGap = minDistance;
            bestAngle = testAngle;
          }
        }
        preferredAngle = bestAngle;
      }

      // Try positions in a cone around the preferred direction
      const coneRange = Math.PI / 3; // 60-degree cone
      const numTries = 16; // More attempts for better placement

      for (let i = 0; i < numTries; i++) {
        const angleOffset = coneRange * (Math.random() - 0.5); // Random within cone
        const angle = preferredAngle + angleOffset;

        // Add more radius variation
        const radiusJitter = Math.random() * 80 - 40; // ±40px variation
        const radius = baseRadius + (depth - 1) * spreadStep + radiusJitter;

        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // Final fallback - spiral outward
      for (let r = baseRadius; r < baseRadius * 3; r += 30) {
        for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
          const x = startX + r * Math.cos(a);
          const y = startY + r * Math.sin(a);

          if (!isOverlapping(x, y, placed, minDist)) {
            return { x, y };
          }
        }
      }

      // Absolute fallback
      const fallbackRadius = baseRadius + (depth - 1) * spreadStep + 200;
      return {
        x: startX + fallbackRadius * Math.cos(preferredAngle),
        y: startY + fallbackRadius * Math.sin(preferredAngle)
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
        const baseRadius = 220; // Increased for more spread between layers
        const spreadStep = 140; // Increased to create more space between each layer
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
            stroke: edgeColor,
            strokeWidth: 1.5
          },
          type: lineStyle,
          animated: false
        }));
        setEdges(initialEdges);

        // Auto-zoom to fit all nodes (center + related) with smooth animation
        setTimeout(() => {
          reactFlow.fitView({
            nodes: [centerNode, ...relatedNodes],
            duration: 800,
            padding: 0.15 // Add 15% padding around the nodes for better visibility
          });
        }, 100); // Small delay to ensure nodes are rendered
      }, 500);
    },
    [reactFlow, colors, findNonOverlappingPosition, lineStyle, edgeColor]
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
      const baseRadius = 160; // Increased for more spread between layers
      const spreadStep = 120; // Increased to match the larger spacing
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
          stroke: edgeColor,
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

  const nodeTypes = { colored: ColoredNode };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}>
        <div className="text-5xl font-bold opacity-10 select-none" style={{ color: isDark ? "#e5e7eb" : "#374151" }}>
          wordweb.
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
        className={canvasBg + " w-full h-full"}
        style={{ background: isDark ? "#1f2937" : "#ffffff" }}
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
          style: { stroke: edgeColor, strokeWidth: 1.5 },
          type: lineStyle,
          animated: false
        }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}>
        <Background
          color={isDark ? "#374151" : "#e5e7eb"}
          variant={BackgroundVariant.Lines}
          gap={20}
          offset={1}
          style={{ backgroundColor: "transparent" }}
        />
        <Controls />
      </ReactFlow>
      <Sidebar
        onSearch={createWordWeb}
        onLineStyleChange={setLineStyle}
        currentLineStyle={lineStyle}
        isDark={isDark}
        onThemeChange={onThemeChange}
      />
    </>
  );
}
