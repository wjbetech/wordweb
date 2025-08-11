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
  const modalRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the first focusable element in the modal
      const focusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [isOpen]);
  // Trap focus inside modal
  React.useEffect(() => {
    if (!isOpen) return;
    function handleTab(e: KeyboardEvent) {
      if (!modalRef.current) return;
      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen, onCancel]);
  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      ref={modalRef}>
      <div className={`modal-box ${isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"}`}>
        <h3 id="confirm-modal-title" className="font-bold text-lg mb-4">
          {title}
        </h3>
        <p className="text-base leading-relaxed mb-6 whitespace-pre-line">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus aria-label="Cancel">
            {cancelText}
          </button>
          <button className={`btn ${confirmButtonClass}`} onClick={onConfirm} aria-label="Confirm">
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
};

export default ConfirmModal;
