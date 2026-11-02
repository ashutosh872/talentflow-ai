# Interview Battle-Card & Technical Cheat-Sheet
## Lead UI Engineer / Design Systems Architect — Wipro Digital
**Req ID:** WIP-DEL-7731 | **Salary:** ₹20,00,000 - ₹28,00,000 PA | **Work Mode:** Hybrid (Noida)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Wipro Digital builds enterprise digital platforms for banking, retail, and healthcare. This role requires technical leadership in design token governance and component architecture.

**Core Competency Focus:**
- **Design Systems Architecture**
- **Design Tokens & SCSS Architecture**
- **Angular & Modular UI**
- **Playwright Automation**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you design a scalable SCSS architecture for an enterprise design system supporting multi-theme white-labeling?
**Answer Approach:**  
I use a 3-tier token architecture: 1) Global/Primitive tokens (raw hex values, base font sizes); 2) Semantic tokens (e.g., `--color-surface-primary`, `--color-action-hover`); 3) Component tokens (e.g., `--btn-primary-bg`). This allows switching from one brand theme to another simply by toggling a CSS class or data attribute at the root container, with zero CSS recompilation.

> **Proof Anchor:** Designed scalable, modular SCSS architectures supporting enterprise platform deliverables.


---

### 3. Primary STAR Impact Story
* **Situation:** Global enterprise client required rapid rebranding across 4 subsidiary portals with minimal code duplication.
* **Task:** Architect a centralized, token-based design system supporting multi-brand white-labeling.
* **Action:** Structured centralized SCSS token hierarchies; decoupled visual styling from component DOM structure; created living Storybook documentation.
* **Result:** **Cut multi-brand deployment cycles from 3 weeks to 2 days while maintaining 100% brand guideline adherence.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *How does Wipro Digital structure design system governance between client projects and internal accelerator libraries?*
2. *What is the team's standard approach for automated visual regression testing in client CI pipelines?*
