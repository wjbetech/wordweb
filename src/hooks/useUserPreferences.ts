import { useState, useCallback } from "react";
import { loadUserPreferences } from "../utils/localStorage";

/**
 * Custom hook for managing user preferences and settings
 * Handles sidebar state, tooltips, recent searches, etc.
 */
export const useUserPreferences = () => {
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
