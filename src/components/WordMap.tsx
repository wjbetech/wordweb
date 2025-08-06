import { ReactFlowProvider } from "reactflow";
import { WordWebFlow } from "./WordWebFlow";

type WordMapProps = {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
};

export default function WordMap({ isDark, onThemeChange }: WordMapProps) {
  return (
    <div className="relative w-screen h-screen bg-[#fdf6e3] overflow-hidden">
      {/* Centered, unclickable, unselectable wordweb. icon */}
      <div
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ opacity: 0.15 }}>
        <span className="text-4xl font-extrabold tracking-tight text-gray-500 dark:text-gray-400">wordweb.</span>
      </div>

      <ReactFlowProvider>
        <WordWebFlow isDark={isDark} onThemeChange={onThemeChange} />
      </ReactFlowProvider>
    </div>
  );
}
