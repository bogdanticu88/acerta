export interface LegislationRef {
  code: string;
  label: string;
  description: string;
  url: string;
}

export const LEGISLATION: Record<string, LegislationRef> = {
  GDPR_ART28: {
    code: 'GDPR Art.28',
    label: 'Processor Agreements',
    description: 'Data processing agreements (DPA) must be in place with all processors handling personal data.',
    url: 'https://gdpr-info.eu/art-28-gdpr/',
  },
  GDPR_ART32: {
    code: 'GDPR Art.32',
    label: 'Security of Processing',
    description: 'Appropriate technical and organisational measures to ensure data security.',
    url: 'https://gdpr-info.eu/art-32-gdpr/',
  },
  GDPR_ART33: {
    code: 'GDPR Art.33',
    label: 'Breach Notification (72h)',
    description: 'Personal data breaches must be notified to supervisory authority within 72 hours.',
    url: 'https://gdpr-info.eu/art-33-gdpr/',
  },
  GDPR_ART35: {
    code: 'GDPR Art.35',
    label: 'Data Protection Impact Assessment',
    description: 'DPIA required for high-risk processing of personal data.',
    url: 'https://gdpr-info.eu/art-35-gdpr/',
  },
  NIS2_ART21: {
    code: 'NIS2 Art.21',
    label: 'Cybersecurity Risk Measures',
    description: 'Essential and important entities must implement appropriate and proportionate technical, operational, and organisational measures to manage risks to network and information systems.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022L2555',
  },
  NIS2_ART21D: {
    code: 'NIS2 Art.21(d)',
    label: 'Supply Chain Security',
    description: 'Security in supply chain, including security-related aspects concerning relationships between each entity and its direct suppliers or service providers.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022L2555',
  },
  NIS2_ART23: {
    code: 'NIS2 Art.23',
    label: 'Incident Reporting',
    description: 'Significant incidents must be reported to competent authorities without undue delay and in any event within 24 hours of becoming aware.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022L2555',
  },
  DORA_ART5: {
    code: 'DORA Art.5-15',
    label: 'ICT Risk Management Framework',
    description: 'Financial entities must establish and maintain a sound, comprehensive, and well-documented ICT risk management framework.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554',
  },
  DORA_ART11: {
    code: 'DORA Art.11',
    label: 'Business Continuity & Disaster Recovery',
    description: 'Financial entities shall put in place a sound and tested ICT business continuity policy.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554',
  },
  DORA_ART28: {
    code: 'DORA Art.28',
    label: 'ICT Third-Party Risk Management',
    description: 'Financial entities must maintain a comprehensive ICT third-party risk management policy and register all ICT third-party service arrangements.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554',
  },
  DORA_ART30: {
    code: 'DORA Art.30',
    label: 'Contractual Provisions (ICT)',
    description: 'Mandatory contractual provisions covering SLAs, audit rights, termination, resilience testing, and incident reporting.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554',
  },
  EU_AI_ACT: {
    code: 'EU AI Act Art.9-17',
    label: 'High-Risk AI Systems',
    description: 'Providers of high-risk AI systems must implement risk management, data governance, and human oversight requirements.',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401689',
  },
};
