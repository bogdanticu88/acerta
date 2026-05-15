import { Tier } from './tiers';

export type AnswerValue = 'yes' | 'partial' | 'no' | 'na' | null;

export interface Question {
  id: string;
  domain: DomainId;
  text: string;
  guidance: string;
  tiers: Tier[];           // which tiers see this question
  weight: number;          // 1=standard, 2=important, 3=critical
  legislation: string[];   // keys from legislation.ts
  evidenceLabel?: string;  // what evidence to request
}

export type DomainId =
  | 'access-control'
  | 'data-privacy'
  | 'incident-response'
  | 'business-continuity'
  | 'ict-risk'
  | 'supply-chain'
  | 'ai-technology'
  | 'app-cloud-security'
  | 'physical-security'
  | 'certifications'
  | 'contractual-legal'
  | 'financial-viability';

export interface Domain {
  id: DomainId;
  label: string;
  icon: string;
  legislation: string[];
}

export const DOMAINS: Domain[] = [
  { id: 'access-control', label: 'Information Security & Access Control', icon: '🔐', legislation: ['NIS2_ART21', 'DORA_ART5'] },
  { id: 'data-privacy', label: 'Data Privacy & GDPR Compliance', icon: '🛡️', legislation: ['GDPR_ART28', 'GDPR_ART32', 'GDPR_ART35'] },
  { id: 'incident-response', label: 'Incident Response & Breach Notification', icon: '🚨', legislation: ['GDPR_ART33', 'NIS2_ART23', 'DORA_ART5'] },
  { id: 'business-continuity', label: 'Business Continuity & Resilience', icon: '♻️', legislation: ['DORA_ART11', 'NIS2_ART21'] },
  { id: 'ict-risk', label: 'ICT Risk Management', icon: '⚙️', legislation: ['DORA_ART5', 'DORA_ART28'] },
  { id: 'supply-chain', label: 'Supply Chain & Nth Party Risk', icon: '🔗', legislation: ['DORA_ART28', 'NIS2_ART21D'] },
  { id: 'ai-technology', label: 'AI & Emerging Technology', icon: '🤖', legislation: ['EU_AI_ACT'] },
  { id: 'app-cloud-security', label: 'Application & Cloud Security', icon: '☁️', legislation: ['NIS2_ART21', 'DORA_ART5'] },
  { id: 'physical-security', label: 'Physical & Environmental Security', icon: '🏢', legislation: ['NIS2_ART21'] },
  { id: 'certifications', label: 'Certifications & Audit Evidence', icon: '📋', legislation: ['DORA_ART30'] },
  { id: 'contractual-legal', label: 'Contractual & Legal Requirements', icon: '📄', legislation: ['GDPR_ART28', 'DORA_ART30'] },
  { id: 'financial-viability', label: 'Financial Stability & Viability', icon: '💼', legislation: ['DORA_ART28'] },
];

