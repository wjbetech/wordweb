import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import Spinner from "./Spinner";

const ColoredNode = memo(({ data }: NodeProps) => {
  // Removed unused bg and color variables
  const isExpanded = data?.isExpanded || false;
  const isLoading = data?.isLoading || false;
  const isCore = data?.isCore || false;
  // DaisyUI purple for expanded nodes (except core)
  const expandedPurple = "#a21caf"; // Tailwind purple-700
  // Muted overlay for inactive nodes
  const mutedOverlay = "rgba(243,244,246,0.85)"; // Tailwind gray-100 with opacity
  let bgColor = data?.color || "#f3f4f6";
  // All nodes should have white text
  const textColor = "#fff";

  if (isCore) {
    bgColor = data?.color || "#3b82f6";
  } else if (isExpanded) {
    bgColor = expandedPurple;
  } else {
    bgColor = `linear-gradient(0deg, ${mutedOverlay}, ${mutedOverlay}), ${data?.color || "#f3f4f6"}`;
  }

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
          px-5 py-2 min-w-[60px] text-center select-none flex items-center justify-center gap-2
          font-medium text-[17px] leading-tight
          cursor-${isLoading ? "not-allowed" : "pointer"}
        `}
        style={{
          background: bgColor,
          color: textColor,
          opacity: isLoading ? 0.7 : 1,
          fontWeight: 500,
          backgroundBlendMode: !isCore && !isExpanded ? "multiply" : undefined
        }}>
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
