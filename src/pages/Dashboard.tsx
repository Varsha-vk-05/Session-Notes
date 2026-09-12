import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Users,
  User,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { getSessions, subscribeToStorage } from '../services/storage';
import { Session } from '../types/session';
import { Button } from '../components/common/Button';
import { DraftCard } from '../components/cards/DraftCard';
import { SessionCard } from '../components/cards/SessionCard';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(getSessions());

  useEffect(() => {
    return subscribeToStorage(() => {
      setSessions(getSessions());
    });
  }, []);

  // Filter drafts
  const draftSessions = sessions.filter(s => s.status === 'draft');

  // Filter today's sessions (all active scheduled or draft sessions)
  const todaySessions = sessions.filter(s => s.status !== 'submitted' && s.status !== 'not_billable');

  // Filter submitted / finalized sessions
  const completedSessions = sessions.filter(s => s.status === 'submitted' || s.status === 'queued' || s.status === 'not_billable');

  // Count pending documentation tasks
  const pendingCount = todaySessions.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden group">
        {/* Animated background glows inside hero */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-teal-400/25 to-sky-400/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-gradient-to-tr from-indigo-500/20 to-teal-400/10 rounded-full blur-2xl pointer-events-none animate-float-reverse" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-md border border-white/15 shadow-inner">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>2:10 PM · 10 minutes before next session</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good afternoon, Jamie
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5 leading-relaxed">
              {pendingCount > 0
                ? `You have ${pendingCount} recent ${pendingCount === 1 ? 'session' : 'sessions'} to document.`
                : 'All your scheduled sessions for today are documented.'}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/sessions')}
              leftIcon={<FilePlus className="w-5 h-5" />}
              className="shadow-lg shadow-teal-900/30 hover:shadow-teal-800/40 transition-all hover:scale-[1.01]"
            >
              Start a session note
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/bulk')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm"
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Bulk individual entry
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 1: In-Progress Drafts */}
      <section aria-labelledby="drafts-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="drafts-heading" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>In-Progress Drafts</span>
              {draftSessions.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {draftSessions.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              Autosaved notes you can resume anytime
            </p>
          </div>
        </div>

        {draftSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftSessions.map((draft) => (
              <DraftCard key={draft.id} session={draft} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You're all caught up"
            description="No session note drafts need your attention."
            variant="caught-up"
            actionLabel="View today's sessions"
            onAction={() => navigate('/sessions')}
          />
        )}
      </section>

      {/* SECTION 2: Today's Scheduled Sessions */}
      <section aria-labelledby="today-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="today-heading" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Today&apos;s Sessions</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {todaySessions.length} pending
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Lincoln Elementary · Tuesday, Aug 18, 2026
            </p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>Choose from student list</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todaySessions.map((sess) => (
            <SessionCard key={sess.id} session={sess} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Recently Submitted / Finalized */}
      {completedSessions.length > 0 && (
        <section aria-labelledby="submitted-heading" className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="submitted-heading" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Recently Recorded Notes</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {completedSessions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Submitted and archived notes (Read-only)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.map((sess) => (
              <SessionCard key={sess.id} session={sess} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
