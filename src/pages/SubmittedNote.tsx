import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Target,
  FileCheck,
  ArrowLeft,
  Printer,
  Home,
  User,
  Users,
  ShieldCheck,
  CloudOff,
  Slash,
  History,
  ArrowRight,
  School
} from 'lucide-react';
import { getSessionById, getStudentById } from '../services/storage';
import { Student } from '../types/student';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';

export const SubmittedNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const session = id ? getSessionById(id) : undefined;
  const isGroup = session?.modality === 'Group' || (session?.studentIds && session.studentIds.length > 1);
  const students: Student[] = (session?.studentIds.map(sid => getStudentById(sid)).filter((s): s is Student => Boolean(s))) || [];

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Session record not found</h2>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  const draft = session.draft;
  const primaryStudent = students[0];
  const primaryGoal = primaryStudent?.iepGoals.find(g => g.id === draft?.goalId);
  const primaryObjective = primaryGoal?.objectives.find(o => o.id === draft?.objectiveId);

  const isQueued = session.status === 'queued';
  const isNotBillable = session.status === 'not_billable';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-slide-up print:space-y-4 print:pb-0 print:animate-none print:max-w-full">
      {/* Top Banner / Navigation & Print Actions (Hidden on Print) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
            className="bg-white/80 backdrop-blur-xs shadow-2xs hover:bg-slate-50"
          >
            Print Record
          </Button>
        </div>
      </div>

      {/* Confirmation State Callout (Hidden on Print) */}
      <div className="print:hidden">
        {isNotBillable ? (
          <div className="rounded-2xl border border-slate-300/80 bg-slate-100/90 backdrop-blur-sm p-6 text-slate-900 flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-slate-200 text-slate-700 shrink-0 shadow-2xs">
              <Slash className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold">Student absent</h1>
                <StatusBadge status="not_billable" size="sm" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                This session was recorded as absent and will not proceed as a billable service.
              </p>
            </div>
          </div>
        ) : isQueued ? (
          <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/80 backdrop-blur-sm p-6 text-indigo-900 flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 shadow-2xs">
              <CloudOff className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold">Saved and Queued</h1>
                <StatusBadge status="queued" size="sm" />
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                Your session note was saved on this device and will continue processing automatically when the connection is restored.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/80 backdrop-blur-sm p-6 text-emerald-950 flex items-start gap-4 shadow-sm shadow-emerald-100/50">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold">Note Submitted</h1>
                <StatusBadge status="submitted" size="sm" />
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Your session note was successfully recorded and locked for compliance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Official Clinical Print Header (Visible ONLY when Printing) */}
      <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-900 leading-tight">
              Lincoln Elementary School
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              Special Education &amp; Related Services · Clinical Documentation Record
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              District 48 Special Education Program · Confidential IEP Service Documentation
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-900">Official Service Log</div>
            <div>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>Status: <span className="font-bold uppercase text-slate-900">{session.status.replace('_', ' ')}</span></div>
          </div>
        </div>
      </div>

      {/* Submitted Record (The Document Printed) */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 shadow-card overflow-hidden divide-y divide-slate-100/80 print:bg-white print:border print:border-slate-300 print:rounded-lg print:shadow-none print:divide-slate-200">
        {/* Header with Student and Provider Info */}
        <div className="p-5 sm:p-6 bg-slate-50/80 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-slate-100/70 print:p-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Official Session Record (Locked / Read-Only)
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {isGroup ? students.map(s => s.name).join(' & ') : primaryStudent?.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Documented by <strong>{session.submittedBy || 'Jamie Chen, CCC-SLP'}</strong> on {draft?.serviceDate || 'August 18, 2026'} at {session.submittedAt || '2:10 PM'}
            </p>
          </div>

          <div className="print:hidden">
            <StatusBadge status={session.status} size="md" />
          </div>
          <div className="hidden print:block text-right">
            <span className="px-2.5 py-1 rounded border border-slate-400 text-xs font-bold uppercase text-slate-900 bg-white">
              {session.status === 'not_billable' ? 'Not Billable (Absent)' : session.status === 'queued' ? 'Queued' : 'Submitted'}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs print:p-4 print:grid-cols-4 print:gap-3">
          <div>
            <span className="text-slate-500 font-medium block">Service Date</span>
            <span className="text-slate-900 font-bold mt-0.5 block">{draft?.serviceDate || session.scheduledDate}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Duration</span>
            <span className="text-slate-900 font-bold mt-0.5 block">
              {draft?.durationMinutes !== undefined ? `${draft.durationMinutes} min` : '30 min'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Modality</span>
            <span className="text-slate-900 font-bold mt-0.5 block">{draft?.modality || session.modality}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Location</span>
            <span className="text-slate-900 font-bold mt-0.5 block">{draft?.location || session.location}</span>
          </div>
        </div>

        {/* Goal & Activity Details */}
        <div className="p-5 sm:p-6 space-y-4 print:p-4 print:space-y-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Therapy Activity
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {draft?.activity || session.defaultActivity || 'Speech therapy session'}
            </p>
          </div>

          {!isGroup && primaryGoal && (
            <div className="bg-white/70 backdrop-blur-xs rounded-xl p-4 border border-slate-200/80 shadow-sm space-y-1.5 text-xs print:bg-slate-50 print:border-slate-300 print:shadow-none print-avoid-break">
              <span className="font-bold text-teal-800 uppercase tracking-wider block print:text-slate-900">
                Target IEP Goal: {primaryGoal.code} ({primaryGoal.area})
              </span>
              <p className="text-slate-800 font-semibold">{primaryGoal.description}</p>
              {primaryObjective && (
                <p className="text-slate-600 pt-1 border-t border-slate-200/60 print:border-slate-300">
                  <strong>Target Objective ({primaryObjective.code}):</strong> {primaryObjective.description}
                  {primaryObjective.criteria && <span className="block mt-0.5 text-slate-500">Criteria: {primaryObjective.criteria}</span>}
                </p>
              )}
            </div>
          )}

          {/* Group Outcomes */}
          {isGroup && draft?.studentOutcomes && (
            <div className="space-y-3 print-avoid-break">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Recorded Student Outcomes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2">
                {students.map((st) => {
                  const outcome = draft.studentOutcomes?.[st.id];
                  const g = st.iepGoals.find(goal => goal.id === outcome?.goalId);
                  return (
                    <div key={st.id} className="rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xs p-4 space-y-2 shadow-sm print:bg-white print:border-slate-300 print:shadow-none print-avoid-break">
                      <span className="text-sm font-bold text-slate-900 block">{st.name}</span>
                      <p className="text-xs text-teal-900 font-medium print:text-slate-800">
                        Goal: {g?.description || 'Active IEP Goal'}
                      </p>
                      <p className="text-xs text-slate-700 bg-white/95 p-3 rounded-lg border border-slate-100 leading-relaxed shadow-2xs print:bg-slate-50 print:border-slate-200 print:shadow-none">
                        {outcome?.narrative || 'Outcome documented.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Narrative Service Note */}
          {!isGroup && (
            <div className="space-y-1.5 print-avoid-break">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Narrative Service Note
              </span>
              <div className="rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xs p-4 text-sm text-slate-800 leading-relaxed shadow-sm print:bg-slate-50 print:border-slate-300 print:shadow-none">
                {draft?.narrative || (isNotBillable ? 'Student was absent from scheduled therapy session.' : 'No narrative note recorded.')}
              </div>
            </div>
          )}
        </div>

        {/* Clinical Attestation & Provider Signature */}
        <div className="p-5 sm:p-6 bg-slate-50/60 backdrop-blur-xs space-y-2 print:bg-slate-50/80 print:p-4 print-avoid-break">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-teal-700 print:text-slate-800" />
            <span>Clinical Provider Sign-Off &amp; Verification</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            I verify that Jamie Chen, CCC-SLP provided direct school-based therapy services on {draft?.serviceDate || 'August 18, 2026'} in accordance with the student&apos;s Individualized Education Program (IEP).
          </p>
          <div className="hidden print:flex items-center justify-between pt-4 mt-2 border-t border-slate-300 text-xs">
            <div>
              <span className="text-slate-500">Provider Signature: </span>
              <span className="font-serif italic font-bold text-slate-900 underline">Jamie Chen, CCC-SLP</span>
            </div>
            <div>
              <span className="text-slate-500">Date Verified: </span>
              <span className="font-bold text-slate-900">{draft?.serviceDate || 'August 18, 2026'}</span>
            </div>
          </div>
        </div>

        {/* Audit History Log */}
        {session.history && session.history.length > 0 && (
          <div className="p-5 sm:p-6 bg-slate-50/40 backdrop-blur-xs space-y-2.5 print:bg-white print:p-4 print-avoid-break">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 print:text-slate-800">
              <History className="w-4 h-4 text-slate-400 print:text-slate-600" />
              <span>Record Audit &amp; Event History</span>
            </span>
            <ul className="space-y-1.5">
              {session.history.map((h, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-center justify-between border-b border-slate-100 pb-1 last:border-0 print:border-slate-200">
                  <span className="font-medium text-slate-800">{h.action}</span>
                  <span className="text-slate-500">{h.author} · {h.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Quick Action CTAs (Hidden on Print) */}
      <div className="flex items-center justify-between pt-4 flex-wrap gap-3 print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          leftIcon={<Home className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/sessions')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Document Next Session
        </Button>
      </div>
    </div>
  );
};
