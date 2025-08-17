// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { searchDatamuse } from "../api/datamuse";
import type { DatamuseWord } from "../types/Datamuse";
import SearchSection from "./SearchSection";
import SettingsPanel from "./SettingsPanel";
import MainPanel from "./MainPanel";
import { themeClasses } from "../utils/themeUtils";
import type { LineStyle } from "../types/common";
import LoadModal from "./LoadModal";
import SaveModal from "./SaveModal";
import HelpModal from "./HelpModal";
import AboutModal from "./AboutModal";
import {
  listNamedAppStates,
  saveNamedAppState,
  loadNamedAppState,
  deleteNamedAppState,
  type AppState
} from "../utils/localStorage";
import SharePanel from "./SharePanel";
import ThemeToggle from "./ThemeToggle";
import { format } from "date-fns";

type SidebarProps = {
  onSearch?: (centerWord: string, related: DatamuseWord[]) => void;
  onLineStyleChange?: (style: LineStyle) => void;
  currentLineStyle?: LineStyle;
  onThemeChange?: (isDark: boolean) => void;
  isDark?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onClear?: () => void;
  recentSearches?: string[];
  onRecentSearchesChange?: (searches: string[]) => void;
  sidebarOpen?: boolean;
  onSidebarToggle?: (open: boolean) => void;
  onTooltipToggle?: (enabled: boolean) => void;
  tooltipsEnabled?: boolean;
  onExportPNG?: () => void;
  // onExportSVG removed
  onExportPDF?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: () => void;
  hydrateAppState: (state: AppState) => void;
  onResetOnboarding?: () => void;
};

