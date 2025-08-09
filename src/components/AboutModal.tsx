import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, isDark, onClose }) => {
  if (!isOpen) return null;
  // Handler for clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div
        className={`relative rounded-xl shadow-lg p-4 max-w-md w-full ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* X button */}
        <button
          className="absolute cursor-pointer text-3xl top-2 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          onClick={onClose}
          aria-label="Close modal">
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">About</h2>
        <div className="mb-4">
          <p>
            <b>wordweb</b> is an interactive word relationship explorer built with React, DaisyUI, and ReactFlow.
            <br />
            Created by WJ Beavers.
            <br />
            For more info, visit the project repository or contact the author.
          </p>
        </div>
        <button className="btn btn-info w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
