import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = 'max-h-[85vh]',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bottomsheet-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-10 flex justify-center pointer-events-none">
        <div
          className={`w-full max-w-2xl bg-white rounded-t-2xl shadow-sheet border-t border-slate-200 pointer-events-auto flex flex-col ${maxHeight} animate-slideUp`}
        >
          {/* Grab handle for touch feel */}
          <div className="w-full flex justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-300" />
          </div>

          {/* Header */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 shrink-0">
            <div>
              <h3 id="bottomsheet-title" className="text-base font-bold text-slate-900">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close sheet"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
