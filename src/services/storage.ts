import { Student } from '../types/student';
import { Session, SessionDraft, SessionStatus } from '../types/session';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_SESSIONS } from '../data/sessions';

const STORAGE_KEYS = {
  STUDENTS: 'session_notes_students_v1',
  SESSIONS: 'session_notes_sessions_v1',
  NETWORK_STATUS: 'session_notes_network_sim_v1',
};

// Listeners for reactive updates
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

function notifyListeners() {
  listeners.forEach(cb => cb());
}

export function subscribeToStorage(callback: StorageListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function getStudentById(id: string): Student | undefined {
  const students = getStudents();
  return students.find(s => s.id === id);
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function getSessionById(id: string): Session | undefined {
  const sessions = getSessions();
  return sessions.find(s => s.id === id);
}

export function saveSessionDraft(sessionId: string, draft: Partial<SessionDraft>): Session {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const timestamp = now.getTime();

  let updatedSession: Session;

  if (index >= 0) {
    const existing = sessions[index];
    const updatedDraft: SessionDraft = {
      serviceDate: draft.serviceDate || existing.draft?.serviceDate || existing.scheduledDate,
      durationMinutes: draft.durationMinutes !== undefined ? draft.durationMinutes : (existing.draft?.durationMinutes || 30),
      serviceType: draft.serviceType || existing.draft?.serviceType || existing.serviceType,
      modality: draft.modality || existing.draft?.modality || existing.modality,
      location: draft.location || existing.draft?.location || existing.location,
      activity: draft.activity !== undefined ? draft.activity : (existing.draft?.activity || existing.defaultActivity || ''),
      goalId: draft.goalId !== undefined ? draft.goalId : existing.draft?.goalId,
      objectiveId: draft.objectiveId !== undefined ? draft.objectiveId : existing.draft?.objectiveId,
      narrative: draft.narrative !== undefined ? draft.narrative : (existing.draft?.narrative || ''),
      observations: draft.observations !== undefined ? draft.observations : (existing.draft?.observations || ''),
      studentOutcomes: draft.studentOutcomes || existing.draft?.studentOutcomes,
      lastSavedAt: timeString,
      lastSavedTimestamp: timestamp,
      syncStatus: getNetworkStatus() === 'unstable' ? 'unstable' : 'saved'
    };

    updatedSession = {
      ...existing,
      status: existing.status === 'submitted' || existing.status === 'not_billable' ? existing.status : 'draft',
      draft: updatedDraft
    };
    sessions[index] = updatedSession;
  } else {
    // Create new session if not existing
    const newDraft: SessionDraft = {
      serviceDate: draft.serviceDate || '2026-08-18',
      durationMinutes: draft.durationMinutes || 30,
      serviceType: draft.serviceType || 'Speech therapy',
      modality: draft.modality || 'Individual',
      location: draft.location || 'Room 204',
      activity: draft.activity || '',
      goalId: draft.goalId,
      objectiveId: draft.objectiveId,
      narrative: draft.narrative || '',
      observations: draft.observations || '',
      studentOutcomes: draft.studentOutcomes,
      lastSavedAt: timeString,
      lastSavedTimestamp: timestamp,
      syncStatus: getNetworkStatus() === 'unstable' ? 'unstable' : 'saved'
    };

    updatedSession = {
      id: sessionId,
      studentIds: [],
      scheduledDate: '2026-08-18',
      scheduledStart: timeString,
      scheduledEnd: timeString,
      serviceType: newDraft.serviceType,
      modality: newDraft.modality,
      location: newDraft.location,
      status: 'draft',
      draft: newDraft
    };
    sessions.push(updatedSession);
  }

  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  notifyListeners();
  return updatedSession;
}

export function submitSessionNote(sessionId: string, asQueued: boolean = false): Session {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index < 0) throw new Error('Session not found');

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const session = sessions[index];

  const newStatus: SessionStatus = asQueued ? 'queued' : 'submitted';

  const history = session.history || [];
  history.unshift({
    timestamp: timeString,
    author: 'Jamie Chen, CCC-SLP',
    action: asQueued ? 'Note saved and queued for transmission' : 'Note finalized and submitted',
  });

  const updated: Session = {
    ...session,
    status: newStatus,
    submittedAt: timeString,
    submittedBy: 'Jamie Chen, CCC-SLP',
    history
  };

  sessions[index] = updated;
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  notifyListeners();
  return updated;
}

export function markStudentAbsent(sessionId: string, reason: string = 'Student absent'): Session {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index < 0) throw new Error('Session not found');

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const session = sessions[index];

  const history = session.history || [];
  history.unshift({
    timestamp: timeString,
    author: 'Jamie Chen, CCC-SLP',
    action: `Recorded as "${reason}" (Not billable)`,
  });

  const updated: Session = {
    ...session,
    status: 'not_billable',
    nonBillableReason: 'Student absent',
    submittedAt: timeString,
    submittedBy: 'Jamie Chen, CCC-SLP',
    draft: {
      serviceDate: session.scheduledDate,
      durationMinutes: 0,
      serviceType: session.serviceType,
      modality: session.modality,
      location: session.location,
      activity: 'Missed session / Student absent',
      narrative: 'Student was not in attendance for scheduled service. Documented as non-billable missed session.',
      lastSavedAt: timeString,
      lastSavedTimestamp: now.getTime(),
      syncStatus: 'saved'
    },
    history
  };

  sessions[index] = updated;
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  notifyListeners();
  return updated;
}

