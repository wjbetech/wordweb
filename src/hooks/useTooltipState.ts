import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { Node } from "reactflow";

export interface TooltipData {
  word: string;
  score?: number;
  tags?: string[];
  nodeId: string;
  isVisible: boolean;
  isPinned: boolean;
  justUnpinned?: boolean;
}

export function useTooltipState() {
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    word: "",
    nodeId: "",
    isVisible: false,
    isPinned: false,
    justUnpinned: false,
  });

  // Force tooltip re-renders when viewport changes
  const [tooltipUpdate, setTooltipUpdate] = useState(0);

  const reactFlow = useReactFlow();

  const showTooltip = useCallback(
    (data: {
      word: string;
      score?: number;
      tags?: string[];
      nodeId: string;
    }) => {
      setTooltipData({
        ...data,
        isVisible: true,
        isPinned: false,
        justUnpinned: false,
      });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipData((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const pinTooltip = useCallback(
    (data: {
      word: string;
      score?: number;
      tags?: string[];
      nodeId: string;
    }) => {
      setTooltipData({
        ...data,
        isVisible: true,
        isPinned: true,
      });
    },
    []
  );

  const unpinTooltip = useCallback(() => {
    setTooltipData((prev) => ({
      ...prev,
      isPinned: false,
      isVisible: true,
    }));
  }, []);

  const closeTooltip = useCallback(() => {
    setTooltipData((prev) => ({
      ...prev,
      isVisible: false,
      isPinned: false,
    }));
  }, []);

  const forceTooltipUpdate = useCallback(() => {
    if (tooltipData.isVisible && tooltipData.isPinned) {
      setTooltipUpdate((prev) => prev + 1);
    }
  }, [tooltipData.isVisible, tooltipData.isPinned]);

  // Helper: calculate tooltip screen position from node ID
  const getTooltipPosition = useCallback(
    (nodeId: string, nodes: Node[]): { x: number; y: number } => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };

      // Get the current viewport (tooltipUpdate forces recalculation on viewport changes)
      const viewport = reactFlow.getViewport();

      // Calculate screen position from node position and viewport
      // Position tooltip to the right and slightly above the node
      const screenX = node.position.x * viewport.zoom + viewport.x + 150; // offset to right of node
      const screenY = node.position.y * viewport.zoom + viewport.y - 10; // slightly above node

      return { x: screenX, y: screenY };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlow, tooltipUpdate]
  );

  return {
    tooltipData,
    showTooltip,
    hideTooltip,
    pinTooltip,
    unpinTooltip,
    closeTooltip,
    forceTooltipUpdate,
    getTooltipPosition,
  };
}
