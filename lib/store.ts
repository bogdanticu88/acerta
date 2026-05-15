'use client';
import { create } from 'zustand';
import { IRQAnswers, CIAScores, Tier } from '@/data/tiers';
import { Answers, AnalystItem, OsintFinding } from '@/lib/scoring';

export type Stage = 'landing' | 'irq' | 'tier' | 'ddq' | 'osint' | 'report';

interface VendorInfo {
  name: string;
  country: string;
  sector: string;
  website: string;
  contactName: string;
  contactEmail: string;
}

interface AppState {
  stage: Stage;
  vendor: VendorInfo;
  irqAnswers: Partial<IRQAnswers>;
  ciaScores: CIAScores | null;
  tier: Tier | null;
  ddqAnswers: Answers;
  osintFindings: OsintFinding[];
  analystItems: AnalystItem[];
  analystSignedOff: boolean;

  setStage: (stage: Stage) => void;
  setVendor: (vendor: VendorInfo) => void;
  setIrqAnswer: (key: keyof IRQAnswers, value: number) => void;
  setCIAAndTier: (cia: CIAScores, tier: Tier) => void;
  setDdqAnswer: (questionId: string, value: import('@/data/questions').AnswerValue) => void;
  setOsintFindings: (findings: OsintFinding[]) => void;
  setAnalystItems: (items: AnalystItem[]) => void;
  updateAnalystItem: (id: string, updates: Partial<AnalystItem>) => void;
  setAnalystSignedOff: (v: boolean) => void;
  loadMockVendor: (vendor: import('@/data/mock-vendors').MockVendor) => void;
  reset: () => void;
}

const DEFAULT_VENDOR: VendorInfo = {
  name: '', country: '', sector: '', website: '', contactName: '', contactEmail: '',
};

export const useStore = create<AppState>((set) => ({
  stage: 'landing',
  vendor: DEFAULT_VENDOR,
  irqAnswers: {},
  ciaScores: null,
  tier: null,
  ddqAnswers: {},
  osintFindings: [],
  analystItems: [],
  analystSignedOff: false,

  setStage: (stage) => set({ stage }),
  setVendor: (vendor) => set({ vendor }),
  setIrqAnswer: (key, value) =>
    set((s) => ({ irqAnswers: { ...s.irqAnswers, [key]: value } })),
  setCIAAndTier: (ciaScores, tier) => set({ ciaScores, tier }),
  setDdqAnswer: (questionId, value) =>
    set((s) => ({ ddqAnswers: { ...s.ddqAnswers, [questionId]: value } })),
  setOsintFindings: (osintFindings) => set({ osintFindings }),
  setAnalystItems: (analystItems) => set({ analystItems }),
  updateAnalystItem: (id, updates) =>
    set((s) => ({
      analystItems: s.analystItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  setAnalystSignedOff: (v) => set({ analystSignedOff: v }),
  loadMockVendor: (vendor) =>
    set({
      vendor: {
        name: vendor.name,
        country: vendor.country,
        sector: vendor.sector,
        website: vendor.website,
        contactName: 'Demo Contact',
        contactEmail: 'demo@example.com',
      },
      irqAnswers: vendor.irqAnswers,
      ddqAnswers: vendor.ddqAnswers,
      osintFindings: vendor.osintFindings,
      analystItems: vendor.analystItems,
      stage: 'landing',
      ciaScores: null,
      tier: null,
      analystSignedOff: false,
    }),
  reset: () =>
    set({
      stage: 'landing',
      vendor: DEFAULT_VENDOR,
      irqAnswers: {},
      ciaScores: null,
      tier: null,
      ddqAnswers: {},
      osintFindings: [],
      analystItems: [],
      analystSignedOff: false,
    }),
}));
