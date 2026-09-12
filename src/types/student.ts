export interface IEPObjective {
  id: string;
  code: string;
  description: string;
  criteria?: string;
}

export interface IEPGoal {
  id: string;
  code: string;
  area: 'Expressive Language' | 'Receptive Language' | 'Articulation' | 'Pragmatics' | 'Fluency' | 'General';
  description: string;
  targetDate: string;
  objectives: IEPObjective[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  status: 'active' | 'withdrawn';
  withdrawalDate?: string; // e.g. "August 13, 2026"
  dob: string;
  caseManager: string;
  serviceFrequency: string; // e.g. "2x 30min / week"
  iepGoals: IEPGoal[];
  avatarBg: string;
}
