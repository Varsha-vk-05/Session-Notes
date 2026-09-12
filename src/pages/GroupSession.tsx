import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
  Check,
  User
} from 'lucide-react';
import {
  getSessionById,
  getStudentById,
  saveSessionDraft,
  getNetworkStatus,
  subscribeToStorage
} from '../services/storage';
import { Session, SessionDraft, StudentGroupOutcome } from '../types/session';
import { Student } from '../types/student';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { DateField } from '../components/common/DateField';
import { DurationField } from '../components/common/DurationField';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressStepper } from '../components/layout/ProgressStepper';
import { SaveStatus } from '../components/layout/SaveStatus';
import { MobileActionBar } from '../components/layout/MobileActionBar';
import { AIAssistPanel } from '../components/ai/AIAssistPanel';
import { ValidationSummary, ValidationErrorItem } from '../components/common/ValidationSummary';
import { BottomSheet } from '../components/common/BottomSheet';

export const GroupSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | undefined>(() => (id ? getSessionById(id) : undefined));
  const [students, setStudents] = useState<Student[]>(() => {
    if (session && session.studentIds.length > 0) {
      return session.studentIds.map(sid => getStudentById(sid)).filter(Boolean) as Student[];
    }
    return [];
  });

  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(0);
  const [isUnstable, setIsUnstable] = useState(getNetworkStatus() === 'unstable');
  const [isSaving, setIsSaving] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Shared Group Details State
  const initialDraft = session?.draft;
  const [serviceDate, setServiceDate] = useState(initialDraft?.serviceDate || session?.scheduledDate || '2026-08-18');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialDraft?.durationMinutes !== undefined ? initialDraft.durationMinutes : 30
  );
  const [serviceType, setServiceType] = useState(initialDraft?.serviceType || 'Speech therapy');
  const [location, setLocation] = useState(initialDraft?.location || 'Room 204');
  const [activity, setActivity] = useState(initialDraft?.activity || 'Narrative sequencing');

  // Student Specific Outcomes State
  const [outcomes, setOutcomes] = useState<Record<string, StudentGroupOutcome>>(() => {
    const existing = initialDraft?.studentOutcomes || {};
    const initialMap: Record<string, StudentGroupOutcome> = {};

    const studentList = session?.studentIds.map(sid => getStudentById(sid)).filter(Boolean) as Student[];
    studentList.forEach(st => {
      if (existing[st.id]) {
        initialMap[st.id] = existing[st.id];
      } else {
        const defaultGoal = st.iepGoals[0];
        const defaultObj = defaultGoal?.objectives[0];
        initialMap[st.id] = {
          studentId: st.id,
          goalId: defaultGoal?.id || '',
          objectiveId: defaultObj?.id || '',
          observations: '',
          narrative: '',
          completed: false,
        };
      }
    });

    return initialMap;
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return subscribeToStorage(() => {
      setIsUnstable(getNetworkStatus() === 'unstable');
      if (id) {
        const s = getSessionById(id);
        setSession(s);
        if (s) {
          const stList = s.studentIds.map(sid => getStudentById(sid)).filter(Boolean) as Student[];
          setStudents(stList);
        }
      }
    });
  }, [id]);

  const currentStudent = students[activeStudentIndex];
  const currentOutcome = currentStudent ? outcomes[currentStudent.id] : undefined;
  const currentGoal = currentStudent?.iepGoals.find(g => g.id === currentOutcome?.goalId);
  const currentObjective = currentGoal?.objectives.find(o => o.id === currentOutcome?.objectiveId);

  // Autosave Draft
  const triggerAutosave = (updatedOutcomes = outcomes) => {
    if (!id) return;
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      const updated = saveSessionDraft(id, {
        serviceDate,
        durationMinutes,
        serviceType: serviceType as any,
        modality: 'Group',
        location: location as any,
        activity,
        studentOutcomes: updatedOutcomes,
        narrative: `Group Speech Therapy session (${students.map(s => s.name).join(', ')}) targeting ${activity}.`,
      });
      setSession(updated);
      setIsSaving(false);
    }, 350);
  };

  const handleUpdateStudentOutcome = (studentId: string, partial: Partial<StudentGroupOutcome>) => {
    const updated = {
      ...outcomes,
      [studentId]: {
        ...outcomes[studentId],
        ...partial,
        completed: Boolean(
          (partial.narrative !== undefined ? partial.narrative : outcomes[studentId]?.narrative)?.trim()
        ),
      },
    };
    setOutcomes(updated);
    triggerAutosave(updated);
  };

  const validateGroupForm = (): ValidationErrorItem[] => {
    const errors: ValidationErrorItem[] = [];

    if (!serviceDate) {
      errors.push({ fieldId: 'group-service-date', label: 'Service Date', message: 'Enter service date.' });
    }
    if (durationMinutes === '' || Number(durationMinutes) <= 0) {
      errors.push({ fieldId: 'group-duration', label: 'Duration', message: 'Duration must be greater than 0 minutes.' });
    }
    if (!activity.trim()) {
      errors.push({ fieldId: 'group-activity', label: 'Activity', message: 'Enter shared group activity.' });
    }

    students.forEach((st) => {
      const outcome = outcomes[st.id];
      if (!outcome?.goalId) {
        errors.push({
          fieldId: `goal-${st.id}`,
          label: `${st.name}'s Goal`,
          message: `Select an IEP goal for ${st.name}.`,
        });
      }
      if (!outcome?.narrative?.trim()) {
        errors.push({
          fieldId: `narrative-${st.id}`,
          label: `${st.name}'s Outcome Note`,
          message: `Provide individual clinical response for ${st.name}.`,
        });
      }
    });

    return errors;
  };

  const handleReview = () => {
    const errors = validateGroupForm();
    setValidationErrors(errors);

    if (errors.length > 0) {
      const first = errors[0];
      // Switch tab if error belongs to a student
      const errorStudentIndex = students.findIndex(s => first.fieldId.includes(s.id));
      if (errorStudentIndex >= 0) {
        setActiveStudentIndex(errorStudentIndex);
      }
      return;
    }

    if (id) {
      saveSessionDraft(id, {
        serviceDate,
        durationMinutes,
        serviceType: serviceType as any,
        modality: 'Group',
        location: location as any,
        activity,
        studentOutcomes: outcomes,
        narrative: `Group Speech Therapy session (${students.map(s => s.name).join(', ')}) targeting ${activity}.`,
      });
      navigate(`/review/${id}`);
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-slide-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Group Session Documentation
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100/90 text-purple-900 border border-purple-200/80 flex items-center gap-1 shadow-2xs">
                <Users className="w-3 h-3" />
                <span>One shared group session</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              One shared group session with individual student outcomes
            </p>
          </div>
        </div>

        <SaveStatus
          lastSavedTimestamp={session?.draft?.lastSavedTimestamp}
          lastSavedAt={session?.draft?.lastSavedAt}
          isSaving={isSaving}
          isUnstable={isUnstable}
        />
      </div>

      <div className="max-w-xl mx-auto px-2">
        <ProgressStepper currentStep={2} />
      </div>

      {/* Explainer Banner */}
      <div className="bg-purple-50/80 backdrop-blur-xs border border-purple-200/90 rounded-xl p-3.5 text-xs text-purple-900 flex items-start gap-2.5 shadow-sm">
        <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">One shared group session:</span>
          <p className="opacity-90">
            Shared service details (time, location, activity) apply to the group session, while each student has an independent IEP goal and individual clinical narrative.
          </p>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <ValidationSummary errors={validationErrors} />
      )}

      {/* Section 1: Shared Group Metadata */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>1. Shared Session Details</span>
          <span className="text-xs font-normal text-slate-500 lowercase">Applies to all participants</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DateField
            id="group-service-date"
            label="Service Date"
            value={serviceDate}
            onChange={(e) => {
              setServiceDate(e.target.value);
              triggerAutosave();
            }}
          />

          <DurationField
            id="group-duration"
            label="Duration"
            value={durationMinutes}
            onChangeMinutes={(mins) => {
              setDurationMinutes(mins);
              triggerAutosave();
            }}
          />

          <Select
            id="group-service-type"
            label="Service Type"
            value={serviceType}
            onChange={(e) => {
              setServiceType(e.target.value as any);
              triggerAutosave();
            }}
            options={[
              { value: 'Speech therapy', label: 'Speech therapy' },
              { value: 'Occupational therapy', label: 'Occupational therapy' },
              { value: 'Physical therapy', label: 'Physical therapy' },
            ]}
          />

          <Select
            id="group-location"
            label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value as any);
              triggerAutosave();
            }}
            options={[
              { value: 'Room 204', label: 'Room 204' },
              { value: 'Classroom', label: 'Classroom' },
              { value: 'Therapy room', label: 'Therapy room' },
              { value: 'Sensory room', label: 'Sensory room' },
            ]}
          />
        </div>

        <div>
          <Select
            id="group-activity"
            label="Shared Group Activity"
            isRequired
            value={activity}
            onChange={(e) => {
              setActivity(e.target.value);
              triggerAutosave();
            }}
            options={[
              { value: 'Narrative sequencing', label: 'Narrative sequencing' },
              { value: 'Wh-question picture scene cards', label: 'Wh-question picture cards' },
              { value: 'Pragmatic turn-taking board game', label: 'Pragmatic turn-taking game' },
            ]}
          />
        </div>
      </div>

      {/* Section 2: Student Specific Outcomes with Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span>2. Student Specific Clinical Outcomes</span>
          </h2>
          <span className="text-xs text-slate-500">
            {students.filter(s => outcomes[s.id]?.completed).length} of {students.length} completed
          </span>
        </div>

        {/* Student Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          {students.map((st, idx) => {
            const isSelected = activeStudentIndex === idx;
            const isCompleted = outcomes[st.id]?.completed;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStudentIndex(idx)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-teal-400 text-navy-950' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {st.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span>{st.name}</span>
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Student Documentation Card */}
        {currentStudent && currentOutcome && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            {/* Student Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{currentStudent.name}</span>
                  <span className="text-xs text-slate-500">({currentStudent.grade})</span>
                </div>
                <StatusBadge status="active" size="sm" />
              </div>

              {/* Goal Selector */}
              <Select
                id={`goal-${currentStudent.id}`}
                label={`${currentStudent.name}'s IEP Goal`}
                isRequired
                value={currentOutcome.goalId}
                onChange={(e) => {
                  const selectedG = currentStudent.iepGoals.find(g => g.id === e.target.value);
                  handleUpdateStudentOutcome(currentStudent.id, {
                    goalId: e.target.value,
                    objectiveId: selectedG?.objectives[0]?.id || '',
                  });
                }}
                options={currentStudent.iepGoals.map(g => ({
                  value: g.id,
                  label: `${g.code} — ${g.description}`,
                }))}
              />

              {/* Objective Selector */}
              {currentGoal && (
                <Select
                  label="Objective"
                  value={currentOutcome.objectiveId}
                  onChange={(e) => {
                    handleUpdateStudentOutcome(currentStudent.id, {
                      objectiveId: e.target.value,
                    });
                  }}
                  options={currentGoal.objectives.map(o => ({
                    value: o.id,
                    label: `${o.code} — ${o.description}`,
                  }))}
                />
              )}

              {/* Individual Narrative Note */}
              <Textarea
                id={`narrative-${currentStudent.id}`}
                label={`${currentStudent.name}'s Session Note`}
                isRequired
                rows={5}
                value={currentOutcome.narrative}
                onChange={(e) => {
                  handleUpdateStudentOutcome(currentStudent.id, {
                    narrative: e.target.value,
                  });
                }}
                placeholder={`Describe how ${currentStudent.name} responded during group ${activity}...`}
                helperText={`Describe specific performance and cuing level for ${currentStudent.name}.`}
                actionElement={
                  <button
                    type="button"
                    onClick={() => setIsAIOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Note Assist</span>
                  </button>
                }
              />

              {/* Next student shortcut */}
              {activeStudentIndex < students.length - 1 && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveStudentIndex(activeStudentIndex + 1)}
                  >
                    Next Student: {students[activeStudentIndex + 1]?.name} →
                  </Button>
                </div>
              )}
            </div>

            {/* AI Assistant for current student (Desktop) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="hidden lg:block">
                <AIAssistPanel
                  studentName={currentStudent.name}
                  grade={currentStudent.grade}
                  goalDescription={currentGoal?.description}
                  objectiveDescription={currentObjective?.description}
                  activity={activity}
                  modality="Group"
                  initialObservations={currentOutcome.observations}
                  onApplyDraft={(draftText) => {
                    handleUpdateStudentOutcome(currentStudent.id, {
                      narrative: draftText,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile AI Bottom Sheet */}
      {currentStudent && (
        <BottomSheet
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          title="AI Note Assist"
          subtitle={`Drafting note for ${currentStudent.name} (Group Session)`}
        >
          <AIAssistPanel
            studentName={currentStudent.name}
            grade={currentStudent.grade}
            goalDescription={currentGoal?.description}
            objectiveDescription={currentObjective?.description}
            activity={activity}
            modality="Group"
            initialObservations={currentOutcome?.observations}
            onApplyDraft={(draftText) => {
              handleUpdateStudentOutcome(currentStudent.id, {
                narrative: draftText,
              });
              setIsAIOpen(false);
            }}
            onClose={() => setIsAIOpen(false)}
          />
        </BottomSheet>
      )}

      {/* Sticky Action Bar */}
      <MobileActionBar
        statusInfo={
          <SaveStatus
            lastSavedTimestamp={session?.draft?.lastSavedTimestamp}
            lastSavedAt={session?.draft?.lastSavedAt}
            isSaving={isSaving}
            isUnstable={isUnstable}
          />
        }
        secondaryAction={
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/sessions')}
          >
            Back
          </Button>
        }
      >
        <Button
          variant="secondary"
          size="md"
          onClick={handleReview}
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Review &amp; submit group note
        </Button>
      </MobileActionBar>
    </div>
  );
};
