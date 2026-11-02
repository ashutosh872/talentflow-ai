# Interview Battle-Card & Technical Cheat-Sheet
## Senior Frontend Developer (WCAG Accessibility & Design Systems) — Publicis Sapient
**Req ID:** PS-DEL-5591 | **Salary:** ₹20,00,000 - ₹28,00,000 PA | **Work Mode:** Hybrid (Gurugram / Noida)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Publicis Sapient delivers digital business transformation for top retail, banking, and government clients where accessibility lawsuits and legal compliance (WCAG 2.1 AA / Section 508) are paramount.

**Core Competency Focus:**
- **WCAG 2.1/2.2 AA Enterprise Compliance**
- **Accessible Design Systems**
- **Figma-to-Code Precision**
- **Section 508 Legal Standards**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you test and verify WCAG 2.1 AA compliance before shipping code to production?
**Answer Approach:**  
I implement a 3-layer accessibility QA strategy: 1) Automated linting and tests (eslint-plugin-jsx-a11y and Playwright axe-core integration) to catch ~40% of issues early; 2) Full manual keyboard navigation audit (ensuring zero keyboard traps, visible focus rings with minimum 3:1 contrast ratio, and logical tab sequences); 3) Screen reader testing with NVDA/JAWS on Windows and VoiceOver on macOS.

> **Proof Anchor:** Built accessible forms, semantic page landmarks, and ARIA compliant patterns across 8+ years of production delivery.


#### Q2: How do you make complex interactive UI patterns (like custom modals, accordion tabs, and comboboxes) screen-reader accessible?
**Answer Approach:**  
I implement WAI-ARIA Authoring Practices (APG) design patterns. For tabs: `role='tablist'`, `role='tab'`, `role='tabpanel'`, with `aria-selected`, `aria-controls`, and Arrow key navigation. For live content updates, I apply `aria-live='polite'` so screen readers announce notifications without interrupting active user speech.

> **Proof Anchor:** Engineered accessible interactive UI components for enterprise client deliverables.


---

### 3. Primary STAR Impact Story
* **Situation:** Enterprise client faced strict accessibility compliance audits across consumer-facing web experiences.
* **Task:** Audit, remediate, and establish WCAG 2.1 AA compliant component standards.
* **Action:** Rebuilt non-semantic markup into valid HTML5 semantic hierarchies, added appropriate ARIA attributes, managed programmatic focus, and eliminated color contrast deficiencies.
* **Result:** **Passed independent third-party accessibility audit with zero critical or blocker violations.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *How does Publicis Sapient incorporate automated accessibility testing into client CI/CD build gates?*
2. *What collaborative rituals exist between UX researchers, accessibility specialists, and frontend engineers?*
3. *How are design tokens structured across multi-brand client transformation projects?*