export const QUESTIONS: Question[] = [
  // ── DOMAIN 1: Access Control ──────────────────────────────────────────────
  {
    id: 'AC-01', domain: 'access-control', tiers: [1,2,3,4], weight: 3,
    legislation: ['NIS2_ART21', 'GDPR_ART32'],
    text: 'Do you enforce multi-factor authentication (MFA) for all accounts with access to systems that will process our data?',
    guidance: 'MFA must be applied to all privileged and standard user accounts, including remote access.',
    evidenceLabel: 'MFA policy or screenshot of MFA configuration',
  },
  {
    id: 'AC-02', domain: 'access-control', tiers: [1,2,3,4], weight: 2,
    legislation: ['NIS2_ART21', 'GDPR_ART32'],
    text: 'Do you apply the principle of least privilege when granting access to systems and data?',
    guidance: 'Users should only have access to the data and systems required to perform their job function.',
    evidenceLabel: 'Access control policy',
  },
  {
    id: 'AC-03', domain: 'access-control', tiers: [1,2,3], weight: 2,
    legislation: ['NIS2_ART21'],
    text: 'Do you conduct formal access reviews at least annually to revoke unnecessary or stale privileges?',
    guidance: 'Access reviews should be documented and include both human and service accounts.',
    evidenceLabel: 'Latest access review report (redacted)',
  },
  {
    id: 'AC-04', domain: 'access-control', tiers: [1,2], weight: 3,
    legislation: ['NIS2_ART21', 'DORA_ART5'],
    text: 'Do you maintain a privileged access management (PAM) solution for administrative accounts?',
    guidance: 'Privileged accounts (admin, root, service accounts) must be managed through a dedicated PAM solution with session recording.',
    evidenceLabel: 'PAM solution name and scope',
  },
  {
    id: 'AC-05', domain: 'access-control', tiers: [1,2,3], weight: 2,
    legislation: ['NIS2_ART21'],
    text: 'Do you have a documented joiner-mover-leaver process ensuring timely deprovisioning of access?',
    guidance: 'Access must be revoked within 24 hours of an employee departure for critical systems.',
    evidenceLabel: 'HR/IT offboarding procedure',
  },
  {
    id: 'AC-06', domain: 'access-control', tiers: [1,2], weight: 2,
    legislation: ['NIS2_ART21', 'DORA_ART5'],
    text: 'Is all remote access to your infrastructure protected by VPN and MFA?',
    guidance: 'Direct RDP/SSH access to production systems without VPN + MFA is not acceptable.',
    evidenceLabel: 'Remote access architecture diagram',
  },

  // ── DOMAIN 2: Data Privacy ────────────────────────────────────────────────
  {
    id: 'DP-01', domain: 'data-privacy', tiers: [1,2,3], weight: 3,
    legislation: ['GDPR_ART28'],
    text: 'Are you willing to sign a Data Processing Agreement (DPA) in accordance with GDPR Article 28?',
    guidance: 'Mandatory for any vendor acting as a data processor under GDPR.',
    evidenceLabel: 'Draft DPA or confirmation of willingness',
  },
  {
    id: 'DP-02', domain: 'data-privacy', tiers: [1,2,3], weight: 3,
    legislation: ['GDPR_ART32'],
    text: 'Is personal data encrypted at rest and in transit using current industry-standard algorithms (AES-256, TLS 1.2+)?',
    guidance: 'Encryption must cover all personal data, including backups.',
    evidenceLabel: 'Encryption policy or technical specification',
  },
  {
    id: 'DP-03', domain: 'data-privacy', tiers: [1,2], weight: 3,
    legislation: ['GDPR_ART35'],
    text: 'Have you conducted a Data Protection Impact Assessment (DPIA) for the services you will provide?',
    guidance: 'Required when processing is likely to result in high risk to individuals (Art. 35).',
    evidenceLabel: 'DPIA summary or screening outcome',
  },
  {
    id: 'DP-04', domain: 'data-privacy', tiers: [1,2,3], weight: 2,
    legislation: ['GDPR_ART28'],
    text: 'Do you maintain a Record of Processing Activities (RoPA) as required by GDPR Article 30?',
    guidance: 'Required for organisations with 250+ employees or processing high-risk data.',
    evidenceLabel: 'Confirmation of RoPA maintenance',
  },
  {
    id: 'DP-05', domain: 'data-privacy', tiers: [1,2], weight: 2,
    legislation: ['GDPR_ART28'],
    text: 'Where is personal data stored and processed? Is it within the EU/EEA or transferred to third countries?',
    guidance: 'Transfers outside EU/EEA require appropriate safeguards (SCCs, adequacy decision).',
    evidenceLabel: 'Data flow map or data residency statement',
  },
  {
    id: 'DP-06', domain: 'data-privacy', tiers: [1,2,3], weight: 2,
    legislation: ['GDPR_ART32'],
    text: 'Do you have a designated Data Protection Officer (DPO) or privacy lead?',
    guidance: 'DPO is mandatory for public authorities and organisations conducting large-scale processing of sensitive data.',
    evidenceLabel: 'DPO contact details or privacy lead name',
  },

  // ── DOMAIN 3: Incident Response ───────────────────────────────────────────
  {
    id: 'IR-01', domain: 'incident-response', tiers: [1,2,3,4], weight: 3,
    legislation: ['GDPR_ART33', 'NIS2_ART23'],
    text: 'Do you have a documented and tested Incident Response Plan (IRP)?',
    guidance: 'The IRP must include personal data breach scenarios and tested notification procedures.',
    evidenceLabel: 'IRP document (redacted) or test exercise summary',
  },
  {
    id: 'IR-02', domain: 'incident-response', tiers: [1,2,3,4], weight: 3,
    legislation: ['GDPR_ART33'],
    text: 'Can you commit to notifying us of a personal data breach within 24 hours of discovery?',
    guidance: 'GDPR requires controller notification within 72h; you need vendor notification much earlier to meet this.',
    evidenceLabel: 'Breach notification procedure or contractual SLA',
  },
  {
    id: 'IR-03', domain: 'incident-response', tiers: [1,2,3], weight: 2,
    legislation: ['NIS2_ART23', 'DORA_ART5'],
    text: 'Do you maintain security event logging and retain logs for a minimum of 12 months?',
    guidance: 'Logs must cover authentication events, privileged actions, and data access.',
    evidenceLabel: 'Log retention policy',
  },
  {
    id: 'IR-04', domain: 'incident-response', tiers: [1,2], weight: 2,
    legislation: ['NIS2_ART21', 'DORA_ART5'],
    text: 'Do you operate a Security Operations Centre (SOC) or equivalent 24/7 monitoring capability?',
    guidance: 'Critical and high-tier vendors must have continuous monitoring of their environments.',
    evidenceLabel: 'SOC capability description or MDR provider name',
  },
  {
    id: 'IR-05', domain: 'incident-response', tiers: [1,2,3], weight: 2,
    legislation: ['GDPR_ART33'],
    text: 'Have you experienced any reportable data breaches in the past 3 years? If yes, please describe.',
    guidance: 'Full disclosure required. Concealing known breaches is a disqualifying factor.',
    evidenceLabel: 'Breach disclosure statement',
  },

  // ── DOMAIN 4: Business Continuity ─────────────────────────────────────────
  {
    id: 'BC-01', domain: 'business-continuity', tiers: [1,2,3], weight: 3,
    legislation: ['DORA_ART11', 'NIS2_ART21'],
    text: 'Do you have a documented and regularly tested Business Continuity Plan (BCP)?',
    guidance: 'BCP must be tested at least annually with results documented.',
    evidenceLabel: 'BCP document or test results summary',
  },
  {
    id: 'BC-02', domain: 'business-continuity', tiers: [1,2,3], weight: 2,
    legislation: ['DORA_ART11'],
    text: 'What is your Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for the services you provide?',
    guidance: 'RTO/RPO must be contractually committed and tested.',
    evidenceLabel: 'RTO/RPO statement or DR test results',
  },
  {
    id: 'BC-03', domain: 'business-continuity', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART11'],
    text: 'Do you operate from geographically redundant data centres or cloud regions?',
    guidance: 'Single-region deployments represent concentration risk for critical services.',
    evidenceLabel: 'Infrastructure architecture overview',
  },
  {
    id: 'BC-04', domain: 'business-continuity', tiers: [1,2,3], weight: 2,
    legislation: ['DORA_ART11'],
    text: 'Are backups encrypted, stored separately from primary systems, and tested for restoration?',
    guidance: 'Untested backups are not considered a valid recovery control.',
    evidenceLabel: 'Backup policy and restoration test record',
  },

  // ── DOMAIN 5: ICT Risk Management ─────────────────────────────────────────
  {
    id: 'ICT-01', domain: 'ict-risk', tiers: [1,2], weight: 3,
    legislation: ['DORA_ART5', 'DORA_ART28'],
    text: 'Do you maintain a formal ICT risk management framework aligned to a recognised standard (NIST, ISO 27005, DORA)?',
    guidance: 'Required for financial sector vendors under DORA. Framework must be reviewed annually.',
    evidenceLabel: 'ICT risk framework documentation or alignment statement',
  },
  {
    id: 'ICT-02', domain: 'ict-risk', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART5'],
    text: 'Do you conduct an annual ICT risk assessment and maintain a risk register?',
    guidance: 'Risk register must identify, classify, and track mitigation of ICT risks.',
    evidenceLabel: 'Risk register excerpt (redacted) or latest risk assessment summary',
  },
  {
    id: 'ICT-03', domain: 'ict-risk', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART5'],
    text: 'Do you have a vulnerability management programme with defined SLAs for patching critical vulnerabilities?',
    guidance: 'Critical CVEs (CVSS 9+) should be patched within 24–72 hours. High (CVSS 7+) within 30 days.',
    evidenceLabel: 'Vulnerability management policy or patching SLA',
  },
  {
    id: 'ICT-04', domain: 'ict-risk', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART5'],
    text: 'Do you perform threat intelligence monitoring and integrate findings into your risk management process?',
    guidance: 'Vendors providing critical services must actively monitor for emerging threats.',
    evidenceLabel: 'Threat intel programme description or provider name',
  },

  // ── DOMAIN 6: Supply Chain ─────────────────────────────────────────────────
  {
    id: 'SC-01', domain: 'supply-chain', tiers: [1,2,3], weight: 3,
    legislation: ['DORA_ART28', 'NIS2_ART21D'],
    text: 'Do you maintain a register of all sub-processors and fourth parties that will have access to our data?',
    guidance: 'Full list of sub-processors must be disclosed and kept current.',
    evidenceLabel: 'Sub-processor list',
  },
  {
    id: 'SC-02', domain: 'supply-chain', tiers: [1,2,3], weight: 2,
    legislation: ['DORA_ART28', 'NIS2_ART21D'],
    text: 'Do you conduct security due diligence on your own critical suppliers and sub-processors?',
    guidance: 'Vendor risk management must extend to your own supply chain.',
    evidenceLabel: 'Supplier due diligence policy',
  },
  {
    id: 'SC-03', domain: 'supply-chain', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART28'],
    text: 'Will you notify us immediately if any critical sub-processor changes, is acquired, or experiences a security incident?',
    guidance: 'Change notification is required under DORA for ICT-critical service providers.',
    evidenceLabel: 'Change notification commitment (contractual)',
  },
  {
    id: 'SC-04', domain: 'supply-chain', tiers: [1,2], weight: 2,
    legislation: ['NIS2_ART21D'],
    text: 'Do any of your sub-processors operate from outside the EU/EEA? If so, what safeguards are in place?',
    guidance: 'Offshore processing introduces jurisdiction risk. SCCs or equivalent required.',
    evidenceLabel: 'Sub-processor locations and transfer mechanism',
  },

  // ── DOMAIN 7: AI & Emerging Technology ────────────────────────────────────
  {
    id: 'AI-01', domain: 'ai-technology', tiers: [1,2], weight: 2,
    legislation: ['EU_AI_ACT'],
    text: 'Do your services incorporate AI or automated decision-making that affects individuals? If yes, is it classified under the EU AI Act?',
    guidance: 'High-risk AI systems (as defined by EU AI Act Annex III) require mandatory risk management and human oversight.',
    evidenceLabel: 'AI system classification or EU AI Act conformity statement',
  },
  {
    id: 'AI-02', domain: 'ai-technology', tiers: [1,2], weight: 2,
    legislation: ['EU_AI_ACT', 'GDPR_ART32'],
    text: 'Is customer or personal data used to train or fine-tune AI models?',
    guidance: 'Using client data for AI training without explicit consent is a GDPR violation.',
    evidenceLabel: 'AI data usage policy or contractual prohibition',
  },
  {
    id: 'AI-03', domain: 'ai-technology', tiers: [1,2], weight: 1,
    legislation: ['EU_AI_ACT'],
    text: 'Do you maintain logging and auditability of AI-generated decisions or recommendations?',
    guidance: 'Required for transparency and accountability under the EU AI Act for high-risk systems.',
    evidenceLabel: 'AI audit logging capability description',
  },

  // ── DOMAIN 8: Application & Cloud Security ─────────────────────────────────
  {
    id: 'AS-01', domain: 'app-cloud-security', tiers: [1,2,3], weight: 3,
    legislation: ['NIS2_ART21', 'DORA_ART5'],
    text: 'Do you conduct penetration testing of your services at least annually by an accredited third party?',
    guidance: 'CREST or CHECK accredited testers preferred. Results must be shared (executive summary at minimum).',
    evidenceLabel: 'Latest pentest executive summary (redacted)',
  },
  {
    id: 'AS-02', domain: 'app-cloud-security', tiers: [1,2,3], weight: 2,
    legislation: ['NIS2_ART21'],
    text: 'Do you follow a secure software development lifecycle (SSDLC) including code review and SAST/DAST scanning?',
    guidance: 'All production code changes must pass automated security scanning before deployment.',
    evidenceLabel: 'SSDLC policy or CI/CD pipeline security description',
  },
  {
    id: 'AS-03', domain: 'app-cloud-security', tiers: [1,2], weight: 2,
    legislation: ['NIS2_ART21', 'DORA_ART5'],
    text: 'Is your cloud environment configured according to a security baseline (CIS Benchmarks or CSP security best practices)?',
    guidance: 'Cloud misconfigurations are the leading cause of data breaches. Baseline compliance must be continuously monitored.',
    evidenceLabel: 'Cloud security baseline or CSPM tool confirmation',
  },
  {
    id: 'AS-04', domain: 'app-cloud-security', tiers: [1,2,3], weight: 2,
    legislation: ['NIS2_ART21'],
    text: 'Do you operate a responsible disclosure or bug bounty programme?',
    guidance: 'A public vulnerability disclosure policy demonstrates security maturity.',
    evidenceLabel: 'Responsible disclosure policy URL',
  },

  // ── DOMAIN 9: Physical Security ────────────────────────────────────────────
  {
    id: 'PS-01', domain: 'physical-security', tiers: [1,2], weight: 2,
    legislation: ['NIS2_ART21', 'GDPR_ART32'],
    text: 'Are your data centres and offices protected by physical access controls (badge access, CCTV, visitor logs)?',
    guidance: 'Physical access to systems processing sensitive data must be restricted and logged.',
    evidenceLabel: 'Physical security policy or ISO 27001 cert covering this control',
  },
  {
    id: 'PS-02', domain: 'physical-security', tiers: [1,2], weight: 1,
    legislation: ['NIS2_ART21'],
    text: 'Do you enforce a clear desk/screen policy and secure disposal of physical media?',
    guidance: 'Printed materials and physical storage media must be securely disposed of.',
    evidenceLabel: 'Clear desk/media disposal policy',
  },

  // ── DOMAIN 10: Certifications ──────────────────────────────────────────────
  {
    id: 'CE-01', domain: 'certifications', tiers: [1,2,3,4], weight: 3,
    legislation: ['DORA_ART30', 'NIS2_ART21'],
    text: 'Do you hold ISO 27001 certification? If yes, please provide the certificate scope and expiry date.',
    guidance: 'ISO 27001 certification significantly reduces assessment burden. Certificate must be current.',
    evidenceLabel: 'ISO 27001 certificate',
  },
  {
    id: 'CE-02', domain: 'certifications', tiers: [1,2,3], weight: 2,
    legislation: ['DORA_ART30'],
    text: 'Do you have a SOC 2 Type II report available? If yes, please share the report or executive summary.',
    guidance: 'SOC 2 Type II (not Type I) provides assurance over a period of time. Relevance depends on service scope.',
    evidenceLabel: 'SOC 2 Type II report or executive summary',
  },
  {
    id: 'CE-03', domain: 'certifications', tiers: [1,2], weight: 2,
    legislation: ['GDPR_ART32'],
    text: 'Are you certified under any other relevant frameworks (PCI-DSS, HIPAA, TISAX, CSA STAR, ENS)?',
    guidance: 'Additional certifications may be required depending on the nature of data processed.',
    evidenceLabel: 'Relevant certificates',
  },
  {
    id: 'CE-04', domain: 'certifications', tiers: [1,2,3,4], weight: 1,
    legislation: ['NIS2_ART21'],
    text: 'Are you willing to provide audit rights or allow our security team to conduct an on-site assessment?',
    guidance: 'Right to audit is a key contractual requirement under DORA and NIS2.',
    evidenceLabel: 'Confirmation or contractual audit rights clause',
  },

  // ── DOMAIN 11: Contractual & Legal ────────────────────────────────────────
  {
    id: 'CL-01', domain: 'contractual-legal', tiers: [1,2,3], weight: 3,
    legislation: ['GDPR_ART28', 'DORA_ART30'],
    text: 'Does your standard contract include SLAs for availability, incident response, and breach notification?',
    guidance: 'SLAs must be specific, measurable, and include financial penalties for non-compliance.',
    evidenceLabel: 'SLA document or template',
  },
  {
    id: 'CL-02', domain: 'contractual-legal', tiers: [1,2], weight: 3,
    legislation: ['DORA_ART30'],
    text: 'Does your contract include termination rights if you fail to meet security obligations or suffer a material breach?',
    guidance: 'DORA mandates termination rights in ICT service contracts with financial entities.',
    evidenceLabel: 'Relevant contract clause',
  },
  {
    id: 'CL-03', domain: 'contractual-legal', tiers: [1,2,3], weight: 2,
    legislation: ['GDPR_ART28'],
    text: 'Are there any pending or past legal proceedings, regulatory fines, or enforcement actions related to data protection?',
    guidance: 'Full disclosure required. GDPR fines, DPA enforcement actions, or court rulings must be disclosed.',
    evidenceLabel: 'Legal disclosure statement',
  },
  {
    id: 'CL-04', domain: 'contractual-legal', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART30'],
    text: 'Do you have professional indemnity and cyber liability insurance? Please provide coverage amounts.',
    guidance: 'Minimum €2M cyber liability coverage recommended for high-risk vendors.',
    evidenceLabel: 'Insurance certificate',
  },

  // ── DOMAIN 12: Financial Viability ────────────────────────────────────────
  {
    id: 'FV-01', domain: 'financial-viability', tiers: [1,2], weight: 3,
    legislation: ['DORA_ART28'],
    text: 'Can you provide audited financial statements for the past 2 years?',
    guidance: 'Financial stability is essential for vendors providing critical services. DORA requires assessment of ICT concentration risk.',
    evidenceLabel: 'Audited financial statements or Companies House filing reference',
  },
  {
    id: 'FV-02', domain: 'financial-viability', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART28'],
    text: 'Have there been any changes in ownership, key management, or corporate structure in the past 12 months?',
    guidance: 'Ownership changes can affect service continuity and data security commitments.',
    evidenceLabel: 'Corporate structure confirmation',
  },
  {
    id: 'FV-03', domain: 'financial-viability', tiers: [1,2], weight: 2,
    legislation: ['DORA_ART28'],
    text: 'Do you have a documented exit/transition plan to ensure continuity of service if the relationship ends?',
    guidance: 'Vendor lock-in and exit risk must be assessed. A documented exit plan reduces concentration risk.',
    evidenceLabel: 'Exit plan or data portability statement',
  },
];

export function getQuestionsForTier(tier: Tier): Question[] {
  return QUESTIONS.filter(q => q.tiers.includes(tier));
}

export function getQuestionsByDomain(questions: Question[]): Record<DomainId, Question[]> {
  const grouped: Partial<Record<DomainId, Question[]>> = {};
  for (const q of questions) {
    if (!grouped[q.domain]) grouped[q.domain] = [];
    grouped[q.domain]!.push(q);
  }
  return grouped as Record<DomainId, Question[]>;
}
