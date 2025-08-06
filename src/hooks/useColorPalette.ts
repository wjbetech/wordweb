import { useMemo } from "react";

export const useColorPalette = () => {
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

  return colors;
};
