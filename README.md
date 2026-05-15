<h1 align="center">Acerta</h1>

<p align="center">
  EU vendor security due diligence. CIA-based risk tiering. OSINT-backed verification.
</p>

<p align="center">
  <a href="https://bogdanticu88.github.io/acerta"><img src="https://img.shields.io/badge/demo-live-991B1B" alt="Live demo" /></a>
  <a href="https://github.com/bogdanticu88/acerta/blob/main/LICENSE"><img src="https://img.shields.io/github/license/bogdanticu88/acerta?color=991B1B" alt="License" /></a>
</p>

---

## Why this matters

Vendor security due diligence in most EU companies is still done with Excel spreadsheets, manually updated questionnaires, and email threads. When a supplier breaches GDPR, causes a NIS2-notifiable incident, or fails a DORA ICT audit, the root cause is often that no structured assessment was done before onboarding.

EU legislation now sets a high bar:

- **GDPR Art.28** requires a signed Data Processing Agreement and documented due diligence for every processor with access to personal data.
- **NIS2 Art.21(d)** mandates supply chain security controls, including supplier assessments.
- **DORA Art.28** requires financial entities to assess ICT third-party risk before contract signature and periodically throughout the relationship.

Acerta replaces the spreadsheet with a structured, legislation-aligned workflow. It assigns an inherent risk tier before the vendor is contacted, adapts the questionnaire depth to that tier, and for high-risk vendors adds an OSINT vetting layer that self-attestation alone cannot cover.

---

## How it works

Four stages, all running in the browser:

```
[1] IRQ Intake  ->  [2] CIA Tier Assignment  ->  [3] Adaptive DDQ  ->  [4] OSINT + Report
```

Stages 1 and 2 are completed by the internal requester (procurement or security team) before the vendor is contacted. Stage 3 simulates the vendor-facing questionnaire portal. Stage 4 applies to Tier 1 and Tier 2 vendors only.

### Stage 1: Inherent Risk Questionnaire (IRQ)

Six questions determine the CIA exposure vector.

| # | Question | CIA Dimension |
|---|---|---|
| 1 | What type of personal data will the vendor access? | Confidentiality |
| 2 | Estimated number of data subjects in scope? | Confidentiality |
| 3 | What level of system or network access is required? | Integrity |
| 4 | How critical is this vendor to business operations? | Availability |
| 5 | Will the vendor use sub-processors with data access? | Confidentiality |
| 6 | Will the vendor process personal data on behalf of your organisation? | Confidentiality |

CIA scores update in real time as answers are selected.

### Stage 2: CIA Tier Assignment

```
C score = Q1 + Q2 + Q5 + Q6  (normalised to 0-5)
I score = Q3                   (normalised to 0-5)
A score = Q4                   (normalised to 0-5)

Tier = max(C, I, A):
  5    -> Tier 1 Critical  -> Full DDQ + OSINT + Analyst Review
  4    -> Tier 2 High      -> Full DDQ + OSINT
  3    -> Tier 3 Medium    -> Standard DDQ (~45 questions)
  1-2  -> Tier 4 Low       -> Lite DDQ (~15 questions)
```

### Stage 3: Adaptive DDQ

Questions are organised into 12 domains aligned to EU legislation. Each vendor receives only the questions proportionate to their tier.

