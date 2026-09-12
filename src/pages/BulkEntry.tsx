import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowLeft,
  CheckSquare,
  Square,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getStudents, createBulkIndividualSessions } from '../services/storage';
import { Button } from '../components/common/Button';
import { DateField } from '../components/common/DateField';
import { DurationField } from '../components/common/DurationField';
import { Select } from '../components/common/Select';
import { THERAPY_ACTIVITIES } from '../data/activities';

export const BulkEntry: React.FC = () => {
  const navigate = useNavigate();
  const students = getStudents().filter(s => s.status === 'active');

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([
    'student-maya-reyes',
    'student-jordan-tate',
  ]);

  const [serviceDate, setServiceDate] = useState('2026-08-18');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(30);
  const [serviceType, setServiceType] = useState('Speech therapy');
  const [location, setLocation] = useState('Room 204');
  const [activity, setActivity] = useState('Narrative sequencing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedStudentIds(students.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handleCreate = () => {
    if (selectedStudentIds.length === 0) return;
    setIsSubmitting(true);

    const created = createBulkIndividualSessions(selectedStudentIds, {
      serviceDate,
      durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : 30,
      serviceType,
      location,
      activity,
    });

    setIsSubmitting(false);

    // If 1 or more created, navigate to dashboard with created drafts
    if (created.length > 0) {
      navigate('/', {
        state: { message: `Created ${created.length} individual session drafts.` }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            aria-label="Back to session selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bulk Individual Entry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate separate individual notes for multiple students at once
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL DISTINCTION BANNER */}
      <div
        role="alert"
        className="rounded-xl border border-indigo-200/90 bg-indigo-50/80 backdrop-blur-xs p-4 text-indigo-900 flex items-start gap-3 shadow-sm"
      >
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold tracking-tight">
            Important distinction: Separate individual records
          </h4>
          <p className="text-xs leading-relaxed opacity-95">
            <strong>This is not a group session.</strong> This tool initializes <strong>separate, distinct individual notes</strong> for each selected student. Each student will receive their own independent draft note linked directly to their specific IEP goals.
          </p>
        </div>
      </div>

      {/* Step 1: Select Students */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Select Students</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose which students need individual session records generated
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
            >
              Select all
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {students.map((st) => {
            const isChecked = selectedStudentIds.includes(st.id);
            return (
              <div
                key={st.id}
                onClick={() => toggleStudent(st.id)}
                tabIndex={0}
                role="checkbox"
                aria-checked={isChecked}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleStudent(st.id);
                  }
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-teal-50/70 backdrop-blur-xs border-teal-500 ring-1 ring-teal-500 shadow-sm'
                    : 'bg-white/80 backdrop-blur-xs border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-2xs ${st.avatarBg}`}
                  >
                    {st.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{st.name}</h3>
                    <p className="text-xs text-slate-500">{st.grade} · {st.school}</p>
                  </div>
                </div>

                <div className="shrink-0 text-teal-600">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-teal-600 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedStudentIds.length > 0 && (
          <div className="pt-2 text-xs font-bold text-teal-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{selectedStudentIds.length} separate individual notes will be created.</span>
          </div>
        )}
      </div>

      {/* Step 2: Shared Initial Defaults */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Default Session Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            These values will be applied as the starting baseline for each generated individual draft
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateField
            label="Service Date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
          />

          <DurationField
            label="Duration"
            value={durationMinutes}
            onChangeMinutes={(mins) => setDurationMinutes(mins)}
          />

          <Select
            label="Service Type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            options={[
              { value: 'Speech therapy', label: 'Speech therapy' },
              { value: 'Occupational therapy', label: 'Occupational therapy' },
              { value: 'Physical therapy', label: 'Physical therapy' },
            ]}
          />

          <Select
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={[
              { value: 'Room 204', label: 'Room 204' },
              { value: 'Classroom', label: 'Classroom' },
              { value: 'Therapy room', label: 'Therapy room' },
            ]}
          />

          <div className="sm:col-span-2">
            <Select
              label="Activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              options={THERAPY_ACTIVITIES.map(a => ({ value: a.name, label: a.name }))}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50/80 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-sm font-bold text-slate-900 block">
            Ready to generate {selectedStudentIds.length} drafts?
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            You will be able to edit individual goals and notes for each student after generation.
          </span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          disabled={selectedStudentIds.length === 0}
          isLoading={isSubmitting}
          onClick={handleCreate}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md shadow-teal-900/20"
        >
          Create {selectedStudentIds.length} Individual Drafts
        </Button>
      </div>
    </div>
  );
};
