import React from 'react';
import { CheckCircle, Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'caught-up' | 'neutral';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  variant = 'neutral',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
      <div className="p-3 rounded-full bg-slate-100 mb-3 text-slate-500">
        {icon ? (
          icon
        ) : variant === 'caught-up' ? (
          <CheckCircle className="w-8 h-8 text-teal-600" aria-hidden="true" />
        ) : (
          <Inbox className="w-8 h-8 text-slate-400" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
