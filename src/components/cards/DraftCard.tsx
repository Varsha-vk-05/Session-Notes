import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { Session } from '../../types/session';
import { getStudentById } from '../../services/storage';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { TiltCard } from '../common/TiltCard';

export interface DraftCardProps {
  session: Session;
  onContinue?: () => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({ session, onContinue }) => {
  const navigate = useNavigate();
  const students = session.studentIds.map(id => getStudentById(id)).filter(Boolean);
  const isGroup = session.modality === 'Group' || session.studentIds.length > 1;

  const handleAction = () => {
    if (onContinue) {
      onContinue();
    } else {
      if (isGroup) {
        navigate(`/group/${session.id}`);
      } else {
        navigate(`/sessions/${session.id}`);
      }
    }
  };

  const studentDisplay = isGroup
    ? students.map(s => s?.name).join(' & ')
    : students[0]?.name || 'Student';

  const gradeDisplay = isGroup
    ? 'Grade 4 (Group)'
    : students[0]?.grade || '';

  return (
    <TiltCard maxTilt={6} className="h-full">
      <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-amber-200/90 shadow-card hover:shadow-card-hover transition-all p-4 sm:p-5 flex flex-col justify-between h-full relative overflow-hidden group">
        {/* Draft accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" aria-hidden="true" />

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {studentDisplay}
                </h3>
                {session.isMakeUp && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    Make-up
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {gradeDisplay} · {session.serviceType}
              </p>
            </div>
            <StatusBadge status="draft" size="sm" />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-slate-700">
                {session.scheduledStart} – {session.scheduledEnd}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{session.location}</span>
            </div>
            {session.draft?.activity && (
              <div className="col-span-2 text-slate-600 truncate">
                <span className="text-slate-400 font-medium">Activity: </span>
                <span className="font-medium text-slate-800">{session.draft.activity}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400">
            {session.draft?.lastSavedAt ? `Saved at ${session.draft.lastSavedAt}` : 'Draft saved'}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAction}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Continue note
          </Button>
        </div>
      </div>
    </TiltCard>
  );
};
