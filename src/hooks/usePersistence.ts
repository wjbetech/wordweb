// src/hooks/usePersistence.ts
import { useEffect, useCallback } from "react";
import type { Node, Edge } from "reactflow";
import {
  saveUserPreferences,
  saveAppState,
  loadAppState,
  clearAppState,
  type UserPreferences,
  type AppState,
  isStorageAvailable,
} from "../utils/localStorage";
import type { LineStyle } from "../types/common";

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
  tooltipsEnabled: boolean;
}

interface UsePersistenceReturn {
  saveCurrentState: () => void;
  loadSavedState: () => AppState | null;
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
  recentSearches,
  tooltipsEnabled,
}: UsePersistenceProps): UsePersistenceReturn => {
  const isStorageSupported = isStorageAvailable();

  // Auto-save app state when it changes (debounced)
  useEffect(() => {
    if (!isStorageSupported || nodes.length === 0) return;

    const timeoutId = setTimeout(() => {
      const appState: AppState = {
        nodes,
        edges,
        expandedNodes: Array.from(expandedNodes),
        usedWords: Array.from(usedWords),
        viewport,
        centerWord,
        lineStyle,
        sidebarOpen,
        recentSearches,
        tooltipsEnabled,
      };
      saveAppState(appState);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [
    nodes,
    edges,
    expandedNodes,
    usedWords,
    viewport,
    centerWord,
    lineStyle,
    sidebarOpen,
    recentSearches,
    tooltipsEnabled,
    isStorageSupported,
  ]);

  // Auto-save user preferences when they change
  useEffect(() => {
    if (!isStorageSupported) return;

    const preferences: UserPreferences = {
      theme: isDark ? "dark" : "light",
      lineStyle,
      sidebarOpen,
      recentSearches,
      tooltipsEnabled,
    };
    saveUserPreferences(preferences);
  }, [
    isDark,
    lineStyle,
    sidebarOpen,
    recentSearches,
    tooltipsEnabled,
    isStorageSupported,
  ]);

  const saveCurrentState = useCallback(() => {
    if (!isStorageSupported) return;

    const appState: AppState = {
      nodes,
      edges,
      expandedNodes: Array.from(expandedNodes),
      usedWords: Array.from(usedWords),
      viewport,
      centerWord,
      lineStyle,
      sidebarOpen,
      recentSearches,
      tooltipsEnabled,
    };
    saveAppState(appState);
  }, [
    nodes,
    edges,
    expandedNodes,
    usedWords,
    viewport,
    centerWord,
    lineStyle,
    sidebarOpen,
    recentSearches,
    tooltipsEnabled,
    isStorageSupported,
  ]);

  const loadSavedState = useCallback(() => {
    if (!isStorageSupported) return null;
    return loadAppState();
  }, [isStorageSupported]);

  const clearSavedState = useCallback(() => {
    if (!isStorageSupported) return;
    clearAppState();
  }, [isStorageSupported]);

  return {
    saveCurrentState,
    loadSavedState,
    clearSavedState,
    isStorageSupported,
  };
};
