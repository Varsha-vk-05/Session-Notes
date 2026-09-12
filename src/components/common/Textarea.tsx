import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  actionElement?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  id,
  label,
  helperText,
  error,
  isRequired = false,
  actionElement,
  className = '',
  rows = 5,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-slate-800"
        >
          {label} {isRequired && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {actionElement}
          {isRequired && <span className="text-xs text-slate-400 font-medium">Required</span>}
        </div>
      </div>

      <div className="relative rounded-lg shadow-sm">
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={isRequired}
          className={`block w-full rounded-lg border text-slate-900 bg-white placeholder-slate-400 text-sm leading-relaxed transition-colors p-3.5 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <div id={errorId} className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
