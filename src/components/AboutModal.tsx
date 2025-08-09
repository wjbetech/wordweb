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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30" onClick={handleBackdropClick}>
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
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="mb-6 space-y-5 text-md leading-relaxed">
          <p>
            <b className="text-accent">wordweb.</b> is an interactive word relationship explorer built with React,
            DaisyUI, and ReactFlow.
            <br />
            <span className="text-sm text-gray-400">Created by William East</span>
          </p>
          <p>
            <b>Purpose:</b> wordweb helps you discover, visualize, and explore the connections between words and
            concepts. It's designed for writers, students, teachers, and anyone curious about language.
          </p>
          <ul className="list-disc pl-7 space-y-3">
            <li>
              <b className="text-accent">Open Source:</b> The project is open source and contributions are welcome!
            </li>
            <li>
              <b className="text-accent">Tech Stack:</b> Built with React, DaisyUI, ReactFlow, and the Datamuse API.
            </li>
            <li>
              <b className="text-accent">Privacy:</b> All saved webs and data are stored locally in your browser. No
              account or login required.
            </li>
          </ul>
          <div className="pt-2">
            <b>Contact & Links:</b>
            <ul className="list-none pl-0 mt-2 space-y-2">
              <li>
                <span className="font-semibold text-info">Email:</span>{" "}
                <span className="text-gray-400">wjbetech@gmail.com</span>
              </li>
              <li>
                <span className="font-semibold text-info">GitHub:</span>{" "}
                <span className="text-gray-400">github.com/wjbetech/wordweb</span>
              </li>
              <li>
                <span className="font-semibold text-info">Discord:</span>{" "}
                <span className="text-gray-400">discord.gg/wordweb</span>
              </li>
            </ul>
          </div>
        </div>
        <button className="btn btn-info w-full mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
