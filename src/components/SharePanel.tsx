// src/components/SharePanel.tsx
import { themeClasses } from "../utils/themeUtils";

type SharePanelProps = {
  isDark: boolean;
  onExportPNG?: () => void;
  onExportSVG?: () => void;
  onExportPDF?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: (file: File) => void;
};

export default function SharePanel({
  isDark,
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onExportJSON,
  onImportJSON,
}: SharePanelProps) {
  return (
    <div className={themeClasses.contentPanel(isDark)}>
      <div className="space-y-4">
        <div
          className={`text-sm font-semibold ${themeClasses.secondaryText(
            isDark
          )}`}
        >
          📤 Export
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onExportPNG?.()}
            disabled={!onExportPNG}
            className={themeClasses.actionButton(isDark, "accent")}
          >
            🖼️ Export PNG
          </button>
          <button
            onClick={() => onExportSVG?.()}
            disabled={!onExportSVG}
            className={themeClasses.actionButton(isDark, "accent")}
          >
            🧩 Export SVG
          </button>
          <button
            onClick={() => onExportPDF?.()}
            disabled={!onExportPDF}
            className={themeClasses.actionButton(isDark, "accent")}
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => onExportJSON?.()}
            disabled={!onExportJSON}
            className={themeClasses.actionButton(isDark, "accent")}
          >
            🗂️ Export JSON (state)
          </button>
        </div>

        <div className={`border-t pt-4 ${themeClasses.border(isDark)}`}>
          <div
            className={`text-sm font-semibold mb-3 ${themeClasses.secondaryText(
              isDark
            )}`}
          >
            📥 Import
          </div>
          <label className={themeClasses.actionButton(isDark, "primary")}>
            ⬆️ Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onImportJSON) onImportJSON(file);
                e.currentTarget.value = "";
              }}
              disabled={!onImportJSON}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
