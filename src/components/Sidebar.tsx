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
  isDark = false,
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
      const updated = [
        searchTerm,
        ...prev.filter((t) => t !== searchTerm),
      ].slice(0, 8);
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
        } h-[70vh] w-64 rounded-xl bg-zinc-800 shadow-xl p-3 z-20 transform transition-transform duration-300  ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          fontFamily:
            "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        {/* Header controls */}
        <div className="absolute top-3 left-0 right-3 flex justify-between items-center px-3">
          <button
            className="px-2 py-1 text-white rounded-lg transition-colors cursor-pointer z-50 text-2xl bg-transparent hover:bg-[#4c5c68] focus:outline-none "
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
        <div className="mt-12 flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-100">
            wordweb. Controls
          </h2>
          {/* Search input */}
          <form onSubmit={handleSearch} className="flex gap-2">
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
                className="grow"
                placeholder="Search a word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-soft btn-success btn-sm">
              Go
            </button>
          </form>

          {/* Recent searches */}
          {recent.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Recent searches:</div>
              <div className="flex flex-wrap gap-1">
                {recent.map((term) => (
                  <div
                    key={term}
                    className="relative bg-zinc-700 text-gray-200 rounded px-2 py-1 text-xs hover:bg-zinc-600 cursor-pointer flex items-center gap-2 "
                  >
                    <span
                      onClick={() => handleRecentSearchClick(term)}
                      className="select-none"
                    >
                      {term}
                    </span>
                    <button
                      onClick={(e) => handleRemoveRecentSearch(term, e)}
                      className="text-gray-400 hover:text-red-400 text-sm leading-none cursor-pointer transition-colors duration-200 font-bold"
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

          {/* Line style selector */}
          <div className="mt-4">
            <label className="block text-xs text-gray-300 mb-2">
              Line Style
            </label>
            <select
              value={currentLineStyle}
              onChange={(e) => onLineStyleChange?.(e.target.value as LineStyle)}
              className="w-full bg-zinc-700 text-gray-200 rounded px-2 py-1 cursor-pointer hover:bg-zinc-600 text-sm"
            >
              <option value="default">Default</option>
              <option value="straight">Straight</option>
              <option value="smoothstep">Smooth Step</option>
              <option value="step">Step</option>
              <option value="bezier">Bezier</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-3">
            <button className="btn btn-soft btn-success btn-wide btn-sm">
              Save wordweb
            </button>
            <button className="btn btn-soft btn-info btn-wide btn-sm">
              Load wordweb
            </button>
            <button className="btn btn-soft btn-error btn-wide btn-sm">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Minimal toggle button when sidebar is closed */}
      {!open && (
        <button
          className="fixed top-4 left-0 z-50 px-2 py-2 bg-zinc-800 text-white rounded-r-lg shadow hover:bg-zinc-800/90 transition-colors cursor-pointer text-2xl "
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      )}
    </>
  );
}
