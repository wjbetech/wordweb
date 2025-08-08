import { useState, useCallback } from "react";

export function useLoadingState() {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isUpdatingLineStyle, setIsUpdatingLineStyle] = useState(false);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  const startInitialLoading = useCallback(() => {
    setIsInitialLoading(true);
  }, []);

  const stopInitialLoading = useCallback(() => {
    setIsInitialLoading(false);
  }, []);

  const startLineStyleUpdate = useCallback(() => {
    setIsUpdatingLineStyle(true);
  }, []);

  const stopLineStyleUpdate = useCallback(() => {
    setIsUpdatingLineStyle(false);
  }, []);

  const addLoadingNode = useCallback((nodeId: string) => {
    setLoadingNodes((prev) => new Set([...prev, nodeId]));
  }, []);

  const removeLoadingNode = useCallback((nodeId: string) => {
    setLoadingNodes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const isNodeLoading = useCallback(
    (nodeId: string) => {
      return loadingNodes.has(nodeId);
    },
    [loadingNodes]
  );

  return {
    isInitialLoading,
    isUpdatingLineStyle,
    loadingNodes,
    startInitialLoading,
    stopInitialLoading,
    startLineStyleUpdate,
    stopLineStyleUpdate,
    addLoadingNode,
    removeLoadingNode,
    isNodeLoading,
  };
}
