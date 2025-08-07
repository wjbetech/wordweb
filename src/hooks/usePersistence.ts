// src/hooks/usePersistence.ts
import { useEffect, useCallback } from "react";
import type { Node, Edge } from "reactflow";
import {
  saveGraphState,
  loadGraphState,
  clearGraphState,
  saveUserPreferences,
  type GraphState,
  type UserPreferences,
  isStorageAvailable
} from "../utils/localStorage";

type LineStyle = "default" | "straight" | "smoothstep" | "step" | "bezier";

interface UsePersistenceProps {
  nodes: Node[];
  edges: Edge[];
  expandedNodes: Set<string>;
  usedWords: Set<string>;
  viewport: { x: number; y: number; zoom: number };
  centerWord?: string;
  isDark: boolean;
  lineStyle: LineStyle;
  sidebarOpen: boolean;
  recentSearches: string[];
}

interface UsePersistenceReturn {
  saveCurrentState: () => void;
  loadSavedState: () => GraphState | null;
  clearSavedState: () => void;
  isStorageSupported: boolean;
}

export const usePersistence = ({
  nodes,
  edges,
  expandedNodes,
  usedWords,
  viewport,
  centerWord,
  isDark,
  lineStyle,
  sidebarOpen,
  recentSearches
}: UsePersistenceProps): UsePersistenceReturn => {
  const isStorageSupported = isStorageAvailable();

  // Auto-save graph state when it changes (debounced)
  useEffect(() => {
    if (!isStorageSupported || nodes.length === 0) return;

    const timeoutId = setTimeout(() => {
      const graphState: GraphState = {
        nodes,
        edges,
        expandedNodes: Array.from(expandedNodes),
        usedWords: Array.from(usedWords),
        viewport,
        centerWord
      };
      saveGraphState(graphState);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, expandedNodes, usedWords, viewport, centerWord, isStorageSupported]);

  // Auto-save user preferences when they change
  useEffect(() => {
    if (!isStorageSupported) return;

    const preferences: UserPreferences = {
      theme: isDark ? "dark" : "light",
      lineStyle,
      sidebarOpen,
      recentSearches
    };
    saveUserPreferences(preferences);
  }, [isDark, lineStyle, sidebarOpen, recentSearches, isStorageSupported]);

  const saveCurrentState = useCallback(() => {
    if (!isStorageSupported) return;

    const graphState: GraphState = {
      nodes,
      edges,
      expandedNodes: Array.from(expandedNodes),
      usedWords: Array.from(usedWords),
      viewport,
      centerWord
    };
    saveGraphState(graphState);
  }, [nodes, edges, expandedNodes, usedWords, viewport, centerWord, isStorageSupported]);

  const loadSavedState = useCallback(() => {
    if (!isStorageSupported) return null;
    return loadGraphState();
  }, [isStorageSupported]);

  const clearSavedState = useCallback(() => {
    if (!isStorageSupported) return;
    clearGraphState();
  }, [isStorageSupported]);

  return {
    saveCurrentState,
    loadSavedState,
    clearSavedState,
    isStorageSupported
  };
};
