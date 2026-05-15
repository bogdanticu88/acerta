'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DOMAINS, getQuestionsForTier, getQuestionsByDomain, AnswerValue } from '@/data/questions';
import { LEGISLATION } from '@/data/legislation';
import { Tier } from '@/data/tiers';

const DOMAIN_TIERS: Record<string, Tier[]> = {
  'access-control': [1,2,3,4], 'data-privacy': [1,2,3], 'incident-response': [1,2,3,4],
  'business-continuity': [1,2,3], 'ict-risk': [1,2], 'supply-chain': [1,2,3],
  'ai-technology': [1,2], 'app-cloud-security': [1,2,3], 'physical-security': [1,2],
  'certifications': [1,2,3,4], 'contractual-legal': [1,2,3], 'financial-viability': [1,2],
};

type AnswerOpt = { value: AnswerValue; label: string; active: string; inactive: string };

const ANSWER_OPTIONS: AnswerOpt[] = [
  { value: 'yes',     label: 'Yes',     active: 'border-emerald-600 bg-emerald-50 text-emerald-800', inactive: 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50' },
  { value: 'partial', label: 'Partial', active: 'border-amber-500 bg-amber-50 text-amber-800',       inactive: 'border-slate-200 text-slate-500 hover:border-amber-300 hover:bg-amber-50' },
  { value: 'no',      label: 'No',      active: 'border-slate-600 bg-slate-100 text-slate-800',      inactive: 'border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50' },
  { value: 'na',      label: 'N/A',     active: 'border-slate-300 bg-slate-50 text-slate-500',       inactive: 'border-slate-100 text-slate-300 hover:border-slate-200' },
];

export default function DDQ() {
  const { tier, ddqAnswers, setDdqAnswer, setStage, vendor } = useStore();
  const [activeDomain, setActiveDomain] = useState(DOMAINS[0].id);

  if (!tier) return null;

  const questions        = getQuestionsForTier(tier);
  const byDomain         = getQuestionsByDomain(questions);
  const applicableDomains = DOMAINS.filter((d) => DOMAIN_TIERS[d.id]?.includes(tier));
  const totalAnswered    = questions.filter((q) => ddqAnswers[q.id] != null).length;
  const progress         = Math.round((totalAnswered / questions.length) * 100);
  const domainQuestions  = byDomain[activeDomain] ?? [];
  const domainIdx        = applicableDomains.findIndex((d) => d.id === activeDomain);

  function handleNext() {
    if (tier! <= 2) setStage('osint');
    else setStage('report');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Role banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 mb-6">
        <span className="text-amber-600 text-lg">📤</span>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-700">Vendor Portal — Third Party</span>
          <p className="text-amber-700 text-xs mt-0.5">
            In production, the vendor receives a <strong>unique link</strong> to this questionnaire and fills it independently.
            In this demo, you are simulating the vendor&apos;s responses.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => setStage('tier')} className="btn-ghost mb-4">← Back to Tier</button>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-1">Step 3</div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Due Diligence Questionnaire</h1>
            {vendor.name && (
              <p className="text-slate-400 text-sm">
                {vendor.name} · Tier {tier} · {questions.length} questions · {applicableDomains.length} domains
              </p>
            )}
          </div>
          <div className="text-right shrink-0 ml-6">
            <div className="text-3xl font-black text-[#991B1B]">{progress}<span className="text-lg text-slate-300">%</span></div>
            <div className="text-xs text-slate-400">{totalAnswered}/{questions.length}</div>
          </div>
        </div>
        <div className="mt-3 h-0.5 bg-slate-200">
          <div className="h-full bg-[#991B1B] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Domain sidebar */}
        <div className="space-y-px border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
          {applicableDomains.map((domain) => {
            const dqs      = byDomain[domain.id] ?? [];
            const dAnswered = dqs.filter((q) => ddqAnswers[q.id] != null).length;
            const complete  = dAnswered === dqs.length && dqs.length > 0;
            const isActive  = activeDomain === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`w-full text-left px-3 py-2.5 text-sm transition-all flex items-center gap-2 ${
                  isActive ? 'bg-white border-l-2 border-l-[#991B1B] font-semibold text-slate-900' : 'bg-white text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-base">{domain.icon}</span>
                <span className="flex-1 leading-tight text-xs">{domain.label}</span>
                {complete
                  ? <span className="text-emerald-500 text-xs font-bold">✓</span>
                  : dAnswered > 0
                  ? <span className="text-slate-300 text-xs">{dAnswered}/{dqs.length}</span>
                  : null}
              </button>
            );
          })}
        </div>

        {/* Questions panel */}
        <div className="md:col-span-3 space-y-4">
          {/* Domain header */}
          {(() => {
            const d = DOMAINS.find((d) => d.id === activeDomain);
            if (!d) return null;
            const dqs = byDomain[d.id] ?? [];
            const dAnswered = dqs.filter((q) => ddqAnswers[q.id] != null).length;
            return (
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{d.icon}</span>
                  <h2 className="font-black text-slate-900">{d.label}</h2>
                  <span className="ml-auto text-xs text-slate-400">{dAnswered}/{dqs.length} answered</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {d.legislation.map((key) => {
                    const leg = LEGISLATION[key];
                    return leg ? (
                      <a key={key} href={leg.url} target="_blank" rel="noopener noreferrer"
                        className="leg-badge hover:text-[#991B1B] hover:border-[#991B1B] transition-colors">
                        {leg.code}
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })()}

          {domainQuestions.map((q) => {
            const answered = ddqAnswers[q.id];
            return (
              <div key={q.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">{q.id}</span>
                  {q.weight === 3 && (
                    <span className="text-xs font-bold text-[#991B1B] uppercase tracking-widest">Critical</span>
                  )}
                  {q.weight === 2 && (
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Important</span>
                  )}
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{q.text}</p>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">{q.guidance}</p>

                <div className="flex gap-2 flex-wrap">
                  {ANSWER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDdqAnswer(q.id, opt.value)}
                      className={`px-4 py-1.5 rounded-md border-2 text-xs font-semibold transition-all ${
                        answered === opt.value ? opt.active + ' ring-1 ring-offset-1 ring-[#991B1B]' : opt.inactive
                      }`}
                    >
                      {answered === opt.value && '✓ '}{opt.label}
                    </button>
                  ))}
                </div>

                {q.evidenceLabel && answered && answered !== 'no' && (
                  <div className="mt-3 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-2 rounded flex items-center gap-2">
                    <span>📎</span>
                    <span>Evidence: <em>{q.evidenceLabel}</em></span>
                    <span className="ml-auto text-slate-300">upload in full platform</span>
                  </div>
                )}

                {q.legislation.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {q.legislation.map((key) => {
                      const leg = LEGISLATION[key];
                      return leg ? <span key={key} className="leg-badge">{leg.code}</span> : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => domainIdx > 0 && setActiveDomain(applicableDomains[domainIdx - 1].id)}
              disabled={domainIdx === 0}
              className="btn-secondary"
            >
              ← Previous
            </button>
            {domainIdx < applicableDomains.length - 1 ? (
              <button
                onClick={() => setActiveDomain(applicableDomains[domainIdx + 1].id)}
                className="btn-primary"
              >
                Next domain →
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={totalAnswered < questions.length}
                className="btn-primary"
              >
                {tier <= 2 ? 'Proceed to OSINT →' : 'Generate Report →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
