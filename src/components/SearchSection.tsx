// src/components/SearchSection.tsx
import Spinner from "./Spinner";
import { themeClasses } from "../utils/themeUtils";

type SearchSectionProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  externalLoading: boolean;
  recent: string[];
  onRecentSearchClick: (term: string) => void;
  onRemoveRecentSearch: (term: string, e: React.MouseEvent) => void;
  isDark: boolean;
};

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  onSearch,
  isLoading,
  externalLoading,
  recent,
  onRecentSearchClick,
  onRemoveRecentSearch,
  isDark,
}: SearchSectionProps) {
  const combinedLoading = isLoading || externalLoading;

  return (
    <>
      {/* Search input */}
      <form onSubmit={onSearch} className="flex gap-2 mb-2">
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
            disabled={combinedLoading}
            style={{ fontSize: "14px" }}
          />
        </label>
        <button
          type="submit"
          className="btn btn-success btn-sm text-[14px] min-w-[60px] flex items-center justify-center"
          disabled={combinedLoading || !searchTerm.trim()}
        >
          {combinedLoading ? (
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
                  combinedLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span
                  onClick={() => onRecentSearchClick(term)}
                  className="select-none"
                >
                  {term}
                </span>
                <button
                  onClick={(e) => onRemoveRecentSearch(term, e)}
                  disabled={combinedLoading}
                  className={`${themeClasses.searchTagRemove(isDark)} ${
                    combinedLoading ? "cursor-not-allowed" : ""
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
    </>
  );
}
