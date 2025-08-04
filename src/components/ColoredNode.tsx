import { memo } from "react";
import type { NodeProps } from "reactflow";

const ColoredNode = memo(({ data }: NodeProps) => {
  const bg = data?.color?.bg || "#fff";
  const color = data?.color?.text || "#222";
  return (
    <div
      style={{
        background: bg,
        color,
        borderRadius: 12,
        padding: "10px 18px",
        fontWeight: 700,
        fontSize: 18,
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        border: `2px solid ${color}`,
        minWidth: 60,
        textAlign: "center",
        userSelect: "none"
      }}>
      {data.label}
    </div>
  );
});

export default ColoredNode;
