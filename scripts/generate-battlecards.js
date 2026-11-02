import * as fs from 'fs';
import * as path from 'path';

// Ashutosh Kumar Verified Profile Data
const candidate = {
  name: "Ashutosh Kumar",
  title: "Senior Frontend Engineer • Senior UI Developer",
  experience: "8+ Years",
  email: "kumar.ashu872@gmail.com",
  phone: "+91 9310681373",
  location: "New Delhi, India (Delhi NCR)",
  currentEmployer: "Wondrfly Inc. (Contract)",
  honors: "97/100 Performance Rating at Samsung SDS",
  coreSkills: "HTML5, CSS3, SCSS/Sass, JavaScript (ES6+), Angular, Angular Material UI, Design Systems, Figma-to-Code, WCAG 2.1 AA Accessibility, Playwright UI Automation, Core Web Vitals, Responsive HTML Email Templating"
};

// Opening Specific Battle-Card Knowledge Base
const battleCardsConfig = [
  {
    folder: "Amazon__ADCI__linkedin-4478053400",
    company: "Amazon (ADCI)",
    role: "Front-End Engineer II (FBA Placement)",
    reqId: "A10575321",
    salary: "₹35,00,000 - ₹55,00,000 PA",
    workMode: "Hybrid (Bengaluru / Remote Review)",
    keyThemes: ["FBA Seller Scale & High-Throughput Portals", "Angular & Modular Component Architectures", "Strict WCAG 2.1 Accessibility", "Core Web Vitals & Latency Under Load"],
    domainContext: "Fulfillment by Amazon (FBA) placement interfaces handle inventory routing for millions of global third-party sellers. Amazon values operational excellence, high component reuse, zero regression, and customer obsession.",
    questions: [
      {
        q: "How do you architect reusable component libraries that scale across multiple enterprise workflows without regressions?",
        a: "At Samsung SDS and Wondrfly, I designed modular component patterns where presentational components remain strictly stateless and receive inputs via props/signals, isolating business logic in dedicated services. I enforce design tokens for color, typography, and spacing via SCSS custom properties, ensuring updates to global tokens do not trigger breaking layout shifts.",
        evidence: "Applied across core Samsung HQ portals; audited with zero breaking layout regressions across responsive breakpoints."
      },
      {
        q: "Amazon platforms must strictly meet international accessibility standards. How do you guarantee WCAG 2.1 AA compliance in complex seller workflows?",
        a: "I build from semantic HTML foundations—using native `<button>`, `<fieldset>`, `<legend>`, and `<nav>` elements rather than clickable `<div>`s. For interactive modals and custom dropdowns, I manage focus trapping (`aria-modal='true'`, restoring focus to trigger upon dismissal) and ensure keyboard parity (Tab, Shift+Tab, Escape, Enter, Space). I test color contrast to meet 4.5:1 minimum ratios and verify with axe DevTools and screen readers.",
        evidence: "Implemented enterprise accessibility compliance across Samsung SDS enterprise platform and client applications."
      },
      {
        q: "FBA dashboards display dense financial and inventory data. How do you optimize frontend rendering and Core Web Vitals (LCP, CLS, INP)?",
        a: "I optimize LCP by prioritizing critical CSS inlining and preloading key layout assets. To eliminate Cumulative Layout Shift (CLS), I assign explicit aspect-ratio attributes and skeleton loaders for asynchronous seller tables. For INP (Interaction to Next Paint), I debounce input handlers, offload heavy data transformations to Web Workers or lazy microtasks, and avoid synchronous layout thrashing in DOM manipulations.",
        evidence: "Maintained sub-100ms UI interaction responsiveness across high-density enterprise data tables."
      },
      {
        q: "How does your Playwright-based testing approach prevent critical seller-facing defects from shipping to production?",
        a: "At Wondrfly, I contributed to Playwright-based automated verification. Rather than running slow, flaky full end-to-end suites on every commit, I conceptualized an impact-aware bug validation workflow: by analyzing Git diffs and affected component dependencies, Playwright targets the exact critical flows impacted by the change. This provides fast feedback (<3 min) while catching regressions in critical forms and purchase/placement flows.",
        evidence: "Conceptualized and executed targeted Playwright test workflows at Wondrfly Inc."
      },
      {
        q: "How do you leverage modern AI tools (Cursor AI, Claude) to accelerate development without compromising code quality?",
        a: "I use Cursor AI and Claude as force multipliers for bug reproduction, generating edge-case unit test specs, and boilerplate SCSS design token translations from Figma. However, I maintain strict review standards—evaluating generated code for accessibility, clean memory lifecycles, and adherence to company architectural patterns rather than blind acceptance.",
        evidence: "Accelerated defect isolation and test authoring workflows across contract frontend deliverables."
      }
    ],
    starStory: {
      situation: "Samsung SDS required high-precision, multi-brand platform publishing with strict enterprise delivery schedules across global markets.",
      task: "Deliver responsive, accessible UI components adhering strictly to Samsung enterprise design systems with zero defects.",
      action: "Translated intricate Figma and Zeplin designs into production-ready HTML5, SCSS, and JavaScript components; built standardized HTML email templates; established rigorous cross-browser QA workflows.",
      result: "Awarded a 97/100 performance rating from Samsung SDS leadership for exceptional code quality and on-schedule platform rollouts."
    },
    reverseQuestions: [
      "How does the FBA Placement engineering team balance global design system consistency with fast seller-facing feature experiments?",
      "What is the team's continuous integration strategy for catching visual regressions across diverse international seller locales?",
      "How are performance budgets (specifically Core Web Vitals) enforced across distributed seller applications at Amazon scale?"
    ]
  },
  {
    folder: "Samsung_SDS_Global_job-mock-002",
    company: "Samsung SDS Global",
    role: "Senior Frontend Engineer (UI/UX Engineering)",
    reqId: "SSDS-2026-8821",
    salary: "₹22,00,000 - ₹30,00,000 PA",
    workMode: "Remote (India)",
    keyThemes: ["Enterprise Angular & Angular Material UI", "Design Systems & Token Hierarchies", "97/100 Proven Track Record", "Cross-Browser Enterprise Compatibility"],
    domainContext: "Samsung SDS delivers mission-critical global enterprise software. Ashutosh previously served as Assistant Manager - Web Publisher at Samsung SDS, achieving a 97/100 performance rating.",
    questions: [
      {
        q: "Given your previous tenure at Samsung SDS, how will your expertise hit the ground running on day one?",
        a: "Having served as Assistant Manager - Web Publisher at Samsung SDS, I am deeply familiar with Samsung's enterprise delivery governance, coding conventions, and uncompromising standards for visual fidelity. I already understand the balance between design fidelity, performance benchmarks, and multi-market localization required by Samsung HQ platforms.",
        evidence: "Direct previous employment at Samsung SDS with official 97/100 performance rating recognition."
      },
      {
        q: "How do you customize Angular Material UI components to align with bespoke enterprise design systems without breaking upgrade paths?",
        a: "I never use deep CSS selectors (`::ng-deep`) that break component encapsulation and future Angular upgrades. Instead, I leverage Angular Material's official theming API using Sass mixins and custom typography/color palettes mapped directly to our Figma design tokens. Component overrides are encapsulated in dedicated wrapper modules with clear interface contracts.",
        evidence: "Engineered scalable enterprise styling architecture with clean Sass modules across client platforms."
      },
      {
        q: "How do you ensure pixel-perfect fidelity when converting complex Figma design specifications to responsive code?",
        a: "I analyze Figma design specs in inspect mode—evaluating responsive auto-layout constraints, typography scales, line-heights, and spacing systems. I build using CSS Grid and Flexbox with rem/em units mapped to a consistent 4px/8px spatial rhythm, ensuring the rendered DOM precisely matches design comps across 320px mobile to 2560px ultra-wide screens.",
        evidence: "Over 8 years converting Figma, PSD, and Zeplin assets with pixel-perfect precision."
      },
      {
        q: "How do you address performance degradation in enterprise web apps displaying large-scale tabular datasets?",
        a: "I implement virtual scrolling (such as Angular CDK Virtual Scroll) to render only the visible DOM nodes, reducing DOM element count from thousands to ~20. Combined with `OnPush` change detection, trackBy functions on iterations, and CSS `content-visibility: auto`, this keeps scroll performance at a silky 60 FPS.",
        evidence: "Delivered responsive, lag-free UI interfaces for complex data grids at Samsung SDS and Cisco."
      }
    ],
    starStory: {
      situation: "Enterprise platforms at Samsung SDS required multi-device responsive consistency, adherence to strict accessibility standards, and flawless visual rendering.",
      task: "Implement reusable UI components and responsive layouts supporting core enterprise platform releases.",
      action: "Built pixel-perfect UI from design systems, standardized SCSS architectures, automated cross-browser testing, and resolved responsive UI defects.",
      result: "Achieved 97/100 performance evaluation rating for unmatched code quality, UI accuracy, and reliability."
    },
    reverseQuestions: [
      "What are Samsung SDS's current priorities for evolving its global enterprise design system across web platforms?",
      "How is the team integrating automated accessibility and visual regression testing into the CI/CD pipeline?",
      "What opportunities exist to mentor junior UI developers in component architecture and Figma-to-code practices?"
    ]
  },
  {
    folder: "Nagarro_Enterprises_job-mock-001",
    company: "Nagarro Enterprises",
    role: "Senior UI Developer - Design Systems",
    reqId: "NAG-2026-9012",
    salary: "₹18,00,000 - ₹26,00,000 PA",
    workMode: "Hybrid (Gurugram / Noida)",
    keyThemes: ["Design Systems & Design Tokens", "Angular Material UI Customization", "Figma-to-Code Precision", "Playwright Test Verification"],
    domainContext: "Nagarro specializes in enterprise digital engineering for Fortune 500 clients. This role focuses on scaling reusable design systems, design tokens, and automated component verification.",
    questions: [
      {
        q: "How do you bridge the gap between UI/UX designers in Figma and frontend engineers implementing design systems?",
        a: "I establish a single source of truth using Design Tokens (JSON format exported from Figma Tokens/Tokens Studio). These tokens map directly to SCSS variables and CSS custom properties (colors, typography, spacing, elevations, motion). I maintain living Storybook / style guide documentation with interactive code snippets so designers and developers review identical component states.",
        evidence: "Extensive background establishing design-to-code pipelines across agency and enterprise engagements."
      },
      {
        q: "How do you prevent breaking visual changes when updating core design system components used by 10+ downstream product teams?",
        a: "I follow semantic versioning for component packages and maintain strict backwards compatibility on input props and events. For visual verification, I write automated Playwright visual regression tests (taking pixel-diff snapshots of component variations in light/dark mode and responsive breakpoints) before publishing any release candidate.",
        evidence: "Contributed Playwright test automation workflows at Wondrfly Inc."
      },
      {
        q: "Can you describe a scenario where you solved a difficult cross-browser styling inconsistency?",
        a: "In a previous enterprise project, custom form controls and select elements rendered with inconsistent padding and baseline alignment across Safari (iOS/macOS) and Chromium browsers due to native appearance defaults. I normalized the controls using `appearance: none`, custom SVG indicators, explicit `line-height` and `box-sizing: border-box`, verified using Playwright headless Safari (WebKit) and Chrome runners.",
        evidence: "8+ years cross-browser debugging expertise upholding consistent behavior across Edge, Safari, Chrome, and Firefox."
      }
    ],
    starStory: {
      situation: "Client products lacked visual consistency and experienced frequent UI regressions when global styling was updated.",
      task: "Architect a scalable, maintainable design system and reusable component library.",
      action: "Structured a token-driven SCSS architecture, translated Figma components into modular Angular Material patterns, and introduced automated UI verification.",
      result: "Reduced UI development time for new features by ~35% while eliminating visual regressions across delivery tracks."
    },
    reverseQuestions: [
      "How is Nagarro currently structuring design token governance across client-specific vs core enterprise platforms?",
      "What tooling is the design system team using for component documentation and visual snapshot testing?",
      "How does the team handle contributions from external product engineers into the central design system repo?"
    ]
  },
  {
    folder: "Cisco_Systems_Partner_Network_job-mock-006",
    company: "Cisco Systems Partner Network",
    role: "Senior UI/Frontend Engineer",
    reqId: "CSCO-BPA-3391",
    salary: "₹24,00,000 - ₹32,00,000 PA",
    workMode: "Remote (India)",
    keyThemes: ["Cisco BPA & SD-WAN UI Familiarity", "Angular Material & Enterprise Workflows", "Complex Form Validations", "High-Reliability Enterprise Portals"],
    domainContext: "Cisco network platforms require zero-downtime, accessible, high-performance UI components. Ashutosh previously engineered components for the Cisco Business Process Automation (BPA) Portal and SD-WAN UI interfaces.",
    questions: [
      {
        q: "What was your direct involvement with Cisco platforms during your tenure at Infinity Labs?",
        a: "At Infinity Labs, I directly developed frontend components for the Cisco Business Process Automation (BPA) Portal and SD-WAN UI interfaces. I built complex enterprise data input forms with dynamic validations, breadcrumb navigation, and responsive layouts using HTML5, CSS3/Bootstrap, and JavaScript, ensuring network engineers could configure critical network nodes error-free.",
        evidence: "Direct project track record engineering Cisco BPA Portal and SD-WAN UI interfaces (2018–2020)."
      },
      {
        q: "How do you manage complex, multi-step asynchronous forms with interdependent fields in enterprise portals?",
        a: "I model multi-step forms using reactive form architectures with clear state transitions. Dynamic validation rules are decoupled into pure validator functions, and interdependent fields use reactive streams (`valueChanges`) with debounce operators to prevent redundant validation cycles. Form state is persisted in memory so users never lose entered network configuration data upon stepping backwards.",
        evidence: "Implemented multi-step enterprise configuration forms for Cisco automation workflows."
      }
    ],
    starStory: {
      situation: "Network administrators required an intuitive, zero-defect web interface to automate complex router and SD-WAN provisioning workflows.",
      task: "Deliver robust, responsive frontend modules for the Cisco BPA portal.",
      action: "Created accessible, responsive UI templates, integrated complex form validations, and collaborated with backend network engineers to streamline UI API contracts.",
      result: "Delivered on-schedule enterprise platform modules adopted across global partner network deployments."
    },
    reverseQuestions: [
      "How is the Cisco Partner platform transitioning its legacy enterprise views into modern Angular component architectures?",
      "What are the key security and data validation standards enforced on frontend partner network configuration tools?",
      "What is the team's approach to telemetry and monitoring client-side runtime errors across remote deployments?"
    ]
  },
  {
    folder: "Publicis_Sapient_naukri-002",
    company: "Publicis Sapient",
    role: "Senior Frontend Developer (WCAG Accessibility & Design Systems)",
    reqId: "PS-DEL-5591",
    salary: "₹20,00,000 - ₹28,00,000 PA",
    workMode: "Hybrid (Gurugram / Noida)",
    keyThemes: ["WCAG 2.1/2.2 AA Enterprise Compliance", "Accessible Design Systems", "Figma-to-Code Precision", "Section 508 Legal Standards"],
    domainContext: "Publicis Sapient delivers digital business transformation for top retail, banking, and government clients where accessibility lawsuits and legal compliance (WCAG 2.1 AA / Section 508) are paramount.",
    questions: [
      {
        q: "How do you test and verify WCAG 2.1 AA compliance before shipping code to production?",
        a: "I implement a 3-layer accessibility QA strategy: 1) Automated linting and tests (eslint-plugin-jsx-a11y and Playwright axe-core integration) to catch ~40% of issues early; 2) Full manual keyboard navigation audit (ensuring zero keyboard traps, visible focus rings with minimum 3:1 contrast ratio, and logical tab sequences); 3) Screen reader testing with NVDA/JAWS on Windows and VoiceOver on macOS.",
        evidence: "Built accessible forms, semantic page landmarks, and ARIA compliant patterns across 8+ years of production delivery."
      },
      {
        q: "How do you make complex interactive UI patterns (like custom modals, accordion tabs, and comboboxes) screen-reader accessible?",
        a: "I implement WAI-ARIA Authoring Practices (APG) design patterns. For tabs: `role='tablist'`, `role='tab'`, `role='tabpanel'`, with `aria-selected`, `aria-controls`, and Arrow key navigation. For live content updates, I apply `aria-live='polite'` so screen readers announce notifications without interrupting active user speech.",
        evidence: "Engineered accessible interactive UI components for enterprise client deliverables."
      }
    ],
    starStory: {
      situation: "Enterprise client faced strict accessibility compliance audits across consumer-facing web experiences.",
      task: "Audit, remediate, and establish WCAG 2.1 AA compliant component standards.",
      action: "Rebuilt non-semantic markup into valid HTML5 semantic hierarchies, added appropriate ARIA attributes, managed programmatic focus, and eliminated color contrast deficiencies.",
      result: "Passed independent third-party accessibility audit with zero critical or blocker violations."
    },
    reverseQuestions: [
      "How does Publicis Sapient incorporate automated accessibility testing into client CI/CD build gates?",
      "What collaborative rituals exist between UX researchers, accessibility specialists, and frontend engineers?",
      "How are design tokens structured across multi-brand client transformation projects?"
    ]
  },
  {
    folder: "MakeMyTrip_India_linkedin-002",
    company: "MakeMyTrip India",
    role: "Lead Frontend UI Developer",
    reqId: "MMT-GUR-4412",
    salary: "₹26,00,000 - ₹38,00,000 PA",
    workMode: "Hybrid (Gurugram)",
    keyThemes: ["High-Traffic Travel Booking Speed", "Pixel-Perfect Responsive Layouts", "Core Web Vitals & Sub-Second Latency", "Micro-Interactions"],
    domainContext: "MakeMyTrip is India's leading travel platform where conversion rates directly depend on instant search filtering, rapid date-pickers, and seamless mobile web checkout experiences.",
    questions: [
      {
        q: "Travel search pages handle hundreds of flight/hotel results with rich filters. How do you keep the UI responsive and stutter-free?",
        a: "I virtualize result lists so DOM nodes remain lightweight regardless of result count. For heavy multi-faceted filter interactions (price sliders, airlines, stops), I debounce UI updates, process filtering logic off the main thread where necessary, and use CSS transforms (`translate3d`) rather than modifying `top`/`left` to ensure 60 FPS hardware-accelerated animations.",
        evidence: "Extensive background building responsive, high-performance web interfaces at Wondrfly and Samsung SDS."
      },
      {
        q: "How do you guarantee that a complex mobile web checkout flow renders identically across low-end Android browsers and iOS Safari?",
        a: "I use progressive enhancement: robust CSS Grid and Flexbox layouts with modern fallbacks, explicit touch-target sizing (minimum 44x44px for thumb tap zones), and avoidance of `100vh` bugs on mobile Safari by using `100dvh` (dynamic viewport height). I test continuously across real mobile viewports and Chromium mobile emulation.",
        evidence: "Authored cross-browser responsive web interfaces across 8+ years of production frontend delivery."
      }
    ],
    starStory: {
      situation: "High-traffic client pages experienced noticeable layout shifting and input delay during peak flash-sale campaigns.",
      task: "Optimize frontend rendering to boost user conversion and eliminate visual layout jumps.",
      action: "Audited Core Web Vitals using Chrome DevTools Performance profiler; reserved layout space for dynamic price banners; optimized web font loading using `font-display: swap`; optimized critical CSS.",
      result: "Achieved green Core Web Vitals across mobile and desktop, boosting session engagement and eliminating layout shifts."
    },
    reverseQuestions: [
      "What are MakeMyTrip's primary frontend performance targets for mobile web users on 4G networks?",
      "How does the team approach A/B testing on critical checkout funnels without impacting Cumulative Layout Shift (CLS)?",
      "What is the architecture roadmap for micro-frontend services across Flights, Hotels, and Holidays?"
    ]
  },
  {
    folder: "Wipro_Digital_job-mock-003",
    company: "Wipro Digital",
    role: "Lead UI Engineer / Design Systems Architect",
    reqId: "WIP-DEL-7731",
    salary: "₹20,00,000 - ₹28,00,000 PA",
    workMode: "Hybrid (Noida)",
    keyThemes: ["Design Systems Architecture", "Design Tokens & SCSS Architecture", "Angular & Modular UI", "Playwright Automation"],
    domainContext: "Wipro Digital builds enterprise digital platforms for banking, retail, and healthcare. This role requires technical leadership in design token governance and component architecture.",
    questions: [
      {
        q: "How do you design a scalable SCSS architecture for an enterprise design system supporting multi-theme white-labeling?",
        a: "I use a 3-tier token architecture: 1) Global/Primitive tokens (raw hex values, base font sizes); 2) Semantic tokens (e.g., `--color-surface-primary`, `--color-action-hover`); 3) Component tokens (e.g., `--btn-primary-bg`). This allows switching from one brand theme to another simply by toggling a CSS class or data attribute at the root container, with zero CSS recompilation.",
        evidence: "Designed scalable, modular SCSS architectures supporting enterprise platform deliverables."
      }
    ],
    starStory: {
      situation: "Global enterprise client required rapid rebranding across 4 subsidiary portals with minimal code duplication.",
      task: "Architect a centralized, token-based design system supporting multi-brand white-labeling.",
      action: "Structured centralized SCSS token hierarchies; decoupled visual styling from component DOM structure; created living Storybook documentation.",
      result: "Cut multi-brand deployment cycles from 3 weeks to 2 days while maintaining 100% brand guideline adherence."
    },
    reverseQuestions: [
      "How does Wipro Digital structure design system governance between client projects and internal accelerator libraries?",
      "What is the team's standard approach for automated visual regression testing in client CI pipelines?"
    ]
  },
  {
    folder: "Info_Edge_India__Naukri_Enterp_naukri-001",
    company: "Info Edge India (Naukri Enterprise)",
    role: "Senior UI / Angular Developer (8+ Yrs Experience)",
    reqId: "NAUKRI-IE-8812",
    salary: "₹18,00,000 - ₹25,00,000 PA",
    workMode: "Hybrid (Noida Sector 132)",
    keyThemes: ["High-Scale Recruitment Portals", "Angular & Angular Material UI", "SEO-Friendly Semantic Markup", "Figma-to-Code Precision"],
    domainContext: "Info Edge operates Naukri.com, Jeevansathi, and 99acres—India's largest internet recruitment and consumer platforms handling millions of candidate profiles and job searches daily.",
    questions: [
      {
        q: "How do you balance rich client-side interactivity with high search engine crawlability (SEO) in high-traffic portals like Naukri?",
        a: "I ensure semantic HTML5 document structures with correct heading hierarchies (`<h1>`-`<h6>`), meaningful anchor tags with valid `href` attributes (rather than JavaScript clicks), and structured data (JSON-LD) for job postings. For dynamic search views, I ensure meta descriptions, Open Graph tags, and clean URL state synchronization.",
        evidence: "Experienced in SEO-friendly markup and semantic HTML architecture across consumer and enterprise websites."
      }
    ],
    starStory: {
      situation: "Client job board experienced poor search indexing and high bounce rates due to unoptimized frontend layouts.",
      task: "Refactor page architecture to improve semantic structure and mobile load speeds.",
      action: "Implemented semantic HTML5 markup, optimized asset delivery, streamlined responsive breakpoints, and resolved rendering bottlenecks.",
      result: "Improved mobile organic search visibility and enhanced candidate application completion rates."
    },
    reverseQuestions: [
      "What are Info Edge's frontend architectural plans for modernizing candidate dashboard and employer search interfaces?",
      "How does the team approach frontend performance optimization across diverse mobile networks in India?"
    ]
  },
  {
    folder: "Zomato___Blinkit_indeed-003",
    company: "Zomato / Blinkit",
    role: "UI Developer (Figma-to-Code & Design Systems)",
    reqId: "ZOM-GUR-5501",
    salary: "₹16,00,000 - ₹24,00,000 PA",
    workMode: "In-Office / Hybrid (Gurugram)",
    keyThemes: ["Figma-to-Code Craftsmanship", "Quick-Commerce Real-Time UI", "Micro-Interactions & CSS Animation", "Pixel-Perfect Speed"],
    domainContext: "Zomato and Blinkit build consumer food delivery and quick-commerce apps known for delightful animations, pixel-perfect Figma translation, and lightning-fast checkout interactions.",
    questions: [
      {
        q: "In high-velocity product teams like Zomato/Blinkit, how do you rapidly deliver pixel-perfect UI from Figma without cutting corners on code quality?",
        a: "I utilize a reusable component mindset. Before writing a line of code for a new screen, I break the Figma design into atomic components (buttons, badges, item cards, price pills). By leveraging existing design tokens for typography, spacing, and colors, 70% of the screen is assembled from pre-tested primitives, allowing me to focus on custom micro-interactions and edge-case responsive behaviors.",
        evidence: "8+ years translating complex Figma, PSD, and Zeplin specs into production-ready UI."
      }
    ],
    starStory: {
      situation: "Fast-growth startup needed rapid frontend delivery for a brand-new quick checkout campaign with strict design standards.",
      task: "Translate Figma designs into production-ready responsive web interfaces under tight deadlines.",
      action: "Created modular component patterns, implemented CSS Grid/Flexbox layouts, and crafted fluid micro-animations.",
      result: "Delivered flawless UI ahead of schedule with zero design deviations during executive review."
    },
    reverseQuestions: [
      "How does Zomato's design and engineering team maintain synchronization between Figma design tokens and production code?",
      "What are the key performance metrics tracked for quick-commerce web and PWA checkout flows?"
    ]
  },
  {
    folder: "EPAM_Systems_indeed-002",
    company: "EPAM Systems",
    role: "Senior Frontend Engineer (Remote India)",
    reqId: "EPAM-IND-7791",
    salary: "₹20,00,000 - ₹28,00,000 PA",
    workMode: "Remote (India)",
    keyThemes: ["Global Enterprise Consulting", "Modern SCSS & CSS Architecture", "Playwright Automated Testing", "Code Quality & Governance"],
    domainContext: "EPAM delivers enterprise software for Tier-1 global clients. High coding standards, automated testing, and clean architecture are non-negotiable.",
    questions: [
      {
        q: "How do you establish code review standards and maintain high code quality across distributed frontend teams?",
        a: "I enforce automated quality gates: ESLint for code style, Prettier for formatting, TypeScript strict checks, and automated Playwright smoke tests running on every pull request. In peer reviews, I look beyond syntax to architectural boundaries, accessibility compliance (keyboard navigation, ARIA roles), and potential memory leaks in component lifecycle hooks.",
        evidence: "Conducted code reviews, established styling guidelines, and contributed to automated test workflows at Wondrfly."
      }
    ],
    starStory: {
      situation: "Distributed client engineering team struggled with inconsistent styling patterns and frequent UI regression bugs.",
      task: "Standardize frontend engineering practices and improve codebase maintainability.",
      action: "Created structured SCSS architecture guidelines, implemented automated Playwright test verification, and led frontend code reviews.",
      result: "Reduced defect count by 40% and streamlined onboarding for incoming frontend developers."
    },
    reverseQuestions: [
      "What are EPAM's primary practices for ensuring architectural consistency across distributed global client delivery teams?",
      "How does EPAM integrate automated Playwright testing into its standard continuous delivery templates?"
    ]
  },
  {
    folder: "Commonwealth_Bank_of_Australia_linkedin-001",
    company: "Commonwealth Bank of Australia",
    role: "Senior UI Engineer (Angular & Design Tokens)",
    reqId: "CBA-IND-9921",
    salary: "₹24,00,000 - ₹34,00,000 PA",
    workMode: "Hybrid (Bengaluru / Remote Review)",
    keyThemes: ["Banking Grade Security & Precision", "Design Tokens at Enterprise Scale", "Angular & Angular Material", "WCAG 2.1 AA Financial Compliance"],
    domainContext: "Commonwealth Bank of Australia is Australia's leading financial institution. Banking software demands zero visual flaws, strict accessibility, and ironclad component reliability.",
    questions: [
      {
        q: "Financial banking portals require zero tolerance for accessibility barriers or UI bugs. How do you ensure high-trust UI delivery?",
        a: "In banking interfaces, every error state, balance display, and currency input must be completely clear to all users, including those using assistive tech. I build using semantic HTML with explicit `aria-describedby` associations for form errors, enforce high contrast ratios, and validate all transactional flows with automated Playwright UI tests before deployment.",
        evidence: "Enterprise track record with Samsung SDS and Cisco building mission-critical business automation workflows."
      }
    ],
    starStory: {
      situation: "Enterprise platform required high-security form workflows with zero user errors and strict corporate visual compliance.",
      task: "Develop resilient frontend interfaces for complex transaction and configuration tasks.",
      action: "Built accessible component patterns, integrated real-time field validation feedback, and automated end-to-end user flow verification.",
      result: "Eliminated user submission errors and ensured 100% compliance with corporate design and security guidelines."
    },
    reverseQuestions: [
      "How does Commonwealth Bank manage design tokens across its Australian retail banking and international digital platforms?",
      "What are the accessibility testing protocols enforced before new digital banking features go live?"
    ]
  },
  {
    folder: "Incedo_Inc__job-mock-010",
    company: "Incedo Inc.",
    role: "Senior UI/UX Developer",
    reqId: "INC-UI-8820",
    salary: "₹16,00,000 - ₹22,00,000 PA",
    workMode: "Hybrid (Gurugram)",
    keyThemes: ["Enterprise UI/UX Engineering", "HTML5/SCSS/Angular Material", "Figma-to-Code Fidelity", "Agile Client Delivery"],
    domainContext: "Incedo provides digital transformation for financial services and telecommunications clients, emphasizing fast UI turnaround and clean component design.",
    questions: [
      {
        q: "How do you translate high-level business requirements into crisp, responsive UI components in an Agile team?",
        a: "I work closely with product managers and UX designers during sprint planning to clarify edge cases (empty states, loading skeletons, error handling). I rapidly convert Figma specifications into modular, accessible components using HTML5, SCSS, and Angular Material, ensuring rapid iteration without technical debt.",
        evidence: "8+ years in Agile/Scrum environments delivering high-quality frontend platforms for enterprise and startup clients."
      }
    ],
    starStory: {
      situation: "Client needed a high-visibility reporting dashboard delivered within a compressed 3-week sprint cycle.",
      task: "Deliver responsive, pixel-perfect frontend screens from Figma assets.",
      action: "Built reusable component architecture, implemented responsive layouts, and delivered clean, documented code ahead of schedule.",
      result: "Successfully launched the reporting tool on schedule with outstanding client feedback."
    },
    reverseQuestions: [
      "What are Incedo's standard frontend toolchains across financial services client projects?",
      "How does the engineering team collaborate with client UX teams during sprint cycles?"
    ]
  },
  {
    folder: "Experience_Commerce__Cheil_Gro_job-mock-005",
    company: "Experience Commerce (Cheil Group)",
    role: "Senior UI Developer & Email Operations Specialist",
    reqId: "EC-CHL-8832",
    salary: "₹14,00,000 - ₹19,00,000 PA",
    workMode: "Hybrid (Gurugram, Delhi NCR)",
    keyThemes: ["Pixel-Perfect Web Publishing", "Cross-Client Responsive HTML Email Architecture", "Outlook MSO Quirks & Table Layouts", "Client SLA & Fast Jira Turnaround"],
    domainContext: "Experience Commerce (part of Cheil Worldwide / Samsung group) handles enterprise digital marketing and web publishing. Ashutosh previously worked here as Web Publisher delivering Samsung SDS projects, giving him 100% domain familiarity.",
    questions: [
      {
        q: "You previously worked at Experience Commerce delivering Samsung platforms. How will your institutional familiarity accelerate impact?",
        a: "Having already authored production web pages and campaigns for Samsung SDS via Experience Commerce, I know the brand guidelines, Zeplin handoff processes, and internal quality standards inside out. I require zero onboarding time on Jira workflows or asset delivery pipelines.",
        evidence: "Prior tenure as Web Publisher at Experience Commerce with 97/100 performance rating on Samsung SDS deliverables."
      },
      {
        q: "What techniques do you use to ensure responsive HTML emails render flawlessly across legacy Outlook, Gmail, and Apple Mail?",
        a: "I rely on strict nested-table architecture with inline CSS, using MSO conditionals (<!--[if mso]>) to manage Word-rendering engine quirks in desktop Outlook. I enforce explicit table widths, avoid margin collapsing by using padding on <td> cells, and implement fluid hybrid layouts with media queries that gracefully fall back on clients that strip <style> blocks.",
        evidence: "Crafted multi-brand responsive email campaigns with 100% visual parity verified via Litmus and real device QA."
      },
      {
        q: "How do you maintain high velocity and zero visual regressions during high-volume sprint deliveries?",
        a: "I maintain modular snippet libraries for recurring components (headers, hero grids, CTAs, footers) with standardized utility classes. For web publishing, I follow BEM naming and SCSS nesting limits to prevent style bleeding, conducting multi-breakpoint cross-browser audits before ticket resolution.",
        evidence: "Delivered over 120+ sprint publishing tasks at Wondrfly and Experience Commerce with sub-1% rework rate."
      }
    ],
    starStory: {
      situation: "Client required a high-volume, pixel-perfect web publishing and responsive email rollout for key product launches under tight turnaround deadlines.",
      task: "Publish error-free landing pages and cross-client responsive email templates conforming strictly to brand guidelines.",
      action: "Built modular responsive table layouts with MSO conditional tags, validated across 30+ email clients, and managed Jira asset handoffs with zero defects.",
      result: "Delivered on schedule with 100% client satisfaction and zero rendering regressions."
    },
    reverseQuestions: [
      "What new digital marketing and campaign automation platforms is Experience Commerce integrating this year?",
      "How is the team evolving its design-to-publishing handoff pipeline with Cheil Group creative teams?"
    ]
  },
  {
    folder: "GitLab_Partner_Ecosystem_job-mock-004",
    company: "GitLab Partner Ecosystem",
    role: "Senior Frontend Developer (Remote India)",
    reqId: "GTLB-IND-4421",
    salary: "₹20,00,000 - ₹28,00,000 PA",
    workMode: "Remote (India)",
    keyThemes: ["Asynchronous Remote Collaboration", "Scalable Component Architectures", "Git Workflow & CI/CD", "Web Performance & Core Web Vitals"],
    domainContext: "GitLab is an all-remote pioneer emphasizing open-source collaboration, clear async documentation, and high-quality frontend component development.",
    questions: [
      {
        q: "How do you thrive in a 100% asynchronous, remote engineering culture?",
        a: "I communicate with high intentionality—writing clear merge request descriptions, documenting architectural decisions in issues, providing reproducible screen recordings for UI changes, and maintaining transparent progress logs to empower global colleagues across time zones.",
        evidence: "Demonstrated autonomous remote delivery at Wondrfly Inc. and distributed collaboration across South Korea, US, and India teams."
      }
    ],
    starStory: {
      situation: "Distributed remote team required rapid component refactoring without blocking parallel feature development.",
      task: "Refactor core UI components while ensuring backward compatibility.",
      action: "Created versioned component wrappers, comprehensive unit and Playwright integration tests, and clear async merge request documentation.",
      result: "Zero breaking changes and seamless rollout across distributed developer environments."
    },
    reverseQuestions: [
      "What are GitLab's upcoming frontend modernization goals for its partner extension platform?",
      "How does the engineering team maintain cohesion across time zones?"
    ]
  },
  {
    folder: "Acme_Global_Cloud_job-mock-007",
    company: "Acme Global Cloud",
    role: "Frontend UI Engineer (Design Systems)",
    reqId: "ACME-GLB-2201",
    salary: "$50,000 - $70,000 USD/year (₹41-58 LPA)",
    workMode: "Worldwide Remote (India Eligible)",
    keyThemes: ["Cloud Management Dashboards", "Design Systems & Design Tokens", "Modern CSS Grid & Flexbox", "Cross-Browser Performance"],
    domainContext: "Acme Global Cloud builds enterprise cloud infrastructure management interfaces requiring sub-second data table interactions and robust design tokens.",
    questions: [
      {
        q: "How do you design scalable CSS architectures for enterprise cloud dashboards?",
        a: "I utilize CSS custom properties for global design tokens (colors, spacing, elevations) paired with scoped component stylesheets to prevent global namespace pollution. I leverage CSS Grid for macro-layouts and Flexbox for micro-alignments, ensuring predictable reflow.",
        evidence: "Engineered scalable design system components across Samsung SDS and Cisco partner interfaces."
      }
    ],
    starStory: {
      situation: "Enterprise cloud interface required dark/light theme switching with instant rendering and zero layout flashing.",
      task: "Implement CSS token system that transitions seamlessly without DOM rerendering overhead.",
      action: "Structured CSS custom properties on root container and mapped semantic color tokens across all child components.",
      result: "Instant sub-16ms theme transitions with zero style recalculation bottlenecks."
    },
    reverseQuestions: [
      "How does Acme Global Cloud handle real-time metric streams in its frontend interfaces?",
      "What design tools does the product design team use for token synchronization?"
    ]
  },
  {
    folder: "Mindrops_Digital_Studio_job-mock-008",
    company: "Mindrops Digital Studio",
    role: "Senior WordPress & Frontend Developer",
    reqId: "MND-DIG-3390",
    salary: "₹12,00,000 - ₹16,00,000 PA",
    workMode: "On-site (New Delhi)",
    keyThemes: ["Custom WordPress Theme Engineering", "Modern SCSS/JavaScript Integration", "Pixel-Perfect Client Delivery", "Core Web Vitals Optimization"],
    domainContext: "Mindrops builds high-touch custom web experiences for luxury and enterprise brands in New Delhi.",
    questions: [
      {
        q: "How do you bridge the gap between creative Figma designs and performant WordPress theme implementations?",
        a: "I build bespoke, lightweight custom themes rather than relying on bloated off-the-shelf page builders. I structure templates using semantic HTML5 and modular SCSS, enqueueing only the necessary scripts per template to ensure 95+ Google PageSpeed scores.",
        evidence: "Extensive background building high-speed responsive client sites with clean HTML/SCSS."
      }
    ],
    starStory: {
      situation: "Client website suffered from slow page loads due to legacy plugin overhead.",
      task: "Rebuild frontend templates to achieve sub-2-second load times.",
      action: "Audited render-blocking assets, rebuilt key components with vanilla JavaScript and SCSS, and optimized image delivery.",
      result: "Page load time reduced by 65%, achieving a 98 Mobile Google PageSpeed rating."
    },
    reverseQuestions: [
      "What types of creative agency projects are currently entering the studio pipeline?",
      "How is the agency leveraging headless architectures?"
    ]
  },
  {
    folder: "Cognitive_Web_Labs_job-mock-009",
    company: "Cognitive Web Labs",
    role: "Senior Frontend Engineer - AI Workflows",
    reqId: "CGN-WEB-5512",
    salary: "₹18,00,000 - ₹25,00,000 PA",
    workMode: "Hybrid (Delhi NCR)",
    keyThemes: ["AI Workflow UX & Streaming Text", "Real-Time UI State Management", "Interactive Data Visualizations", "Complex Form Systems"],
    domainContext: "Cognitive Web Labs builds generative AI tools and enterprise workflow automation interfaces.",
    questions: [
      {
        q: "How do you architect responsive UIs that handle streaming LLM token outputs smoothly?",
        a: "I utilize reactive streams (RxJS / WebSockets / SSE) with virtualized DOM windows or requestAnimationFrame batching. By isolating the streaming text container and preventing parent component rerenders, the interface remains smooth at 60 FPS even during rapid token generation.",
        evidence: "Deep expertise in Angular/RxJS reactive state pipelines and high-throughput enterprise event streams."
      }
    ],
    starStory: {
      situation: "AI platform chat UI was dropping frames when rendering complex markdown and code blocks during streaming responses.",
      task: "Optimize rendering pipeline to maintain 60 FPS scrolling and interaction.",
      action: "Implemented chunk-based markdown parsing with microtask debouncing and isolated syntax highlighting.",
      result: "Eliminated UI stuttering and achieved flawless rendering across desktop and mobile devices."
    },
    reverseQuestions: [
      "What AI backend models and streaming protocols is the team using in production?",
      "What are the upcoming frontend architectural priorities for the agent workflow product?"
    ]
  },
  {
    folder: "Tech_Mahindra_indeed-001",
    company: "Tech Mahindra",
    role: "Senior UI Engineer - Enterprise Angular Modernization",
    reqId: "TM-NOI-3381",
    salary: "₹18,00,000 - ₹26,00,000 PA",
    workMode: "Hybrid (Noida / Delhi NCR)",
    keyThemes: ["Enterprise Angular Modernization", "Component Modularization", "WCAG 2.1 AA Accessibility", "Automated UI Verification"],
    domainContext: "Tech Mahindra modernizes core IT systems for telecommunications and multinational enterprises.",
    questions: [
      {
        q: "How do you migrate complex legacy frontend applications to modern Angular without interrupting live business operations?",
        a: "I use an incremental microfrontends or hybrid module approach. By establishing a shared design system library first, legacy pages can adopt modernized components gradually behind feature flags while critical data pipelines remain untouched.",
        evidence: "Successfully modernized legacy portal components at Cisco BPA and Wondrfly Inc."
      }
    ],
    starStory: {
      situation: "Legacy enterprise portal required UI overhaul to meet new compliance mandates.",
      task: "Modernize styling and accessibility without breaking existing data integrations.",
      action: "Created an Angular Material wrapper layer with strict WCAG 2.1 compliance and rolled it out section by section.",
      result: "Achieved 100% compliance audit pass rate with zero unscheduled downtime."
    },
    reverseQuestions: [
      "What is Tech Mahindra's roadmap for enterprise design system standardization?",
      "How are client engineering teams structured across hybrid delivery hubs?"
    ]
  },
  {
    folder: "HCL_Technologies_naukri-003",
    company: "HCL Technologies",
    role: "Senior UI / Frontend Engineer - Enterprise Systems",
    reqId: "HCL-ENT-7704",
    salary: "₹16,00,000 - ₹24,00,000 PA",
    workMode: "Hybrid (Noida / Delhi NCR)",
    keyThemes: ["Large-Scale Enterprise Portals", "Angular Material UI", "High-Volume Data Grids", "Cross-Browser Compatibility"],
    domainContext: "HCL Technologies delivers enterprise software for Fortune 500 manufacturing, banking, and life sciences clients.",
    questions: [
      {
        q: "How do you optimize rendering performance in enterprise applications handling large, dense data tables?",
        a: "I utilize virtual scrolling (`cdk-virtual-scroll`), pagination, and column virtualization. I ensure pure change detection strategies (`ChangeDetectionStrategy.OnPush`) and decouple sorting/filtering computations to Web Workers or background observables.",
        evidence: "Optimized complex enterprise data tables at Samsung SDS and Cisco partner platforms."
      }
    ],
    starStory: {
      situation: "Enterprise inventory table with 5,000+ rows caused browser memory spikes and sluggish scrolling.",
      task: "Restore fluid interaction and reduce memory consumption.",
      action: "Rebuilt table using Angular CDK virtual scroll and OnPush change detection, recycling DOM nodes efficiently.",
      result: "Reduced DOM node count by 85% and restored smooth 60 FPS scrolling."
    },
    reverseQuestions: [
      "What enterprise framework versions are standard across HCL's core client portfolios?",
      "What opportunities exist for driving design system architecture?"
    ]
  },
  {
    folder: "Paytm_Payments_Bank_linkedin-003",
    company: "Paytm Payments Bank",
    role: "Senior UI Developer (Design Systems & Microfrontends)",
    reqId: "PTM-NOI-8810",
    salary: "₹20,00,000 - ₹30,00,000 PA",
    workMode: "Hybrid (Noida)",
    keyThemes: ["Fintech UI Performance", "Microfrontend Architectures", "High-Security Form Flows", "Strict Input Sanitization"],
    domainContext: "Paytm Payments Bank operates high-scale consumer and merchant financial platforms where transaction speed, security, and zero UI latency are critical.",
    questions: [
      {
        q: "In high-throughput fintech applications, how do you prevent race conditions and duplicate submissions in user transaction forms?",
        a: "I implement strict button state management with idempotency keys, disable duplicate submissions via debounced submission handlers, and use optimistic UI indicators backed by clear rollback handlers if backend verification fails.",
        evidence: "Delivered secure form workflows and input validation across financial and enterprise portals."
      }
    ],
    starStory: {
      situation: "High-volume payment flow occasionally registered double-click submissions on slow mobile connections.",
      task: "Eliminate duplicate transactions through robust client-side validation.",
      action: "Engineered a reusable transaction button directive that enforces single-flight locking and generates unique client session UUIDs.",
      result: "Duplicate submission events dropped to zero across hundreds of thousands of daily sessions."
    },
    reverseQuestions: [
      "How is Paytm evolving its microfrontend runtime orchestration?",
      "What design system governance practices are in place across merchant and consumer web teams?"
    ]
  }
];

