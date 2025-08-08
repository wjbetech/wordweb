// src/types/common.ts
export type LineStyle =
  | "default"
  | "straight"
  | "smoothstep"
  | "step"
  | "bezier";

export interface TooltipData {
  word: string;
  score?: number;
  tags?: string[];
  nodeId: string;
  isVisible: boolean;
  isPinned: boolean;
  justUnpinned?: boolean;
}
