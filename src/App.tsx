import { useState, useEffect } from "react";
import WordMap from "./components/WordMap";
import "reactflow/dist/style.css";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isDark");
      return stored === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDark", isDark.toString());
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  return <WordMap isDark={isDark} onThemeChange={setIsDark} />;
}
