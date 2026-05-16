import { AnswerValue, Question } from '@/data/questions';
import { Tier } from '@/data/tiers';

export type Answers = Record<string, AnswerValue>;

const ANSWER_WEIGHTS: Record<NonNullable<AnswerValue>, number> = {
  yes: 1.0,
  partial: 0.5,
  no: 0.0,
  na: 1.0, // N/A doesn't penalise
};

export function scoreDDQ(questions: Question[], answers: Answers): number {
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const multiplier = ANSWER_WEIGHTS[answer];
    totalWeight += q.weight;
    earnedWeight += q.weight * multiplier;
  }

  if (totalWeight === 0) return 0;
  return Math.round((earnedWeight / totalWeight) * 100);
}

export function scoreDomain(
  domainQuestions: Question[],
  answers: Answers,
): number {
  return scoreDDQ(domainQuestions, answers);
}

export interface OsintFinding {
  category: string;
  status: 'clear' | 'flag' | 'critical';
  detail: string;
  score: number; // 0-100, 100 = clean
}

export function scoreOsint(findings: OsintFinding[]): number {
  if (findings.length === 0) return 100;
  const avg = findings.reduce((sum, f) => sum + f.score, 0) / findings.length;
  return Math.round(avg);
}

export interface AnalystItem {
  id: string;
  label: string;
  rating: 'clear' | 'flag' | 'critical' | null;
  notes: string;
}

export function scoreAnalyst(items: AnalystItem[]): number {
  const rated = items.filter(i => i.rating !== null);
  if (rated.length === 0) return 100;
  const scores: number[] = rated.map(i => {
    if (i.rating === 'clear') return 100;
    if (i.rating === 'flag') return 50;
    return 0;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function computeFinalScore(
  tier: Tier,
  ddqScore: number,
  osintScore: number,
  analystScore: number,
): number {
  if (tier <= 2) return Math.round(ddqScore * 0.5 + osintScore * 0.3 + analystScore * 0.2);
  return ddqScore;
}

export type Decision = 'approve' | 'conditional' | 'escalate' | 'reject';

export function getDecision(score: number): Decision {
  if (score >= 80) return 'approve';
  if (score >= 60) return 'conditional';
  if (score >= 40) return 'escalate';
  return 'reject';
}

export const DECISION_DESCRIPTIONS: Record<Decision, string> = {
  approve: 'Vendor meets security requirements. Proceed with onboarding.',
  conditional: 'Vendor requires remediation of identified gaps before onboarding. Re-assess within 90 days.',
  escalate: 'Significant risks identified. CISO review required before proceeding.',
  reject: 'Vendor does not meet minimum security requirements. Do not onboard.',
};
