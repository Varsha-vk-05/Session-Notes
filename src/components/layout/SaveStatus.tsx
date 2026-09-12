import React, { useEffect, useState } from 'react';
import { Check, Loader2, WifiOff, Cloud } from 'lucide-react';

export interface SaveStatusProps {
  lastSavedTimestamp?: number;
  lastSavedAt?: string;
  isSaving?: boolean;
  isUnstable?: boolean;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({
  lastSavedTimestamp,
  lastSavedAt,
  isSaving = false,
  isUnstable = false,
}) => {
  const [relativeTime, setRelativeTime] = useState<string>('Saved just now');

  useEffect(() => {
    if (!lastSavedTimestamp) {
      setRelativeTime(lastSavedAt ? `Saved at ${lastSavedAt}` : 'Draft saved');
      return;
    }

    const update = () => {
      const diffSec = Math.floor((Date.now() - lastSavedTimestamp) / 1000);
      if (diffSec < 5) {
        setRelativeTime('Saved just now');
      } else if (diffSec < 60) {
        setRelativeTime(`Saved ${diffSec} seconds ago`);
      } else {
        const mins = Math.floor(diffSec / 60);
        setRelativeTime(`Saved ${mins}m ago`);
      }
    };

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSavedTimestamp, lastSavedAt]);

  if (isSaving) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium" role="status">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" aria-hidden="true" />
        <span>Saving draft...</span>
      </div>
    );
  }

  if (isUnstable) {
    return (
      <div
        className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium"
        title="Connection unstable — your latest changes are saved on this device."
        role="status"
      >
        <WifiOff className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
        <span>Saved locally (unstable conn.)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium" role="status">
      <Check className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
      <span>{relativeTime}</span>
    </div>
  );
};
