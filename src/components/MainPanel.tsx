// src/components/MainPanel.tsx
import { themeClasses } from "../utils/themeUtils";

type MainPanelProps = {
  isDark: boolean;
  onSaveGraph: () => void;
  onLoadGraph: () => void;
  onClearGraph: () => void;
  onToggleHelp: () => void;
  onToggleAbout: () => void;
};

export default function MainPanel({
  isDark,
  onSaveGraph,
  onLoadGraph,
  onClearGraph,
  onToggleHelp,
  onToggleAbout
}: MainPanelProps) {
  return (
    <div className={themeClasses.contentPanel(isDark)}>
      <div className="space-y-4">
        <div className={`text-sm font-semibold ${themeClasses.secondaryText(isDark)}`}>📊 Graph Actions</div>

        {/* Main action buttons */}
        <div className="space-y-2">
          <button onClick={onSaveGraph} className={themeClasses.actionButton(isDark, "primary")}>
            💾 Save Graph
          </button>

          <button onClick={onLoadGraph} className={themeClasses.actionButton(isDark, "accent")}>
            📂 Load Graph
          </button>

          <button onClick={onClearGraph} className={themeClasses.actionButton(isDark, "error")}>
            🗑️ Clear Graph
          </button>
        </div>

        <div className={`border-t pt-4 ${themeClasses.border(isDark)}`}>
          <div className={`text-sm font-semibold mb-3 ${themeClasses.secondaryText(isDark)}`}>ℹ️ Information</div>

          <div className="space-y-2">
            <button onClick={onToggleHelp} className={themeClasses.actionButton(isDark, "accent")}>
              ❓ Help
            </button>

            <button onClick={onToggleAbout} className={themeClasses.actionButton(isDark, "accent")}>
              📖 About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
