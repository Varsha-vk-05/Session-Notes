import React, { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  helperText,
  error,
  isRequired = false,
  leftIcon,
  rightElement,
  className = '',
  ...props
}, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-800"
        >
          {label} {isRequired && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </label>
        {isRequired && <span className="text-xs text-slate-400 font-medium">Required</span>}
      </div>

      <div className="relative rounded-lg shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={isRequired}
          className={`block w-full rounded-lg border text-slate-900 bg-white placeholder-slate-400 text-sm transition-colors min-h-touch py-2.5 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-12' : 'pr-3.5'} ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
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

Input.displayName = 'Input';