export function createBulkIndividualSessions(
  studentIds: string[],
  defaults: {
    serviceDate: string;
    durationMinutes: number;
    serviceType: string;
    location: string;
    activity: string;
  }
): Session[] {
  const sessions = getSessions();
  const created: Session[] = [];
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  studentIds.forEach((studentId, idx) => {
    const student = getStudentById(studentId);
    const newId = `session-bulk-${Date.now()}-${idx}`;
    const defaultGoal = student?.iepGoals[0];
    const defaultObj = defaultGoal?.objectives[0];

    const newSession: Session = {
      id: newId,
      studentIds: [studentId],
      scheduledDate: defaults.serviceDate,
      scheduledStart: timeString,
      scheduledEnd: timeString,
      serviceType: defaults.serviceType as any,
      modality: 'Individual',
      location: defaults.location as any,
      defaultActivity: defaults.activity,
      status: 'draft',
      draft: {
        serviceDate: defaults.serviceDate,
        durationMinutes: defaults.durationMinutes,
        serviceType: defaults.serviceType as any,
        modality: 'Individual',
        location: defaults.location as any,
        activity: defaults.activity,
        goalId: defaultGoal?.id,
        objectiveId: defaultObj?.id,
        narrative: '',
        observations: '',
        lastSavedAt: timeString,
        lastSavedTimestamp: now.getTime(),
        syncStatus: 'saved'
      }
    };

    sessions.push(newSession);
    created.push(newSession);
  });

  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  notifyListeners();
  return created;
}

export function getNetworkStatus(): 'online' | 'unstable' {
  return (localStorage.getItem(STORAGE_KEYS.NETWORK_STATUS) as 'online' | 'unstable') || 'online';
}

export function setNetworkStatus(status: 'online' | 'unstable') {
  localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, status);
  notifyListeners();
}

export type ThemePreset = 'mint' | 'azure' | 'lavender' | 'sunlight';

const THEME_KEYS = {
  PRESET: 'session_notes_theme_preset_v1',
  ANIMATIONS: 'session_notes_theme_anim_v1',
};

export function getThemePreset(): ThemePreset {
  return (localStorage.getItem(THEME_KEYS.PRESET) as ThemePreset) || 'mint';
}

export function setThemePreset(preset: ThemePreset) {
  localStorage.setItem(THEME_KEYS.PRESET, preset);
  notifyListeners();
}

export function getAnimationsEnabled(): boolean {
  const val = localStorage.getItem(THEME_KEYS.ANIMATIONS);
  return val === null ? true : val === 'true';
}

export function setAnimationsEnabled(enabled: boolean) {
  localStorage.setItem(THEME_KEYS.ANIMATIONS, String(enabled));
  notifyListeners();
}

export function resetAllDataToDefault() {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, 'online');
  localStorage.setItem(THEME_KEYS.PRESET, 'mint');
  localStorage.setItem(THEME_KEYS.ANIMATIONS, 'true');
  notifyListeners();
}
