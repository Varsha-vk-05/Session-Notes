import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
}

export interface ProgressStepperProps {
  currentStep: number; // 1, 2, 3, or 4
  steps?: StepItem[];
  onStepClick?: (stepNumber: number) => void;
}

const DEFAULT_STEPS: StepItem[] = [
  { number: 1, label: 'Session' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Review' },
  { number: 4, label: 'Submit' },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
  onStepClick,
}) => {
  return (
    <nav aria-label="Documentation Progress" className="w-full py-2">
      <ol className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div
          className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0"
          aria-hidden="true"
        >
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{
              width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <li key={step.number} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={isUpcoming || !onStepClick}
                onClick={() => onStepClick && onStepClick(step.number)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : isCurrent
                    ? 'bg-navy-900 text-white ring-4 ring-navy-100 shadow-sm'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                ) : (
                  <span>{step.number}</span>
                )}
              </button>
              <span
                className={`text-[11px] font-semibold mt-1 tracking-tight ${
                  isCurrent
                    ? 'text-navy-900'
                    : isCompleted
                    ? 'text-teal-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
