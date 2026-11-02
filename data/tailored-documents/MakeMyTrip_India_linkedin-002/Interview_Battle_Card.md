# Interview Battle-Card & Technical Cheat-Sheet
## Lead Frontend UI Developer — MakeMyTrip India
**Req ID:** MMT-GUR-4412 | **Salary:** ₹26,00,000 - ₹38,00,000 PA | **Work Mode:** Hybrid (Gurugram)  
**Candidate:** Ashutosh Kumar (8+ Years Experience) | **Email:** kumar.ashu872@gmail.com | **Phone:** +91 9310681373

---

### 1. Company & Engineering Domain Context
MakeMyTrip is India's leading travel platform where conversion rates directly depend on instant search filtering, rapid date-pickers, and seamless mobile web checkout experiences.

**Core Competency Focus:**
- **High-Traffic Travel Booking Speed**
- **Pixel-Perfect Responsive Layouts**
- **Core Web Vitals & Sub-Second Latency**
- **Micro-Interactions**

---

### 2. High-Yield Technical Deep-Dive Questions & Answers


#### Q1: Travel search pages handle hundreds of flight/hotel results with rich filters. How do you keep the UI responsive and stutter-free?
**Answer Approach:**  
I virtualize result lists so DOM nodes remain lightweight regardless of result count. For heavy multi-faceted filter interactions (price sliders, airlines, stops), I debounce UI updates, process filtering logic off the main thread where necessary, and use CSS transforms (`translate3d`) rather than modifying `top`/`left` to ensure 60 FPS hardware-accelerated animations.

> **Proof Anchor:** Extensive background building responsive, high-performance web interfaces at Wondrfly and Samsung SDS.


#### Q2: How do you guarantee that a complex mobile web checkout flow renders identically across low-end Android browsers and iOS Safari?
**Answer Approach:**  
I use progressive enhancement: robust CSS Grid and Flexbox layouts with modern fallbacks, explicit touch-target sizing (minimum 44x44px for thumb tap zones), and avoidance of `100vh` bugs on mobile Safari by using `100dvh` (dynamic viewport height). I test continuously across real mobile viewports and Chromium mobile emulation.

> **Proof Anchor:** Authored cross-browser responsive web interfaces across 8+ years of production frontend delivery.


---

### 3. Primary STAR Impact Story
* **Situation:** High-traffic client pages experienced noticeable layout shifting and input delay during peak flash-sale campaigns.
* **Task:** Optimize frontend rendering to boost user conversion and eliminate visual layout jumps.
* **Action:** Audited Core Web Vitals using Chrome DevTools Performance profiler; reserved layout space for dynamic price banners; optimized web font loading using `font-display: swap`; optimized critical CSS.
* **Result:** **Achieved green Core Web Vitals across mobile and desktop, boosting session engagement and eliminating layout shifts.**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
1. *What are MakeMyTrip's primary frontend performance targets for mobile web users on 4G networks?*
2. *How does the team approach A/B testing on critical checkout funnels without impacting Cumulative Layout Shift (CLS)?*
3. *What is the architecture roadmap for micro-frontend services across Flights, Hotels, and Holidays?*
