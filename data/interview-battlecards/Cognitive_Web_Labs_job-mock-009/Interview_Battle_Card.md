# Interview Battle-Card & Technical Cheat-Sheet
## Senior Frontend Engineer - AI Workflows — Cognitive Web Labs
**Req ID:** CGN-WEB-5512 | **Salary:** ₹18,00,000 - ₹25,00,000 PA | **Work Mode:** Hybrid (Delhi NCR)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
Cognitive Web Labs builds generative AI tools and enterprise workflow automation interfaces.

**Core Competency Focus:**
- **AI Workflow UX & Streaming Text**
- **Real-Time UI State Management**
- **Interactive Data Visualizations**
- **Complex Form Systems**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: How do you architect responsive UIs that handle streaming LLM token outputs smoothly?
**Answer Approach:**  
I utilize reactive streams (RxJS / WebSockets / SSE) with virtualized DOM windows or requestAnimationFrame batching. By isolating the streaming text container and preventing parent component rerenders, the interface remains smooth at 60 FPS even during rapid token generation.

> **Proof Anchor:** Deep expertise in Angular/RxJS reactive state pipelines and high-throughput enterprise event streams.


---

### 3. Primary STAR Impact Story
* **Situation:** AI platform chat UI was dropping frames when rendering complex markdown and code blocks during streaming responses.
* **Task:** Optimize rendering pipeline to maintain 60 FPS scrolling and interaction.
* **Action:** Implemented chunk-based markdown parsing with microtask debouncing and isolated syntax highlighting.
* **Result:** **Eliminated UI stuttering and achieved flawless rendering across desktop and mobile devices.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *What AI backend models and streaming protocols is the team using in production?*
2. *What are the upcoming frontend architectural priorities for the agent workflow product?*
