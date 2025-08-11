export type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDisable: () => void;
  isDark?: boolean;
};

export default function OnboardingModal({
  isOpen,
  onClose,
  onDisable,
  isDark = false,
}: OnboardingModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal modal-open z-[100]">
      <div
        className={`modal-box max-w-lg ${
          isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="font-bold text-xl mb-2">Welcome to WordWeb!</h2>
        <p className="mb-4 text-sm opacity-80">
          WordWeb helps you visualize and explore word relationships. <br />
          <ul className="list-disc ml-6 mt-2 mb-4">
            <li>Type a word to start building your word web.</li>
            <li>Click nodes to expand related words.</li>
            <li>Save, load, and share your creations.</li>
          </ul>
          <span className="block mt-2">Enjoy exploring!</span>
        </p>
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
