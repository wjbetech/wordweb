// src/components/Toast.tsx
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  isDark: boolean;
}

export default function Toast({ message, isVisible, isDark }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay removal to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{
        background: isDark ? "#374151" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
        border: `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`,
        fontFamily: "Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif"
      }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
