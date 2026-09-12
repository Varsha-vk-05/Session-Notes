import React from 'react';

export interface MobileActionBarProps {
  children: React.ReactNode;
  secondaryAction?: React.ReactNode;
  statusInfo?: React.ReactNode;
  className?: string;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  children,
  secondaryAction,
  statusInfo,
  className = '',
}) => {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-6 z-30 shadow-lg ${className}`}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {secondaryAction}
          {statusInfo && <div className="hidden sm:block truncate">{statusInfo}</div>}
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
};
