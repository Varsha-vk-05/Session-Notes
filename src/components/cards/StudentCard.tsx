import React from 'react';
import { Student } from '../../types/student';
import { Session } from '../../types/session';
import { Target, ChevronRight, AlertTriangle } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export interface StudentCardProps {
  student: Student;
  sessions: Session[];
  isSelected: boolean;
  onSelect: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  sessions,
  isSelected,
  onSelect,
}) => {
  const isWithdrawn = student.status === 'withdrawn';
  const activeGoalsCount = student.iepGoals.length;

  return (
    <TiltCard maxTilt={8} perspective={900}>
      <div
        onClick={() => onSelect(student)}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(student);
          }
        }}
        className={`rounded-xl border p-4 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 relative ${
          isSelected
            ? 'bg-teal-50/70 backdrop-blur-xs border-teal-600 shadow-md ring-1 ring-teal-600'
            : 'bg-white/90 backdrop-blur-xs border-slate-200/90 hover:border-slate-300 hover:shadow-card'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar + Name + Grade */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 transition-transform group-hover:scale-105 ${student.avatarBg}`}
            >
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {student.name}
                </h4>
                {isWithdrawn && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Withdrawn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {student.grade} · {student.school}
              </p>
            </div>
          </div>

          {/* Right selection indicator */}
          <div className="shrink-0">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-teal-600 border-teal-600 text-white scale-110'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>

        {/* Withdrawn warning if applicable */}
        {isWithdrawn && (
          <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
            <span>Withdrawn as of {student.withdrawalDate || 'August 13, 2026'}</span>
          </div>
        )}

        {/* Goals summary */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
            <span>{activeGoalsCount} IEP {activeGoalsCount === 1 ? 'goal' : 'goals'} linked</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} today</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </TiltCard>
  );
};
