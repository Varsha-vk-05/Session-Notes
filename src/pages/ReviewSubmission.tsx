import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Target,
  FileText,
  ShieldCheck,
  User,
  Users,
  AlertCircle,
  CloudOff,
  Edit
} from 'lucide-react';
import { getSessionById, getStudentById, submitSessionNote, getNetworkStatus } from '../services/storage';
import { Session } from '../types/session';
import { Student } from '../types/student';
import { Button } from '../components/common/Button';
import { ProgressStepper } from '../components/layout/ProgressStepper';
import { StatusBadge } from '../components/common/StatusBadge';
import { MobileActionBar } from '../components/layout/MobileActionBar';

export const ReviewSubmission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const session = id ? getSessionById(id) : undefined;
  const isGroup = session?.modality === 'Group' || (session?.studentIds && session.studentIds.length > 1);
  const students: Student[] = (session?.studentIds.map(sid => getStudentById(sid)).filter((s): s is Student => Boolean(s))) || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkStatus] = useState(getNetworkStatus());

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Session not found</h2>
        <Button onClick={() => navigate('/sessions')}>Choose a session</Button>
      </div>
    );
  }

  const draft = session.draft;
  const primaryStudent = students[0];
  const primaryGoal = primaryStudent?.iepGoals.find(g => g.id === draft?.goalId);
  const primaryObjective = primaryGoal?.objectives.find(o => o.id === draft?.objectiveId);

  const handleFinalSubmit = async () => {
    if (!id) return;
    setIsSubmitting(true);

    // Simulate submission latency
    await new Promise(r => setTimeout(r, 650));

    const asQueued = getNetworkStatus() === 'unstable';
    submitSessionNote(id, asQueued);

    setIsSubmitting(false);
    navigate(`/submitted/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 animate-slide-up">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isGroup) {
                navigate(`/group/${session.id}`);
              } else {
                navigate(`/sessions/${session.id}`);
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            aria-label="Back to editing"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Review &amp; finalize session note
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm accuracy before final documentation submission
            </p>
          </div>
        </div>

        <StatusBadge status="ready_to_submit" size="md" />
      </div>

      <div className="max-w-xl mx-auto px-2">
        <ProgressStepper currentStep={3} />
      </div>

      {/* Unstable Connection Warning if triggered */}
      {networkStatus === 'unstable' && (
        <div className="bg-indigo-50/80 backdrop-blur-xs border border-indigo-200/90 rounded-xl p-3.5 text-xs text-indigo-900 flex items-start gap-2.5 shadow-sm">
          <CloudOff className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Offline / Unstable Connection Mode Active</span>
            <p className="mt-0.5 opacity-90">
              When submitted, this note will be safely stored in the <strong>Queued</strong> state and automatically processed once the connection is restored.
            </p>
          </div>
        </div>
      )}

      {/* Review Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 shadow-card overflow-hidden divide-y divide-slate-100/80">
        {/* Student & Session Header */}
        <div className="p-5 sm:p-6 bg-slate-50/70 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-900 border border-teal-300 flex items-center justify-center font-bold text-base shadow-xs">
              {isGroup ? <Users className="w-6 h-6" /> : primaryStudent?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {isGroup ? students.map(s => s.name).join(' & ') : primaryStudent?.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/60">
                  {isGroup ? 'Group Session' : draft?.modality || 'Individual'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isGroup ? 'Lincoln Elementary' : `${primaryStudent?.grade} · ${primaryStudent?.school}`}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isGroup) {
                navigate(`/group/${session.id}`);
              } else {
                navigate(`/sessions/${session.id}`);
              }
            }}
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            className="bg-white/80 backdrop-blur-xs"
          >
            Edit details
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Service Date</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">
              {draft?.serviceDate || session.scheduledDate}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Duration</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">
              {draft?.durationMinutes || 30} minutes
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Service Type</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">
              {draft?.serviceType || session.serviceType}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Location</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">
              {draft?.location || session.location}
            </span>
          </div>
        </div>

        {/* Activity & Goals */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Documented Activity
            </span>
            <p className="text-sm font-bold text-slate-800 mt-1">
              {draft?.activity || 'Narrative sequencing'}
            </p>
          </div>

          {!isGroup && primaryGoal && (
            <div className="space-y-2 bg-white/70 backdrop-blur-xs rounded-xl p-4 border border-slate-200/80 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  Linked IEP Goal ({primaryGoal.code})
                </span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">
                  {primaryGoal.description}
                </p>
              </div>

              {primaryObjective && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Target Objective ({primaryObjective.code})
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {primaryObjective.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Group Specific Outcomes Review */}
          {isGroup && draft?.studentOutcomes && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Individual Student Outcomes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map((st) => {
                  const outcome = draft.studentOutcomes?.[st.id];
                  const g = st.iepGoals.find(goal => goal.id === outcome?.goalId);
                  return (
                    <div key={st.id} className="rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xs p-3.5 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{st.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-xs text-teal-900 font-medium">
                        Goal: {g?.description || 'Active Goal'}
                      </div>
                      <p className="text-xs text-slate-700 bg-white/90 p-2.5 rounded-lg border border-slate-100 leading-relaxed shadow-2xs">
                        {outcome?.narrative || 'Outcome documented.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Narrative Note (Individual) */}
          {!isGroup && (
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Session Note Narrative
              </span>
              <div className="rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-xs p-4 text-sm text-slate-800 leading-relaxed shadow-sm">
                {draft?.narrative || 'No narrative note entered.'}
              </div>
            </div>
          )}
        </div>

        {/* Provider Sign-off Attestation */}
        <div className="p-5 sm:p-6 bg-slate-50/60 backdrop-blur-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Clinical Provider Sign-Off</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            By submitting this record, you verify that Jamie Chen, CCC-SLP provided direct school-based services on {draft?.serviceDate || 'August 18, 2026'} in accordance with the student&apos;s Individualized Education Program (IEP).
          </p>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <MobileActionBar
        secondaryAction={
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              if (isGroup) {
                navigate(`/group/${session.id}`);
              } else {
                navigate(`/sessions/${session.id}`);
              }
            }}
          >
            Edit
          </Button>
        }
      >
        <Button
          variant="secondary"
          size="md"
          isLoading={isSubmitting}
          onClick={handleFinalSubmit}
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Submit Note
        </Button>
      </MobileActionBar>
    </div>
  );
};
