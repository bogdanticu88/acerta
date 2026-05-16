'use client';
import { useStore } from '@/lib/store';
import { MOCK_VENDORS, MockVendor } from '@/data/mock-vendors';
import { computeCIA, assignTier } from '@/data/tiers';

const TIER_LABELS = ['', 'Critical', 'High', 'Medium', 'Low'];
const TIER_PILL = ['', 'tier-1', 'tier-2', 'tier-3', 'tier-4'];

export default function Landing() {
  const { setStage, loadMockVendor, setCIAAndTier, reset } = useStore();

  function handleDemo(vendor: MockVendor) {
    loadMockVendor(vendor);
    const cia  = computeCIA(vendor.irqAnswers);
    const tier = assignTier(cia);
    setCIAAndTier(cia, tier);
    setStage('ddq');
  }

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] text-white">
        <div className="max-w-5xl mx-auto px-6 py-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              EU Vendor Security Due Diligence
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none">
              Ac<span className="text-[#991B1B]">erta</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-6 font-light leading-relaxed">
              Vendor trust, verified.<br />
              CIA-based risk tiering. OSINT-backed verification.
            </p>
            <p className="text-slate-400 mb-10 max-w-xl">
              Built for procurement and security teams operating under GDPR, NIS2 and DORA.
              Not another Excel spreadsheet.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { reset(); setStage('irq'); }}
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-semibold px-8 py-3.5 rounded-md transition-colors text-base"
              >
                Start Assessment
              </button>
              <a
                href="#demo"
                className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-md transition-colors text-base"
              >
                View Demo Scenarios
              </a>
            </div>
          </div>

          {/* Legislation tags */}
          <div className="mt-14 pt-8 border-t border-slate-800 flex flex-wrap gap-2">
            {[
              'GDPR 2016/679',
              'NIS2 2022/2555',
              'DORA 2022/2554',
              'EU AI Act 2024/1689',
              'ISO 27001',
              'NIST CSF 2.0',
            ].map((l) => (
              <span key={l} className="text-xs font-medium text-slate-500 border border-slate-700 px-3 py-1 rounded-sm">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-2">Methodology</div>
          <h2 className="text-3xl font-black text-slate-900">Four stages. Zero guesswork.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {[
            {
              n: '01',
              title: 'IRQ Intake',
              desc: 'Six questions determine your CIA exposure vector and assign an inherent risk tier — before the vendor is contacted.',
              icon: '▣',
            },
            {
              n: '02',
              title: 'CIA Tier Assignment',
              desc: 'Confidentiality, Integrity and Availability scores are normalised to a 1–4 tier. Tier drives question depth.',
              icon: '◈',
            },
            {
              n: '03',
              title: 'Adaptive DDQ',
              desc: '12 EU-aligned domains, 150+ questions. Vendors receive only what is proportionate to their tier.',
              icon: '◉',
            },
            {
              n: '04',
              title: 'OSINT + Report',
              desc: 'Tier 1–2 vendors undergo automated OSINT vetting and analyst sign-off before a scored PDF report is issued.',
              icon: '◎',
            },
          ].map((item) => (
            <div key={item.n} className="bg-white p-6">
              <div className="text-[#991B1B] text-2xl mb-4">{item.icon}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.n}</div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OSINT highlight ───────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-2">
                Differentiator
              </div>
              <h2 className="text-3xl font-black mb-4">
                Vendors can say anything.<br />
                OSINT does not lie.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                For Tier 1 and Tier 2 vendors, Acerta goes beyond self-attestation.
                Automated checks across EU registries, sanctions databases, breach
                records and external security posture — followed by a structured
                analyst review before approval.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                {[
                  'OpenCorporates · EU company registry verification',
                  'EU Financial Sanctions List · OpenSanctions (332 sources)',
                  'HaveIBeenPwned · data breach history',
                  'Shodan · external attack surface (passive)',
                  'Adverse media · regulatory fines · court records',
                  'Financial health · insolvency register check',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#991B1B] mt-0.5">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Sample OSINT Finding
              </div>
              <div className="space-y-3">
                {[
                  { status: 'CLEAR', label: 'Company Registration', color: 'text-emerald-400' },
                  { status: 'CLEAR', label: 'EU Sanctions Screening', color: 'text-emerald-400' },
                  { status: 'FLAG',  label: 'Data Breach History — 1 domain breach (2021)', color: 'text-amber-400' },
                  { status: 'CLEAR', label: 'External Security Posture', color: 'text-emerald-400' },
                  { status: 'CLEAR', label: 'Adverse Media', color: 'text-emerald-400' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    <span className={`font-bold w-12 shrink-0 ${f.color}`}>{f.status}</span>
                    <span className="text-slate-300">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo scenarios ────────────────────────────────────────────────── */}
      <section id="demo" className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#991B1B] mb-2">Try it</div>
          <h2 className="text-3xl font-black text-slate-900">Demo Scenarios</h2>
          <p className="text-slate-500 mt-2">
            Pre-configured vendor scenarios. Loads directly into the assessment flow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {MOCK_VENDORS.map((vendor) => {
            const cia  = computeCIA(vendor.irqAnswers);
            const tier = assignTier(cia);
            return (
              <button
                key={vendor.id}
                onClick={() => handleDemo(vendor)}
                className="card text-left hover:border-[#991B1B] transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${TIER_PILL[tier]}`}>
                    Tier {tier} — {TIER_LABELS[tier]}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#991B1B] transition-colors">
                  {vendor.name}
                </h3>
                <p className="text-slate-400 text-xs mb-3 uppercase tracking-wide">
                  {vendor.country} · {vendor.sector}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">{vendor.description}</p>
                <div className="mt-4 text-[#991B1B] text-sm font-semibold">
                  Load scenario ›
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div>
            <span className="font-black text-[#991B1B]">Acerta</span>
            {' — '}Open-source EU Vendor Security Due Diligence Platform
          </div>
          <div className="flex gap-4">
            <span>GDPR · NIS2 · DORA · EU AI Act</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
