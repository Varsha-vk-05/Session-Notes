import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  CloudOff,
  AlertCircle,
  Slash,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { SessionStatus } from '../../types/session';

export interface StatusBadgeProps {
  status: SessionStatus | 'active' | 'withdrawn' | 'needs_documentation';
  size?: 'sm' | 'md' | 'lg';
  customLabel?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  customLabel,
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          icon: FileText,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'ready_to_submit':
        return {
          label: 'Ready to submit',
          icon: CheckCircle2,
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'validation_error':
        return {
          label: 'Action needed',
          icon: AlertCircle,
          bg: 'bg-red-50 text-red-800 border-red-200',
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: RefreshCw,
          bg: 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse',
        };
      case 'submitted':
        return {
          label: 'Submitted',
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        };
      case 'queued':
        return {
          label: 'Saved and queued',
          icon: CloudOff,
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'not_billable':
        return {
          label: 'Not billable',
          icon: Slash,
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'withdrawn':
        return {
          label: 'Withdrawn',
          icon: AlertCircle,
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'active':
        return {
          label: 'Active',
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'scheduled':
      case 'needs_documentation':
      default:
        return {
          label: 'Needs documentation',
          icon: Clock,
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const label = customLabel || config.label;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses[size]} ${config.bg}`}
      role="status"
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