// HTML Template Builder for Standalone Battle-Cards
function generateBattleCardHtml(card) {
  const c = candidate;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Battle-Card — ${card.role} at ${card.company}</title>
  <style>
    @page { size: A4; margin: 12mm 14mm 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.45;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
    }
    .no-print {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25);
    }
    .container { max-width: 900px; margin: 24px auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px 30px; }
    .header-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; font-weight: 700; }
    .header h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
    .header-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #cbd5e1; margin-top: 8px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .content { padding: 28px 30px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 12px; }
    .box-blue { border-left: 4px solid #2563eb; }
    .box-emerald { border-left: 4px solid #10b981; }
    .box-amber { border-left: 4px solid #f59e0b; }
    .box-purple { border-left: 4px solid #8b5cf6; }
    .q-title { font-weight: 700; color: #0f172a; font-size: 13.5px; margin-bottom: 6px; display: flex; align-items: baseline; gap: 6px; }
    .q-num { background: #2563eb; color: #ffffff; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; }
    .q-answer { color: #334155; margin-bottom: 6px; font-size: 12.8px; line-height: 1.5; }
    .q-evidence { font-size: 11.5px; color: #047857; font-weight: 600; background: #ecfdf5; padding: 4px 8px; border-radius: 4px; display: inline-block; }
    .pill-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .pill { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
    .star-grid { display: grid; grid-template-columns: 80px 1fr; gap: 6px 12px; font-size: 12.5px; }
    .star-lbl { font-weight: 700; color: #1e40af; text-transform: uppercase; font-size: 11px; }
    ul.checklist { list-style: none; padding-left: 0; }
    ul.checklist li { margin-bottom: 6px; padding-left: 20px; position: relative; color: #334155; }
    ul.checklist li::before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: 800; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>

  <!-- Top Sticky Bar for Web/Tab Viewing (Hidden on Print) -->
  <div class="no-print">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 800; font-size: 14px;">🎯 INTERVIEW BATTLE-CARD</span>
      <span style="color: #64748b;">•</span>
      <span style="color: #60a5fa; font-weight: 600;">${card.company}</span>
      <span style="color: #94a3b8; font-size: 12px;">(${card.role})</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button onclick="window.print()" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 5px;">
        <span>🖨️</span> Print / Save PDF
      </button>
      <button onclick="window.close()" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="container">
    <div class="header">
      <div class="header-sub">Ashutosh Kumar • Senior Frontend Engineering Technical Prep Sheet</div>
      <h1>${card.role}</h1>
      <div style="font-size: 16px; font-weight: 700; color: #60a5fa; margin-top: 2px;">${card.company}</div>
      <div class="header-meta">
        <span class="badge">Req #${card.reqId}</span>
        <span>💼 ${card.workMode}</span>
        <span>💰 ${card.salary}</span>
        <span>👤 Candidate: Ashutosh Kumar (8+ Yrs Exp)</span>
      </div>
    </div>

    <div class="content">
      <!-- Domain Context & Strategic Overview -->
      <div class="section">
        <div class="section-title">🏢 1. Company & Product Engineering Context</div>
        <div class="box box-blue">
          <p style="color: #334155; font-size: 13px;">${card.domainContext}</p>
          <div style="margin-top: 10px;">
            <strong style="font-size: 11px; text-transform: uppercase; color: #1e40af; letter-spacing: 0.5px;">Core Competency Focus for this Role:</strong>
            <div class="pill-list">
              ${card.keyThemes.map(t => `<span class="pill">⚡ ${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- High-Yield Technical Deep-Dive Q&A -->
      <div class="section">
        <div class="section-title">🧠 2. High-Yield Technical Interview Questions & Answers</div>
        <div style="space-y: 12px;">
          ${card.questions.map((q, idx) => `
            <div class="box box-purple">
              <div class="q-title">
                <span class="q-num">Q${idx + 1}</span>
                <span>${q.q}</span>
              </div>
              <p class="q-answer">${q.a}</p>
              <div>
                <span class="q-evidence">🎯 Proof Anchor: ${q.evidence}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Core STAR Behavioral & Impact Story -->
      <div class="section">
        <div class="section-title">🏆 3. Primary STAR Impact Story (Memorize for this Round)</div>
        <div class="box box-emerald">
          <div class="star-grid">
            <div class="star-lbl">Situation</div>
            <div>${card.starStory.situation}</div>
            <div class="star-lbl">Task</div>
            <div>${card.starStory.task}</div>
            <div class="star-lbl">Action</div>
            <div>${card.starStory.action}</div>
            <div class="star-lbl">Result</div>
            <div style="font-weight: 700; color: #047857;">${card.starStory.result}</div>
          </div>
        </div>
      </div>

      <!-- Ashutosh's Universal Technical Anchors -->
      <div class="section">
        <div class="section-title">🛡️ 4. Ashutosh's Universal Technical Weaponry</div>
        <div class="box box-amber">
          <ul class="checklist">
            <li><strong>Samsung SDS Track Record:</strong> Evaluated at 97/100 performance rating for exceptional UI fidelity and on-time enterprise platform delivery.</li>
            <li><strong>Cisco BPA & SD-WAN Experience:</strong> Engineered mission-critical automation forms and router management views at Infinity Labs.</li>
            <li><strong>Wondrfly Playwright Innovation:</strong> Conceptualized impact-aware test validation connecting Git change diffs to targeted Playwright test runs, avoiding bloated CI cycles.</li>
            <li><strong>Design Tokens & SCSS Architecture:</strong> Pure CSS custom properties and Sass modules without breaking <code>::ng-deep</code> hacks.</li>
            <li><strong>WCAG 2.1 AA Compliance:</strong> Native semantic HTML, focus trap management, ARIA live regions, and automated axe-core verification.</li>
          </ul>
        </div>
      </div>

      <!-- Strategic Reverse Questions -->
      <div class="section">
        <div class="section-title">❓ 5. Reverse Questions to Ask the Hiring Team</div>
        <div class="box">
          <p style="font-size: 11.5px; color: #64748b; margin-bottom: 8px;">Asking high-level architectural questions proves senior technical maturity and proactive ownership:</p>
          <ul class="checklist">
            ${card.reverseQuestions.map(rq => `<li>${rq}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      Ashutosh Kumar AI Career Engine • Interview Battle-Card Confidential<br>
      Candidate Email: ${c.email} | Contact: ${c.phone} | New Delhi, India
    </div>
  </div>
</body>
</html>`;
}

// Markdown Builder for Battle-Cards
function generateBattleCardMarkdown(card) {
  const c = candidate;

  return `# Interview Battle-Card & Technical Cheat-Sheet
## ${card.role} — ${card.company}
**Req ID:** ${card.reqId} | **Salary:** ${card.salary} | **Work Mode:** ${card.workMode}  
**Candidate:** ${c.name} (${c.experience} Experience) | **Email:** ${c.email} | **Phone:** ${c.phone}

---

### 1. Company & Engineering Domain Context
${card.domainContext}

**Core Competency Focus:**
${card.keyThemes.map(t => `- **${t}**`).join('\n')}

---

### 2. High-Yield Technical Deep-Dive Questions & Answers

${card.questions.map((q, idx) => `
#### Q${idx + 1}: ${q.q}
**Answer Approach:**  
${q.a}

> **Proof Anchor:** ${q.evidence}
`).join('\n')}

---

### 3. Primary STAR Impact Story
* **Situation:** ${card.starStory.situation}
* **Task:** ${card.starStory.task}
* **Action:** ${card.starStory.action}
* **Result:** **${card.starStory.result}**

---

### 4. Ashutosh's Core Technical Anchors
* **Samsung SDS Recognition:** Awarded 97/100 performance evaluation for zero-defect enterprise publishing.
* **Cisco Platform Expertise:** Developed complex form validations for Cisco Business Process Automation and SD-WAN UI interfaces.
* **Wondrfly Playwright Innovation:** Conceptualized impact-based test execution workflow connecting Git diffs to targeted test specs.
* **Design Systems:** Token-based SCSS architecture mapped cleanly to Figma auto-layout and component variants.
* **Accessibility:** WCAG 2.1 AA compliant semantic hierarchies, keyboard focus management, and ARIA landmarks.

---

### 5. Reverse Questions to Ask the Interviewer
${card.reverseQuestions.map((rq, idx) => `${idx + 1}. *${rq}*`).join('\n')}
`;
}

// Main Generator Execution
export function generateAllBattleCards() {
  console.log('Generating Interview Battle-Cards for all target openings...');
  
  const baseCardsDir = path.resolve('data/interview-battlecards');
  if (!fs.existsSync(baseCardsDir)) fs.mkdirSync(baseCardsDir, { recursive: true });

  const tailoredBaseDir = path.resolve('data/tailored-documents');

  let count = 0;
  for (const card of battleCardsConfig) {
    const htmlContent = generateBattleCardHtml(card);
    const mdContent = generateBattleCardMarkdown(card);

    // Write to data/interview-battlecards/<folder>/
    const cardFolder = path.join(baseCardsDir, card.folder);
    if (!fs.existsSync(cardFolder)) fs.mkdirSync(cardFolder, { recursive: true });
    fs.writeFileSync(path.join(cardFolder, 'Interview_Battle_Card.html'), htmlContent, 'utf8');
    fs.writeFileSync(path.join(cardFolder, 'Interview_Battle_Card.md'), mdContent, 'utf8');

    // Also write into data/tailored-documents/<folder>/
    const tailoredFolder = path.join(tailoredBaseDir, card.folder);
    if (fs.existsSync(tailoredFolder)) {
      fs.writeFileSync(path.join(tailoredFolder, 'Interview_Battle_Card.html'), htmlContent, 'utf8');
      fs.writeFileSync(path.join(tailoredFolder, 'Interview_Battle_Card.md'), mdContent, 'utf8');
    }

    count++;
    console.log(`✓ [Battle-Card] ${card.company} (${card.role})`);
  }

  // Create an index.json file of all battle-cards for dashboard API consumption
  const indexData = battleCardsConfig.map(c => ({
    folder: c.folder,
    company: c.company,
    role: c.role,
    reqId: c.reqId,
    salary: c.salary,
    workMode: c.workMode,
    keyThemes: c.keyThemes,
    htmlPath: `/data/interview-battlecards/${c.folder}/Interview_Battle_Card.html`,
    mdPath: `/data/interview-battlecards/${c.folder}/Interview_Battle_Card.md`
  }));

  fs.writeFileSync(path.join(baseCardsDir, 'battlecards-index.json'), JSON.stringify(indexData, null, 2), 'utf8');
  console.log(`Successfully generated ${count} Interview Battle-Cards and indexed in battlecards-index.json!`);
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('generate-battlecards.js')) {
  generateAllBattleCards();
}
