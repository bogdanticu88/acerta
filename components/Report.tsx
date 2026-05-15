'use client';
import { useStore } from '@/lib/store';
import { getQuestionsForTier, getQuestionsByDomain, DOMAINS } from '@/data/questions';
import { LEGISLATION } from '@/data/legislation';
import { TIER_LABELS, TIER_REASSESSMENT } from '@/data/tiers';
import {
  scoreDDQ, scoreDomain, scoreOsint, scoreAnalyst, computeFinalScore,
  getDecision, DECISION_DESCRIPTIONS,
} from '@/lib/scoring';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const DOMAIN_TIERS: Record<string, number[]> = {
  'access-control': [1,2,3,4], 'data-privacy': [1,2,3], 'incident-response': [1,2,3,4],
  'business-continuity': [1,2,3], 'ict-risk': [1,2], 'supply-chain': [1,2,3],
  'ai-technology': [1,2], 'app-cloud-security': [1,2,3], 'physical-security': [1,2],
  'certifications': [1,2,3,4], 'contractual-legal': [1,2,3], 'financial-viability': [1,2],
};

const DECISION_STYLE = {
  approve:     { bg: '#064E3B', label: 'APPROVED',              bar: '#10B981' },
  conditional: { bg: '#78350F', label: 'CONDITIONAL APPROVAL',  bar: '#F59E0B' },
  escalate:    { bg: '#7C2D12', label: 'ESCALATE TO CISO',      bar: '#F97316' },
  reject:      { bg: '#450A0A', label: 'REJECTED',              bar: '#EF4444' },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#F97316' : '#EF4444';
  return (
    <div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-black" style={{ color }}>{score}</span>
        <span className="text-slate-400 text-xs">/100</span>
      </div>
      <div className="h-1 bg-slate-100 w-full">
        <div className="h-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function Report() {
  const { tier, ciaScores, vendor, ddqAnswers, osintFindings, analystItems, setStage, reset } = useStore();
  if (!tier || !ciaScores) return null;

  const questions        = getQuestionsForTier(tier);
  const byDomain         = getQuestionsByDomain(questions);
  const applicableDomains = DOMAINS.filter((d) => DOMAIN_TIERS[d.id]?.includes(tier));

  const ddqScore    = scoreDDQ(questions, ddqAnswers);
  const osintScore  = scoreOsint(osintFindings);
  const analystScore = scoreAnalyst(analystItems);
  const finalScore  = computeFinalScore(tier, ddqScore, osintScore, analystScore);
  const decision    = getDecision(finalScore);
  const style       = DECISION_STYLE[decision];

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const radarData = applicableDomains.map((d) => ({
    subject: d.label.split(' ')[0],
    score: scoreDomain(byDomain[d.id] ?? [], ddqAnswers),
    fullMark: 100,
  }));

  const gaps = questions.filter((q) => {
    const a = ddqAnswers[q.id];
    return (a === 'no' || a === 'partial') && q.weight >= 2;
  });

  const criticalOsint = osintFindings.filter((f) => f.status === 'critical');
  const flagOsint     = osintFindings.filter((f) => f.status === 'flag');

  const contractualClauses = [
    { condition: true,          code: 'GDPR Art.28',  clause: 'Data Processing Agreement (DPA) must be executed before any processing commences.' },
    { condition: tier <= 2,     code: 'DORA Art.30',  clause: 'Contract must include SLAs for availability, incident response time, and breach notification (max 24h to notify client).' },
    { condition: tier <= 2,     code: 'DORA Art.30',  clause: 'Right to audit clause allowing on-site or documentary security assessments by our team or approved third party.' },
    { condition: tier <= 2,     code: 'DORA Art.30',  clause: 'Termination for cause triggered by material security breach, insolvency, or failure to maintain stated certifications.' },
    { condition: tier === 1,    code: 'DORA Art.28',  clause: 'Exit and transition plan required with 6-month notice period and full data portability guarantee.' },
    { condition: true,          code: 'NIS2 Art.21',  clause: 'Vendor must notify us within 24 hours of any security incident that may affect our data or service continuity.' },
    { condition: gaps.some((q) => q.id === 'CL-04'), code: 'Best Practice', clause: 'Minimum €2M cyber liability insurance must be maintained throughout the contract term.' },
  ].filter((c) => c.condition);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between no-print">
        <div>
          <button onClick={() => tier <= 2 ? setStage('osint') : setStage('ddq')} className="btn-ghost mb-4">← Back</button>
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-1">Assessment Report</div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">{vendor.name || 'Vendor Assessment'}</h1>
          <p className="text-slate-400 text-xs">Generated {today} · Acerta Platform</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary mt-8 flex items-center gap-2 shrink-0">
          🖨️ Print / PDF
        </button>
      </div>

      {/* Decision block — dark, authoritative */}
      <div className="rounded-lg p-8 mb-8 text-white" style={{ backgroundColor: style.bg }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Assessment Decision</div>
            <div className="text-3xl font-black mb-2 tracking-tight">{style.label}</div>
            <p className="opacity-80 text-sm leading-relaxed max-w-lg">{DECISION_DESCRIPTIONS[decision]}</p>
          </div>
          <div className="text-right ml-8 shrink-0">
            <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Final Score</div>
            <div className="text-6xl font-black">{finalScore}</div>
            <div className="h-1 w-16 ml-auto mt-2" style={{ backgroundColor: style.bar }} />
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className={`grid gap-4 mb-8 ${tier <= 2 ? 'grid-cols-4' : 'grid-cols-2'}`}>
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Risk Tier</div>
          <div className="text-3xl font-black text-slate-900">{tier}</div>
          <div className="text-sm text-slate-500">{TIER_LABELS[tier]}</div>
        </div>
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">DDQ Score</div>
          <ScoreBar score={ddqScore} />
        </div>
        {tier <= 2 && (
          <>
            <div className="card">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">OSINT Score</div>
              <ScoreBar score={osintScore} />
            </div>
            <div className="card">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Analyst Score</div>
              <ScoreBar score={analystScore} />
            </div>
          </>
        )}
        {tier > 2 && (
          <div className="card">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Re-assessment</div>
            <div className="text-xl font-black text-slate-900">{TIER_REASSESSMENT[tier]}</div>
          </div>
        )}
      </div>

      {/* Radar */}
      <div className="card mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Domain Score Breakdown</div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar dataKey="score" stroke="#991B1B" fill="#991B1B" fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 mt-4 border-t border-slate-50 pt-4">
          {applicableDomains.map((d) => {
            const s = scoreDomain(byDomain[d.id] ?? [], ddqAnswers);
            const color = s >= 80 ? '#15803D' : s >= 60 ? '#B45309' : '#991B1B';
            return (
              <div key={d.id} className="flex items-center gap-2 py-1">
                <span>{d.icon}</span>
                <span className="text-xs text-slate-500 flex-1 truncate">{d.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1 bg-slate-100">
                    <div className="h-full" style={{ width: `${s}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-bold w-6 text-right" style={{ color }}>{s}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="card mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Key Gaps Identified</div>
          <p className="text-slate-400 text-xs mb-4">{gaps.length} significant gaps — No or Partial on Important/Critical questions</p>
          <div className="space-y-2">
            {gaps.map((q) => {
              const a = ddqAnswers[q.id];
              return (
                <div key={q.id} className={`p-3 rounded border text-sm ${a === 'no' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className={`text-xs font-bold uppercase tracking-wide ${a === 'no' ? 'text-[#991B1B]' : 'text-amber-700'}`}>
                        {a === 'no' ? 'Not in place' : 'Partial'} ·{' '}
                      </span>
                      <span className="font-medium text-slate-800">{q.text}</span>
                      <div className="flex gap-1 mt-1">
                        {q.legislation.map((key) => {
                          const leg = LEGISLATION[key];
                          return leg ? <span key={key} className="leg-badge">{leg.code}</span> : null;
                        })}
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs font-bold ${q.weight === 3 ? 'text-[#991B1B]' : 'text-amber-700'}`}>
                      {q.weight === 3 ? 'CRITICAL' : 'IMPORTANT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OSINT items needing attention */}
      {tier <= 2 && [...criticalOsint, ...flagOsint].length > 0 && (
        <div className="card mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">OSINT — Items Requiring Attention</div>
          <div className="space-y-2">
            {[...criticalOsint, ...flagOsint].map((f, i) => (
              <div key={i} className={`p-3 rounded border text-sm ${f.status === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wide ${f.status === 'critical' ? 'text-[#991B1B]' : 'text-amber-700'}`}>
                  {f.status} ·{' '}
                </span>
                <span className="font-medium text-slate-700">{f.category}</span>
                <p className="text-slate-500 text-xs mt-1">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contractual requirements */}
      <div className="card mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Recommended Contractual Requirements</div>
        <div className="divide-y divide-slate-50">
          {contractualClauses.map((c, i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <span className="leg-badge shrink-0 mt-0.5">{c.code}</span>
              <p className="text-sm text-slate-600">{c.clause}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata footer */}
      <div className="border border-slate-200 rounded-md p-4 text-xs text-slate-400 mb-8 grid sm:grid-cols-3 gap-2">
        <div><strong className="text-slate-600">Vendor:</strong> {vendor.name || '—'}</div>
        <div><strong className="text-slate-600">Country:</strong> {vendor.country || '—'}</div>
        <div><strong className="text-slate-600">Assessment Date:</strong> {today}</div>
        <div><strong className="text-slate-600">Risk Tier:</strong> Tier {tier} — {TIER_LABELS[tier]}</div>
        <div><strong className="text-slate-600">Next Re-assessment:</strong> {TIER_REASSESSMENT[tier]}</div>
        <div><strong className="text-slate-600">Framework:</strong> GDPR · NIS2 · DORA · EU AI Act</div>
      </div>

      <div className="flex gap-3 no-print">
        <button onClick={reset} className="btn-secondary">Start New Assessment</button>
      </div>
    </div>
  );
}
