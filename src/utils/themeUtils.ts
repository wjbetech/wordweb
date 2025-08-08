// src/utils/themeUtils.ts

/**
 * Utility function to handle theme-responsive className selection
 * Reduces repetitive ternary operations throughout components
 */
export function getThemeClasses(
  isDark: boolean,
  darkClasses: string,
  lightClasses: string
): string {
  return isDark ? darkClasses : lightClasses;
}

/**
 * Common theme class combinations used throughout the app
 */
export const themeClasses = {
  // Background variations
  sidebarBg: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-zinc-800",
      "bg-slate-50 border-slate-300 border shadow-lg"
    ),

  panelBg: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "border-zinc-600 bg-zinc-900/30",
      "border-gray-200 bg-gray-50/50"
    ),

  cardBg: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "border-zinc-700 bg-zinc-800/50",
      "border-gray-200 bg-white/80"
    ),

  // Content panel styling
  contentPanel: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "border-zinc-600 bg-zinc-900/30",
      "border-gray-200 bg-gray-50/50"
    ) + " border rounded-lg p-4 space-y-4",

  settingsCard: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "border-zinc-700 bg-zinc-800/50",
      "border-gray-200 bg-white/80"
    ) + " border rounded-lg p-3 space-y-3",

  // Text variations
  primaryText: (isDark: boolean) =>
    getThemeClasses(isDark, "text-gray-100", "text-slate-800"),

  secondaryText: (isDark: boolean) =>
    getThemeClasses(isDark, "text-gray-300", "text-gray-700"),

  mutedText: (isDark: boolean) =>
    getThemeClasses(isDark, "text-gray-400", "text-gray-600"),

  // Interactive elements
  hoverBg: (isDark: boolean) =>
    getThemeClasses(isDark, "hover:bg-zinc-700", "hover:bg-gray-100"),

  buttonHover: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "text-white hover:bg-[#4c5c68]",
      "text-slate-700 hover:bg-slate-200"
    ),

  // Borders
  border: (isDark: boolean) =>
    getThemeClasses(isDark, "border-zinc-600", "border-gray-200"),

  borderSubtle: (isDark: boolean) =>
    getThemeClasses(isDark, "border-zinc-700", "border-gray-200"),

  // Toggle label text wrapping
  toggleLabel: (isDark: boolean) =>
    getThemeClasses(isDark, "text-gray-300", "text-gray-700") +
    " text-sm leading-relaxed break-words hyphens-auto word-break overflow-wrap-anywhere whitespace-normal flex-1 min-w-0",

  // Recent search tags
  searchTag: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-zinc-700 text-gray-200 hover:bg-zinc-600",
      "bg-zinc-600 text-white hover:bg-zinc-700"
    ) +
    " relative rounded px-2 py-1 text-xs cursor-pointer flex items-center gap-2 transition-opacity",

  searchTagRemove: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "text-gray-400 hover:text-red-400",
      "text-gray-300 hover:text-red-300"
    ) +
    " text-sm leading-none cursor-pointer transition-colors duration-200 font-bold",

  // Tab navigation
  tabContainer: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "border-zinc-600 bg-zinc-900/50",
      "border-gray-200 bg-gray-50"
    ) + " border rounded-lg p-1 mt-4 mb-4",

  tabButton: (isDark: boolean, isActive: boolean) =>
    "cursor-pointer flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 " +
    (isActive
      ? getThemeClasses(
          isDark,
          "bg-blue-600 text-white shadow-sm border border-blue-500",
          "bg-white text-blue-600 shadow-sm border border-blue-200"
        )
      : getThemeClasses(
          isDark,
          "text-gray-400 hover:text-gray-200 hover:bg-zinc-800",
          "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        )),

  // Error and alert styling
  errorContainer: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-red-900/30 text-red-200 border border-red-800",
      "bg-red-50 text-red-800 border border-red-200"
    ) + " p-2 rounded-lg text-sm mb-2",

  errorIcon: () => "text-red-500 font-bold",

  errorButtonBorder: (isDark: boolean) =>
    getThemeClasses(isDark, "border-red-600", "border-red-300"),

  // Dropdown styling
  dropdownButton: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-zinc-800 border-zinc-600 text-gray-200 hover:bg-zinc-700",
      "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    ) + " btn btn-sm w-full justify-between text-sm border",

  dropdownMenu: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-zinc-800 border-zinc-600 text-gray-200",
      "bg-white border-gray-300 text-gray-700"
    ) +
    " dropdown-content menu rounded-box z-[1] w-full p-2 shadow-lg mt-1 text-sm font-semibold border",

  dropdownItem: (isDark: boolean) =>
    getThemeClasses(isDark, "hover:bg-zinc-700", "hover:bg-gray-100"),

  // Action button styling
  actionButton: (isDark: boolean, variant: "primary" | "accent" | "error") => {
    const baseClasses =
      "btn btn-wide btn-sm text-[14px] border flex items-center gap-2";

    switch (variant) {
      case "primary":
        return (
          baseClasses +
          " " +
          getThemeClasses(
            isDark,
            "btn-primary bg-blue-600 hover:bg-blue-700 text-white border-blue-500",
            "btn-primary bg-blue-600 hover:bg-blue-700 text-white border-blue-400"
          )
        );
      case "accent":
        return (
          baseClasses +
          " " +
          getThemeClasses(
            isDark,
            "btn-accent bg-teal-600 hover:bg-teal-700 text-white border-teal-500",
            "btn-accent bg-teal-600 hover:bg-teal-700 text-white border-teal-400"
          )
        );
      case "error":
        return (
          baseClasses +
          " " +
          getThemeClasses(
            isDark,
            "btn-error bg-red-600 hover:bg-red-700 text-white border-red-500",
            "btn-error bg-red-600 hover:bg-red-700 text-white border-red-400"
          )
        );
      default:
        return baseClasses;
    }
  },

  // Sidebar toggle button
  sidebarToggle: (isDark: boolean) =>
    getThemeClasses(
      isDark,
      "bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600 hover:shadow-zinc-600/50",
      "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:shadow-slate-400/50"
    ) +
    " fixed top-4 left-0 z-50 px-3 py-3 rounded-r-lg shadow-lg transition-all duration-200 cursor-pointer text-xl border-r border-t border-b hover:px-4 hover:shadow-xl",

  toggleIcon: () =>
    "block transform transition-transform duration-200 hover:scale-110",
};
