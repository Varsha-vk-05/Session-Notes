export interface AIGenerateRequest {
  studentName: string;
  grade?: string;
  goalDescription?: string;
  objectiveDescription?: string;
  activity: string;
  modality: string;
  observations: string; // Factual notes entered by Jamie
}

export interface AIGenerateResponse {
  status: 'success' | 'needs_more_info' | 'error';
  generatedText: string;
  needsMoreInformation: boolean;
  message?: string;
  tokensUsed?: number;
  confidence?: 'high' | 'medium' | 'low';
}
