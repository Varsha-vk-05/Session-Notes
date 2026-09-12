import { Student } from '../types/student';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-maya-reyes',
    name: 'Maya Reyes',
    grade: 'Grade 4',
    school: 'Lincoln Elementary',
    status: 'active',
    dob: '2016-04-12',
    caseManager: 'Sarah Jenkins, M.Ed.',
    serviceFrequency: '2x 30min / week',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iepGoals: [
      {
        id: 'goal-maya-1',
        code: 'SLP-G1',
        area: 'Expressive Language',
        description: 'Organize a four-step narrative',
        targetDate: '2027-02-15',
        objectives: [
          {
            id: 'obj-maya-1a',
            code: 'OBJ-1.1',
            description: 'Independently sequence 4 picture cards into logical beginning, middle, and end order with 80% accuracy.',
            criteria: '4/5 opportunities across 3 consecutive sessions'
          },
          {
            id: 'obj-maya-1b',
            code: 'OBJ-1.2',
            description: 'Use transitional temporal markers (first, next, then, finally) when verbalizing story sequences.',
            criteria: '80% accuracy with minimal cues'
          }
        ]
      },
      {
        id: 'goal-maya-2',
        code: 'SLP-G2',
        area: 'Expressive Language',
        description: 'Use irregular past tense verbs in structured speech',
        targetDate: '2027-02-15',
        objectives: [
          {
            id: 'obj-maya-2a',
            code: 'OBJ-2.1',
            description: 'Correctly formulate target irregular past tense verbs during picture description tasks with 85% accuracy.',
          }
        ]
      }
    ]
  },
  {
    id: 'student-jordan-tate',
    name: 'Jordan Tate',
    grade: 'Grade 4',
    school: 'Lincoln Elementary',
    status: 'active',
    dob: '2016-09-28',
    caseManager: 'Sarah Jenkins, M.Ed.',
    serviceFrequency: '2x 30min / week',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iepGoals: [
      {
        id: 'goal-jordan-1',
        code: 'SLP-G1',
        area: 'Receptive Language',
        description: 'Answer who / what / where questions',
        targetDate: '2027-01-20',
        objectives: [
          {
            id: 'obj-jordan-1a',
            code: 'OBJ-1.1',
            description: 'Answer literal who, what, and where questions following a structured visual story sequence with no more than 1 verbal cue.',
            criteria: '80% accuracy in 4 of 5 trials'
          },
          {
            id: 'obj-jordan-1b',
            code: 'OBJ-1.2',
            description: 'Answer inferential why and how questions based on shared narrative contexts with moderate scaffolding.',
            criteria: '70% accuracy across 3 sessions'
          }
        ]
      },
      {
        id: 'goal-jordan-2',
        code: 'SLP-G2',
        area: 'Pragmatics',
        description: 'Maintain conversational topic across 3 exchanges',
        targetDate: '2027-01-20',
        objectives: [
          {
            id: 'obj-jordan-2a',
            code: 'OBJ-2.1',
            description: 'Provide relevant on-topic comments or follow-up questions in peer group discussions.',
          }
        ]
      }
    ]
  },
  {
    id: 'student-eli-morgan',
    name: 'Eli Morgan',
    grade: 'Grade 5',
    school: 'Lincoln Elementary',
    status: 'withdrawn',
    withdrawalDate: 'August 13, 2026',
    dob: '2015-11-04',
    caseManager: 'David Martinez, Ed.S.',
    serviceFrequency: '1x 30min / week',
    avatarBg: 'bg-amber-100 text-amber-900 border-amber-300',
    iepGoals: [
      {
        id: 'goal-eli-1',
        code: 'SLP-G1',
        area: 'Articulation',
        description: 'Self-correct articulation of /r/ sounds in structured sentences',
        targetDate: '2026-11-15',
        objectives: [
          {
            id: 'obj-eli-1a',
            code: 'OBJ-1.1',
            description: 'Produce vocalic /r/ (ar, er, or) in sentences with 85% accuracy given self-monitoring cues.',
            criteria: '85% accuracy across 3 trials'
          }
        ]
      }
    ]
  },
  {
    id: 'student-liam-patel',
    name: 'Liam Patel',
    grade: 'Grade 3',
    school: 'Lincoln Elementary',
    status: 'active',
    dob: '2017-03-19',
    caseManager: 'Sarah Jenkins, M.Ed.',
    serviceFrequency: '2x 30min / week',
    avatarBg: 'bg-sky-100 text-sky-800 border-sky-300',
    iepGoals: [
      {
        id: 'goal-liam-1',
        code: 'SLP-G1',
        area: 'Expressive Language',
        description: 'Use descriptive category and attribute vocabulary',
        targetDate: '2027-03-10',
        objectives: [
          {
            id: 'obj-liam-1a',
            code: 'OBJ-1.1',
            description: 'Name object category, function, and 2 visual attributes with 80% accuracy in structured naming tasks.',
          }
        ]
      }
    ]
  },
  {
    id: 'student-sophia-chen',
    name: 'Sophia Chen',
    grade: 'Grade 2',
    school: 'Lincoln Elementary',
    status: 'active',
    dob: '2018-06-08',
    caseManager: 'Emily Wong, M.Ed.',
    serviceFrequency: '2x 30min / week',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
    iepGoals: [
      {
        id: 'goal-sophia-1',
        code: 'SLP-G1',
        area: 'Receptive Language',
        description: 'Follow multi-step directions containing spatial and temporal concepts',
        targetDate: '2027-04-22',
        objectives: [
          {
            id: 'obj-sophia-1a',
            code: 'OBJ-1.1',
            description: 'Follow 2-step conditional directions with temporal markers (before, after) with 75% accuracy.',
          }
        ]
      }
    ]
  }
];
