// src/components/ConfirmModal.tsx
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDark?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "btn-error",
  onConfirm,
  onCancel,
  isDark = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <p className="text-base leading-relaxed mb-6 whitespace-pre-line">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>
            {cancelText}
          </button>
          <button className={`btn ${confirmButtonClass}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
};

export default ConfirmModal;
