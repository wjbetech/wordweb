interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <label className="swap swap-rotate">
      <input type="checkbox" checked={isDark} onChange={onToggle} className="toggle toggle-lg toggle-warning" />
      <span className="sr-only">Toggle theme</span>
    </label>
  );
}
