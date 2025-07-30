import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar"; // Adjust path if needed

const initialNodes = [];
const initialEdges = [];

export default function WordMap() {
  return (
    <div className="relative w-screen h-screen bg-[#fdf6e3] overflow-hidden">
      <ReactFlowProvider>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          panOnDrag
          minZoom={0.5}
          maxZoom={2}
          className="w-full h-full"
        >
          <Background
            variant="lines"
            gap={40}
            size={1}
            color="rgba(0, 0, 0, 0.1)"
          />
          <Controls />
        </ReactFlow>

        {/* Overlay Sidebar */}
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
}
