# Interview Battle-Card & Technical Cheat-Sheet
## Senior Frontend Engineer (UI/UX Engineering) — Samsung SDS Global
**Req ID:** SSDS-2026-8821 | **Salary:** ₹22,00,000 - ₹30,00,000 PA | **Work Mode:** Remote (India)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Samsung SDS delivers mission-critical global enterprise software. Ashutosh previously served as Assistant Manager - Web Publisher at Samsung SDS, achieving a 97/100 performance rating.

**Core Competency Focus:**
- **Enterprise Angular & Angular Material UI**
- **Design Systems & Token Hierarchies**
- **97/100 Proven Track Record**
- **Cross-Browser Enterprise Compatibility**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: Given your previous tenure at Samsung SDS, how will your expertise hit the ground running on day one?
**Answer Approach:**  
Having served as Assistant Manager - Web Publisher at Samsung SDS, I am deeply familiar with Samsung's enterprise delivery governance, coding conventions, and uncompromising standards for visual fidelity. I already understand the balance between design fidelity, performance benchmarks, and multi-market localization required by Samsung HQ platforms.

> **Proof Anchor:** Direct previous employment at Samsung SDS with official 97/100 performance rating recognition.


#### Q2: How do you customize Angular Material UI components to align with bespoke enterprise design systems without breaking upgrade paths?
**Answer Approach:**  
I never use deep CSS selectors (`::ng-deep`) that break component encapsulation and future Angular upgrades. Instead, I leverage Angular Material's official theming API using Sass mixins and custom typography/color palettes mapped directly to our Figma design tokens. Component overrides are encapsulated in dedicated wrapper modules with clear interface contracts.

> **Proof Anchor:** Engineered scalable enterprise styling architecture with clean Sass modules across client platforms.


#### Q3: How do you ensure pixel-perfect fidelity when converting complex Figma design specifications to responsive code?
**Answer Approach:**  
I analyze Figma design specs in inspect mode—evaluating responsive auto-layout constraints, typography scales, line-heights, and spacing systems. I build using CSS Grid and Flexbox with rem/em units mapped to a consistent 4px/8px spatial rhythm, ensuring the rendered DOM precisely matches design comps across 320px mobile to 2560px ultra-wide screens.

> **Proof Anchor:** Over 8 years converting Figma, PSD, and Zeplin assets with pixel-perfect precision.


#### Q4: How do you address performance degradation in enterprise web apps displaying large-scale tabular datasets?
**Answer Approach:**  
I implement virtual scrolling (such as Angular CDK Virtual Scroll) to render only the visible DOM nodes, reducing DOM element count from thousands to ~20. Combined with `OnPush` change detection, trackBy functions on iterations, and CSS `content-visibility: auto`, this keeps scroll performance at a silky 60 FPS.

> **Proof Anchor:** Delivered responsive, lag-free UI interfaces for complex data grids at Samsung SDS and Cisco.


---

### 3. Primary STAR Impact Story
* **Situation:** Enterprise platforms at Samsung SDS required multi-device responsive consistency, adherence to strict accessibility standards, and flawless visual rendering.
* **Task:** Implement reusable UI components and responsive layouts supporting core enterprise platform releases.
* **Action:** Built pixel-perfect UI from design systems, standardized SCSS architectures, automated cross-browser testing, and resolved responsive UI defects.
* **Result:** **Achieved 97/100 performance evaluation rating for unmatched code quality, UI accuracy, and reliability.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *What are Samsung SDS's current priorities for evolving its global enterprise design system across web platforms?*
2. *How is the team integrating automated accessibility and visual regression testing into the CI/CD pipeline?*
3. *What opportunities exist to mentor junior UI developers in component architecture and Figma-to-code practices?*
