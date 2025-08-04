import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

const ColoredNode = memo(({ data }: NodeProps) => {
  const bg = data?.color?.bg || "#fff";
  const color = data?.color?.text || "#222";
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#475569",
          width: 8,
          height: 8,
          border: "2px solid white"
        }}
      />
      <div
        style={{
          background: bg,
          color,
          borderRadius: 12,
          padding: "10px 18px",
          fontWeight: 700,
          fontSize: 18,
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
          border: "none",
          minWidth: 60,
          textAlign: "center",
          userSelect: "none"
        }}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#475569",
          width: 8,
          height: 8,
          border: "2px solid white"
        }}
      />
    </>
  );
});

export default ColoredNode;
