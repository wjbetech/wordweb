// src/utils/localStorage.ts
import type { Node, Edge } from "reactflow";

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  expandedNodes: string[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  centerWord?: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  lineStyle: "default" | "straight" | "smoothstep" | "step" | "bezier";
  sidebarOpen: boolean;
  recentSearches: string[];
}

const STORAGE_KEYS = {
  GRAPH_STATE: "wordweb_graph_state",
  USER_PREFERENCES: "wordweb_user_preferences",
  LAST_SAVED: "wordweb_last_saved"
} as const;

// Graph state management
export const saveGraphState = (state: GraphState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GRAPH_STATE, JSON.stringify(state));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error("Failed to save graph state:", error);
  }
};

export const loadGraphState = (): GraphState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GRAPH_STATE);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load graph state:", error);
    return null;
  }
};

export const clearGraphState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.GRAPH_STATE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch (error) {
    console.error("Failed to clear graph state:", error);
  }
};

// User preferences management
export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save user preferences:", error);
  }
};

export const loadUserPreferences = (): UserPreferences | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load user preferences:", error);
    return null;
  }
};

// Utility functions
export const getLastSavedTime = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
  } catch (error) {
    console.error("Failed to get last saved time:", error);
    return null;
  }
};

export const isStorageAvailable = (): boolean => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
