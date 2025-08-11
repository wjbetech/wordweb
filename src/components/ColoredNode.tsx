import { memo, useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import Spinner from "./Spinner";

// Extend props to accept setNodeDraggable and id
// ...existing code...

const ColoredNode = memo(({ data }: NodeProps) => {
  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 350);
    return () => clearTimeout(timer);
  }, []);
  const isExpanded = data?.isExpanded || false;
  const isLoading = data?.isLoading || false;
  const isCore = data?.isCore || false;
  // DaisyUI purple for expanded nodes (except core)
  const expandedPurple = "#a21caf"; // Tailwind purple-700
  // Muted overlay for inactive nodes
  const mutedOverlay = "rgba(243,244,246,0.85)"; // Tailwind gray-100 with opacity
  let bgColor = data?.color || "#f3f4f6";
  // Use white text for core/expanded, dark for muted/inactive
  let textColor = "#fff";
  if (isCore) {
    bgColor = data?.color || "#3b82f6";
    textColor = "#fff";
  } else if (isExpanded) {
    bgColor = expandedPurple;
    textColor = "#fff";
  } else {
    bgColor = `linear-gradient(0deg, ${mutedOverlay}, ${mutedOverlay}), ${data?.color || "#f3f4f6"}`;
    textColor = "#222";
  }

  // Show drag handle if this node's tooltip is open or pinned

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#60a5fa",
          width: 8,
          height: 8,
          border: "2px solid white"
        }}
      />
      <div
        className={`
          transition-all duration-200
          rounded-2xl shadow-md border border-base-200
          px-5 min-w-[60px] select-none flex justify-center items-center gap-2
          font-medium text-[17px] leading-tight
          group
          ${isNew ? "animate-pop-in" : ""}
        `}
        style={{
          background: bgColor,
          color: textColor,
          opacity: isLoading ? 0.7 : 1,
          fontWeight: 500,
          backgroundBlendMode: !isCore && !isExpanded ? "multiply" : undefined,
          position: "relative",
          cursor: "pointer",
          height: 44, // fixed height for perfect vertical centering
          paddingTop: 0,
          paddingBottom: 0
        }}>
        {/* Drag handle removed: node is now always draggable and clickable */}
        {isLoading ? (
          <>
            <Spinner size="sm" className={isExpanded ? "text-primary-content" : "text-base-content"} />
            <span className="text-sm">Loading...</span>
          </>
        ) : (
          <span className="truncate w-full">{data.label}</span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#60a5fa",
          width: 8,
          height: 8,
          border: "2px solid white"
        }}
      />
    </>
  );
});

export default ColoredNode;
