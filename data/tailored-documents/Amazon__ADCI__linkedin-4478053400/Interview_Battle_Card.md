# Interview Battle-Card & Technical Cheat-Sheet
## Front-End Engineer II (FBA Placement) — Amazon (ADCI)
**Req ID:** A10575321 | **Salary:** ₹35,00,000 - ₹55,00,000 PA | **Work Mode:** Hybrid (Bengaluru / Remote Review)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Fulfillment by Amazon (FBA) placement interfaces handle inventory routing for millions of global third-party sellers. Amazon values operational excellence, high component reuse, zero regression, and customer obsession.

**Core Competency Focus:**
- **FBA Seller Scale & High-Throughput Portals**
- **Angular & Modular Component Architectures**
- **Strict WCAG 2.1 Accessibility**
- **Core Web Vitals & Latency Under Load**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you architect reusable component libraries that scale across multiple enterprise workflows without regressions?
**Answer Approach:**  
At Samsung SDS and Wondrfly, I designed modular component patterns where presentational components remain strictly stateless and receive inputs via props/signals, isolating business logic in dedicated services. I enforce design tokens for color, typography, and spacing via SCSS custom properties, ensuring updates to global tokens do not trigger breaking layout shifts.

> **Proof Anchor:** Applied across core Samsung HQ portals; audited with zero breaking layout regressions across responsive breakpoints.


#### Q2: Amazon platforms must strictly meet international accessibility standards. How do you guarantee WCAG 2.1 AA compliance in complex seller workflows?
**Answer Approach:**  
I build from semantic HTML foundations—using native `<button>`, `<fieldset>`, `<legend>`, and `<nav>` elements rather than clickable `<div>`s. For interactive modals and custom dropdowns, I manage focus trapping (`aria-modal='true'`, restoring focus to trigger upon dismissal) and ensure keyboard parity (Tab, Shift+Tab, Escape, Enter, Space). I test color contrast to meet 4.5:1 minimum ratios and verify with axe DevTools and screen readers.

> **Proof Anchor:** Implemented enterprise accessibility compliance across Samsung SDS enterprise platform and client applications.


#### Q3: FBA dashboards display dense financial and inventory data. How do you optimize frontend rendering and Core Web Vitals (LCP, CLS, INP)?
**Answer Approach:**  
I optimize LCP by prioritizing critical CSS inlining and preloading key layout assets. To eliminate Cumulative Layout Shift (CLS), I assign explicit aspect-ratio attributes and skeleton loaders for asynchronous seller tables. For INP (Interaction to Next Paint), I debounce input handlers, offload heavy data transformations to Web Workers or lazy microtasks, and avoid synchronous layout thrashing in DOM manipulations.

> **Proof Anchor:** Maintained sub-100ms UI interaction responsiveness across high-density enterprise data tables.


#### Q4: How does your Playwright-based testing approach prevent critical seller-facing defects from shipping to production?
**Answer Approach:**  
At Wondrfly, I contributed to Playwright-based automated verification. Rather than running slow, flaky full end-to-end suites on every commit, I conceptualized an impact-aware bug validation workflow: by analyzing Git diffs and affected component dependencies, Playwright targets the exact critical flows impacted by the change. This provides fast feedback (<3 min) while catching regressions in critical forms and purchase/placement flows.

> **Proof Anchor:** Conceptualized and executed targeted Playwright test workflows at Wondrfly Inc.


#### Q5: How do you leverage modern AI tools (Cursor AI, Claude) to accelerate development without compromising code quality?
**Answer Approach:**  
I use Cursor AI and Claude as force multipliers for bug reproduction, generating edge-case unit test specs, and boilerplate SCSS design token translations from Figma. However, I maintain strict review standards—evaluating generated code for accessibility, clean memory lifecycles, and adherence to company architectural patterns rather than blind acceptance.

> **Proof Anchor:** Accelerated defect isolation and test authoring workflows across contract frontend deliverables.


---

### 3. Primary STAR Impact Story
* **Situation:** Samsung SDS required high-precision, multi-brand platform publishing with strict enterprise delivery schedules across global markets.
* **Task:** Deliver responsive, accessible UI components adhering strictly to Samsung enterprise design systems with zero defects.
* **Action:** Translated intricate Figma and Zeplin designs into production-ready HTML5, SCSS, and JavaScript components; built standardized HTML email templates; established rigorous cross-browser QA workflows.
* **Result:** **Awarded a 97/100 performance rating from Samsung SDS leadership for exceptional code quality and on-schedule platform rollouts.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *How does the FBA Placement engineering team balance global design system consistency with fast seller-facing feature experiments?*
2. *What is the team's continuous integration strategy for catching visual regressions across diverse international seller locales?*
3. *How are performance budgets (specifically Core Web Vitals) enforced across distributed seller applications at Amazon scale?*
