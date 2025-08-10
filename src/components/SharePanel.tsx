// src/components/SharePanel.tsx
import { themeClasses } from "../utils/themeUtils";

type SharePanelProps = {
  isDark: boolean;
  onExportPNG?: () => void;
  onExportPDF?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: () => void;
};

export default function SharePanel({ isDark, onExportPNG, onExportPDF, onExportJSON, onImportJSON }: SharePanelProps) {
  return (
    <div className={themeClasses.contentPanel(isDark)}>
      <div className="space-y-4">
        <div className={`text-sm font-semibold ${themeClasses.secondaryText(isDark)}`}>📤 Export</div>
        <div className="space-y-2">
          <button
            onClick={() => onExportPNG?.()}
            disabled={!onExportPNG}
            className={themeClasses.actionButton(isDark, "accent")}>
            🖼️ Export PNG
          </button>
          {/* Export SVG button removed */}
          <button
            onClick={() => onExportPDF?.()}
            disabled={!onExportPDF}
            className={themeClasses.actionButton(isDark, "accent")}>
            📄 Export PDF
          </button>
          <button
            onClick={() => onExportJSON?.()}
            disabled={!onExportJSON}
            className={themeClasses.actionButton(isDark, "accent")}>
            🗂️ Export JSON
          </button>
        </div>

        <div className={`border-t pt-4 ${themeClasses.border(isDark)}`}>
          <div className={`text-sm font-semibold mb-3 ${themeClasses.secondaryText(isDark)}`}>📥 Import</div>
          <button
            className={themeClasses.actionButton(isDark, "primary")}
            onClick={() => onImportJSON && onImportJSON()}
            disabled={!onImportJSON}>
            ⬆️ Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}
