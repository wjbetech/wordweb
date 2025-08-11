import { memo, useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import Spinner from "./Spinner";

// Utility: Calculate luminance and contrast ratio
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const num = parseInt(c, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}
function contrastRatio(hexA: string, hexB: string) {
  const lumA = luminance(...hexToRgb(hexA));
  const lumB = luminance(...hexToRgb(hexB));
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}
function adjustBgForContrast(bg: string, text: string, minRatio = 4.5) {
  // Only works for hex backgrounds
  let rgb = hexToRgb(bg);
  let tries = 0;
  while (contrastRatio(bg, text) < minRatio && tries < 10) {
    // Lighten or darken depending on text color
    rgb = (text === "#222" ? rgb.map((v) => Math.min(255, v + 16)) : rgb.map((v) => Math.max(0, v - 16))) as [
      number,
      number,
      number
    ];
    bg = "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
    tries++;
  }
  return bg;
}

const ColoredNode = memo(({ data }: NodeProps) => {
  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 350);
    return () => clearTimeout(timer);
  }, []);
  const isLoading = data?.isLoading || false;
  const isCore = data?.isCore || false;
  const isExpanded = data?.isExpanded || false;
  // Consistent text color for all nodes
  const textColor = "#222";
  // Fun, random, or themed color from data.color, fallback to light gray
  let bgColor = data?.color || "#f3f4f6";
  // Remove overlays and gradients for consistency
  // Adjust background for contrast
  if (/^#([0-9a-f]{3}){1,2}$/i.test(bgColor)) {
    bgColor = adjustBgForContrast(bgColor, textColor, 4.5);
  } else {
    // fallback for non-hex: use default
    bgColor = "#f3f4f6";
  }

  const [hovered, setHovered] = useState(false);
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
        className={[
          "transition-all duration-200",
          "rounded-2xl shadow-md border border-base-200",
          "px-5 min-w-[60px] select-none flex justify-center items-center gap-2",
          "font-medium text-[17px] leading-tight",
          "group",
          isNew ? "animate-pop-in" : "",
          "hover:border-blue-400 hover:shadow-lg"
        ].join(" ")}
        style={{
          background: hovered ? `linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04)), ${bgColor}` : bgColor,
          color: textColor,
          opacity: isLoading ? 0.7 : 1,
          fontWeight: 500,
          backgroundBlendMode: !isCore && !isExpanded ? "multiply" : undefined,
          position: "relative",
          cursor: "pointer",
          height: 44, // fixed height for perfect vertical centering
          paddingTop: 0,
          paddingBottom: 0
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
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
