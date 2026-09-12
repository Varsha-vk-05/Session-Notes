import React from 'react';
import { AlertCircle, ArrowDown } from 'lucide-react';

export interface ValidationErrorItem {
  fieldId: string;
  label: string;
  message: string;
}

export interface ValidationSummaryProps {
  errors: ValidationErrorItem[];
  onFocusField?: (fieldId: string) => void;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  onFocusField,
}) => {
  if (errors.length === 0) return null;

  const handleJump = (fieldId: string) => {
    if (onFocusField) {
      onFocusField(fieldId);
    } else {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }
  };

  const count = errors.length;
  const countText = count === 1 ? '1 item needs attention' : `${count} items need attention`;

  return (
    <div
      role="alert"
      aria-labelledby="validation-summary-title"
      className="rounded-xl border border-red-200 bg-red-50/90 p-4 shadow-sm text-red-900 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h3 id="validation-summary-title" className="text-sm font-semibold text-red-900">
            {countText} before submission
          </h3>
          <p className="text-xs text-red-700 mt-0.5">
            Please complete the following required fields to finalize this clinical note:
          </p>
          <ul className="mt-2.5 space-y-1.5 list-none">
            {errors.map((err) => (
              <li key={err.fieldId} className="text-xs">
                <button
                  type="button"
                  onClick={() => handleJump(err.fieldId)}
                  className="inline-flex items-center gap-1 text-red-800 hover:text-red-950 font-medium underline underline-offset-2 focus:ring-1 focus:ring-red-600 rounded text-left"
                >
                  <ArrowDown className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">{err.label}:</strong> {err.message}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
