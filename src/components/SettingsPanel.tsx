// src/components/SettingsPanel.tsx
import { themeClasses } from "../utils/themeUtils";

type SettingsPanelProps = {
  isDark: boolean;
  showTooltips: boolean;
  setShowTooltips: (value: boolean) => void;
};

export default function SettingsPanel({ isDark, showTooltips, setShowTooltips }: SettingsPanelProps) {
  return (
    <div className={themeClasses.contentPanel(isDark)}>
      {/* Settings Panel */}
      <div className="space-y-4">
        <div className={`text-sm font-semibold ${themeClasses.secondaryText(isDark)}`}>🎛️ Feature Toggles</div>

        {/* Feature toggles section */}
        <div className={themeClasses.settingsCard(isDark)}>
          <div className="form-control w-full">
            <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
              <input
                type="checkbox"
                className={`
                  toggle toggle-sm flex-shrink-0
                  ${isDark ? "toggle-primary" : "toggle-success"}
                `}
                checked={showTooltips}
                onChange={(e) => setShowTooltips(e.target.checked)}
              />
              <span className={themeClasses.toggleLabel(isDark)}>Show tooltips</span>
            </label>
          </div>

          {/* Placeholder features */}

          <div className="form-control w-full">
            <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
              <input
                type="checkbox"
                className={`toggle toggle-sm flex-shrink-0 opacity-50 cursor-not-allowed ${
                  isDark ? "toggle-primary" : "toggle-success"
                }`}
                disabled
              />
              <span
                className={`${themeClasses.toggleLabel(
                  isDark
                )} line-through text-gray-400 dark:text-gray-500 select-none`}
                title="Coming soon!">
                Sound effects
              </span>
            </label>
          </div>
          <div className="form-control w-full">
            <label className="label cursor-pointer justify-start gap-3 py-2 overflow-hidden min-w-0 w-full">
              <input
                type="checkbox"
                className={`toggle toggle-sm flex-shrink-0 opacity-50 cursor-not-allowed ${
                  isDark ? "toggle-primary" : "toggle-success"
                }`}
                disabled
              />
              <span
                className={`${themeClasses.toggleLabel(
                  isDark
                )} line-through text-gray-400 dark:text-gray-500 select-none`}
                title="Coming soon!">
                Animations
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
