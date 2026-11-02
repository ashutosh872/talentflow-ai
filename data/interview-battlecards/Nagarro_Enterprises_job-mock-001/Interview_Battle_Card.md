# Interview Battle-Card & Technical Cheat-Sheet
## Senior UI Developer - Design Systems — Nagarro Enterprises
**Req ID:** NAG-2026-9012 | **Salary:** ₹18,00,000 - ₹26,00,000 PA | **Work Mode:** Hybrid (Gurugram / Noida)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Nagarro specializes in enterprise digital engineering for Fortune 500 clients. This role focuses on scaling reusable design systems, design tokens, and automated component verification.

**Core Competency Focus:**
- **Design Systems & Design Tokens**
- **Angular Material UI Customization**
- **Figma-to-Code Precision**
- **Playwright Test Verification**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you bridge the gap between UI/UX designers in Figma and frontend engineers implementing design systems?
**Answer Approach:**  
I establish a single source of truth using Design Tokens (JSON format exported from Figma Tokens/Tokens Studio). These tokens map directly to SCSS variables and CSS custom properties (colors, typography, spacing, elevations, motion). I maintain living Storybook / style guide documentation with interactive code snippets so designers and developers review identical component states.

> **Proof Anchor:** Extensive background establishing design-to-code pipelines across agency and enterprise engagements.


#### Q2: How do you prevent breaking visual changes when updating core design system components used by 10+ downstream product teams?
**Answer Approach:**  
I follow semantic versioning for component packages and maintain strict backwards compatibility on input props and events. For visual verification, I write automated Playwright visual regression tests (taking pixel-diff snapshots of component variations in light/dark mode and responsive breakpoints) before publishing any release candidate.

> **Proof Anchor:** Contributed Playwright test automation workflows at Wondrfly Inc.


#### Q3: Can you describe a scenario where you solved a difficult cross-browser styling inconsistency?
**Answer Approach:**  
In a previous enterprise project, custom form controls and select elements rendered with inconsistent padding and baseline alignment across Safari (iOS/macOS) and Chromium browsers due to native appearance defaults. I normalized the controls using `appearance: none`, custom SVG indicators, explicit `line-height` and `box-sizing: border-box`, verified using Playwright headless Safari (WebKit) and Chrome runners.

> **Proof Anchor:** 8+ years cross-browser debugging expertise upholding consistent behavior across Edge, Safari, Chrome, and Firefox.


---

### 3. Primary STAR Impact Story
* **Situation:** Client products lacked visual consistency and experienced frequent UI regressions when global styling was updated.
* **Task:** Architect a scalable, maintainable design system and reusable component library.
* **Action:** Structured a token-driven SCSS architecture, translated Figma components into modular Angular Material patterns, and introduced automated UI verification.
* **Result:** **Reduced UI development time for new features by ~35% while eliminating visual regressions across delivery tracks.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *How is Nagarro currently structuring design token governance across client-specific vs core enterprise platforms?*
2. *What tooling is the design system team using for component documentation and visual snapshot testing?*
3. *How does the team handle contributions from external product engineers into the central design system repo?*
