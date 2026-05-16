import { IRQAnswers } from './tiers';
import { Answers } from '@/lib/scoring';
import { OsintFinding } from '@/lib/scoring';
import { AnalystItem } from '@/lib/scoring';

export interface MockVendor {
  id: string;
  name: string;
  country: string;
  sector: string;
  website: string;
  description: string;
  irqAnswers: IRQAnswers;
  ddqAnswers: Answers;
  osintFindings: OsintFinding[];
  analystItems: AnalystItem[];
  label: string; // for demo picker
}

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: 'acme-cloud',
    name: 'ACME Cloud Services GmbH',
    country: 'Germany',
    sector: 'Cloud Infrastructure',
    website: 'acme-cloud.de',
    description: 'Critical cloud infrastructure provider processing EU customer financial data with admin-level system access.',
    label: 'Tier 1 — Critical (financial data, admin access)',
    irqAnswers: {
      dataType: 3,       // Special categories
      dataVolume: 3,     // >100k records
      systemAccess: 3,   // Admin/root
      operationalCriticality: 2, // Core business
      subProcessors: 1,  // Yes
      gdprArt28: 1,      // Yes
    },
    ddqAnswers: {
      'AC-01': 'yes', 'AC-02': 'yes', 'AC-03': 'partial', 'AC-04': 'yes', 'AC-05': 'yes', 'AC-06': 'yes',
      'DP-01': 'yes', 'DP-02': 'yes', 'DP-03': 'partial', 'DP-04': 'yes', 'DP-05': 'yes', 'DP-06': 'yes',
      'IR-01': 'yes', 'IR-02': 'yes', 'IR-03': 'yes', 'IR-04': 'yes', 'IR-05': 'yes',
      'BC-01': 'yes', 'BC-02': 'yes', 'BC-03': 'yes', 'BC-04': 'yes',
      'ICT-01': 'yes', 'ICT-02': 'yes', 'ICT-03': 'partial', 'ICT-04': 'yes',
      'SC-01': 'yes', 'SC-02': 'yes', 'SC-03': 'yes', 'SC-04': 'yes',
      'AI-01': 'no', 'AI-02': 'no', 'AI-03': 'na',
      'AS-01': 'yes', 'AS-02': 'yes', 'AS-03': 'yes', 'AS-04': 'yes',
      'PS-01': 'yes', 'PS-02': 'yes',
      'CE-01': 'yes', 'CE-02': 'yes', 'CE-03': 'partial', 'CE-04': 'yes',
      'CL-01': 'yes', 'CL-02': 'yes', 'CL-03': 'yes', 'CL-04': 'yes',
      'FV-01': 'yes', 'FV-02': 'yes', 'FV-03': 'yes',
    },
    osintFindings: [
      { category: 'Company Registration', status: 'clear', detail: 'Registered in Handelsregister München, HRB 12345. Status: active. No discrepancies with vendor-supplied information.', score: 100 },
      { category: 'Sanctions Screening', status: 'clear', detail: 'No matches found in EU Financial Sanctions List, UN Consolidated List, or OpenSanctions database.', score: 100 },
      { category: 'Data Breach History', status: 'flag', detail: '1 domain breach found on HaveIBeenPwned (2021, marketing database, email addresses only). No current breach indicators.', score: 60 },
      { category: 'External Security Posture', status: 'clear', detail: 'No critical exposed services found via Shodan. TLS 1.3 in use. No deprecated protocols detected.', score: 95 },
      { category: 'Adverse Media', status: 'clear', detail: 'No negative press coverage found in past 36 months. No regulatory fines or enforcement actions identified.', score: 100 },
      { category: 'Financial Health', status: 'clear', detail: 'Latest Bundesanzeiger filing shows positive EBITDA. No insolvency proceedings. Series B funding (€45M) closed Q2 2024.', score: 100 },
    ],
    analystItems: [
      { id: 'a1', label: 'Verify company registration matches vendor-provided details', rating: 'clear', notes: 'Confirmed via Handelsregister. Directors match.' },
      { id: 'a2', label: 'Cross-check UBO against sanctions lists', rating: 'clear', notes: 'Two beneficial owners identified. Neither appears on any sanctions list.' },
      { id: 'a3', label: 'Review last 3 years court/litigation records', rating: 'clear', notes: 'No active litigation found. One minor employment dispute settled 2023.' },
      { id: 'a4', label: 'Confirm no active insolvency proceedings', rating: 'clear', notes: 'German insolvency register checked — clear.' },
      { id: 'a5', label: 'Validate ISO 27001 certificate claimed in DDQ', rating: 'clear', notes: 'Certificate verified via BSI. Scope covers cloud services. Valid until Dec 2026.' },
      { id: 'a6', label: 'Review key executive backgrounds', rating: 'flag', notes: 'CTO previously employed at a company that suffered a major breach in 2020. Not disqualifying but noted.' },
      { id: 'a7', label: 'Check sub-processors against sanctions lists', rating: 'clear', notes: 'AWS Frankfurt, Cloudflare Frankfurt. Both clear.' },
    ],
  },
  {
    id: 'medisoft',
    name: 'Workline Solutions SL',
    country: 'Spain',
    sector: 'HR & Payroll SaaS',
    website: 'workline-hr.es',
    description: 'HR and payroll SaaS processing employee personal data with read-write portal access.',
    label: 'Tier 3 — Medium (employee data, portal access)',
    irqAnswers: {
      dataType: 2,       // Financial/HR
      dataVolume: 1,     // <1,000 records
      systemAccess: 2,   // Read-write
      operationalCriticality: 1, // Partial
      subProcessors: 0,  // No
      gdprArt28: 1,      // Yes
    },
    ddqAnswers: {
      'AC-01': 'yes', 'AC-02': 'yes', 'AC-03': 'no', 'AC-05': 'partial',
      'DP-01': 'yes', 'DP-02': 'yes', 'DP-04': 'yes', 'DP-06': 'no',
      'IR-01': 'partial', 'IR-02': 'yes', 'IR-03': 'yes', 'IR-05': 'yes',
      'BC-01': 'partial', 'BC-02': 'partial', 'BC-04': 'yes',
      'SC-01': 'na', 'SC-02': 'na',
      'AS-01': 'partial', 'AS-02': 'yes', 'AS-04': 'no',
      'CE-01': 'no', 'CE-02': 'no', 'CE-04': 'yes',
      'CL-01': 'yes', 'CL-03': 'yes',
    },
    osintFindings: [],
    analystItems: [],
  },
  {
    id: 'printshop',
    name: 'PrintQuick BV',
    country: 'Netherlands',
    sector: 'Print & Mailing Services',
    website: 'printquick.nl',
    description: 'External print and mailing provider with no digital system access and no personal data beyond mailing addresses.',
    label: 'Tier 4 — Low (mailing addresses, no system access)',
    irqAnswers: {
      dataType: 1,       // Basic contact
      dataVolume: 0,     // None (batch print jobs)
      systemAccess: 0,   // None
      operationalCriticality: 0, // No
      subProcessors: 0,  // No
      gdprArt28: 1,      // Yes (processes names/addresses)
    },
    ddqAnswers: {
      'AC-01': 'na', 'AC-02': 'yes',
      'IR-01': 'yes', 'IR-02': 'yes', 'IR-05': 'yes',
      'CE-01': 'no', 'CE-04': 'yes',
      'CL-03': 'yes',
    },
    osintFindings: [],
    analystItems: [],
  },
];
