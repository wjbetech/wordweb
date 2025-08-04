// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { searchDatamuse } from "../api/datamuse";

type SidebarProps = {
  onSearch?: (centerWord: string, related: string[]) => void;
};

export default function Sidebar({ onSearch }: SidebarProps) {
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
      const related = results.slice(0, 8).map((w: any) => w.word);
      if (onSearch) onSearch(searchTerm, related);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`fixed top-4 ${
          open ? "left-3" : "left-0"
        } h-[70vh] w-64 rounded-xl bg-zinc-800 shadow-xl p-4 z-20 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Toggle button inside sidebar */}
        <button
          className="absolute top-4 left-4 px-2 py-2 text-white rounded-lg transition-colors cursor-pointer z-50 text-3xl mb-4 bg-transparent hover:bg-[#4c5c68] focus:outline-none"
          style={{ background: "none" }}
          onClick={() => setOpen(false)}
          aria-label="Close sidebar">
          ←
        </button>
        <div className="mt-16 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-100">wordweb. Controls</h2>
          {/* Search input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              className="flex-1 min-w-0 rounded px-2 py-1 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none"
              placeholder="Search a word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 bg-green-600 hover:bg-green-500/90 text-white px-3 py-1 rounded cursor-pointer"
              style={{ maxWidth: "4.5rem" }}>
              Go
            </button>
          </form>

          {/* Recent searches */}
          {recent.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Recent searches:</div>
              <div className="flex flex-wrap gap-1">
                {recent.map((term) => (
                  <button
                    key={term}
                    className="bg-zinc-700 text-gray-200 rounded px-2 py-1 text-xs hover:bg-zinc-600 cursor-pointer"
                    onClick={() => setSearchTerm(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder action buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button className="bg-teal-700 hover:bg-teal-600/90 text-white rounded px-3 py-1 cursor-pointer">
              Save wordweb
            </button>
            <button className="bg-cyan-600 hover:bg-cyan-500/90 text-white rounded px-3 py-1 cursor-pointer">
              Load wordweb
            </button>
            <button className="bg-red-600 hover:bg-red-500/90 text-white rounded px-3 py-1 cursor-pointer">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Minimal toggle button when sidebar is closed */}
      {!open && (
        <button
          className="fixed top-4 left-0 z-50 px-2 py-2 bg-zinc-800 text-white rounded-r-lg shadow hover:bg-zinc-800/90 transition-colors cursor-pointer text-2xl"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar">
          ☰
        </button>
      )}
    </>
  );
}
