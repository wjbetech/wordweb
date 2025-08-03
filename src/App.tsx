import React, { useState, useCallback } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider, useReactFlow } from "reactflow";
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

  // Handler to create a word web
  const createWordWeb = useCallback(
    (centerWord: string, related: string[]) => {
      // Center node
      const centerId = `center-${centerWord}`;
      const centerNode: Node = {
        id: centerId,
        data: { label: centerWord, depth: 0 },
        position: { x: center.x, y: center.y },
        type: "default"
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
        const baseRadius = 180;
        const spreadStep = 120;
        const depth = 1;
        const angleStep = (2 * Math.PI) / Math.max(related.length, 1);
        const randomOffset = Math.random() * 2 * Math.PI;
        const relatedNodes: Node[] = related.map((word, i) => {
          const angle = i * angleStep + randomOffset;
          return {
            id: `related-${centerWord}-${word}`,
            data: { label: word, depth },
            position: {
              x: center.x + (baseRadius + (depth - 1) * spreadStep) * Math.cos(angle),
              y: center.y + (baseRadius + (depth - 1) * spreadStep) * Math.sin(angle)
            },
            type: "default"
          };
        });
        setNodes([centerNode, ...relatedNodes]);
        setEdges(
          relatedNodes.map((n) => ({
            id: `e-${centerId}-${n.id}`,
            source: centerId,
            target: n.id
          }))
        );
      }, 500);
    },
    [reactFlow]
  );

  // Node click handler to expand web
  const onNodeClick: NodeMouseHandler = async (_event, node) => {
    // Only expand if not the center node and not already expanded
    if (node.id.startsWith("related-") || node.id.startsWith("expanded-")) {
      // Prevent duplicate expansion
      if (nodes.some((n) => n.id.startsWith(`expanded-${node.id}-`))) return;
      // Fetch related words
      const results = await searchDatamuse(node.data.label);
      const related = results.slice(0, 8).map((w: any) => w.word);
      // Determine depth for this expansion
      const parentDepth = node.data.depth ?? 1;
      const depth = parentDepth + 1;
      const baseRadius = 180;
      const spreadStep = 120;
      const angleStep = (2 * Math.PI) / Math.max(related.length, 1);
      const randomOffset = Math.random() * 2 * Math.PI;
      const newNodes: Node[] = related.map((word, i) => {
        const angle = i * angleStep + randomOffset;
        return {
          id: `expanded-${node.id}-${word}`,
          data: { label: word, depth },
          position: {
            x: node.position.x + (baseRadius + (depth - 1) * spreadStep) * Math.cos(angle),
            y: node.position.y + (baseRadius + (depth - 1) * spreadStep) * Math.sin(angle)
          },
          type: "default"
        };
      });
      setNodes((prev) => [...prev, ...newNodes]);
      setEdges((prev) => [
        ...prev,
        ...newNodes.map((n) => ({
          id: `e-${node.id}-${n.id}`,
          source: node.id,
          target: n.id
        }))
      ]);
      // Zoom out a bit
      const currentZoom = reactFlow.getZoom();
      reactFlow.setViewport({
        x: 0,
        y: 0,
        zoom: Math.max(0.5, currentZoom - 0.15)
      });
    }
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        panOnDrag
        minZoom={0.5}
        maxZoom={2}
        className="w-full h-full"
        onNodeClick={onNodeClick}>
        <Background variant="lines" gap={40} size={1} color="rgba(0, 0, 0, 0.1)" />
        <Controls />
      </ReactFlow>
      {/* Overlay Sidebar */}
      <Sidebar onSearch={createWordWeb} />
    </>
  );
}
