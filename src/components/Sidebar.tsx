// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { searchDatamuse } from "../api/datamuse";
import type { DatamuseWord } from "../types/Datamuse";
import Spinner from "./Spinner";
import { themeClasses } from "../utils/themeUtils";

type LineStyle = "default" | "straight" | "smoothstep";

type SidebarProps = {
  onSearch?: (centerWord: string, related: DatamuseWord[]) => void;
  onLineStyleChange?: (style: LineStyle) => void;
  currentLineStyle?: LineStyle;
  onThemeChange?: (isDark: boolean) => void;
  isDark?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onSave?: () => void;
  onClear?: () => void;
  recentSearches?: string[];
  onRecentSearchesChange?: (searches: string[]) => void;
  sidebarOpen?: boolean;
  onSidebarToggle?: (open: boolean) => void;
  onTooltipToggle?: (enabled: boolean) => void;
  tooltipsEnabled?: boolean;
};

import ThemeToggle from "./ThemeToggle";

export default function Sidebar({
  onSearch,
  onLineStyleChange,
  currentLineStyle = "smoothstep",
  onThemeChange,
  isDark = false,
  isLoading: externalLoading = false,
  error = null,
  onSave,
  onClear,
  recentSearches: externalRecentSearches = [],
  onRecentSearchesChange,
  sidebarOpen: externalSidebarOpen,
  onSidebarToggle,
  onTooltipToggle,
  tooltipsEnabled = true,
}: SidebarProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<"main" | "settings">("main");

  // Tooltip preference state with localStorage persistence
  const [showTooltips, setShowTooltips] = useState(() => {
    if (tooltipsEnabled !== undefined) return tooltipsEnabled;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("showTooltips");
      return stored === null ? true : stored === "true";
    }
    return true;
  });

  // Persist sidebar state in localStorage (fallback if no external state)
  const [open, setOpen] = useState(() => {
    if (externalSidebarOpen !== undefined) return externalSidebarOpen;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarOpen");
      return stored === null ? false : stored === "true";
    }
    return false;
  });

  // Use external recent searches or fallback to localStorage
  const recent =
    externalRecentSearches.length > 0
      ? externalRecentSearches
      : (() => {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("recentSearches");
            return stored ? JSON.parse(stored) : [];
          }
          return [];
        })();

  // Search term and loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync sidebar state with external handler
  useEffect(() => {
    if (onSidebarToggle && externalSidebarOpen !== open) {
      onSidebarToggle(open);
    }
    if (typeof window !== "undefined" && externalSidebarOpen === undefined) {
      localStorage.setItem("sidebarOpen", open.toString());
    }
  }, [open, onSidebarToggle, externalSidebarOpen]);

  // Sync tooltip preference with external handler and localStorage
  useEffect(() => {
    if (onTooltipToggle && tooltipsEnabled !== showTooltips) {
      onTooltipToggle(showTooltips);
    }
    if (typeof window !== "undefined" && tooltipsEnabled === undefined) {
      localStorage.setItem("showTooltips", showTooltips.toString());
    }
  }, [showTooltips, onTooltipToggle, tooltipsEnabled]);

  // Handle search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const combinedLoading = isLoading || externalLoading;
    if (!searchTerm.trim() || combinedLoading) return;

    setIsLoading(true);

    // Add to recent searches through external handler or fallback
    if (onRecentSearchesChange) {
      const updated = [
        searchTerm,
        ...externalRecentSearches.filter((t: string) => t !== searchTerm),
      ].slice(0, 5);
      onRecentSearchesChange(updated);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      const current = stored ? JSON.parse(stored) : [];
      const updated = [
        searchTerm,
        ...current.filter((t: string) => t !== searchTerm),
      ].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }

    // Call Datamuse API and trigger word web
    try {
      // Add artificial delay for better UX feedback (minimum 800ms)
      const [results] = await Promise.all([
        searchDatamuse(searchTerm),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      // Get 5-8 related words (or less if not enough)
      const related = results.slice(0, 8);
      if (onSearch) await onSearch(searchTerm, related);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle removing a search term from recent searches
  function handleRemoveRecentSearch(termToRemove: string, e: React.MouseEvent) {
    e.stopPropagation(); // Prevent triggering the search when clicking delete
    const combinedLoading = isLoading || externalLoading;
    if (combinedLoading) return;

    if (onRecentSearchesChange) {
      const updated = externalRecentSearches.filter(
        (term: string) => term !== termToRemove
      );
      onRecentSearchesChange(updated);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      const current = stored ? JSON.parse(stored) : [];
      const updated = current.filter((term: string) => term !== termToRemove);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  }

  // Handle clicking a recent search term
  function handleRecentSearchClick(term: string) {
    const combinedLoading = isLoading || externalLoading;
    if (combinedLoading) return;
    setSearchTerm(term);
  }

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`fixed top-4 ${
          open ? "left-3" : "left-0"
        } h-[70vh] w-64 rounded-xl shadow-xl p-3 z-20 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${themeClasses.sidebarBg(isDark)}`}
        style={{
          fontFamily:
            "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        {/* Header controls */}
        <div className="absolute top-3 left-0 right-3 flex justify-between items-center px-3">
          <button
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer z-50 text-2xl bg-transparent focus:outline-none ${themeClasses.buttonHover(
              isDark
            )}`}
            style={{ background: "none" }}
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            ←
          </button>
          <ThemeToggle
            isDark={isDark}
            onToggle={() => onThemeChange?.(!isDark)}
          />
        </div>
        {/* Scrollable content area */}
        <div className="mt-12 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3 pr-1">
            <h2
              className={`text-base font-bold ${themeClasses.primaryText(
                isDark
              )}`}
            >
              wordweb. Controls
            </h2>

            {/* Error message */}
            {error && (
              <div className={themeClasses.errorContainer(isDark)}>
                <div className="flex items-start gap-2">
                  <span className={themeClasses.errorIcon()}>⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Search input */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-2">
              <label className="input input-sm flex-1 flex items-center gap-2">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  className="grow text-sm"
                  placeholder="Search a word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading || externalLoading}
                  style={{ fontSize: "14px" }}
                />
              </label>
              <button
                type="submit"
                className="btn btn-success btn-sm text-[14px] min-w-[60px] flex items-center justify-center"
                disabled={isLoading || externalLoading || !searchTerm.trim()}
              >
                {isLoading || externalLoading ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  "Go"
                )}
              </button>
            </form>

            {/* Recent searches */}
            {recent.length > 0 && (
              <div>
                <div
                  className={`text-sm mb-2 font-semibold ${themeClasses.mutedText(
                    isDark
                  )}`}
                >
                  Recent searches:
                </div>
                <div className="flex flex-wrap gap-1">
                  {recent.map((term: string) => (
                    <div
                      key={term}
                      className={`${themeClasses.searchTag(isDark)} ${
                        isLoading || externalLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span
                        onClick={() => handleRecentSearchClick(term)}
                        className="select-none"
                      >
                        {term}
                      </span>
                      <button
                        onClick={(e) => handleRemoveRecentSearch(term, e)}
                        disabled={isLoading || externalLoading}
                        className={`${themeClasses.searchTagRemove(isDark)} ${
                          isLoading || externalLoading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                        aria-label={`Remove ${term} from recent searches`}
                        title={`Remove ${term}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className={themeClasses.tabContainer(isDark)}>
              <div className="flex gap-1">
                <button
                  className={themeClasses.tabButton(
                    isDark,
                    activeTab === "main"
                  )}
                  onClick={() => setActiveTab("main")}
                >
                  Main
                </button>
                <button
                  className={themeClasses.tabButton(
                    isDark,
                    activeTab === "settings"
                  )}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "main" && (
              <div
                className={`
              border rounded-lg p-4 space-y-4
              ${
                isDark
                  ? "border-zinc-600 bg-zinc-900/30"
                  : "border-gray-200 bg-gray-50/50"
              }
            `}
              >
                {/* Line style selector */}
                <div>
                  <label
                    className={`block text-sm mb-2 font-semibold ${themeClasses.secondaryText(
                      isDark
                    )}`}
                  >
                    Line Style
                  </label>
                  <div className="dropdown dropdown-bottom w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className={themeClasses.dropdownButton(isDark)}
                    >
                      {currentLineStyle === "smoothstep"
                        ? "Smooth Step"
                        : currentLineStyle === "default"
                        ? "Default"
                        : currentLineStyle === "straight"
                        ? "Straight"
                        : currentLineStyle}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className={themeClasses.dropdownMenu(isDark)}
                    >
                      <li>
                        <a
                          onClick={() => onLineStyleChange?.("default")}
                          className={themeClasses.dropdownItem(isDark)}
                        >
                          Default
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => onLineStyleChange?.("straight")}
                          className={themeClasses.dropdownItem(isDark)}
                        >
                          Straight
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => onLineStyleChange?.("smoothstep")}
                          className={themeClasses.dropdownItem(isDark)}
                        >
                          Smooth Step
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className={`
                border-t pt-4 space-y-2
                ${isDark ? "border-zinc-600" : "border-gray-200"}
              `}
                >
                  <div
                    className={`text-xs font-semibold mb-3 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Wordweb Actions
                  </div>
                  <button
                    className={`
                    btn btn-primary btn-wide btn-sm text-[14px] border
                    ${isDark ? "border-blue-600" : "border-blue-300"}
                  `}
                    disabled={isLoading || externalLoading}
                    onClick={onSave}
                  >
                    💾 Save wordweb
                  </button>
                  <button
                    className={`
                  btn btn-accent btn-wide btn-sm text-[14px] border
                  ${isDark ? "border-teal-600" : "border-teal-300"}
                `}
                    disabled={isLoading || externalLoading}
                  >
                    📂 Load wordweb
                  </button>
                  <button
                    className={`btn btn-error btn-wide btn-sm text-[14px] border ${themeClasses.errorButtonBorder(
                      isDark
                    )}`}
                    disabled={isLoading || externalLoading}
                    onClick={onClear}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div
                className={`
              border rounded-lg p-4 space-y-4
              ${
                isDark
                  ? "border-zinc-600 bg-zinc-900/30"
                  : "border-gray-200 bg-gray-50/50"
              }
            `}
              >
                {/* Settings Panel */}
                <div className="space-y-4">
                  <div
                    className={`text-sm font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    🎛️ Feature Toggles
                  </div>

                  {/* Feature toggles section */}
                  <div
                    className={`
                  border rounded-lg p-3 space-y-3
                  ${
                    isDark
                      ? "border-zinc-700 bg-zinc-800/50"
                      : "border-gray-200 bg-white/80"
                  }
                `}
                  >
                    <div className="form-control w-full">
                      <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                        <input
                          type="checkbox"
                          className={`
                        toggle toggle-sm flex-shrink-0
                        ${isDark ? "toggle-primary" : "toggle-success"}
                      `}
                          checked={showTooltips}
                          onChange={(e) => setShowTooltips(e.target.checked)}
                        />
                        <span className={themeClasses.toggleLabel(isDark)}>
                          Show tooltips
                        </span>
                      </label>
                    </div>

                    <div className="form-control w-full">
                      <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                        <input
                          type="checkbox"
                          className={`
                        toggle toggle-sm flex-shrink-0
                        ${isDark ? "toggle-primary" : "toggle-success"}
                      `}
                          disabled
                        />
                        <span className={themeClasses.toggleLabel(isDark)}>
                          Auto-save progress
                        </span>
                      </label>
                    </div>

                    <div className="form-control w-full">
                      <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                        <input
                          type="checkbox"
                          className={`
                        toggle toggle-sm flex-shrink-0
                        ${isDark ? "toggle-primary" : "toggle-success"}
                      `}
                          disabled
                        />
                        <span className={themeClasses.toggleLabel(isDark)}>
                          Sound effects
                        </span>
                      </label>
                    </div>

                    <div className="form-control w-full">
                      <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                        <input
                          type="checkbox"
                          className={`
                        toggle toggle-sm flex-shrink-0
                        ${isDark ? "toggle-primary" : "toggle-success"}
                      `}
                          disabled
                        />
                        <span className={themeClasses.toggleLabel(isDark)}>
                          Animations
                        </span>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`border-t pt-4 ${
                      isDark ? "border-zinc-600" : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-sm font-semibold mb-3 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      ⚙️ Advanced
                    </div>

                    <div
                      className={`
                    border rounded-lg p-3 space-y-3
                    ${
                      isDark
                        ? "border-zinc-700 bg-zinc-800/50"
                        : "border-gray-200 bg-white/80"
                    }
                  `}
                    >
                      <div className="form-control w-full">
                        <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                          <input
                            type="checkbox"
                            className={`
                          toggle toggle-sm flex-shrink-0
                          ${isDark ? "toggle-warning" : "toggle-warning"}
                        `}
                            disabled
                          />
                          <span className={themeClasses.toggleLabel(isDark)}>
                            Debug mode
                          </span>
                        </label>
                      </div>

                      <div className="form-control w-full">
                        <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
                          <input
                            type="checkbox"
                            className={`
                          toggle toggle-sm flex-shrink-0
                          ${isDark ? "toggle-info" : "toggle-info"}
                        `}
                            disabled
                          />
                          <span className={themeClasses.toggleLabel(isDark)}>
                            Performance mode
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>{" "}
          {/* End scrollable content */}
        </div>{" "}
        {/* End scrollable container */}
      </div>

      {/* Minimal toggle button when sidebar is closed */}
      {!open && (
        <button
          className={`
            fixed top-4 left-0 z-50 px-3 py-3 rounded-r-lg shadow-lg transition-all duration-200 cursor-pointer text-xl border-r border-t border-b
            ${
              isDark
                ? "bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600 hover:shadow-zinc-600/50"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:shadow-slate-400/50"
            }
            hover:px-4 hover:shadow-xl
          `}
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <span className="block transform transition-transform duration-200 hover:scale-110">
            ☰
          </span>
        </button>
      )}
    </>
  );
}
