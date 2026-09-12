import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface DateFieldProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(({
  label = 'Service date',
  helperText,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="date"
      label={label}
      leftIcon={<Calendar className="w-4 h-4" aria-hidden="true" />}
      helperText={helperText}
      {...props}
    />
  );
});

DateField.displayName = 'DateField';
