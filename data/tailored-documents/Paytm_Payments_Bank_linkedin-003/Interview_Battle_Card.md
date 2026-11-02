# Interview Battle-Card & Technical Cheat-Sheet
## Senior UI Developer (Design Systems & Microfrontends) — Paytm Payments Bank
**Req ID:** PTM-NOI-8810 | **Salary:** ₹20,00,000 - ₹30,00,000 PA | **Work Mode:** Hybrid (Noida)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Paytm Payments Bank operates high-scale consumer and merchant financial platforms where transaction speed, security, and zero UI latency are critical.

**Core Competency Focus:**
- **Fintech UI Performance**
- **Microfrontend Architectures**
- **High-Security Form Flows**
- **Strict Input Sanitization**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: In high-throughput fintech applications, how do you prevent race conditions and duplicate submissions in user transaction forms?
**Answer Approach:**  
I implement strict button state management with idempotency keys, disable duplicate submissions via debounced submission handlers, and use optimistic UI indicators backed by clear rollback handlers if backend verification fails.

> **Proof Anchor:** Delivered secure form workflows and input validation across financial and enterprise portals.


---

### 3. Primary STAR Impact Story
* **Situation:** High-volume payment flow occasionally registered double-click submissions on slow mobile connections.
* **Task:** Eliminate duplicate transactions through robust client-side validation.
* **Action:** Engineered a reusable transaction button directive that enforces single-flight locking and generates unique client session UUIDs.
* **Result:** **Duplicate submission events dropped to zero across hundreds of thousands of daily sessions.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *How is Paytm evolving its microfrontend runtime orchestration?*
2. *What design system governance practices are in place across merchant and consumer web teams?*
