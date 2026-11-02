# Interview Battle-Card & Technical Cheat-Sheet
## Senior UI / Frontend Engineer - Enterprise Systems — HCL Technologies
**Req ID:** HCL-ENT-7704 | **Salary:** ₹16,00,000 - ₹24,00,000 PA | **Work Mode:** Hybrid (Noida / Delhi NCR)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
HCL Technologies delivers enterprise software for Fortune 500 manufacturing, banking, and life sciences clients.

**Core Competency Focus:**
- **Large-Scale Enterprise Portals**
- **Angular Material UI**
- **High-Volume Data Grids**
- **Cross-Browser Compatibility**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you optimize rendering performance in enterprise applications handling large, dense data tables?
**Answer Approach:**  
I utilize virtual scrolling (`cdk-virtual-scroll`), pagination, and column virtualization. I ensure pure change detection strategies (`ChangeDetectionStrategy.OnPush`) and decouple sorting/filtering computations to Web Workers or background observables.

> **Proof Anchor:** Optimized complex enterprise data tables at Samsung SDS and Cisco partner platforms.


---

### 3. Primary STAR Impact Story
* **Situation:** Enterprise inventory table with 5,000+ rows caused browser memory spikes and sluggish scrolling.
* **Task:** Restore fluid interaction and reduce memory consumption.
* **Action:** Rebuilt table using Angular CDK virtual scroll and OnPush change detection, recycling DOM nodes efficiently.
* **Result:** **Reduced DOM node count by 85% and restored smooth 60 FPS scrolling.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *What enterprise framework versions are standard across HCL's core client portfolios?*
2. *What opportunities exist for driving design system architecture?*
