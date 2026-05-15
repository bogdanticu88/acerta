export type Tier = 1 | 2 | 3 | 4;

export interface CIAScores {
  confidentiality: number; // 0–5
  integrity: number;       // 0–5
  availability: number;    // 0–5
}

export interface IRQAnswers {
  dataType: 0 | 1 | 2 | 3;        // Q1: None/Basic/Financial-HR/Special
  dataVolume: 0 | 1 | 2 | 3;      // Q2: None/<1k/<100k/>100k
  systemAccess: 0 | 1 | 2 | 3;    // Q3: None/Read/Read-Write/Admin
  operationalCriticality: 0 | 1 | 2; // Q4: No/Partial/Core
  subProcessors: 0 | 1 | 2;       // Q5: No/Yes/Unknown
  gdprArt28: 0 | 1;               // Q6: No/Yes
}

export function computeCIA(answers: IRQAnswers): CIAScores {
  const rawC = answers.dataType + answers.dataVolume + (answers.subProcessors > 0 ? 1 : 0) + answers.gdprArt28;
  // rawC max = 3+3+1+1 = 8, normalise to 0–5
  const confidentiality = Math.round((rawC / 8) * 5);
  // rawI max = 3, normalise to 0–5
  const integrity = Math.round((answers.systemAccess / 3) * 5);
  // rawA max = 2, normalise to 0–5
  const availability = Math.round((answers.operationalCriticality / 2) * 5);

  return { confidentiality, integrity, availability };
}

export function assignTier(cia: CIAScores): Tier {
  const maxScore = Math.max(cia.confidentiality, cia.integrity, cia.availability);
  if (maxScore >= 5) return 1;
  if (maxScore >= 4) return 2;
  if (maxScore >= 3) return 3;
  return 4;
}

export const TIER_LABELS: Record<Tier, string> = {
  1: 'Critical',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

export const TIER_COLORS: Record<Tier, string> = {
  1: '#dc2626', // red-600
  2: '#ea580c', // orange-600
  3: '#ca8a04', // yellow-600
  4: '#16a34a', // green-600
};

export const TIER_DESCRIPTIONS: Record<Tier, string> = {
  1: 'Full DDQ (90+ questions) + Automated OSINT + Analyst Review required. Re-assessment: every 6 months.',
  2: 'Full DDQ (90+ questions) + Automated OSINT report required. Re-assessment: annually.',
  3: 'Standard DDQ (~45 questions). Re-assessment: every 2 years.',
  4: 'Lite DDQ (~15 questions). Re-assessment: every 3 years.',
};

export const TIER_REASSESSMENT: Record<Tier, string> = {
  1: '6 months',
  2: '12 months',
  3: '24 months',
  4: '36 months',
};
