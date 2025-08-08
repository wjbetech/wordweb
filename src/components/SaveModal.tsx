// src/components/SaveModal.tsx
import { useEffect, useMemo, useState } from "react";

type SaveModalProps = {
  isOpen: boolean;
  isDark?: boolean;
  defaultName?: string;
  existingNames?: string[];
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function SaveModal({
  isOpen,
  isDark = false,
  defaultName = "",
  existingNames = [],
  onClose,
  onSave,
}: SaveModalProps) {
  const [name, setName] = useState(defaultName);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setTouched(false);
    }
  }, [isOpen, defaultName]);

  const exists = useMemo(
    () =>
      !!name &&
      existingNames
        .map((n) => n.toLowerCase())
        .includes(name.trim().toLowerCase()),
    [existingNames, name]
  );

  if (!isOpen) return null;

  const canSave = Boolean(name.trim());

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box ${
          isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">Save wordweb.</h3>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-sm">Name</span>
          </div>
          <input
            autoFocus
            type="text"
            className={`input input-bordered w-full text-xs placeholder:text-xs ${
              isDark ? "bg-zinc-700" : ""
            }`}
            placeholder="e.g. Brainstorm - Q3 planning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <div className="label h-5">
            {!canSave && touched ? (
              <span className="label-text-alt text-error text-xs mt-1">
                Please enter a name
              </span>
            ) : exists ? (
              <span className="label-text-alt text-warning">
                This will overwrite an existing save
              </span>
            ) : (
              <span className="label-text-alt">&nbsp;</span>
            )}
          </div>
        </label>

        {existingNames.length > 0 && (
          <div className="mt-2 text-xs opacity-70">
            Existing: {existingNames.slice(0, 5).join(", ")}
            {existingNames.length > 5 ? "…" : ""}
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost hover:bg-error" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => canSave && onSave(name.trim())}
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
