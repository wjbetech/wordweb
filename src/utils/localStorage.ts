// src/utils/localStorage.ts
import type { Node, Edge } from "reactflow";
import type { LineStyle } from "../types/common";

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  expandedNodes: string[];
  usedWords: string[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  centerWord?: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  lineStyle: LineStyle;
  sidebarOpen: boolean;
  recentSearches: string[];
  tooltipsEnabled: boolean;
}

// Combined state interface for persistence
export interface AppState extends GraphState {
  lineStyle: LineStyle;
  sidebarOpen: boolean;
  recentSearches: string[];
  tooltipsEnabled: boolean;
}

const STORAGE_KEYS = {
  GRAPH_STATE: "wordweb_graph_state",
  USER_PREFERENCES: "wordweb_user_preferences",
  LAST_SAVED: "wordweb_last_saved",
  APP_STATE: "wordweb_app_state",
} as const;

// Combined app state management
export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error("Failed to save app state:", error);
  }
};

export const loadAppState = (): AppState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load app state:", error);
    return null;
  }
};

export const clearAppState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch (error) {
    console.error("Failed to clear app state:", error);
  }
};

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
    localStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
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

// Named saves
const NAMED_SAVES_KEY = "wordweb_named_saves";

export interface NamedSaveMeta {
  name: string;
  savedAt: string; // ISO string
  centerWord?: string;
  nodeCount: number;
  edgeCount: number;
  lineStyle: LineStyle;
}

type NamedSavesStore = Record<string, { savedAt: string; state: AppState }>;

const loadNamedSavesStore = (): NamedSavesStore => {
  try {
    const raw = localStorage.getItem(NAMED_SAVES_KEY);
    return raw ? (JSON.parse(raw) as NamedSavesStore) : {};
  } catch (e) {
    console.error("Failed to load named saves store:", e);
    return {};
  }
};

const saveNamedSavesStore = (store: NamedSavesStore) => {
  try {
    localStorage.setItem(NAMED_SAVES_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Failed to save named saves store:", e);
  }
};

export const saveNamedAppState = (name: string, state: AppState): void => {
  const store = loadNamedSavesStore();
  store[name] = { savedAt: new Date().toISOString(), state };
  saveNamedSavesStore(store);
};

export const listNamedAppStates = (): NamedSaveMeta[] => {
  const store = loadNamedSavesStore();
  return Object.entries(store)
    .map(([name, entry]) => ({
      name,
      savedAt: entry.savedAt,
      centerWord: entry.state.centerWord,
      nodeCount: entry.state.nodes?.length ?? 0,
      edgeCount: entry.state.edges?.length ?? 0,
      lineStyle: entry.state.lineStyle,
    }))
    .sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
};

export const loadNamedAppState = (name: string): AppState | null => {
  const store = loadNamedSavesStore();
  const entry = store[name];
  return entry ? entry.state : null;
};

export const deleteNamedAppState = (name: string): void => {
  const store = loadNamedSavesStore();
  if (store[name]) {
    delete store[name];
    saveNamedSavesStore(store);
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
