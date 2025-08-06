// src/components/LoadingOverlay.tsx
import Spinner from "./Spinner";

interface LoadingOverlayProps {
  isDark: boolean;
  message?: string;
}

export default function LoadingOverlay({ isDark, message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
      style={{
        background: isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(250, 240, 230, 0.8)",
        backdropFilter: "blur(2px)"
      }}>
      <div
        className="flex flex-col items-center gap-4 p-8 rounded-xl shadow-lg bg-opacity-90"
        style={{
          background: isDark ? "#374151" : "#ffffff",
          border: `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`
        }}>
        <Spinner size="lg" className={isDark ? "text-white" : "text-gray-700"} />
        <div
          className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
          style={{ fontFamily: "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
          {message}
        </div>
      </div>
    </div>
  );
}
