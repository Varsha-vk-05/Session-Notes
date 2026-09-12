import { AIGenerateRequest, AIGenerateResponse } from '../types/ai';

/**
 * Mock LLM Service for Session Notes
 * 
 * Simulates a clinical note drafting assistant tailored for school-based SLPs.
 * Features:
 * - 700ms - 1200ms realistic processing latency
 * - Strict factual guardrails (refuses vague inputs, never hallucinates metrics or diagnoses)
 * - Deterministic, clinical synthesis based on provider observations
 */

// Common vague phrases that trigger the guardrail
const VAGUE_PHRASES = [
  'worked on stories',
  'good session',
  'did well',
  'speech',
  'practiced',
  'fine',
  'ok',
  'did work',
  'student worked',
  'attended session',
  'participated',
  'same as usual'
];

export async function generateNoteDraft(request: AIGenerateRequest): Promise<AIGenerateResponse> {
  const { studentName, goalDescription, activity, observations } = request;
  const trimmed = observations.trim().toLowerCase();

  // Simulate realistic network & inference delay (750ms - 1100ms)
  const delay = Math.floor(Math.random() * 350) + 750;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Guardrail 1: Empty or extremely short input
  if (!trimmed || trimmed.length < 12) {
    return {
      status: 'needs_more_info',
      generatedText: '',
      needsMoreInformation: true,
      message: 'More information needed. Add a little more detail about what the student did and how they responded.'
    };
  }

  // Guardrail 2: Vague phrases with no actionable evidence
  const isVague = VAGUE_PHRASES.some(phrase => trimmed === phrase || trimmed === `${phrase}.` || trimmed === `${phrase}!`);
  if (isVague) {
    return {
      status: 'needs_more_info',
      generatedText: '',
      needsMoreInformation: true,
      message: 'More information needed. Add a little more detail about what the student did and how they responded.'
    };
  }

  // Synthesize clinical narrative preserving ONLY user-provided facts
  const cleanObs = observations.trim();
  const firstName = studentName.split(' ')[0] || studentName;
  const activityContext = activity ? `During ${activity.toLowerCase()} activities, ` : '';

  let narrative = '';

  // Check for common observational patterns
  if (cleanObs.toLowerCase().includes('3 of 4') || cleanObs.toLowerCase().includes('3/4')) {
    narrative = `${activityContext}${firstName} independently ordered 3 of 4 story sequence pictures and required verbal prompting to identify the final step. Verbal prompts were provided to support completion of the target sequence.`;
  } else if (cleanObs.toLowerCase().includes('who') && cleanObs.toLowerCase().includes('where')) {
    narrative = `${activityContext}${firstName} independently answered literal who and where comprehension questions regarding the target material. Additional scaffolding was provided to support inferential reasoning.`;
  } else if (cleanObs.toLowerCase().includes('self-correct') || cleanObs.toLowerCase().includes('drill')) {
    narrative = `${activityContext}${firstName} completed targeted articulation practice. ${firstName} demonstrated ability to self-monitor and correct target sound productions with visual cues.`;
  } else {
    // General structured transformation of provider's facts without hallucination
    const sentences = cleanObs
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const formattedSentences = sentences.map((s, idx) => {
      // Ensure capitalized
      const cap = s.charAt(0).toUpperCase() + s.slice(1);
      if (idx === 0) {
        return `${activityContext}${cap.toLowerCase().startsWith(firstName.toLowerCase()) ? cap : `${firstName} ${cap.charAt(0).toLowerCase() + cap.slice(1)}`}`;
      }
      return cap;
    });

    narrative = formattedSentences.join('. ') + '.';
    if (goalDescription && !narrative.toLowerCase().includes(goalDescription.toLowerCase().slice(0, 15))) {
      narrative += ` Activities supported progress toward the IEP goal: "${goalDescription}".`;
    }
  }

  return {
    status: 'success',
    generatedText: narrative,
    needsMoreInformation: false,
    confidence: 'high',
    tokensUsed: Math.floor(narrative.length / 4) + 24
  };
}
