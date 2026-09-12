import { Session } from '../types/session';

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'session-group-1',
    studentIds: ['student-maya-reyes', 'student-jordan-tate'],
    scheduledDate: '2026-08-18',
    scheduledStart: '1:10 PM',
    scheduledEnd: '1:40 PM',
    serviceType: 'Speech therapy',
    modality: 'Group',
    location: 'Room 204',
    defaultActivity: 'Narrative sequencing',
    status: 'draft',
    draft: {
      serviceDate: '2026-08-18',
      durationMinutes: 30,
      serviceType: 'Speech therapy',
      modality: 'Group',
      location: 'Room 204',
      activity: 'Narrative sequencing',
      narrative: '',
      studentOutcomes: {
        'student-maya-reyes': {
          studentId: 'student-maya-reyes',
          goalId: 'goal-maya-1',
          objectiveId: 'obj-maya-1a',
          observations: 'Maya independently ordered 3 of 4 story cards. Needed verbal prompt on final transition step.',
          narrative: '',
          completed: false,
        },
        'student-jordan-tate': {
          studentId: 'student-jordan-tate',
          goalId: 'goal-jordan-1',
          objectiveId: 'obj-jordan-1a',
          observations: 'Jordan answered who and where questions without cues. Needed visual choice for why prompt.',
          narrative: '',
          completed: false,
        }
      },
      lastSavedAt: '2:02 PM',
      lastSavedTimestamp: Date.now() - 480000,
      syncStatus: 'saved'
    }
  },
  {
    id: 'session-maya-makeup-2',
    studentIds: ['student-maya-reyes'],
    scheduledDate: '2026-08-18',
    scheduledStart: '1:45 PM',
    scheduledEnd: '2:00 PM',
    serviceType: 'Speech therapy',
    modality: 'Individual',
    location: 'Room 204',
    defaultActivity: 'Individual make-up activity',
    status: 'scheduled',
    isMakeUp: true,
    draft: {
      serviceDate: '2026-08-18',
      durationMinutes: 15,
      serviceType: 'Speech therapy',
      modality: 'Individual',
      location: 'Room 204',
      activity: 'Individual make-up activity',
      goalId: 'goal-maya-1',
      objectiveId: 'obj-maya-1b',
      narrative: '',
      observations: '',
      lastSavedAt: '',
      lastSavedTimestamp: 0,
      syncStatus: 'saved'
    }
  },
  {
    id: 'session-eli-withdrawn-3',
    studentIds: ['student-eli-morgan'],
    scheduledDate: '2026-08-18',
    scheduledStart: '2:05 PM',
    scheduledEnd: '2:35 PM',
    serviceType: 'Speech therapy',
    modality: 'Individual',
    location: 'Room 204',
    defaultActivity: 'Target phoneme drill cards & word ladder',
    status: 'scheduled',
    isWithdrawn: true,
    withdrawalNote: 'Student withdrawn from district on August 13, 2026. Scheduled session remains visible on calendar.'
  },
  {
    id: 'session-liam-morning-4',
    studentIds: ['student-liam-patel'],
    scheduledDate: '2026-08-18',
    scheduledStart: '9:30 AM',
    scheduledEnd: '10:00 AM',
    serviceType: 'Speech therapy',
    modality: 'Individual',
    location: 'Room 204',
    defaultActivity: 'Barrier communication game',
    status: 'submitted',
    submittedAt: '10:08 AM',
    submittedBy: 'Jamie Chen, CCC-SLP',
    draft: {
      serviceDate: '2026-08-18',
      durationMinutes: 30,
      serviceType: 'Speech therapy',
      modality: 'Individual',
      location: 'Room 204',
      activity: 'Barrier communication game',
      goalId: 'goal-liam-1',
      objectiveId: 'obj-liam-1a',
      narrative: 'Liam participated in barrier communication tasks focused on category and attribute descriptions. Liam correctly identified the target category and at least 2 functional attributes for 4 of 5 stimulus items with minimal phonemic cuing. Good self-correction noted during trials 3 and 4.',
      lastSavedAt: '10:05 AM',
      lastSavedTimestamp: Date.now() - 14400000,
      syncStatus: 'saved'
    },
    history: [
      {
        timestamp: '10:08 AM',
        author: 'Jamie Chen, CCC-SLP',
        action: 'Note submitted and verified'
      },
      {
        timestamp: '10:05 AM',
        author: 'Jamie Chen, CCC-SLP',
        action: 'Draft finalized'
      }
    ]
  }
];
