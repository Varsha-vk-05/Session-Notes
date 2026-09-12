import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import { AIReviewCard } from './AIReviewCard';
import { generateNoteDraft } from '../../services/mockAI';
import { AIGenerateRequest, AIGenerateResponse } from '../../types/ai';

export interface AIAssistPanelProps {
  studentName: string;
  grade?: string;
  goalDescription?: string;
  objectiveDescription?: string;
  activity: string;
  modality: string;
  initialObservations?: string;
  onApplyDraft: (text: string) => void;
  onClose?: () => void;
}

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({
  studentName,
  grade,
  goalDescription,
  objectiveDescription,
  activity,
  modality,
  initialObservations = '',
  onApplyDraft,
  onClose,
}) => {
  const [observations, setObservations] = useState(initialObservations);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIGenerateResponse | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Quick sample prompts for quick demonstration
  const samplePrompts = [
    {
      label: '4-step story sequencing',
      text: 'Practiced four-step story sequencing. Maya independently ordered 3 of 4 pictures and needed verbal prompting for the final step.',
    },
    {
      label: 'Vague input (Guardrail Test)',
      text: 'worked on stories',
    },
    {
      label: 'Wh-questions scene',
      text: 'Completed picture card scenes. Answered who and where questions independently. Needed visual cue for why question.',
    }
  ];

  const handleGenerate = async (obsToUse = observations) => {
    setIsLoading(true);
    setAiResponse(null);

    const request: AIGenerateRequest = {
      studentName,
      grade,
      goalDescription,
      objectiveDescription,
      activity,
      modality,
      observations: obsToUse,
    };

    try {
      const response = await generateNoteDraft(request);
      setAiResponse(response);
    } catch (err) {
      setAiResponse({
        status: 'error',
        generatedText: '',
        needsMoreInformation: false,
        message: 'Unable to generate note draft. Please try again or type manually.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (acceptedText: string) => {
    onApplyDraft(acceptedText);
    if (onClose) onClose();
  };

  const handleReject = () => {
    setAiResponse(null);
  };

  return (
    <div className="bg-slate-50/80 rounded-2xl border border-teal-200/80 p-4 sm:p-5 space-y-4">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">AI Note Assist</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300 px-1.5 py-0.2 rounded">
                Assisted
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Draft structured clinical notes from your quick factual observations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-teal-500"
            title="AI Guardrails Info"
            aria-label="AI Guardrails Information"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info Tooltip Callout */}
      {showTooltip && (
        <div className="rounded-lg bg-white border border-slate-200 p-3 text-xs text-slate-600 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Responsible AI Guardrails</span>
          </div>
          <p className="leading-relaxed">
            AI suggestions are based only on the information you provide. It will never invent goals, durations, scores, or diagnoses. Generated drafts are never submitted without your explicit approval.
          </p>
        </div>
      )}

      {/* Observation Input */}
      <div className="space-y-2">
        <label htmlFor="ai-observations-input" className="block text-xs font-semibold text-slate-700">
          Enter your session observations:
        </label>
        <textarea
          id="ai-observations-input"
          rows={3}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="e.g. Practiced four-step story sequencing. Maya independently ordered 3 of 4 pictures and needed verbal prompting for the final step."
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-teal-600 shadow-sm"
        />

        {/* Quick Sample Prompts */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Sample observations to test:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setObservations(p.text);
                  handleGenerate(p.text);
                }}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-900 transition-colors shadow-2xs text-left"
              >
                &ldquo;{p.label}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!aiResponse && (
        <div>
          <Button
            variant="secondary"
            fullWidth
            isLoading={isLoading}
            onClick={() => handleGenerate()}
            disabled={!observations.trim()}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Draft note with AI
          </Button>
        </div>
      )}

      {/* Guardrail: Insufficient Information Warning */}
      {aiResponse?.status === 'needs_more_info' && (
        <div
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 space-y-2 animate-fadeIn"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                More information needed
              </h4>
              <p className="text-xs mt-1 leading-relaxed text-amber-900">
                {aiResponse.message || 'Add a little more detail about what the student did and how they responded.'}
              </p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAiResponse(null)}
            >
              Update observations
            </Button>
          </div>
        </div>
      )}

      {/* AI Draft Result */}
      {aiResponse?.status === 'success' && (
        <AIReviewCard
          draftText={aiResponse.generatedText}
          onAccept={handleApply}
          onRegenerate={() => handleGenerate()}
          onReject={handleReject}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
