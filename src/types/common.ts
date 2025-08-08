// src/types/common.ts
export type LineStyle = "default" | "straight" | "smoothstep";

export interface TooltipData {
  word: string;
  score?: number;
  tags?: string[];
  nodeId: string;
  isVisible: boolean;
  isPinned: boolean;
  justUnpinned?: boolean;
}
