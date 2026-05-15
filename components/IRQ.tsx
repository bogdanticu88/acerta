'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { IRQAnswers, computeCIA, assignTier } from '@/data/tiers';

const QUESTIONS: {
  key: keyof IRQAnswers;
  label: string;
  hint: string;
  legislation?: string;
  options: { value: number; label: string }[];
}[] = [
  {
    key: 'dataType',
    label: 'What type of personal data will the vendor access or process?',
    hint: 'Select the highest sensitivity category that applies.',
    legislation: 'GDPR Art.4, Art.9',
    options: [
      { value: 0, label: 'None — no personal data involved' },
      { value: 1, label: 'Basic contact data (name, email, phone)' },
      { value: 2, label: 'Financial or HR data (salary, bank details, performance records)' },
      { value: 3, label: 'Special categories (health, biometric, criminal records)' },
    ],
  },
  {
    key: 'dataVolume',
    label: 'Estimated number of data subjects (individuals) in scope?',
    hint: 'Include employees, customers, and any other individuals whose data is in scope.',
    legislation: 'GDPR Art.35',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Up to 1,000 individuals' },
      { value: 2, label: '1,000 – 100,000 individuals' },
      { value: 3, label: 'More than 100,000 individuals' },
    ],
  },
  {
    key: 'systemAccess',
    label: 'What level of system or network access will the vendor require?',
    hint: 'Consider the most privileged access type they will ever need.',
    legislation: 'NIS2 Art.21, DORA Art.5',
    options: [
      { value: 0, label: 'None — no direct system access' },
      { value: 1, label: 'Read-only access to a portal or interface' },
      { value: 2, label: 'Read/write access to systems or data' },
      { value: 3, label: 'Administrative or root-level access' },
    ],
  },
  {
    key: 'operationalCriticality',
    label: 'How critical is this vendor to your business operations?',
    hint: 'Would an outage of this vendor halt or significantly impair your operations?',
    legislation: 'DORA Art.11, NIS2 Art.21',
    options: [
      { value: 0, label: 'Non-critical — easily replaced or substituted' },
      { value: 1, label: 'Partial — affects one process, not core operations' },
      { value: 2, label: 'Core — outage would significantly impair operations' },
    ],
  },
  {
    key: 'subProcessors',
    label: 'Will the vendor use sub-processors (4th parties) with access to your data?',
    hint: 'Sub-processors are third parties engaged by your vendor to help deliver services.',
    legislation: 'GDPR Art.28(4), DORA Art.28',
    options: [
      { value: 0, label: 'No — vendor processes data independently' },
      { value: 1, label: 'Yes — sub-processors will have data access' },
      { value: 2, label: 'Unknown — requires clarification' },
    ],
  },
  {
    key: 'gdprArt28',
    label: 'Will the vendor process personal data on behalf of your organisation?',
    hint: 'If yes, a Data Processing Agreement (DPA) under GDPR Art.28 is mandatory.',
    legislation: 'GDPR Art.28',
    options: [
      { value: 0, label: 'No — vendor is a data controller in their own right' },
      { value: 1, label: 'Yes — vendor is acting as a data processor' },
    ],
  },
];

function CIABar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-600 text-xs uppercase tracking-wide">{label}</span>
        <span className="font-black text-sm" style={{ color }}>{score}<span className="text-slate-300 font-normal">/5</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-none overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(score / 5) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function IRQStage() {
  const { irqAnswers, setIrqAnswer, setVendor, vendor, setStage, setCIAAndTier } = useStore();
  const [vendorName,    setVendorName]    = useState(vendor.name);
  const [vendorCountry, setVendorCountry] = useState(vendor.country);

  const answered    = QUESTIONS.filter((q) => irqAnswers[q.key] !== undefined).length;
  const allAnswered = answered === QUESTIONS.length && vendorName.trim();

  const cia = Object.keys(irqAnswers).length === QUESTIONS.length
    ? computeCIA(irqAnswers as IRQAnswers)
    : { confidentiality: 0, integrity: 0, availability: 0 };

  const tier = Object.keys(irqAnswers).length === QUESTIONS.length ? assignTier(cia) : null;

  const TIER_COLOR = ['', '#991B1B', '#C2410C', '#B45309', '#15803D'];

  function handleContinue() {
    if (!allAnswered) return;
    setVendor({ ...vendor, name: vendorName, country: vendorCountry });
    const finalCia  = computeCIA(irqAnswers as IRQAnswers);
    const finalTier = assignTier(finalCia);
    setCIAAndTier(finalCia, finalTier);
    setStage('tier');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Role banner */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mb-6">
        <span className="text-blue-600 text-lg">🏢</span>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-700">Internal Requester — Your Team</span>
          <p className="text-blue-600 text-xs mt-0.5">
            This section is completed by your procurement or security team — <strong>not the vendor</strong>.
            It determines the risk tier before the vendor is contacted.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-1">Step 1</div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Inherent Risk Questionnaire</h1>
        <p className="text-slate-500 text-sm">
          Determines the vendor&apos;s CIA risk tier and which questions they will receive.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Questions */}
        <div className="md:col-span-2 space-y-4">
          {/* Vendor basics */}
          <div className="card">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Vendor Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Acme Cloud GmbH"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Country of Registration</label>
                <input
                  type="text"
                  value={vendorCountry}
                  onChange={(e) => setVendorCountry(e.target.value)}
                  placeholder="e.g. Germany"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* IRQ Questions */}
          {QUESTIONS.map((q, i) => (
            <div key={q.key} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#991B1B] uppercase tracking-widest">Q{i + 1} of {QUESTIONS.length}</span>
                {q.legislation && (
                  <span className="leg-badge">{q.legislation}</span>
                )}
              </div>
              <p className="font-bold text-slate-900 mb-1 text-sm">{q.label}</p>
              <p className="text-slate-400 text-xs mb-4">{q.hint}</p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = irqAnswers[q.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setIrqAnswer(q.key, opt.value as IRQAnswers[typeof q.key])}
                      className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all ${
                        isSelected
                          ? 'border-[#991B1B] bg-[#FEF2F2] text-[#7F1D1D] font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`mr-2 ${isSelected ? 'text-[#991B1B]' : 'text-slate-300'}`}>
                        {isSelected ? '●' : '○'}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Progress bar */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-1 bg-slate-200 rounded-none">
              <div
                className="h-full bg-[#991B1B] transition-all duration-300"
                style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span>{answered}/{QUESTIONS.length} answered</span>
          </div>

          <button onClick={handleContinue} disabled={!allAnswered} className="btn-primary w-full py-3 text-sm">
            Calculate Risk Tier →
          </button>
        </div>

        {/* CIA Live Score */}
        <div>
          <div className="card sticky top-24">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Live CIA Score</div>

            <div className="space-y-5 mb-6">
              <CIABar label="Confidentiality" score={cia.confidentiality} color="#991B1B" />
              <CIABar label="Integrity"       score={cia.integrity}       color="#1E40AF" />
              <CIABar label="Availability"    score={cia.availability}    color="#065F46" />
            </div>

            {tier ? (
              <div className="border-t border-slate-100 pt-5">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Indicative Tier</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black" style={{ color: TIER_COLOR[tier] }}>
                    {tier}
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    {['', 'Critical', 'High', 'Medium', 'Low'][tier]}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {tier <= 2
                    ? 'Full DDQ + OSINT vetting required.'
                    : tier === 3
                    ? 'Standard DDQ required.'
                    : 'Lite DDQ required.'}
                </p>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-5 text-xs text-slate-300">
                Complete all questions to see tier assignment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
