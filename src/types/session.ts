export type SessionStatus =
  | 'scheduled'
  | 'draft'
  | 'ready_to_submit'
  | 'validation_error'
  | 'processing'
  | 'submitted'
  | 'queued'
  | 'not_billable';

export type ServiceType =
  | 'Speech therapy'
  | 'Occupational therapy'
  | 'Physical therapy'
  | 'Nursing'
  | 'Behavioral health';

export type SessionModality = 'Individual' | 'Group' | 'Telehealth';

export type SessionLocation =
  | 'Room 204'
  | 'Classroom'
  | 'Therapy room'
  | 'Sensory room'
  | 'Virtual / Telehealth'
  | 'Other';

export interface StudentGroupOutcome {
  studentId: string;
  goalId: string;
  objectiveId: string;
  observations?: string;
  narrative: string;
  completed: boolean;
}

export interface SessionDraft {
  serviceDate: string;
  durationMinutes: number | '';
  serviceType: ServiceType;
  modality: SessionModality;
  location: SessionLocation;
  activity: string;
  goalId?: string;
  objectiveId?: string;
  narrative: string;
  observations?: string; // Quick bullet points entered by Jamie for AI assistance
  studentOutcomes?: Record<string, StudentGroupOutcome>; // For group sessions
  lastSavedAt: string;
  lastSavedTimestamp: number;
  syncStatus?: 'saved' | 'saving' | 'unstable';
}

export interface SessionHistoryEntry {
  timestamp: string;
  author: string;
  action: string;
  notes?: string;
}

export interface Session {
  id: string;
  studentIds: string[]; // 1 for individual, multiple for group
  scheduledDate: string; // e.g. "2026-08-18"
  scheduledStart: string; // e.g. "1:10 PM"
  scheduledEnd: string; // e.g. "1:40 PM"
  serviceType: ServiceType;
  modality: SessionModality;
  location: SessionLocation;
  defaultActivity?: string;
  status: SessionStatus;
  isMakeUp?: boolean;
  isWithdrawn?: boolean;
  withdrawalNote?: string;
  nonBillableReason?: 'Student absent' | 'Student withdrawn' | 'Provider cancelled' | 'School closure' | 'Other';
  draft?: SessionDraft;
  submittedAt?: string;
  submittedBy?: string;
  history?: SessionHistoryEntry[];
}
