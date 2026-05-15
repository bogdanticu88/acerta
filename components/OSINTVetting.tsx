'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { OsintFinding, AnalystItem } from '@/lib/scoring';
import { MOCK_VENDORS } from '@/data/mock-vendors';

const DEFAULT_ANALYST_ITEMS: AnalystItem[] = [
  { id: 'a1', label: 'Verify company registration matches vendor-provided details', rating: null, notes: '' },
  { id: 'a2', label: 'Cross-check beneficial ownership (UBO) against EU sanctions lists', rating: null, notes: '' },
  { id: 'a3', label: 'Review last 3 years of court and litigation records', rating: null, notes: '' },
  { id: 'a4', label: 'Confirm no active insolvency or administration proceedings', rating: null, notes: '' },
  { id: 'a5', label: 'Validate certifications claimed in DDQ (ISO 27001, SOC 2)', rating: null, notes: '' },
  { id: 'a6', label: 'Review key executive backgrounds (LinkedIn, press, regulatory history)', rating: null, notes: '' },
  { id: 'a7', label: 'Check all sub-processors against EU/UN/OFAC sanctions lists', rating: null, notes: '' },
];

const DEFAULT_OSINT_FINDINGS: OsintFinding[] = [
  { category: 'Company Registration', status: 'clear', detail: 'Registration verified against national business registry. Status: active. No discrepancies.', score: 100 },
  { category: 'EU Sanctions Screening', status: 'clear', detail: 'No matches in EU Financial Sanctions Consolidated List or OpenSanctions (332 sources).', score: 100 },
  { category: 'Data Breach History', status: 'clear', detail: 'No breaches detected via HaveIBeenPwned for vendor domain. No leaked credentials.', score: 100 },
  { category: 'External Security Posture', status: 'clear', detail: 'Shodan passive scan: no critical exposed services. TLS 1.2+ in use.', score: 95 },
  { category: 'Adverse Media & Regulatory', status: 'clear', detail: 'No negative press or enforcement actions in past 36 months.', score: 100 },
  { category: 'Financial Health', status: 'clear', detail: 'Company filings show positive financial position. No insolvency proceedings.', score: 100 },
];

const STATUS_STYLES = {
  clear:    { label: 'Clear',    dot: 'bg-emerald-500', row: 'border-emerald-100 bg-emerald-50/50', text: 'text-emerald-700' },
  flag:     { label: 'Flag',     dot: 'bg-amber-400',   row: 'border-amber-200 bg-amber-50',        text: 'text-amber-700'   },
  critical: { label: 'Critical', dot: 'bg-[#991B1B]',   row: 'border-red-200 bg-red-50',            text: 'text-[#991B1B]'   },
};

const RATING_STYLES = {
  clear:    'border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  flag:     'border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100',
  critical: 'border-red-600 bg-red-50 text-red-800 hover:bg-red-100',
};

export default function OSINTVetting() {
  const {
    vendor, tier, osintFindings, analystItems, analystSignedOff,
    setOsintFindings, setAnalystItems, updateAnalystItem, setAnalystSignedOff, setStage,
  } = useStore();

  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(osintFindings.length > 0);

  useEffect(() => {
    if (analystItems.length === 0) setAnalystItems(DEFAULT_ANALYST_ITEMS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runScan() {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => {
      const mock = MOCK_VENDORS.find((v) => v.name === vendor.name);
      setOsintFindings(mock?.osintFindings.length ? mock.osintFindings : DEFAULT_OSINT_FINDINGS);
      if (mock?.analystItems.length) setAnalystItems(mock.analystItems);
      setScanning(false);
      setScanDone(true);
    }, 2500);
  }

  const allAnalystRated = analystItems.every((i) => i.rating !== null);
  const criticals = osintFindings.filter((f) => f.status === 'critical').length
    + analystItems.filter((i) => i.rating === 'critical').length;
  const flags = osintFindings.filter((f) => f.status === 'flag').length
    + analystItems.filter((i) => i.rating === 'flag').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <button onClick={() => setStage('ddq')} className="btn-ghost mb-4">← Back to DDQ</button>
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-1">Step 4</div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">OSINT Vetting</h1>
        <p className="text-slate-400 text-sm">
          Tier {tier} vendor — automated OSINT scan and analyst review required before report generation.
        </p>
      </div>

      {/* Pre-scan state */}
      {!scanDone && (
        <div className="card py-14 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Automated Intelligence Sources</div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['OpenCorporates', 'EU Sanctions List', 'OpenSanctions', 'HaveIBeenPwned', 'Shodan', 'NewsAPI / GDELT'].map((src) => (
              <span key={src} className="text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1 rounded-sm bg-slate-50">
                {src}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Run automated checks against EU registries, sanctions databases, breach records,
            external security posture and adverse media for <strong className="text-slate-700">{vendor.name || 'this vendor'}</strong>.
          </p>
          <button onClick={runScan} disabled={scanning} className="btn-primary px-10 py-3">
            {scanning ? (
              <span className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning…
              </span>
            ) : 'Run OSINT Scan'}
          </button>
        </div>
      )}

      {/* Post-scan */}
      {scanDone && (
        <>
          {/* Status summary */}
          <div className="flex gap-3 mb-5">
            {criticals > 0 && (
              <span className="text-xs font-bold text-white bg-[#991B1B] px-3 py-1 rounded-sm uppercase tracking-widest">
                {criticals} Critical
              </span>
            )}
            {flags > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-sm uppercase tracking-widest">
                {flags} Flagged
              </span>
            )}
            {criticals === 0 && flags === 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm uppercase tracking-widest">
                All Clear
              </span>
            )}
          </div>

          {/* Automated findings */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Automated Findings</div>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
              {osintFindings.map((f, i) => {
                const s = STATUS_STYLES[f.status];
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white hover:bg-slate-50">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800">{f.category}</span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>{s.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{f.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analyst checklist */}
          <div className="card mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Analyst Review Checklist</div>
            <p className="text-slate-400 text-xs mb-5">Complete each item manually. All must be rated before sign-off.</p>
            <div className="space-y-4">
              {analystItems.map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-md p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-3">{item.label}</p>
                  <div className="flex gap-2 mb-3">
                    {(['clear', 'flag', 'critical'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateAnalystItem(item.id, { rating: r })}
                        className={`px-3 py-1 rounded-md border-2 text-xs font-bold uppercase tracking-wide transition-all ${RATING_STYLES[r]} ${
                          item.rating === r ? 'ring-1 ring-offset-1 ring-[#991B1B]' : ''
                        }`}
                      >
                        {item.rating === r ? '✓ ' : ''}{r}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={item.notes}
                    onChange={(e) => updateAnalystItem(item.id, { notes: e.target.value })}
                    placeholder="Analyst notes…"
                    rows={2}
                    className="w-full text-xs border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#991B1B] text-slate-600 resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Sign-off */}
            <div className={`mt-5 p-4 rounded-md border ${analystSignedOff ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analystSignedOff}
                  disabled={!allAnalystRated}
                  onChange={(e) => setAnalystSignedOff(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#991B1B]"
                />
                <span className={`text-sm ${allAnalystRated ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                  I confirm that all OSINT checks have been completed and findings are accurately recorded.
                </span>
              </label>
              {!allAnalystRated && (
                <p className="text-xs text-slate-400 mt-1.5 pl-7">All checklist items must be rated first.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStage('ddq')} className="btn-secondary">← Back</button>
            <button onClick={() => setStage('report')} disabled={!analystSignedOff} className="btn-primary flex-1 py-3">
              Generate Assessment Report →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
