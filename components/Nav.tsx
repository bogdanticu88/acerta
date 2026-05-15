'use client';
import { useStore, Stage } from '@/lib/store';

const STAGES: { id: Stage; label: string; step: number }[] = [
  { id: 'irq',    label: 'IRQ Intake',      step: 1 },
  { id: 'tier',   label: 'Risk Tier',        step: 2 },
  { id: 'ddq',    label: 'Due Diligence',    step: 3 },
  { id: 'osint',  label: 'OSINT Vetting',    step: 4 },
  { id: 'report', label: 'Report',           step: 5 },
];

const ORDER: Stage[] = ['landing', 'irq', 'tier', 'ddq', 'osint', 'report'];

export default function Nav() {
  const stage = useStore((s) => s.stage);
  const tier  = useStore((s) => s.tier);

  if (stage === 'landing') return null;

  const currentIndex   = ORDER.indexOf(stage);
  const visibleStages  = tier && tier <= 2 ? STAGES : STAGES.filter((s) => s.id !== 'osint');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="font-black text-[#991B1B] text-lg tracking-tight">Acerta</span>
          <span className="hidden sm:block text-slate-300 text-sm">|</span>
          <span className="hidden sm:block text-slate-400 text-xs font-medium uppercase tracking-widest">
            EU Vendor Security Due Diligence
          </span>
        </div>

        {/* Step breadcrumb */}
        <nav className="hidden md:flex items-center gap-0.5">
          {visibleStages.map((s, idx) => {
            const sIndex  = ORDER.indexOf(s.id);
            const isActive = stage === s.id;
            const isDone   = sIndex < currentIndex;
            return (
              <div key={s.id} className="flex items-center">
                <span
                  className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-[#991B1B] text-white'
                      : isDone
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {isDone ? '✓ ' : ''}{s.label}
                </span>
                {idx < visibleStages.length - 1 && (
                  <span className="text-slate-300 text-xs px-0.5">›</span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
