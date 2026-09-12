export interface TherapyActivity {
  id: string;
  name: string;
  category: 'Speech' | 'Language' | 'Social/Pragmatic' | 'Motor/Sensory' | 'General';
  description: string;
  suggestedServiceType: string;
}

export const THERAPY_ACTIVITIES: TherapyActivity[] = [
  {
    id: 'act-narrative-seq',
    name: 'Narrative sequencing',
    category: 'Language',
    description: 'Structured 4-6 step picture story sequence cards, beginning-middle-end story maps, and retellings.',
    suggestedServiceType: 'Speech therapy'
  },
  {
    id: 'act-wh-questions',
    name: 'Wh-question picture scene cards',
    category: 'Language',
    description: 'Visual scene interpretation answering who, what, where, and why prompts.',
    suggestedServiceType: 'Speech therapy'
  },
  {
    id: 'act-articulation-drill',
    name: 'Target phoneme drill cards & word ladder',
    category: 'Speech',
    description: 'Repetitive sound elicitation, syllable drill, and structured sentence readings.',
    suggestedServiceType: 'Speech therapy'
  },
  {
    id: 'act-conversation-board',
    name: 'Pragmatic turn-taking board game',
    category: 'Social/Pragmatic',
    description: 'Peer conversation maintenance, active listening prompts, and conversational repairs.',
    suggestedServiceType: 'Speech therapy'
  },
  {
    id: 'act-barrier-game',
    name: 'Barrier communication game',
    category: 'Language',
    description: 'Giving and following precise verbal descriptions behind a visual barrier.',
    suggestedServiceType: 'Speech therapy'
  },
  {
    id: 'act-fine-motor-craft',
    name: 'Fine motor handwriting & cutting craft',
    category: 'Motor/Sensory',
    description: 'Scissor skills, pencil grip strengthening, and bilateral coordination craft.',
    suggestedServiceType: 'Occupational therapy'
  },
  {
    id: 'act-individual-makeup',
    name: 'Individual make-up activity',
    category: 'Language',
    description: 'Targeted one-on-one compensatory review and targeted skill drill.',
    suggestedServiceType: 'Speech therapy'
  }
];
