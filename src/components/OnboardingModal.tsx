export type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDisable: () => void;
  isDark?: boolean;
};

export default function OnboardingModal({ isOpen, onClose, onDisable, isDark = false }: OnboardingModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal modal-open z-[100]">
      <div className={`modal-box max-w-lg ${isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
        <h2 className="font-bold text-xl mb-2">
          Welcome to <span className="text-accent">wordweb.</span>
        </h2>
        <div className="mb-4 text-md opacity-80">
          <span className="text-accent font-bold">wordweb.</span> helps you visualize and explore word relationships.
          <ul className="list-disc ml-6 mt-2 mb-4">
            <li>Search a word or roll a random word</li>
            <li>Click and drag nodes, re-click to dismiss</li>
            <li>Right-click to pin the tooltip and study</li>
            <li>Save, load, and share your creations</li>
          </ul>
          <span className="block mt-2">Enjoy exploring!</span>
        </div>
        <div className="modal-action flex gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onDisable}>
            Don't show again
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
