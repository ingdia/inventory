import { X } from 'lucide-react';
import { useEffect } from 'react';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

const Modal = ({
  // your branch props
  isOpen,
  onClose,
  children,
  className = '',
  showClose = true,
  // main branch props
  title,
  footer,
  size = 'md',
  // alias: accept either isOpen or open
  open,
}) => {
  const visible = isOpen ?? open ?? false;

  // Body scroll lock from main
  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col
          rounded-2xl bg-white shadow-xl
          dark:bg-gray-900 dark:shadow-black/40
          ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header — only rendered when title is provided */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all print:hidden"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Floating close button — only when no title */}
        {!title && showClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors print:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer — only rendered when footer is provided */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;