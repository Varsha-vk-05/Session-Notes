import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, AlertTriangle, ArrowRight, User, Users, CheckCircle2 } from 'lucide-react';
import { Session } from '../../types/session';
import { getStudentById } from '../../services/storage';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { TiltCard } from '../common/TiltCard';

export interface SessionCardProps {
  session: Session;
  onSelect?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect }) => {
  const navigate = useNavigate();
  const students = session.studentIds.map(id => getStudentById(id)).filter(Boolean);
  const isGroup = session.modality === 'Group' || session.studentIds.length > 1;
  const isWithdrawn = session.isWithdrawn || students.some(s => s?.status === 'withdrawn');
  const isSubmitted = session.status === 'submitted' || session.status === 'queued';
  const isNotBillable = session.status === 'not_billable';

  const handleClick = () => {
    if (onSelect) {
      onSelect();
      return;
    }

    if (isSubmitted || isNotBillable) {
      navigate(`/submitted/${session.id}`);
    } else if (isGroup) {
      navigate(`/group/${session.id}`);
    } else {
      navigate(`/sessions/${session.id}`);
    }
  };

  const studentDisplay = isGroup
    ? students.map(s => s?.name).join(' & ')
    : students[0]?.name || 'Student';

  const gradeDisplay = isGroup
    ? 'Grade 4 (Group of 2)'
    : `${students[0]?.grade || ''} · ${students[0]?.school || 'Lincoln Elementary'}`;

  const activityDisplay = session.draft?.activity || session.defaultActivity || 'Speech therapy session';

  return (
    <TiltCard maxTilt={6} className="flex flex-col">
    <div
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`rounded-xl border transition-all p-4 sm:p-5 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 group relative ${
        isWithdrawn
          ? 'border-amber-300 bg-amber-50/40 backdrop-blur-xs hover:border-amber-400'
          : isSubmitted
          ? 'border-slate-200/90 hover:border-slate-300 bg-white/90 backdrop-blur-xs'
          : 'border-slate-200/90 bg-white/90 backdrop-blur-xs hover:border-teal-400 hover:shadow-card-hover'
      }`}
    >
      <div className="space-y-3">
        {/* Top bar with Modality + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isGroup
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : session.isMakeUp
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>
                {isGroup ? (
                  <>
                    <Users className="w-3 h-3 text-purple-700" aria-hidden="true" />
                    <span>Group Session</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-slate-600" aria-hidden="true" />
                    <span>{session.isMakeUp ? 'Individual Make-up' : 'Individual'}</span>
                  </>
                )}
              </span>

              {isWithdrawn && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-700" aria-hidden="true" />
                  <span>Withdrawn Student</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-teal-700 transition-colors truncate">
              {studentDisplay}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {gradeDisplay}
            </p>
          </div>

          <StatusBadge status={session.status} size="sm" />
        </div>

        {/* Withdrawn warning excerpt if applicable */}
        {isWithdrawn && session.status !== 'not_billable' && session.status !== 'submitted' && (
          <div className="text-xs bg-amber-100/70 border border-amber-200 rounded-lg p-2 text-amber-900">
            Student withdrawn as of Aug 13, 2026. Scheduled session remains on calendar.
          </div>
        )}

        {/* Not billable explanation */}
        {isNotBillable && (
          <div className="text-xs bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-700">
            Recorded as: <strong className="font-semibold">{session.nonBillableReason || 'Student absent'}</strong> (Non-billable)
          </div>
        )}

        {/* Time, location, activity */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>{session.scheduledStart} – {session.scheduledEnd}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>{session.location}</span>
            </div>
          </div>
          <div className="truncate text-slate-600">
            <span className="text-slate-400 font-medium">Activity: </span>
            <span className="font-medium text-slate-800">{activityDisplay}</span>
          </div>
        </div>
      </div>

      {/* Bottom action indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-semibold text-teal-700 group-hover:text-teal-800 flex items-center gap-1">
          {isSubmitted || isNotBillable ? (
            <span>View recorded note</span>
          ) : session.status === 'draft' ? (
            <span>Resume note</span>
          ) : (
            <span>Document session</span>
          )}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {session.serviceType}
        </span>
      </div>
    </div>
    </TiltCard>
  );
};
