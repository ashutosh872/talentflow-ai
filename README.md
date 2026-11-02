# Ashutosh Kumar — AI Job Search & Application Agent

A reliable, maintainable, and ATS-optimized job search and application management system built for **Ashutosh Kumar** (Senior Frontend Engineer • Senior UI Developer | 8+ Years Experience).

---

## 📌 Candidate Profile Summary

- **Candidate:** Ashutosh Kumar
- **Experience:** 8+ years in enterprise frontend & UI engineering (verified against October 2026 resume)
- **Current Position:** Frontend Developer (Contract) at Wondrfly (Sep 2025 – Present)
- **Enterprise Track Record:** Samsung SDS (Assistant Manager, 97/100 performance rating), Cisco Systems (via Infinity Labs), Experience Commerce (Cheil Group), Mindrops, Codifier Technologies.
- **Core Specialization:** HTML5, CSS3, SCSS, JavaScript (ES6+), Angular Material UI, Reusable Component Architecture, Design Systems & Tokens, Pixel-Perfect Figma-to-Code, WCAG 2.1/2.2 AA Accessibility, Core Web Vitals, Cross-Browser Compatibility, Playwright UI test automation & bug reproduction workflows.
- **Explicit Exclusion:** React is **NOT** Ashutosh's primary specialization. React-mandatory positions where production React is non-negotiable are strictly disqualified.

---

## 🏗️ Architecture & System Modules

```
Job Search Workflow/
├── .env.example                       # Config templates and safeguard flags
├── .env                               # Active environment configuration (DRY_RUN=true)
├── package.json                       # Scripts, Node.js dependencies
├── tsconfig.json                      # TypeScript ESM compiler options
├── config/
│   └── job-preferences.json          # Preferences, locations, rubric weights & thresholds
├── data/
│   ├── applications.csv               # Persistent CSV application tracker
│   ├── reports/                       # Daily generated Markdown & JSON reports
│   ├── resumes/                       # Local copies of verified source resumes
│   └── tailored-documents/            # Generated ATS resumes, cover letters & prep notes
├── src/
│   ├── types/index.ts                 # TypeScript data contracts & interfaces
│   ├── profile/
│   │   └── candidate-profile.ts       # Structured verified resume source of truth
│   ├── sources/
│   │   ├── adapter-interface.ts       # Uniform job source adapter contract
│   │   ├── mock-source.ts             # Verified enterprise job fixtures & disqualifier traps
│   │   └── public-apis.ts             # Public REST/RSS adapters (Arbeitnow, RemoteOK)
│   ├── matching/
│   │   ├── scorer.ts                  # 100-point rubric engine + hard disqualifiers
│   │   └── deduplicator.ts            # URL & signature normalization deduplicator
│   ├── tracker/
│   │   └── persistent-tracker.ts      # CSV persistence & lifecycle state engine
│   ├── applications/
│   │   ├── tailor.ts                  # ATS Markdown resume & cover letter generator
│   │   └── submission-safeguard.ts    # Dry-run enforcement & manual action packet builder
│   ├── reports/
│   │   └── report-generator.ts        # Markdown & JSON summary report builder
│   └── index.ts                       # CLI workflow orchestrator
└── tests/
    ├── scorer.test.ts                 # Scoring & hard disqualifier unit tests
    ├── deduplicator.test.ts           # URL & signature deduplication unit tests
    ├── safeguards.test.ts             # Dry-run & submission safety gate tests
    ├── tracker.test.ts                # CSV escaping & persistence unit tests
    └── integration.test.ts            # End-to-end pipeline integration test
```

---

## 🎯 100-Point Scoring Rubric & Decision Gates

### 1. Scoring Weights
- **Technical Skills (30 points):** HTML5, CSS3/SCSS, JavaScript (ES6), Angular Material UI, Reusable UI Patterns, Playwright UI validation, Responsive/Grid/Flexbox.
- **Relevant Experience & Seniority (20 points):** Senior/Lead title alignment, 5–8+ years experience bracket matching Ashutosh's 8+ years.
- **UI Implementation & Design Systems (15 points):** Reusable component systems, design tokens, Figma-to-code, WCAG 2.1/Section 508 accessibility, Core Web Vitals.
- **Location & Work Mode (15 points):** Delhi NCR (Remote/Hybrid/On-site: 14–15 pts), Remote India (15 pts), International remote open to India (15 pts).
- **Compensation & Stability (10 points):** Target baseline ₹10+ LPA (₹18–35 LPA = 10 pts, ₹10–15 LPA = 8 pts, Market = 7 pts).
- **Employer Credibility & Growth (10 points):** Enterprise tier (Samsung, Cisco, Nagarro, Wipro) or verified official careers portal.

### 2. Hard Disqualifiers (Overrides Score to 0 / REJECTED_DISQUALIFIED)
- **React-Mandatory Check:** If a listing mandates production React experience without an Angular/Vanilla UI alternative.
- **Location Ineligibility:** On-site positions located outside Delhi NCR (e.g. Bangalore on-site daily).
- **Below Baseline Compensation:** Disqualifies any role advertising a salary strictly below ₹10 LPA.
- **Expired Postings:** Postings older than 30 days or explicitly flagged closed.

