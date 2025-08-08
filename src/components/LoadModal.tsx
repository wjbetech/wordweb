// src/components/LoadModal.tsx
import type { NamedSaveMeta } from "../utils/localStorage";

type LoadModalProps = {
  isOpen: boolean;
  isDark?: boolean;
  saves: NamedSaveMeta[];
  onClose: () => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
};

export default function LoadModal({
  isOpen,
  isDark = false,
  saves,
  onClose,
  onLoad,
  onDelete,
}: LoadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box ${
          isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">Load Saved Word Web</h3>
        {saves.length === 0 ? (
          <p className="mb-6">No saved word webs yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto -mx-4 px-4">
            <ul className="space-y-2">
              {saves.map((s) => (
                <li
                  key={s.name}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                    isDark ? "bg-zinc-700" : "bg-gray-100"
                  }`}
                >
                  <div className="min-w-0 flex flex-col gap-y-1">
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-xs opacity-70 flex flex-col gap-y-1">
                      <p>{s.centerWord ? `Core Word: ${s.centerWord}` : ""}</p>
                      <p>
                        {s.nodeCount} nodes · {s.edgeCount} edges{" "}
                      </p>
                      {new Date(s.savedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onLoad(s.name)}
                    >
                      Load
                    </button>
                    <button
                      className="btn btn-sm btn-ghost hover:bg-error"
                      onClick={() => onDelete(s.name)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
