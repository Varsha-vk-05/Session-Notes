import React, { useState } from 'react';
import { Sparkles, Check, Edit2, RotateCw, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export interface AIReviewCardProps {
  draftText: string;
  onAccept: (acceptedText: string) => void;
  onRegenerate: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const AIReviewCard: React.FC<AIReviewCardProps> = ({
  draftText,
  onAccept,
  onRegenerate,
  onReject,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(draftText);

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 shadow-sm space-y-3.5 animate-fadeIn"
      role="region"
      aria-label="AI Generated Draft Review"
    >
      {/* Header with Guardrail Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-teal-100">
        <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>AI-generated draft — review before using</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>No unverified clinical facts</span>
        </div>
      </div>

      {/* Draft Content Area */}
      {isEditing ? (
        <div className="space-y-2">
          <label htmlFor="ai-inline-edit" className="block text-xs font-semibold text-slate-700">
            Edit draft directly:
          </label>
          <textarea
            id="ai-inline-edit"
            rows={4}
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="w-full rounded-lg border border-teal-400 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 leading-relaxed"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditableText(draftText);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" variant="secondary" onClick={handleSaveEdit}>
              Done Editing
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3.5 border border-teal-200/80 text-sm text-slate-800 leading-relaxed font-normal shadow-sm">
          {editableText}
        </div>
      )}

      <p className="text-[11px] text-teal-900/80 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-teal-700" aria-hidden="true" />
        <span>Clicking &ldquo;Use draft&rdquo; inserts this text into your editable note. It will not be submitted automatically.</span>
      </p>

      {/* Action Buttons: [Use draft] [Edit] [Regenerate] [Reject] */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-teal-100 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAccept(editableText)}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Use draft
          </Button>

          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={onRegenerate}
            isLoading={isLoading}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Regenerate
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onReject}
          className="text-red-700 hover:text-red-800 hover:bg-red-50"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
