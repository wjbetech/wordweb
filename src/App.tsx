import { useState, useEffect } from "react";
import WordMap from "./components/WordMap";
import OnboardingModal from "./components/OnboardingModal";
import Sidebar from "./components/Sidebar";
import { getCookie, setCookie } from "./utils/cookieUtils";
import "reactflow/dist/style.css";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isDark");
      return stored === "true";
    }
    return false;
  });

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== "undefined") {
      return getCookie("wordweb_onboarding_disabled") !== "1";
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDark", isDark.toString());
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  const handleCloseOnboarding = () => setShowOnboarding(false);
  const handleDisableOnboarding = () => {
    setCookie("wordweb_onboarding_disabled", "1", 365);
    setShowOnboarding(false);
  };

  const handleResetOnboarding = () => {
    setCookie("wordweb_onboarding_disabled", "0", 365);
    setShowOnboarding(true);
  };

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
        onDisable={handleDisableOnboarding}
        isDark={isDark}
      />
      <Sidebar isDark={isDark} onThemeChange={setIsDark} onResetOnboarding={handleResetOnboarding} />
      <WordMap isDark={isDark} onThemeChange={setIsDark} />
    </>
  );
}
