import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  id,
  label,
  options,
  helperText,
  error,
  isRequired = false,
  className = '',
  ...props
}, ref) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-slate-800"
        >
          {label} {isRequired && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </label>
        {isRequired && <span className="text-xs text-slate-400 font-medium">Required</span>}
      </div>

      <div className="relative rounded-lg shadow-sm">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={isRequired}
          className={`appearance-none block w-full rounded-lg border text-slate-900 bg-white text-sm transition-colors min-h-touch py-2.5 pl-3.5 pr-10 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
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

Select.displayName = 'Select';
