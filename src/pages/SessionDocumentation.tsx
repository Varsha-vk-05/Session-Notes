import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  User,
  Info,
  Layers,
  FileCheck,
  Slash
} from 'lucide-react';
import {
  getSessionById,
  getStudentById,
  saveSessionDraft,
  markStudentAbsent,
  getNetworkStatus,
  subscribeToStorage
} from '../services/storage';
import { Session, SessionDraft, ServiceType, SessionModality, SessionLocation } from '../types/session';
import { Student } from '../types/student';
import { THERAPY_ACTIVITIES } from '../data/activities';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { DateField } from '../components/common/DateField';
import { DurationField } from '../components/common/DurationField';
import { StatusBadge } from '../components/common/StatusBadge';
import { WarningBanner } from '../components/common/WarningBanner';
import { ValidationSummary, ValidationErrorItem } from '../components/common/ValidationSummary';
import { ProgressStepper } from '../components/layout/ProgressStepper';
import { SaveStatus } from '../components/layout/SaveStatus';
import { MobileActionBar } from '../components/layout/MobileActionBar';
import { BottomSheet } from '../components/common/BottomSheet';
import { AIAssistPanel } from '../components/ai/AIAssistPanel';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SessionDocumentation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | undefined>(() => (id ? getSessionById(id) : undefined));
  const [student, setStudent] = useState<Student | undefined>(() => {
    if (session && session.studentIds.length > 0) {
      return getStudentById(session.studentIds[0]);
    }
    return undefined;
  });

  // Network status simulation
  const [isUnstable, setIsUnstable] = useState(getNetworkStatus() === 'unstable');
  const [isSaving, setIsSaving] = useState(false);

  // Bottom sheet state for mobile AI Assist
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showAbsentConfirm, setShowAbsentConfirm] = useState(false);

  // Form State
  const initialDraft = session?.draft;
  const [serviceDate, setServiceDate] = useState(initialDraft?.serviceDate || session?.scheduledDate || '2026-08-18');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialDraft?.durationMinutes !== undefined ? initialDraft.durationMinutes : (session?.isMakeUp ? 15 : 30)
  );
  const [serviceType, setServiceType] = useState<ServiceType>(initialDraft?.serviceType || session?.serviceType || 'Speech therapy');
  const [modality, setModality] = useState<SessionModality>(initialDraft?.modality || session?.modality || 'Individual');
  const [location, setLocation] = useState<SessionLocation>(initialDraft?.location || session?.location || 'Room 204');
  const [activity, setActivity] = useState(initialDraft?.activity || session?.defaultActivity || 'Narrative sequencing');
  const [goalId, setGoalId] = useState<string>(
    initialDraft?.goalId || student?.iepGoals[0]?.id || ''
  );
  const [objectiveId, setObjectiveId] = useState<string>(
    initialDraft?.objectiveId || student?.iepGoals[0]?.objectives[0]?.id || ''
  );
  const [narrative, setNarrative] = useState(initialDraft?.narrative || '');
  const [observations, setObservations] = useState(initialDraft?.observations || '');

  // Validation State
  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Autosave tracking ref
  const saveTimeoutRef = useRef<number | null>(null);

  // Refresh data on mount or storage update
  useEffect(() => {
    return subscribeToStorage(() => {
      setIsUnstable(getNetworkStatus() === 'unstable');
      if (id) {
        const s = getSessionById(id);
        setSession(s);
        if (s && s.studentIds.length > 0) {
          setStudent(getStudentById(s.studentIds[0]));
        }
      }
    });
  }, [id]);

  // Update selected goal and auto-select its first objective if goal changes
  const handleGoalChange = (newGoalId: string) => {
    setGoalId(newGoalId);
    const selectedGoalObj = student?.iepGoals.find(g => g.id === newGoalId);
    if (selectedGoalObj && selectedGoalObj.objectives.length > 0) {
      setObjectiveId(selectedGoalObj.objectives[0].id);
    } else {
      setObjectiveId('');
    }
  };

  // Perform Autosave to LocalStorage
  const triggerAutosave = (updatedFields: Partial<SessionDraft>) => {
    if (!id) return;
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      const updated = saveSessionDraft(id, {
        serviceDate,
        durationMinutes,
        serviceType,
        modality,
        location,
        activity,
        goalId,
        objectiveId,
        narrative,
        observations,
        ...updatedFields,
      });
      setSession(updated);
      setIsSaving(false);
    }, 350);
  };

  // Validate form fields
  const validateForm = (): ValidationErrorItem[] => {
    const errors: ValidationErrorItem[] = [];

    if (!serviceDate || isNaN(Date.parse(serviceDate))) {
      errors.push({
        fieldId: 'service-date',
        label: 'Service Date',
        message: 'Enter a valid service date.',
      });
    }

    if (durationMinutes === '' || Number(durationMinutes) <= 0) {
      errors.push({
        fieldId: 'duration-minutes',
        label: 'Duration',
        message: 'Duration must be greater than 0 minutes.',
      });
    }

    if (!serviceType) {
      errors.push({
        fieldId: 'service-type',
        label: 'Service Type',
        message: 'Select a service type.',
      });
    }

    if (!modality) {
      errors.push({
        fieldId: 'session-modality',
        label: 'Modality',
        message: 'Select session modality.',
      });
    }

    if (!location) {
      errors.push({
        fieldId: 'session-location',
        label: 'Location',
        message: 'Select session location.',
      });
    }

    if (!activity.trim()) {
      errors.push({
        fieldId: 'therapy-activity',
        label: 'Activity',
        message: 'Select the activity completed during this session.',
      });
    }

    if (!goalId) {
      errors.push({
        fieldId: 'iep-goal',
        label: 'IEP Goal',
        message: 'Select the IEP goal linked to this session.',
      });
    }

    if (!objectiveId) {
      errors.push({
        fieldId: 'iep-objective',
        label: 'Objective',
        message: 'Select an objective linked to this goal.',
      });
    }

    if (!narrative.trim()) {
      errors.push({
        fieldId: 'narrative-note',
        label: 'Session Note',
        message: 'Add a session note before submitting.',
      });
    }

    return errors;
  };

  const handleReviewAndSubmit = () => {
    setHasAttemptedSubmit(true);
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length > 0) {
      // Focus first error field
      const firstId = errors[0].fieldId;
      const el = document.getElementById(firstId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    // Save final draft state and navigate to review screen
    if (id) {
      saveSessionDraft(id, {
        serviceDate,
        durationMinutes,
        serviceType,
        modality,
        location,
        activity,
        goalId,
        objectiveId,
        narrative,
        observations,
      });
      navigate(`/review/${id}`);
    }
  };

  const handleMarkAbsent = () => {
    if (!id) return;
    markStudentAbsent(id, 'Student absent');
    setShowAbsentConfirm(false);
    navigate(`/submitted/${id}`);
  };

  // If session already submitted or not billable, redirect to submitted view
  if (session && (session.status === 'submitted' || session.status === 'queued' || session.status === 'not_billable')) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="p-3 bg-slate-100 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-slate-600">
          <FileCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">This session is already recorded</h2>
        <p className="text-sm text-slate-500">
          This session note has already been submitted or marked as non-billable and is in read-only mode.
        </p>
        <Button onClick={() => navigate(`/submitted/${session.id}`)}>
          View Recorded Note
        </Button>
      </div>
    );
  }

  // Find goal descriptions
  const currentGoal = student?.iepGoals.find(g => g.id === goalId);
  const currentObjective = currentGoal?.objectives.find(o => o.id === objectiveId);

  const isWithdrawn = session?.isWithdrawn || student?.status === 'withdrawn';

  return (
    <div className="space-y-6 pb-28 animate-slide-up">
      {/* Top Header with Back Navigation & Autosave */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            aria-label="Back to session list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Document Session Note
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual Speech &amp; Language Service
            </p>
          </div>
        </div>

        {/* Live Autosave Status Indicator */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <SaveStatus
            lastSavedTimestamp={session?.draft?.lastSavedTimestamp}
            lastSavedAt={session?.draft?.lastSavedAt}
            isSaving={isSaving}
            isUnstable={isUnstable}
          />
        </div>
      </div>

      {/* Progress Stepper (Step 2: Details) */}
      <div className="max-w-xl mx-auto px-2">
        <ProgressStepper currentStep={2} />
      </div>

      {/* SPECIAL REQUIREMENT: Withdrawn Student Flow for Eli Morgan */}
      {isWithdrawn && (
        <WarningBanner
          title="Student withdrawn"
          description="Eli Morgan was withdrawn on August 13, 2026. This scheduled session remains visible."
          variant="warning"
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-xs border-amber-300 text-amber-900 hover:bg-amber-100"
                onClick={() => {
                  const formEl = document.getElementById('service-date');
                  if (formEl) formEl.focus();
                }}
              >
                Record session
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAbsentConfirm(true)}
                leftIcon={<Slash className="w-3.5 h-3.5" />}
              >
                Student absent
              </Button>
            </>
          }
        />
      )}

      {/* Student Session Context Banner */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/90 p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 shadow-2xs ${student?.avatarBg || 'bg-slate-100 text-slate-800'}`}
          >
            {student?.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {student?.name || 'Student Name'}
              </h2>
              <StatusBadge status={student?.status === 'withdrawn' ? 'withdrawn' : 'active'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {student?.grade || 'Grade 4'} · {student?.school || 'Lincoln Elementary'} · Case Mgr: {student?.caseManager || 'Sarah Jenkins'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50/80 backdrop-blur-xs rounded-lg p-2.5 border border-slate-100 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">{session?.scheduledStart} – {session?.scheduledEnd}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{session?.location || 'Room 204'}</span>
          </div>
        </div>
      </div>

      {/* Validation Summary (if errors exist) */}
      {validationErrors.length > 0 && (
        <ValidationSummary errors={validationErrors} />
      )}

      {/* Main Documentation Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-5 bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
            Service Details
          </h3>

          {/* Service Date & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateField
              id="service-date"
              label="Service Date"
              isRequired
              value={serviceDate}
              onChange={(e) => {
                setServiceDate(e.target.value);
                triggerAutosave({ serviceDate: e.target.value });
              }}
              error={validationErrors.find(e => e.fieldId === 'service-date')?.message}
            />

            <DurationField
              id="duration-minutes"
              label="Duration"
              isRequired
              value={durationMinutes}
              onChangeMinutes={(mins) => {
                setDurationMinutes(mins);
                triggerAutosave({ durationMinutes: mins });
              }}
              error={validationErrors.find(e => e.fieldId === 'duration-minutes')?.message}
            />
          </div>

          {/* Service Type & Modality Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="service-type"
              label="Service Type"
              isRequired
              value={serviceType}
              onChange={(e) => {
                const val = e.target.value as ServiceType;
                setServiceType(val);
                triggerAutosave({ serviceType: val });
              }}
              options={[
                { value: 'Speech therapy', label: 'Speech therapy' },
                { value: 'Occupational therapy', label: 'Occupational therapy' },
                { value: 'Physical therapy', label: 'Physical therapy' },
                { value: 'Nursing', label: 'Nursing' },
                { value: 'Behavioral health', label: 'Behavioral health' },
              ]}
              error={validationErrors.find(e => e.fieldId === 'service-type')?.message}
            />

            <Select
              id="session-modality"
              label="Modality"
              isRequired
              value={modality}
              onChange={(e) => {
                const val = e.target.value as SessionModality;
                setModality(val);
                triggerAutosave({ modality: val });
              }}
              options={[
                { value: 'Individual', label: 'Individual (1:1)' },
                { value: 'Group', label: 'Group' },
                { value: 'Telehealth', label: 'Telehealth / Virtual' },
              ]}
              error={validationErrors.find(e => e.fieldId === 'session-modality')?.message}
            />
          </div>

          {/* Location & Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="session-location"
              label="Location"
              isRequired
              value={location}
              onChange={(e) => {
                const val = e.target.value as SessionLocation;
                setLocation(val);
                triggerAutosave({ location: val });
              }}
              options={[
                { value: 'Room 204', label: 'Room 204 (Speech Room)' },
                { value: 'Classroom', label: 'General Classroom' },
                { value: 'Therapy room', label: 'Therapy Room' },
                { value: 'Sensory room', label: 'Sensory Room' },
                { value: 'Virtual / Telehealth', label: 'Virtual / Telehealth' },
                { value: 'Other', label: 'Other School Area' },
              ]}
              error={validationErrors.find(e => e.fieldId === 'session-location')?.message}
            />

            <Select
              id="therapy-activity"
              label="Activity"
              isRequired
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value);
                triggerAutosave({ activity: e.target.value });
              }}
              options={THERAPY_ACTIVITIES.map(a => ({
                value: a.name,
                label: a.name,
              }))}
              error={validationErrors.find(e => e.fieldId === 'therapy-activity')?.message}
            />
          </div>

          {/* IEP Goal & Objective Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              IEP Linkage
            </h3>

            <Select
              id="iep-goal"
              label="IEP Goal"
              isRequired
              value={goalId}
              onChange={(e) => {
                handleGoalChange(e.target.value);
                triggerAutosave({ goalId: e.target.value });
              }}
              options={
                student?.iepGoals.map(g => ({
                  value: g.id,
                  label: `${g.code} — ${g.description} (${g.area})`,
                })) || [{ value: '', label: 'No goals available' }]
              }
              error={validationErrors.find(e => e.fieldId === 'iep-goal')?.message}
            />

            {currentGoal && (
              <Select
                id="iep-objective"
                label="Objective"
                isRequired
                value={objectiveId}
                onChange={(e) => {
                  setObjectiveId(e.target.value);
                  triggerAutosave({ objectiveId: e.target.value });
                }}
                options={
                  currentGoal.objectives.map(o => ({
                    value: o.id,
                    label: `${o.code} — ${o.description}`,
                  }))
                }
                helperText={currentObjective?.criteria ? `Target Criteria: ${currentObjective.criteria}` : undefined}
                error={validationErrors.find(e => e.fieldId === 'iep-objective')?.message}
              />
            )}
          </div>

          {/* Narrative Service Note */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <Textarea
              id="narrative-note"
              label="Session note"
              isRequired
              rows={6}
              value={narrative}
              onChange={(e) => {
                setNarrative(e.target.value);
                triggerAutosave({ narrative: e.target.value });
              }}
              placeholder="Describe what was done, how the student responded, and relevant evidence."
              helperText="Describe what was done, how the student responded, and relevant evidence."
              error={validationErrors.find(e => e.fieldId === 'narrative-note')?.message}
              actionElement={
                <button
                  type="button"
                  onClick={() => setIsAIOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors focus:ring-2 focus:ring-teal-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>AI Note Assist</span>
                </button>
              }
            />
          </div>
        </div>

        {/* Right Column: AI Assist Panel (Desktop) & Quick Tips */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Note Assist Panel (Always visible on desktop) */}
          <div className="hidden lg:block">
            <AIAssistPanel
              studentName={student?.name || 'Student'}
              grade={student?.grade}
              goalDescription={currentGoal?.description}
              objectiveDescription={currentObjective?.description}
              activity={activity}
              modality={modality}
              initialObservations={observations}
              onApplyDraft={(draftText) => {
                setNarrative(draftText);
                triggerAutosave({ narrative: draftText });
              }}
            />
          </div>

          {/* Helper Tips Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Documentation Checklist</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-slate-500">
              <li>Confirm exact direct therapy minutes (excluding transit).</li>
              <li>Include measurable student response (e.g. 3 of 4 trials).</li>
              <li>Reference level of cuing or prompting provided.</li>
              <li>Notes are autosaved continuously on this device.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile AI Assist Bottom Sheet */}
      <BottomSheet
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        title="AI Note Assist"
        subtitle={`Drafting clinical note for ${student?.name || 'Student'}`}
      >
        <AIAssistPanel
          studentName={student?.name || 'Student'}
          grade={student?.grade}
          goalDescription={currentGoal?.description}
          objectiveDescription={currentObjective?.description}
          activity={activity}
          modality={modality}
          initialObservations={observations}
          onApplyDraft={(draftText) => {
            setNarrative(draftText);
            triggerAutosave({ narrative: draftText });
            setIsAIOpen(false);
          }}
          onClose={() => setIsAIOpen(false)}
        />
      </BottomSheet>

      {/* Confirm Student Absent Dialog */}
      <ConfirmDialog
        isOpen={showAbsentConfirm}
        onClose={() => setShowAbsentConfirm(false)}
        onConfirm={handleMarkAbsent}
        title="Record Student Absent?"
        message="This session will be marked as 'Not billable' with reason 'Student absent'. No therapy charges or claims will be generated."
        confirmLabel="Record Absent"
        variant="warning"
      />

      {/* Sticky Mobile Action Bar */}
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
          onClick={handleReviewAndSubmit}
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Review &amp; submit note
        </Button>
      </MobileActionBar>
    </div>
  );
};
