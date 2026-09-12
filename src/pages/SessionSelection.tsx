import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Filter,
  Users,
  User,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { getStudents, getSessions } from '../services/storage';
import { Student } from '../types/student';
import { Session } from '../types/session';
import { StudentCard } from '../components/cards/StudentCard';
import { SessionCard } from '../components/cards/SessionCard';
import { Button } from '../components/common/Button';
import { WarningBanner } from '../components/common/WarningBanner';
import { EmptyState } from '../components/common/EmptyState';

export const SessionSelection: React.FC = () => {
  const navigate = useNavigate();
  const students = getStudents();
  const sessions = getSessions();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_doc' | 'draft' | 'withdrawn'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'withdrawn') {
        return student.status === 'withdrawn';
      }
      if (statusFilter === 'draft') {
        return sessions.some(s => s.studentIds.includes(student.id) && s.status === 'draft');
      }
      if (statusFilter === 'needs_doc') {
        return sessions.some(s => s.studentIds.includes(student.id) && s.status === 'scheduled');
      }
      return true;
    });
  }, [students, sessions, searchQuery, statusFilter]);

  // Get sessions for the selected student
  const studentSessions = useMemo(() => {
    if (!selectedStudent) return [];
    return sessions.filter(s => s.studentIds.includes(selectedStudent.id));
  }, [selectedStudent, sessions]);

  // Group session shortcut session (Maya + Jordan)
  const groupSession = sessions.find(s => s.modality === 'Group' || s.studentIds.length > 1);

  return (
    <div className="space-y-6 pb-20 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Choose a session
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Step 1: Select a student, then choose their scheduled appointment to document.
          </p>
        </div>

        {/* Quick Modality Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          {groupSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/group/${groupSession.id}`)}
              leftIcon={<Users className="w-4 h-4 text-purple-600" />}
              className="border-purple-200/90 text-purple-900 bg-white/80 backdrop-blur-xs hover:bg-purple-50 shadow-xs"
            >
              Open Group Session (1:10 PM)
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bulk')}
            leftIcon={<Layers className="w-4 h-4 text-indigo-600" />}
            className="border-indigo-200/90 text-indigo-900 bg-white/80 backdrop-blur-xs hover:bg-indigo-50 shadow-xs"
          >
            Bulk Individual Entry
          </Button>
        </div>
      </div>

      {/* Distinction Explainer Banner */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong className="text-slate-800">Documentation Modes:</strong> Individual notes link to 1 student. Group sessions link shared time with independent outcomes. Bulk entry creates separate records.
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Selection (Step 1) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Student</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or grade..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300/80 bg-white/90 backdrop-blur-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium shrink-0 transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                    : 'bg-white/80 backdrop-blur-xs text-slate-600 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                All Students
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('needs_doc')}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium shrink-0 transition-colors ${
                  statusFilter === 'needs_doc'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                    : 'bg-white/80 backdrop-blur-xs text-slate-600 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                Needs Doc
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium shrink-0 transition-colors ${
                  statusFilter === 'draft'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                    : 'bg-white/80 backdrop-blur-xs text-slate-600 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                Drafts
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('withdrawn')}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium shrink-0 transition-colors ${
                  statusFilter === 'withdrawn'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                    : 'bg-white/80 backdrop-blur-xs text-slate-600 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                Withdrawn
              </button>
            </div>
          </div>

          {/* Student Card List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const sSessions = sessions.filter(s => s.studentIds.includes(student.id));
                const isSelected = selectedStudent?.id === student.id;

                return (
                  <StudentCard
                    key={student.id}
                    student={student}
                    sessions={sSessions}
                    isSelected={isSelected}
                    onSelect={(s) => setSelectedStudent(s)}
                  />
                );
              })
            ) : (
              <EmptyState
                title="No students found"
                description="Try clearing your search query or adjusting your filters."
                actionLabel="Clear filters"
                onAction={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Sessions for Chosen Student (Step 2) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>
                {selectedStudent
                  ? `Scheduled Sessions for ${selectedStudent.name}`
                  : 'Select a Student to view sessions'}
              </span>
            </h2>
          </div>

          {selectedStudent ? (
            <div className="space-y-4 animate-fadeIn">
              {/* If Eli Morgan (Withdrawn student) */}
              {selectedStudent.status === 'withdrawn' && (
                <WarningBanner
                  title="Student Withdrawn"
                  description={`${selectedStudent.name} was withdrawn from the district on ${selectedStudent.withdrawalDate || 'August 13, 2026'}. Scheduled sessions remain on the calendar for administrative accuracy.`}
                  variant="warning"
                />
              )}

              {/* Special callout for Maya Reyes if she has multiple sessions */}
              {selectedStudent.id === 'student-maya-reyes' && (
                <div className="bg-teal-50/80 backdrop-blur-xs border border-teal-200/90 rounded-xl p-3.5 text-xs text-teal-900 space-y-1 shadow-sm">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Same-day Services (Separate Records)</span>
                  </div>
                  <p>
                    Maya has two distinct sessions today: a <strong>Group speech session at 1:10 PM</strong> and an <strong>Individual make-up session at 1:45 PM</strong>. These are documented as separate individual records.
                  </p>
                </div>
              )}

              {/* Sessions List */}
              {studentSessions.length > 0 ? (
                <div className="space-y-3">
                  {studentSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No sessions scheduled today"
                  description={`There are no scheduled appointments found for ${selectedStudent.name} on August 18, 2026.`}
                />
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/60 backdrop-blur-sm p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-slate-100/90 flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No student selected
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Choose a student from the list on the left to view their scheduled session notes and IEP goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
