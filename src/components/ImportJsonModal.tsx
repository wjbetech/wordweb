import React, { useState } from "react";

interface ImportJsonModalProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
  onSave: (json: string) => void;
}

const ImportJsonModal: React.FC<ImportJsonModalProps> = ({ isOpen, isDark, onClose, onImport, onSave }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImport = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      JSON.parse(jsonInput);
      setError(null);
      onImport(jsonInput);
    } catch (err: unknown) {
      let msg = "Invalid JSON. Please check your input.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
    }
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      JSON.parse(jsonInput);
      setError(null);
      onSave(jsonInput);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Invalid JSON. Please check your input.";
      setError(msg);
    }
  };

  const handleFormat = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Invalid JSON. Please check your input.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40" onClick={handleBackdropClick}>
      <div
        className={`relative rounded-xl shadow-lg p-8 max-w-2xl w-full ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute cursor-pointer text-3xl top-3 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          onClick={onClose}
          aria-label="Close modal">
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Import JSON</h2>
        <div
          className={`mb-4 p-3 rounded-lg border text-sm font-medium ${
            isDark
              ? "bg-yellow-900/40 border-yellow-700 text-yellow-200"
              : "bg-yellow-50 border-yellow-300 text-yellow-800"
          }`}>
          <span className="font-bold">Warning:</span> Importing JSON will{" "}
          <span className="underline">replace your current word web</span>. If you want to keep your current work,
          please save it first.
        </div>
        <textarea
          className={`w-full h-48 p-3 rounded-lg border resize-none font-mono text-sm ${
            isDark ? "bg-zinc-700 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
          }`}
          placeholder="Paste your exported wordweb JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <div className="text-xs text-info mt-1 mb-1">
          Tip: JSON requires double quotes for keys and strings, and no trailing commas. Example: {`{"key": "value"}`}
        </div>
        <div className="flex items-center justify-between mt-2">
          {error && <div className="text-error text-sm">{error}</div>}
          <button className="btn btn-xs btn-outline btn-info ml-auto" onClick={handleFormat} disabled={!jsonInput}>
            Format JSON
          </button>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}>
            Cancel
          </button>
          <button className="btn btn-secondary" onClick={handleSave} disabled={!jsonInput}>
            Save as Wordweb
          </button>
          <button className="btn btn-primary" onClick={handleImport} disabled={!jsonInput}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportJsonModal;
