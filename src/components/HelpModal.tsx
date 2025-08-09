import React from "react";

interface HelpModalProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, isDark, onClose }) => {
  if (!isOpen) return null;
  // Handler for clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div
        className={`relative rounded-xl shadow-lg p-8 max-w-2xl w-full ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}>
        {/* X button */}
        <button
          className="absolute cursor-pointer text-3xl top-3 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          onClick={onClose}
          aria-label="Close modal">
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Help</h2>
        <div className="mb-6 space-y-8 text-md leading-relaxed">
          <p>
            <b>
              Welcome to <span className="text-accent">wordweb.</span>!
            </b>{" "}
            This app helps you explore and visualize word relationships in a fun, interactive way.
          </p>
          <ul className="list-disc pl-7 space-y-3">
            <li>
              <b className="text-accent">Expand the Web:</b> Click any node (word) in the graph to expand it and
              discover more related words. Build a deep, branching network of ideas.
            </li>
            <li>
              <b className="text-accent">Explore Word Meanings:</b> Place your mouse over a node to see the relevance.
              Right click the node to pin it, and click show to get lots more information.
            </li>
            <li>
              <b className="text-accent">Save & Load:</b> Save and load your favorite webs. Saved webs are stored in
              your browser for privacy and convenience.
            </li>
            <li>
              <b className="text-accent">Settings:</b> Adjust line style, toggle tooltips, and switch between light/dark
              themes in the Settings tab to personalize your experience.
            </li>
            <li>
              <b className="text-accent">Share & Export:</b> Use the Share tab to export your word web as PNG, SVG, or
              PDF, or to import/export as JSON for sharing or backup. Great for presentations, brainstorming, or
              collaboration.
            </li>
          </ul>
          <p>
            Experiment with different words, expand nodes to see deeper connections, and use the export features to save
            or share your creations. If you have feedback or ideas, click About for contact info!
          </p>
        </div>
        <button className="btn btn-info w-full mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
