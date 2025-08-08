import { useState, useCallback, useEffect } from "react";
import { loadUserPreferences } from "../utils/localStorage";

/**
 * Custom hook for managing user preferences and settings
 * Handles sidebar state, tooltips, recent searches, etc.
 */
export const useUserPreferences = () => {
  // Cleanup deprecated localStorage keys/fields
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      // Remove standalone key if it exists
      localStorage.removeItem("dualWordMode");

      // Strip deprecated field from stored user preferences
      const UP_KEY = "wordweb_user_preferences";
      const upRaw = localStorage.getItem(UP_KEY);
      if (upRaw) {
        const up = JSON.parse(upRaw);
        if (up && Object.prototype.hasOwnProperty.call(up, "dualWordMode")) {
          delete up.dualWordMode;
          localStorage.setItem(UP_KEY, JSON.stringify(up));
        }
      }

      // Strip deprecated field from stored app state
      const APP_KEY = "wordweb_app_state";
      const appRaw = localStorage.getItem(APP_KEY);
      if (appRaw) {
        const app = JSON.parse(appRaw);
        if (app && Object.prototype.hasOwnProperty.call(app, "dualWordMode")) {
          delete app.dualWordMode;
          localStorage.setItem(APP_KEY, JSON.stringify(app));
        }
      }
    } catch {
      // no-op
    }
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.sidebarOpen ?? false;
  });

  const [tooltipsEnabled, setTooltipsEnabled] = useState(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.tooltipsEnabled ?? true;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.recentSearches ?? [];
  });

  // Toggle sidebar state
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Toggle tooltips
  const toggleTooltips = useCallback(() => {
    setTooltipsEnabled((prev) => !prev);
  }, []);

  // Add search to recent searches
  const addRecentSearch = useCallback((searchTerm: string) => {
    setRecentSearches((prev) => {
      const updated = [
        searchTerm,
        ...prev.filter((term) => term !== searchTerm),
      ].slice(0, 5);
      return updated;
    });
  }, []);

  // Remove search from recent searches
  const removeRecentSearch = useCallback((searchTerm: string) => {
    setRecentSearches((prev) => prev.filter((term) => term !== searchTerm));
  }, []);

  return {
    sidebarOpen,
    tooltipsEnabled,
    recentSearches,
    setSidebarOpen,
    setTooltipsEnabled,
    setRecentSearches,
    toggleSidebar,
    toggleTooltips,
    addRecentSearch,
    removeRecentSearch,
  };
};
