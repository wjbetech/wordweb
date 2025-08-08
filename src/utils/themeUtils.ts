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
};