export default function Sidebar({
  onSearch,
  onLineStyleChange,
  currentLineStyle = "smoothstep",
  onThemeChange,
  isDark = false,
  isLoading: externalLoading = false,
  error = null,
  onClear,
  recentSearches: externalRecentSearches = [],
  onRecentSearchesChange,
  sidebarOpen: externalSidebarOpen,
  onSidebarToggle,
  onTooltipToggle,
  tooltipsEnabled = true,
  onExportPNG,
  // onExportSVG removed
  onExportPDF,
  onExportJSON,
  onImportJSON,
  hydrateAppState,
  onResetOnboarding
}: SidebarProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<"main" | "settings" | "share">("main");

  // Tooltip preference state with localStorage persistence
  const [showTooltips, setShowTooltips] = useState(() => {
    if (tooltipsEnabled !== undefined) {
      return tooltipsEnabled;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("showTooltips");
      const result = stored === null ? true : stored === "true";
      return result;
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

  // Load/Save modal state
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saves, setSaves] = useState(() => listNamedAppStates());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [defaultSaveName, setDefaultSaveName] = useState("");
  // Help/About modal state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

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

  // Refresh saves list when modals open
  useEffect(() => {
    if (showLoadModal || showSaveModal) setSaves(listNamedAppStates());
  }, [showLoadModal, showSaveModal]);

  // Handle search (single-term)
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const combinedLoading = isLoading || externalLoading;
    if (!searchTerm.trim() || combinedLoading) return;

    setIsLoading(true);

    // Add to recent searches through external handler or fallback
    if (onRecentSearchesChange) {
      const updated = [searchTerm, ...externalRecentSearches.filter((t: string) => t !== searchTerm)].slice(0, 5);
      onRecentSearchesChange(updated);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      const current = stored ? JSON.parse(stored) : [];
      const updated = [searchTerm, ...current.filter((t: string) => t !== searchTerm)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }

    // Call Datamuse API and trigger wordweb
    try {
      const [results] = await Promise.all([
        searchDatamuse(searchTerm),
        new Promise((resolve) => setTimeout(resolve, 800))
      ]);

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
    e.stopPropagation();
    const combinedLoading = isLoading || externalLoading;
    if (combinedLoading) return;

    if (onRecentSearchesChange) {
      const updated = externalRecentSearches.filter((term: string) => term !== termToRemove);
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

  function openLoadModal() {
    setSaves(listNamedAppStates());
    setShowLoadModal(true);
  }

  function closeLoadModal() {
    setShowLoadModal(false);
  }

  function handleLoadNamed(name: string) {
    const state = loadNamedAppState(name);
    if (!state) return;
    if (typeof hydrateAppState === "function") {
      hydrateAppState(state);
      setShowLoadModal(false);
    } else {
      try {
        localStorage.setItem("wordweb_app_state", JSON.stringify(state));
        localStorage.setItem("wordweb_last_saved", new Date().toISOString());
        location.reload();
      } catch (e) {
        console.error("Failed to load named app state", e);
      }
    }
  }

  function handleDeleteNamed(name: string) {
    deleteNamedAppState(name);
    setSaves(listNamedAppStates());
  }

  function openSaveModal() {
    // Compute default name: center word + timestamp or fallback
    let centerWord = "";
    try {
      const current = localStorage.getItem("wordweb_app_state");
      if (current) {
        const state = JSON.parse(current);
        centerWord = state.centerWord || "";
      }
    } catch (error) {
      console.log(error);
    }
    const ts = format(new Date(), "yyyyMMdd-HHmm");
    const name = centerWord ? `${centerWord}-${ts}` : `wordweb-${ts}`;
    setDefaultSaveName(name);
    setShowSaveModal(true);
  }
  function closeSaveModal() {
    setShowSaveModal(false);
  }

  // Save current app snapshot with a provided name
  function handleSaveNamed(name: string) {
    try {
      const current = localStorage.getItem("wordweb_app_state");
      if (!current) {
        alert("Nothing to save. Create a wordweb first.");
        return;
      }
      const state = JSON.parse(current) as AppState;
      saveNamedAppState(name, state);
      setSaves(listNamedAppStates());
      setShowSaveModal(false);
    } catch (e) {
      console.error("Failed to save named app state", e);
    }
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
          fontFamily: "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 500
        }}>
        {/* Header controls */}
        <div className="absolute top-3 left-0 right-3 flex justify-between items-center px-3">
          <button
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer z-50 text-2xl bg-transparent focus:outline-none ${themeClasses.buttonHover(
              isDark
            )}`}
            style={{ background: "none" }}
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            tabIndex={0}>
            ←
          </button>
          <ThemeToggle isDark={isDark} onToggle={() => onThemeChange?.(!isDark)} />
        </div>
        {/* Scrollable content area */}
        <div className="mt-12 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3 pr-1">
            <h2 className={`text-base font-bold ${themeClasses.primaryText(isDark)}`}>wordweb. Controls</h2>

            {/* Error message */}
            {error && (
              <div className={themeClasses.errorContainer(isDark)}>
                <div className="flex items-start gap-2">
                  <span className={themeClasses.errorIcon()} role="img" aria-label="Warning">
                    ⚠
                  </span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Search Section */}
            <SearchSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              isLoading={isLoading}
              externalLoading={externalLoading}
              recent={recent}
              onRecentSearchClick={handleRecentSearchClick}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              isDark={isDark}
            />

            {/* Tab Navigation and Content */}
            <div className={themeClasses.tabContainer(isDark)}>
              <div className="flex gap-1 flex-nowrap min-h-[40px]">
                <button
                  className={`btn btn-sm flex-1 normal-case font-medium ${
                    activeTab === "main" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setActiveTab("main")}
                  type="button">
                  Main
                </button>
                <button
                  className={`btn btn-sm flex-1 normal-case font-medium ${
                    activeTab === "settings" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setActiveTab("settings")}
                  type="button">
                  Settings
                </button>
                <button
                  className={`btn btn-sm flex-1 normal-case font-medium ${
                    activeTab === "share" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setActiveTab("share")}
                  type="button">
                  Share
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === "main" && (
                <div className={themeClasses.contentPanel(isDark)}>
                  {/* Line style selector */}
                  <div>
                    <label className={`block text-sm mb-2 font-semibold ${themeClasses.secondaryText(isDark)}`}>
                      Line Style
                    </label>
                    <div className="dropdown dropdown-bottom w-full">
                      <div
                        tabIndex={0}
                        role="button"
                        aria-haspopup="listbox"
                        aria-expanded="false"
                        aria-label="Select line style"
                        className={themeClasses.dropdownButton(isDark)}>
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
                          aria-hidden="true"
                          focusable="false">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <ul
                        tabIndex={0}
                        className={themeClasses.dropdownMenu(isDark)}
                        role="listbox"
                        aria-label="Line style options">
                        <li>
                          <a
                            onClick={() => onLineStyleChange?.("default")}
                            className={themeClasses.dropdownItem(isDark)}
                            role="option"
                            aria-selected={currentLineStyle === "default"}
                            tabIndex={0}>
                            Default
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => onLineStyleChange?.("straight")}
                            className={themeClasses.dropdownItem(isDark)}
                            role="option"
                            aria-selected={currentLineStyle === "straight"}
                            tabIndex={0}>
                            Straight
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => onLineStyleChange?.("smoothstep")}
                            className={themeClasses.dropdownItem(isDark)}
                            role="option"
                            aria-selected={currentLineStyle === "smoothstep"}
                            tabIndex={0}>
                            Smooth Step
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <MainPanel
                    isDark={isDark}
                    onSaveGraph={openSaveModal}
                    onLoadGraph={openLoadModal}
                    onClearGraph={onClear || (() => {})}
                    onToggleHelp={() => setShowHelpModal(true)}
                    onToggleAbout={() => setShowAboutModal(true)}
                  />
                </div>
              )}
              {activeTab === "settings" && (
                <SettingsPanel isDark={isDark} showTooltips={showTooltips} setShowTooltips={setShowTooltips} />
              )}
              {activeTab === "share" && (
                <SharePanel
                  isDark={isDark}
                  onExportPNG={onExportPNG}
                  // onExportSVG removed
                  onExportPDF={onExportPDF}
                  onExportJSON={onExportJSON}
                  onImportJSON={onImportJSON}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal toggle button when sidebar is closed */}
      {!open && (
        <button
          className={themeClasses.sidebarToggle(isDark)}
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          tabIndex={0}>
          <span className={themeClasses.toggleIcon()} role="img" aria-label="Open menu">
            ☰
          </span>
        </button>
      )}

      {/* Load Modal */}
      <LoadModal
        isOpen={showLoadModal}
        isDark={isDark}
        saves={saves}
        onClose={closeLoadModal}
        onLoad={handleLoadNamed}
        onDelete={handleDeleteNamed}
      />

      {/* Save Modal */}
      <SaveModal
        isOpen={showSaveModal}
        isDark={isDark}
        existingNames={saves.map((s) => s.name)}
        onClose={closeSaveModal}
        onSave={handleSaveNamed}
        defaultName={defaultSaveName}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        isDark={isDark}
        onClose={() => setShowHelpModal(false)}
        onResetOnboarding={onResetOnboarding}
      />

      {/* About Modal */}
      <AboutModal isOpen={showAboutModal} isDark={isDark} onClose={() => setShowAboutModal(false)} />
    </>
  );
}