| Domain | Tier 4 | Tier 3 | Tier 2 | Tier 1 | Key Legislation |
|---|---|---|---|---|---|
| Information Security & Access Control | Yes | Yes | Yes | Yes | NIS2 Art.21, DORA |
| Data Privacy & GDPR Compliance | - | Yes | Yes | Yes | GDPR Art.28, 32, 35 |
| Incident Response & Breach Notification | Yes | Yes | Yes | Yes | GDPR Art.33-34, NIS2 Art.23 |
| Business Continuity & Resilience | - | Yes | Yes | Yes | DORA Art.11, NIS2 |
| ICT Risk Management | - | - | Yes | Yes | DORA Art.5-15 |
| Supply Chain & Nth Party Risk | - | Yes | Yes | Yes | DORA Art.28, NIS2 Art.21(d) |
| AI & Emerging Technology | - | - | Yes | Yes | EU AI Act 2024/1689 |
| Application & Cloud Security | - | Yes | Yes | Yes | NIS2, DORA |
| Physical & Environmental Security | - | - | Yes | Yes | ISO 27001 |
| Certifications & Audit Evidence | Yes | Yes | Yes | Yes | DORA Art.30 |
| Contractual & Legal (DPA, SLA) | - | Yes | Yes | Yes | GDPR Art.28, DORA Art.30 |
| Financial Stability & Viability | - | - | Yes | Yes | DORA (concentration risk) |

Each answer is scored: Yes / Partial / No / N/A, with per-question weights.

### Stage 4: OSINT Vetting (Tier 1 and Tier 2)

Automated checks simulated in this prototype with realistic mock data:

| Source | Data |
|---|---|
| OpenCorporates | Company registration, officers, filing status |
| EU Financial Sanctions List | Entity screening against the EU consolidated list |
| OpenSanctions | 332-source global sanctions and PEPs database |
| HaveIBeenPwned | Known data breaches involving the vendor domain |
| Shodan | Exposed services, outdated TLS, open ports (passive) |
| Adverse media | Regulatory fines, court records, negative press |

Followed by a structured analyst review checklist. Sign-off is required before report generation.

---

## Scoring model

```
DDQ Score     = weighted sum of answers (0-100)
OSINT Score   = automated finding severity, inverted (100 = clean)
Analyst Score = RAG checklist average (0-100)

Tier 1 / 2:  DDQ * 0.5 + OSINT * 0.3 + Analyst * 0.2
Tier 3 / 4:  DDQ only

80-100  LOW RISK    -> Approve
60-79   MEDIUM RISK -> Conditional approval
40-59   HIGH RISK   -> Escalate to CISO
0-39    CRITICAL    -> Reject
```

---

## Demo scenarios

Three pre-configured vendors cover the main risk bands:

| Scenario | Tier | Description |
|---|---|---|
| ACME Cloud GmbH | Tier 1 Critical | SaaS HR and payroll processor, 200k+ EU employee records, admin access |
| MediSoft Solutions SL | Tier 3 Medium | Medical scheduling software, clinic staff data only, read access |
| PrintQuick BV | Tier 4 Low | Physical printing supplier, no data access, non-critical service |

---

## Running locally

```bash
git clone https://github.com/bogdanticu88/acerta
cd acerta
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Deploying

The app exports as a fully static site. No server required.

```bash
npm run build
# output is in /out
```

The repository includes a GitHub Actions workflow that deploys to GitHub Pages on every push to `main`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (static export) |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Deploy | GitHub Pages via GitHub Actions |

---

## EU legislation references

| Regulation | Relevance |
|---|---|
| GDPR 2016/679 Art.28 | Data Processing Agreements with processors |
| GDPR 2016/679 Art.32 | Technical and organisational security measures |
| GDPR 2016/679 Art.33-34 | Breach notification requirements |
| GDPR 2016/679 Art.35 | Data Protection Impact Assessment (DPIA) |
| NIS2 2022/2555 Art.21 | Security measures for essential and important entities |
| NIS2 2022/2555 Art.21(d) | Supply chain security requirements |
| NIS2 2022/2555 Art.23 | Incident reporting obligations |
| DORA 2022/2554 Art.5-15 | ICT risk management framework |
| DORA 2022/2554 Art.11 | Business continuity and disaster recovery |
| DORA 2022/2554 Art.28 | ICT third-party risk management |
| DORA 2022/2554 Art.30 | Key contractual provisions for ICT services |
| EU AI Act 2024/1689 | AI system risk classification and obligations |

---

## License

MIT. See [LICENSE](LICENSE).
