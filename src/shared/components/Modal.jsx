// src/shared/components/Modal.jsx
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, className = '', showClose = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full max-w-lg max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:shadow-black/40 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 print:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