### 3. Classification Tiers
- **85–100:** `Excellent` (Trigger automated ATS document generation)
- **75–84:** `Strong` (Trigger automated ATS document generation)
- **60–74:** `Manual Review` (Requires candidate review of missing requirements)
- **Below 60:** `Reject`

---

## 🛡️ Safety & Dry-Run Safeguards

1. **Default DRY-RUN Mode (`DRY_RUN=true`):**
   - The agent operates in simulation mode. No applications are ever submitted without explicit confirmation.
2. **Explicit Submission Authorization (`ENABLE_AUTOSUBMIT=false`):**
   - Live submissions require both `DRY_RUN=false` and `ENABLE_AUTOSUBMIT=true`.
3. **Manual Action Packets:**
   - For all high-scoring vacancies, the agent generates:
     - An ATS-optimized Markdown resume tailored with exact job keywords
     - A customized cover letter highlighting verified enterprise achievements (Wondrfly, Samsung SDS 97/100 rating, Cisco BPA Portal)
     - An interview preparation and candidate action memo
     - Pre-filled responses to standard application fields
4. **Human Decision Gates:**
   - Halts automatically if an application requires legal declarations, employment bonds, background checks, or relocation decisions.
   - Never fabricates answers or signs agreements.

---

## 🚀 Installation & Execution

### Prerequisites
- Node.js (v20+ or v24+)
- npm

### 1. Installation
```powershell
# Navigate to the workspace directory
cd "c:\Users\lenovo\Documents\Job Search Workflow"

# Install dependencies
npm.cmd install
```

### 2. Running Automated Tests
```powershell
npm.cmd test
```
All 15 automated test suites run through Vitest, validating match scoring, duplicate detection, CSV persistence, and dry-run safety gates.

### 3. Running Job Search in DRY-RUN Mode
```powershell
npm.cmd run dry-run
```
Or directly:
```powershell
npx.cmd tsx src/index.ts --mode dry-run
```

### 4. Generating Reports from Tracker
```powershell
npm.cmd run report
```

### 5. Running Browser-Assisted Playwright Autofiller
To automatically launch Chromium, pre-fill candidate data, and attach the tailored resume for any job:
```powershell
# Autofill by Job ID (from tracker):
npm.cmd run autofill -- job-mock-002

# Or autofill by direct career portal URL:
npm.cmd run autofill -- "https://careers.company.com/jobs/apply"
```
The browser opens in a real visible window, fills First Name, Last Name, Email, Phone, LinkedIn, Years of Experience, Notice Period, Current Company, Cover Letter, and attaches your tailored resume, pausing for your final review before submission.

---

## 🔌 Integration Capabilities & Platform Limitations

| Platform | Capability Status | Discovery | Employer Verification | Auto Apply | Auth / Requirement |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Public REST / RSS (Arbeitnow, RemoteOK)** | ✅ Active | ✅ Yes | ✅ Yes | ❌ Manual packet | Public Web (No key needed) |
| **Adzuna / Jooble API** | 🟡 Supported (Configurable) | ✅ Yes | ✅ Yes | ❌ Redirect | Set `ADZUNA_APP_ID` / `JOOBLE_API_KEY` in `.env` |
| **Greenhouse / Lever Career Portals** | 🟡 Supported | ✅ Yes | ✅ Yes | ⚠️ Partial API | Direct job board endpoints supported |
| **LinkedIn** | 🚫 API Restricted | ⚠️ Public search only | ❌ Manual | ❌ Prohibited | Official API requires LinkedIn Talent Solutions Partner agreement. Automated login scraping violates ToS. Agent generates one-click manual packet. |
| **Naukri** | 🚫 API Restricted | ⚠️ Public view | ❌ Manual | ❌ Prohibited | Enterprise recruiter credentials required. Scraping behind login prohibited. |
| **Workday / Taleo** | 🚫 Proprietary ATS | ❌ Login walled | ❌ Manual | ❌ Captcha / MFA | Candidate SSO required. Agent produces prep packet. |

---

## 📝 Generated Outputs

1. **Persistent Application Tracker:**
   - File: `data/applications.csv`
   - Fields: `Job ID`, `Title`, `Company`, `Official URL`, `Source`, `Posting Date`, `Location`, `Work Mode`, `Salary`, `Required Skills`, `Match Score`, `Evidence`, `Missing Requirements`, `Application Status`, `Next Action`, `Applied Date`, `Confirmation ID`, `Notes`.
2. **Application Documents:**
   - Directory: `data/tailored-documents/[Company]_[JobId]/`
   - Files:
     - `Ashutosh_Kumar_Resume.pdf` (Printable standard ATS PDF)
     - `Ashutosh_Kumar_Resume.md` (Markdown source)
     - `Ashutosh_Kumar_Cover_Letter.pdf` (Printable standard PDF)
     - `Ashutosh_Kumar_Cover_Letter.md` (Markdown source)
     - `Application_Notes_And_Prep.md`
3. **Daily Executive Reports:**
   - Directory: `data/reports/daily-report-YYYY-MM-DD.md` and `.json`
