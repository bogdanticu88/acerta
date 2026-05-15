'use client';
import { useStore } from '@/lib/store';
import { TIER_LABELS, TIER_REASSESSMENT } from '@/data/tiers';
import { DOMAINS } from '@/data/questions';
import { LEGISLATION } from '@/data/legislation';

const DOMAIN_TIERS: Record<string, number[]> = {
  'access-control': [1,2,3,4], 'data-privacy': [1,2,3], 'incident-response': [1,2,3,4],
  'business-continuity': [1,2,3], 'ict-risk': [1,2], 'supply-chain': [1,2,3],
  'ai-technology': [1,2], 'app-cloud-security': [1,2,3], 'physical-security': [1,2],
  'certifications': [1,2,3,4], 'contractual-legal': [1,2,3], 'financial-viability': [1,2],
};

const TIER_ACCENT = ['', '#991B1B', '#C2410C', '#B45309', '#15803D'];
const TIER_BG     = ['', '#FEF2F2', '#FFF7ED', '#FFFBEB', '#F0FDF4'];
const TIER_BORDER = ['', '#FECACA', '#FED7AA', '#FDE68A', '#BBF7D0'];

function CIARow({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-28 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-none overflow-hidden">
        <div className="h-full transition-all duration-700" style={{ width: `${(score / 5) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="w-8 text-right font-black text-sm" style={{ color }}>{score}<span className="text-slate-300 text-xs font-normal">/5</span></span>
    </div>
  );
}

export default function TierResult() {
  const { tier, ciaScores, vendor, setStage } = useStore();
  if (!tier || !ciaScores) return null;

  const applicableDomains = DOMAINS.filter((d) => DOMAIN_TIERS[d.id]?.includes(tier));
  const allLegislation    = Array.from(new Set(applicableDomains.flatMap((d) => d.legislation)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <button onClick={() => setStage('irq')} className="btn-ghost mb-4">← Back to IRQ</button>
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-1">Step 2</div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Risk Tier Assignment</h1>
        {vendor.name && <p className="text-slate-400 text-sm">{vendor.name}</p>}
      </div>

      {/* Tier result block */}
      <div
        className="rounded-lg border-2 p-8 mb-8"
        style={{ backgroundColor: TIER_BG[tier], borderColor: TIER_BORDER[tier] }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Assigned Risk Tier</div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-6xl font-black" style={{ color: TIER_ACCENT[tier] }}>{tier}</span>
              <span className="text-2xl font-bold text-slate-700">{TIER_LABELS[tier]}</span>
            </div>
            <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
              {tier === 1 && 'Full DDQ (90+ questions) across all 12 domains + automated OSINT vetting + analyst sign-off required.'}
              {tier === 2 && 'Full DDQ + automated OSINT report required. Annual re-assessment.'}
              {tier === 3 && 'Standard DDQ (~45 questions) across 9 domains. Re-assessment every 2 years.'}
              {tier === 4 && 'Lite DDQ (~15 questions) across 4 domains. Re-assessment every 3 years.'}
            </p>
          </div>
          <div className="text-right shrink-0 ml-8">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Re-assessment</div>
            <div className="text-2xl font-black" style={{ color: TIER_ACCENT[tier] }}>
              {TIER_REASSESSMENT[tier]}
            </div>
          </div>
        </div>
      </div>

      {/* CIA scores */}
      <div className="card mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">CIA Scores</div>
        <div className="space-y-4">
          <CIARow label="Confidentiality" score={ciaScores.confidentiality} color="#991B1B" />
          <CIARow label="Integrity"       score={ciaScores.integrity}       color="#1E40AF" />
          <CIARow label="Availability"    score={ciaScores.availability}    color="#065F46" />
        </div>
        <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
          Tier = max(C, I, A). Scores normalised to 0–5 scale.
        </p>
      </div>

      {/* Domains included */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Assessment Domains</div>
          <span className="text-xs font-medium text-slate-400">{applicableDomains.length}/12 domains included</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-1">
          {DOMAINS.map((d) => {
            const included = DOMAIN_TIERS[d.id]?.includes(tier);
            return (
              <div key={d.id} className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${included ? '' : 'opacity-30'}`}>
                <span className="text-base">{d.icon}</span>
                <span className={included ? 'text-slate-700 font-medium' : 'text-slate-400'}>{d.label}</span>
                <span className={`ml-auto text-xs ${included ? 'text-emerald-600 font-bold' : 'text-slate-200'}`}>
                  {included ? '✓' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legislation */}
      <div className="card mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Applicable EU Legislation</div>
        <div className="space-y-2">
          {allLegislation.map((key) => {
            const leg = LEGISLATION[key];
            if (!leg) return null;
            return (
              <div key={key} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <span className="leg-badge shrink-0">{leg.code}</span>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{leg.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{leg.description}</div>
                </div>
                <a href={leg.url} target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-xs text-[#991B1B] hover:underline shrink-0">
                  View ›
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStage('irq')} className="btn-secondary">← Revise IRQ</button>
        <button onClick={() => setStage('ddq')} className="btn-primary flex-1 py-3">
          Proceed to Due Diligence Questionnaire →
        </button>
      </div>
    </div>
  );
}
