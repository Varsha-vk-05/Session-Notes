import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type BannerVariant = 'warning' | 'info' | 'error' | 'neutral';

export interface WarningBannerProps {
  title: string;
  description: string;
  variant?: BannerVariant;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  title,
  description,
  variant = 'warning',
  actions,
  icon,
  className = '',
}) => {
  const variantStyles = {
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      iconColor: 'text-amber-600',
      defaultIcon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
      defaultIcon: Info,
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      iconColor: 'text-red-600',
      defaultIcon: AlertCircle,
    },
    neutral: {
      bg: 'bg-slate-50 border-slate-200 text-slate-900',
      iconColor: 'text-slate-600',
      defaultIcon: Info,
    },
  };

  const style = variantStyles[variant];
  const DefaultIcon = style.defaultIcon;

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 shadow-sm ${style.bg} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${style.iconColor}`}>
          {icon || <DefaultIcon className="w-5 h-5" aria-hidden="true" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{description}</p>
          {actions && <div className="mt-3 flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
