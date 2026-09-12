import React, { forwardRef } from 'react';
import { Clock } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface DurationFieldProps extends Omit<InputProps, 'type' | 'leftIcon' | 'rightElement'> {
  value: number | '';
  onChangeMinutes: (minutes: number | '') => void;
}

export const DurationField = forwardRef<HTMLInputElement, DurationFieldProps>(({
  label = 'Duration',
  value,
  onChangeMinutes,
  helperText = 'Documented in minutes of direct service time',
  ...props
}, ref) => {
  const presets = [15, 30, 45, 60];

  return (
    <div className="space-y-2">
      <Input
        ref={ref}
        type="number"
        min="1"
        max="300"
        label={label}
        value={value === '' ? '' : value}
        onChange={(e) => {
          const val = e.target.value;
          onChangeMinutes(val === '' ? '' : parseInt(val, 10));
        }}
        leftIcon={<Clock className="w-4 h-4" aria-hidden="true" />}
        rightElement={<span className="text-xs font-semibold text-slate-500">minutes</span>}
        helperText={helperText}
        placeholder="30"
        {...props}
      />

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-500 mr-1 font-medium">Quick pick:</span>
        {presets.map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => onChangeMinutes(mins)}
            className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
              value === mins
                ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold ring-1 ring-teal-500'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>
    </div>
  );
});

DurationField.displayName = 'DurationField';
