// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { searchDatamuse } from "../api/datamuse";
import type { DatamuseWord } from "../types/Datamuse";

type LineStyle = "default" | "straight" | "smoothstep" | "step" | "bezier";

type SidebarProps = {
  onSearch?: (centerWord: string, related: string[]) => void;
  onLineStyleChange?: (style: LineStyle) => void;
  currentLineStyle?: LineStyle;
  onThemeChange?: (isDark: boolean) => void;
  isDark?: boolean;
};

import ThemeToggle from "./ThemeToggle";

export default function Sidebar({
  onSearch,
  onLineStyleChange,
  currentLineStyle = "smoothstep",
  onThemeChange,
  isDark = false
}: SidebarProps) {
  // Persist sidebar state in localStorage
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarOpen");
      return stored === null ? false : stored === "true";
    }
    return false;
  });

  // Search term and recent searches
  const [searchTerm, setSearchTerm] = useState("");
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", open.toString());
      localStorage.setItem("recentSearches", JSON.stringify(recent));
    }
  }, [open, recent]);

  // Handle search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    // Add to recent searches
    setRecent((prev) => {
      const updated = [searchTerm, ...prev.filter((t) => t !== searchTerm)].slice(0, 8);
      return updated;
    });
    // Call Datamuse API and trigger word web
    try {
      const results = await searchDatamuse(searchTerm);
      // Get 5-8 related words (or less if not enough)
      const related = results.slice(0, 8).map((w: DatamuseWord) => w.word);
      if (onSearch) onSearch(searchTerm, related);
    } catch (err) {
      console.error(err);
    }
  }

  // Handle removing a search term from recent searches
  function handleRemoveRecentSearch(termToRemove: string, e: React.MouseEvent) {
    e.stopPropagation(); // Prevent triggering the search when clicking delete
    setRecent((prev) => prev.filter((term) => term !== termToRemove));
  }

  // Handle clicking a recent search term
  function handleRecentSearchClick(term: string) {
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
        } ${isDark ? "bg-zinc-800" : "bg-slate-50 border-slate-300 border shadow-lg"}`}
        style={{
          fontFamily: "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 500
        }}>
        {/* Header controls */}
        <div className="absolute top-3 left-0 right-3 flex justify-between items-center px-3">
          <button
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer z-50 text-2xl bg-transparent focus:outline-none ${
              isDark ? "text-white hover:bg-[#4c5c68]" : "text-slate-700 hover:bg-slate-200"
            }`}
            style={{ background: "none" }}
            onClick={() => setOpen(false)}
            aria-label="Close sidebar">
            ←
          </button>
          <ThemeToggle isDark={isDark} onToggle={() => onThemeChange?.(!isDark)} />
        </div>
        <div className="mt-12 flex flex-col gap-3">
          <h2 className={`text-base font-bold ${isDark ? "text-gray-100" : "text-slate-800"}`}>wordweb. Controls</h2>
          {/* Search input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <label className="input input-sm flex-1 flex items-center gap-2">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                className="grow"
                placeholder="Search a word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-success btn-sm text-[14px]">
              Go
            </button>
          </form>

          {/* Recent searches */}
          {recent.length > 0 && (
            <div>
              <div className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Recent searches:</div>
              <div className="flex flex-wrap gap-1">
                {recent.map((term) => (
                  <div
                    key={term}
                    className={`relative rounded px-2 py-1 text-xs cursor-pointer flex items-center gap-2 ${
                      isDark
                        ? "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                        : "bg-zinc-600 text-white hover:bg-zinc-700"
                    }`}>
                    <span onClick={() => handleRecentSearchClick(term)} className="select-none">
                      {term}
                    </span>
                    <button
                      onClick={(e) => handleRemoveRecentSearch(term, e)}
                      className={`text-sm leading-none cursor-pointer transition-colors duration-200 font-bold ${
                        isDark ? "text-gray-400 hover:text-red-400" : "text-gray-300 hover:text-red-300"
                      }`}
                      aria-label={`Remove ${term} from recent searches`}
                      title={`Remove ${term}`}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line style selector */}
          <div className="mt-4">
            <label className={`block text-xs mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Line Style</label>
            <div className="dropdown dropdown-bottom w-full">
              <div tabIndex={0} role="button" className="btn btn-soft btn-sm w-full justify-between">
                {currentLineStyle === "smoothstep"
                  ? "Smooth Step"
                  : currentLineStyle === "default"
                  ? "Default"
                  : currentLineStyle === "straight"
                  ? "Straight"
                  : currentLineStyle === "step"
                  ? "Step"
                  : currentLineStyle === "bezier"
                  ? "Bezier"
                  : currentLineStyle}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-lg mt-1">
                <li>
                  <a onClick={() => onLineStyleChange?.("default")}>Default</a>
                </li>
                <li>
                  <a onClick={() => onLineStyleChange?.("straight")}>Straight</a>
                </li>
                <li>
                  <a onClick={() => onLineStyleChange?.("smoothstep")}>Smooth Step</a>
                </li>
                <li>
                  <a onClick={() => onLineStyleChange?.("step")}>Step</a>
                </li>
                <li>
                  <a onClick={() => onLineStyleChange?.("bezier")}>Bezier</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-3">
            <button className="btn btn-primary btn-wide btn-sm text-[14px]">Save wordweb</button>
            <button className="btn btn-accent btn-wide btn-sm text-[14px]">Load wordweb</button>
            <button className="btn btn-error btn-wide btn-sm text-[14px]">Clear</button>
          </div>
        </div>
      </div>

      {/* Minimal toggle button when sidebar is closed */}
      {!open && (
        <button
          className={`fixed top-4 left-0 z-50 px-2 py-2 rounded-r-lg shadow transition-colors cursor-pointer text-2xl ${
            isDark
              ? "bg-zinc-800 text-white hover:bg-zinc-800/90"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-r border-t border-b border-slate-300"
          }`}
          onClick={() => setOpen(true)}
          aria-label="Open sidebar">
          ☰
        </button>
      )}
    </>
  );
}
