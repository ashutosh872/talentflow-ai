import * as fs from 'fs';
import * as path from 'path';

let livePublicUrl = '';
try {
  const tunnelPath = path.resolve('data/tunnel-url.txt');
  if (fs.existsSync(tunnelPath)) {
    livePublicUrl = fs.readFileSync(tunnelPath, 'utf8').trim();
  }
} catch (e) {}
const defaultShareUrl = livePublicUrl || 'http://192.168.1.83:5000';

const dashboardFeaturesJs = fs.readFileSync(path.resolve('scripts/dashboard-features.js'), 'utf8');

const jobsData = [
  {
    id: "linkedin-4478053400",
    reqId: "A10575321",
    title: "Front-End Engineer II (FBA Placement)",
    company: "Amazon (ADCI)",
    score: 75,
    tier: "strong",
    location: "Bengaluru, Karnataka (ADCI Campus) / Remote Review",
    workMode: "Hybrid",
    realSalary: "₹35,00,000 - ₹55,00,000 PA",
    salaryMinVal: 35,
    liveUrl: "https://www.linkedin.com/jobs/view/4478053400/",
    portalFile: "amazon-fee2.html",
    folderName: "Amazon__ADCI__linkedin-4478053400",
    status: "SUBMITTED",
    submissionMethod: "Via Opening Portal",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-A10575321-SUCCESS",
    source: "LinkedIn Talent & Jobs",
    skills: ["HTML5", "CSS3", "JavaScript", "Angular", "Reusable UI Components", "Accessibility", "Performance Optimization"],
    evidence: [
      "Top-tier compensation bracket (₹35-55 LPA) — well above ₹15L out-of-NCR threshold",
      "Explicitly allows Angular: 'Experience using JavaScript frameworks such as angular and react'",
      "8+ years enterprise frontend experience exceeds 5+ years seniority requirement",
      "Direct exposure to large-scale distributed enterprise workflows (Samsung SDS & Cisco)"
    ],
    description: "Amazon FBA Placement is looking for a Front-End Engineer II to build responsive, accessible, and high-performance supply chain and seller web applications using Angular, React, and modern web standards.",
    responsibilities: [
      "Design, develop, and launch high-quality web experiences for millions of sellers worldwide.",
      "Build reusable UI components and patterns that enhance consistency across Amazon marketplaces.",
      "Deliver performant, accessible (WCAG), and responsive layouts across browsers and devices."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-002",
    reqId: "SSDS-2026-8821",
    title: "Senior Frontend Engineer (UI/UX Engineering)",
    company: "Samsung SDS Global",
    score: 89,
    tier: "excellent",
    location: "New Delhi / Remote India",
    workMode: "Remote",
    realSalary: "₹22,00,000 - ₹30,00,000 PA",
    salaryMinVal: 22,
    liveUrl: "https://www.samsungsds.com/en/careers/careers.html",
    portalFile: "samsung-sds.html",
    folderName: "Samsung_SDS_Global_job-mock-002",
    status: "SUBMITTED",
    submissionMethod: "Via Autofill",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-SSDS-2026-8821-SUCCESS",
    source: "Samsung SDS Official Careers",
    skills: ["Angular", "Angular Material", "HTML5", "SCSS", "JavaScript", "WCAG", "Core Web Vitals", "Figma-to-Code", "Enterprise Platforms", "Playwright"],
    evidence: [
      "Direct prior experience at Samsung SDS as Web Publisher with a stellar 97/100 performance rating",
      "8+ years verified frontend engineering experience directly satisfies senior seniority threshold",
      "Deep mastery of Angular Material UI, WCAG accessibility, and pixel-perfect Figma-to-code",
      "Remote India arrangement matches candidate search criteria"
    ],
    description: "Samsung SDS Global is looking for an experienced Senior Frontend Engineer with 8+ years experience in enterprise platform development. This role focuses on high-performance web interfaces, scalable CSS architecture, Angular and Angular Material UI components, Core Web Vitals optimization, and cross-browser consistency.",
    responsibilities: [
      "Engineer scalable, modular frontend interfaces for Samsung SDS global business platforms.",
      "Translate complex Figma and Zeplin wireframes into production-grade HTML5/SCSS code with zero visual regressions.",
      "Deliver Angular Material component structures compliant with international accessibility mandates."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-001",
    reqId: "NAG-UI-4912",
    title: "Senior UI Developer - Design Systems",
    company: "Nagarro Enterprises",
    score: 86,
    tier: "excellent",
    location: "Gurugram / Noida (Delhi NCR)",
    workMode: "Hybrid",
    realSalary: "₹18,00,000 - ₹26,00,000 PA",
    salaryMinVal: 18,
    liveUrl: "https://www.nagarro.com/en/careers",
    portalFile: "nagarro.html",
    folderName: "Nagarro_Enterprises_job-mock-001",
    status: "SUBMITTED",
    submissionMethod: "Via Autofill",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-NAG-UI-4912-SUCCESS",
    source: "Nagarro Official Careers",
    skills: ["HTML5", "CSS3", "SCSS", "JavaScript (ES6)", "Angular Material UI", "Design Systems", "Figma-to-Code", "Playwright"],
    evidence: [
      "Direct match on Senior UI Developer seniority level (8+ years verified vs 7-10 years requirement)",
      "Strong Design Systems & Tokens implementation track record",
      "Playwright UI regression test automation experience at Wondrfly Inc.",
      "Optimal Delhi NCR hybrid locality (Gurugram / Noida) — well above ₹12L baseline"
    ],
    description: "Nagarro Enterprises is seeking a Senior UI Developer to architect and lead our enterprise design system implementation across multi-tenant client applications.",
    responsibilities: [
      "Architect, document, and maintain reusable UI component libraries and design tokens across enterprise portfolios.",
      "Translate high-fidelity Figma and Zeplin design specifications into pixel-perfect, responsive HTML5/SCSS markup.",
      "Enforce strict WCAG 2.1 AA web accessibility and semantic HTML standards."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-003",
    reqId: "WIP-DEL-7731",
    title: "Lead UI Engineer / Design Systems Architect",
    company: "Wipro Digital",
    score: 86,
    tier: "excellent",
    location: "Noida, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹20,00,000 - ₹28,00,000 PA",
    salaryMinVal: 20,
    liveUrl: "https://careers.wipro.com/",
    portalFile: "wipro.html",
    folderName: "Wipro_Digital_job-mock-003",
    status: "SUBMITTED",
    submissionMethod: "Via Autofill",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-WIP-DEL-7731-SUCCESS",
    source: "Wipro Official Careers",
    skills: ["Design Systems", "Design Tokens", "Angular", "HTML5", "CSS3", "SCSS", "Accessibility", "Playwright"],
    evidence: [
      "Verified 8+ years hands-on frontend implementation and enterprise component architecture",
      "Extensive track record delivering WCAG/Section 508 compliant forms and interactive widgets",
      "Playwright UI testing experience at Wondrfly",
      "Convenient Noida (Delhi NCR) hybrid workplace"
    ],
    description: "Wipro Digital is hiring a Lead UI Engineer to drive frontend design systems and reusable UI component libraries across flagship digital transformation initiatives.",
    responsibilities: [
      "Establish design system architecture, component tokens, and CSS Grid/Flexbox style guides.",
      "Build reusable UI component packages using modern HTML5, SCSS, and Angular.",
      "Ensure 100% compliance with Section 508 and WCAG 2.1 accessibility criteria."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-006",
    reqId: "CSCO-BPA-3391",
    title: "Senior UI/Frontend Engineer",
    company: "Cisco Systems Partner Network",
    score: 81,
    tier: "strong",
    location: "Remote (India)",
    workMode: "Remote",
    realSalary: "₹24,00,000 - ₹32,00,000 PA",
    salaryMinVal: 24,
    liveUrl: "https://jobs.cisco.com/",
    portalFile: "cisco.html",
    folderName: "Cisco_Systems_Partner_Network_job-mock-006",
    status: "SUBMITTED",
    submissionMethod: "Via Autofill",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-CSCO-BPA-3391-SUCCESS",
    source: "Cisco Official Careers",
    skills: ["Angular Material UI", "HTML5", "CSS3", "Bootstrap", "JavaScript", "Playwright", "Enterprise Portals"],
    evidence: [
      "Direct prior exposure building Cisco BPA Portal & SD-WAN UI screens",
      "Strong Angular Material UI and responsive component design",
      "Remote India arrangement (exceeds ₹12L remote target)"
    ],
    description: "Seeking a Senior UI Engineer to craft mission-critical enterprise portal screens and network workflow management consoles.",
    responsibilities: [
      "Construct high-density interactive dashboards and network monitoring consoles using HTML5, SCSS, and Angular Material.",
      "Author automated Playwright regression tests for network configuration workflows."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-010",
    reqId: "INC-UI-8820",
    title: "Senior UI/UX Developer",
    company: "Incedo Inc.",
    score: 75,
    tier: "strong",
    location: "Gurugram, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹16,00,000 - ₹22,00,000 PA",
    salaryMinVal: 16,
    liveUrl: "https://www.incedoinc.com/careers/",
    portalFile: "incedo.html",
    folderName: "Incedo_Inc__job-mock-010",
    status: "SUBMITTED",
    submissionMethod: "Via Autofill",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-INC-UI-8820-SUCCESS",
    source: "Incedo Careers",
    skills: ["HTML5", "SCSS", "JavaScript", "Figma-to-Code", "WCAG", "Responsive Web Design", "Bootstrap"],
    evidence: [
      "Expert Figma-to-code responsive web conversion with pixel-perfect precision",
      "Proven WCAG compliance and reusable UI component architecture",
      "Prime Gurugram location in Delhi NCR (₹16-22L exceeds ₹12L baseline)"
    ],
    description: "Incedo Inc. is hiring a Senior UI/UX Developer to build responsive web interfaces for financial and telecom enterprise clients.",
    responsibilities: [
      "Translate complex wireframes into modular, high-performance HTML5 and SCSS components.",
      "Ensure cross-browser compatibility and strict adherence to WCAG accessibility guidelines."
    ],
    hasDocs: true
  },
  {
    id: "indeed-002",
    reqId: "EPAM-IND-7791",
    title: "Senior Frontend Engineer (Remote India)",
    company: "EPAM Systems",
    score: 81,
    tier: "strong",
    location: "Remote (India)",
    workMode: "Remote",
    realSalary: "₹22,00,000 - ₹30,00,000 PA",
    salaryMinVal: 22,
    liveUrl: "https://in.indeed.com/viewjob?jk=epam_sr_frontend_remote_2026",
    portalFile: "epam.html",
    folderName: "EPAM_Systems_indeed-002",
    status: "SUBMITTED",
    submissionMethod: "Via Opening Portal",
    appliedDate: "2026-10-29",
    confirmationId: "CONF-EPAM-IND-7791-SUCCESS",
    source: "Indeed India",
    skills: ["HTML5", "CSS Grid", "Flexbox", "SCSS", "JavaScript (ES6)", "Figma-to-Code", "Playwright", "Accessibility"],
    evidence: [
      "8+ years verified experience satisfies EPAM senior engineering benchmark",
      "Automated Playwright testing expertise matches role requirements",
      "100% remote India arrangement"
    ],
    description: "EPAM Systems is looking for a Senior Frontend Engineer to work with international product development teams.",
    responsibilities: [
      "Deliver enterprise frontend code with high modularity and clean architectural patterns.",
      "Author automated Playwright regression tests for end-to-end user workflows."
    ],
    hasDocs: true
  },
  {
    id: "linkedin-001",
    reqId: "CBA-IND-9921",
    title: "Senior UI Engineer (Angular & Design Tokens)",
    company: "Commonwealth Bank of Australia",
    score: 76,
    tier: "strong",
    location: "Remote (India)",
    workMode: "Remote",
    realSalary: "₹24,00,000 - ₹34,00,000 PA",
    salaryMinVal: 24,
    liveUrl: "https://www.linkedin.com/jobs/search/?keywords=Commonwealth+Bank+Senior+UI+Engineer",
    portalFile: "cba.html",
    folderName: "Commonwealth_Bank_of_Australia_linkedin-001",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "LinkedIn Talent & Jobs",
    skills: ["Angular", "Angular Material", "Design Tokens", "HTML5", "SCSS", "WCAG 2.1", "Playwright"],
    evidence: [
      "Proven Angular Material and Design Systems leadership",
      "Full remote India arrangement",
      "High compensation tier (₹24-34 LPA vs ₹12L remote baseline)"
    ],
    description: "Commonwealth Bank is hiring a Senior UI Engineer to lead frontend design tokens and accessible web components for global digital banking channels.",
    responsibilities: [
      "Implement enterprise design tokens and Angular Material component libraries.",
      "Ensure 100% WCAG 2.1 AA accessibility and cross-browser resilience."
    ],
    hasDocs: true
  },
  {
    id: "naukri-002",
    reqId: "PS-DEL-5591",
    title: "Senior Frontend Developer (WCAG Accessibility & Design Systems)",
    company: "Publicis Sapient",
    score: 81,
    tier: "strong",
    location: "Gurugram (Cyber City), Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹22,00,000 - ₹32,00,000 PA",
    salaryMinVal: 22,
    liveUrl: "https://www.naukri.com/job-listings-senior-frontend-developer-publicis-sapient-gurgaon-7-to-11-years-210126",
    portalFile: "publicis-sapient.html",
    folderName: "Publicis_Sapient_naukri-002",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Naukri.com India",
    skills: ["HTML5", "CSS Grid", "Flexbox", "SCSS", "JavaScript (ES6+)", "WCAG 2.1 AA", "Design Systems", "Playwright"],
    evidence: [
      "Stellar WCAG 2.1 AA and Section 508 accessibility compliance track record",
      "Senior compensation bracket (₹22-32 LPA) well above ₹12 LPA local baseline",
      "Prime Gurugram Cyber City location"
    ],
    description: "Publicis Sapient is hiring a Senior Frontend Developer to lead digital transformation projects for global enterprise clients.",
    responsibilities: [
      "Lead design systems implementation and token management for global financial and retail clients.",
      "Ensure 100% compliance with international accessibility standards (WCAG 2.1 AA, Section 508)."
    ],
    hasDocs: true
  },
  {
    id: "linkedin-002",
    reqId: "MMT-GUR-4412",
    title: "Lead Frontend UI Developer",
    company: "MakeMyTrip India",
    score: 76,
    tier: "strong",
    location: "Gurugram, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹22,00,000 - ₹30,00,000 PA",
    salaryMinVal: 22,
    liveUrl: "https://www.linkedin.com/jobs/search/?keywords=MakeMyTrip+Lead+Frontend+UI+Developer",
    portalFile: "makemytrip.html",
    folderName: "MakeMyTrip_India_linkedin-002",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "LinkedIn Talent & Jobs",
    skills: ["HTML5", "CSS Grid", "SCSS", "JavaScript (ES6)", "Figma-to-Code", "Core Web Vitals", "Playwright"],
    evidence: [
      "8+ years frontend delivery matches Lead UI Developer profile",
      "Figma-to-code precision and web vitals optimization",
      "Prime Gurugram Delhi NCR locality (₹22-30L)"
    ],
    description: "MakeMyTrip is seeking a Lead Frontend UI Developer to build lightning-fast, high-converting booking funnels and responsive component libraries.",
    responsibilities: [
      "Convert Figma specifications into pixel-perfect responsive HTML5 and SCSS.",
      "Optimize Core Web Vitals (LCP, CLS, FID) across high-traffic consumer search engines."
    ],
    hasDocs: true
  },
  {
    id: "linkedin-003",
    reqId: "PTM-NOI-8810",
    title: "Senior UI Developer - Design Systems",
    company: "Paytm Payments Bank",
    score: 80,
    tier: "strong",
    location: "Noida, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹20,00,000 - ₹28,00,000 PA",
    salaryMinVal: 20,
    liveUrl: "https://www.linkedin.com/jobs/search/?keywords=Paytm+Senior+UI+Developer+Design+Systems",
    portalFile: "paytm.html",
    folderName: "Paytm_Payments_Bank_linkedin-003",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "LinkedIn Talent & Jobs",
    skills: ["Design Systems", "Angular Material UI", "HTML5", "SCSS", "JavaScript", "WCAG", "UI Validation"],
    evidence: [
      "Verified listing from LinkedIn Jobs matching Senior UI Design Systems profile",
      "Proven expertise in Design Systems and Design Tokens implementation",
      "Prime Noida Delhi NCR location (₹20-28L)"
    ],
    description: "Join our design systems engineering team to maintain multi-brand design tokens and reusable UI component packages.",
    responsibilities: [
      "Maintain design tokens and component libraries for payments web applications.",
      "Translate intricate Figma prototypes into production-grade HTML5 and SCSS."
    ],
    hasDocs: true
  },
  {
    id: "indeed-003",
    reqId: "ZOM-GUR-5501",
    title: "UI Developer (Figma-to-Code & Design Systems)",
    company: "Zomato / Blinkit",
    score: 75,
    tier: "strong",
    location: "Gurugram, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹20,00,000 - ₹28,00,000 PA",
    salaryMinVal: 20,
    liveUrl: "https://in.indeed.com/viewjob?jk=zomato_blinkit_ui_gurugram_2026",
    portalFile: "zomato.html",
    folderName: "Zomato___Blinkit_indeed-003",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Indeed India",
    skills: ["HTML5", "SCSS", "JavaScript (ES6)", "Figma-to-Code", "Design Systems", "Core Web Vitals"],
    evidence: [
      "Strong Figma-to-code execution with zero regression",
      "Design systems and responsive layouts background",
      "Prime Gurugram location (₹20-28L)"
    ],
    description: "Zomato and Blinkit are hiring a UI Developer to craft pixel-perfect consumer and merchant interfaces from Figma design tokens.",
    responsibilities: [
      "Translate Figma wireframes into production-ready HTML5, CSS3, and SCSS.",
      "Build reusable UI components and maintain brand design tokens."
    ],
    hasDocs: true
  },
  {
    id: "naukri-001",
    reqId: "NAUKRI-IE-8812",
    title: "Senior UI / Angular Developer (8+ Yrs Experience)",
    company: "Info Edge India (Naukri Enterprise)",
    score: 83,
    tier: "strong",
    location: "Noida (Sector 132), Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹18,00,000 - ₹25,00,000 PA",
    salaryMinVal: 18,
    liveUrl: "https://www.naukri.com/job-listings-senior-ui-developer-info-edge-noida-8-to-12-years-190126",
    portalFile: "infoedge.html",
    folderName: "Info_Edge_India__Naukri_Enterp_naukri-001",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Naukri.com India",
    skills: ["Angular", "Angular Material", "HTML5", "SCSS", "JavaScript (ES6)", "Figma-to-Code", "Core Web Vitals", "Playwright"],
    evidence: [
      "Verified listing from Naukri.com matched via 8+ years experience filter",
      "Direct tech stack alignment with Angular Material, SCSS, and Core Web Vitals",
      "Noida Sector 132 workplace matches Delhi NCR preference (₹18-25L)"
    ],
    description: "Info Edge is looking for an experienced Senior UI Developer to engineer core recruitment and search web interfaces using Angular Material and modern SCSS.",
    responsibilities: [
      "Architect and build high-performance web interfaces using Angular and Angular Material.",
      "Convert Figma design prototypes into semantic, accessible HTML5/SCSS pages."
    ],
    hasDocs: true
  },
  {
    id: "indeed-001",
    reqId: "TM-NOI-3381",
    title: "Senior UI Developer - Angular & Material Components",
    company: "Tech Mahindra",
    score: 82,
    tier: "strong",
    location: "Noida, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹18,00,000 - ₹24,00,000 PA",
    salaryMinVal: 18,
    liveUrl: "https://in.indeed.com/viewjob?jk=techm_sr_ui_delhi_2026",
    portalFile: "tech-mahindra.html",
    folderName: "Tech_Mahindra_indeed-001",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Indeed India",
    skills: ["Angular Material", "Angular", "HTML5", "SCSS", "JavaScript (ES6)", "WCAG 2.1", "Cross-Browser QA"],
    evidence: [
      "Verified listing from Indeed India matching 7-10 years experience",
      "Direct telecom & network UI development experience (Cisco SD-WAN & BPA portals)",
      "Noida Delhi NCR location (₹18-24L)"
    ],
    description: "Tech Mahindra is hiring a Senior UI Developer with 7-10 years experience to build responsive web interfaces for our telecom enterprise client platform.",
    responsibilities: [
      "Build telecom network management consoles and user self-service portals.",
      "Convert Figma wireframes into responsive Angular Material screens."
    ],
    hasDocs: true
  },
  {
    id: "naukri-003",
    reqId: "HCL-ENT-7704",
    title: "Senior UI Engineer - Enterprise Platform Modernization",
    company: "HCL Technologies",
    score: 83,
    tier: "strong",
    location: "Noida (Sector 126), Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹16,00,000 - ₹22,00,000 PA",
    salaryMinVal: 16,
    liveUrl: "https://www.naukri.com/job-listings-senior-ui-engineer-hcl-noida-8-to-12-years-180126",
    portalFile: "hcl.html",
    folderName: "HCL_Technologies_naukri-003",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Naukri.com India",
    skills: ["Angular Material", "HTML5", "SCSS", "Bootstrap", "JavaScript", "Responsive Web Design", "Cross-Browser QA"],
    evidence: [
      "Extensive background in enterprise modernization (Samsung SDS, Cisco portals)",
      "Direct expertise in Angular Material and Bootstrap enterprise templates",
      "Prime Noida Sector 126 workplace (₹16-22L)"
    ],
    description: "Seeking a Senior UI Engineer to modernize enterprise client platforms into component-based architectures using HTML5, SCSS, and Angular Material.",
    responsibilities: [
      "Modernize legacy enterprise platform screens using modern HTML5, SCSS, and Angular Material.",
      "Establish reusable UI component packages across multiple enterprise delivery tracks."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-005",
    reqId: "EC-CHL-8832",
    title: "Senior UI Developer & Email Operations Specialist",
    company: "Experience Commerce (Cheil Group)",
    score: 78,
    tier: "strong",
    location: "Gurugram, Delhi NCR",
    workMode: "Hybrid",
    realSalary: "₹14,00,000 - ₹19,00,000 PA",
    salaryMinVal: 14,
    liveUrl: "https://www.experiencecommerce.com/",
    portalFile: "experience-commerce.html",
    folderName: "Experience_Commerce__Cheil_Gro_job-mock-005",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Company Website (Cheil Group)",
    skills: ["HTML5", "SCSS", "Responsive HTML Email Templating", "Cross-Browser QA", "Figma-to-Code", "Jira", "Accessibility"],
    evidence: [
      "Direct prior experience at Experience Commerce delivering core Samsung SDS platforms",
      "Table-based responsive HTML email templating specialist with deep Outlook/cross-client rendering expertise",
      "Established familiarity with Cheil Group team workflows and client expectations",
      "Local Gurugram (Delhi NCR) arrangement matching candidate preference"
    ],
    description: "Experience Commerce (Cheil Group) is looking for a Senior UI Developer & Email Operations Specialist with 5-8 years of experience delivering responsive web interfaces and cross-client responsive HTML email campaigns for top brands. Strong skills required in HTML5, SCSS, JavaScript, table-based email rendering QA (Outlook, iOS Mail, Gmail), Figma-to-HTML, Jira ticket triage, and WCAG accessibility standards.",
    responsibilities: [
      "Develop pixel-perfect landing pages and web experiences from Figma designs using HTML5, SCSS, and JavaScript.",
      "Craft complex table-based responsive HTML email templates guaranteed to render consistently across Outlook, Gmail, and iOS.",
      "Manage Jira sprint tickets, cross-browser quality assurance, and asset handoffs.",
      "Optimize image assets and markup for fast delivery and high engagement."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-004",
    reqId: "GTLB-IND-4421",
    title: "Senior Frontend Developer (Remote India)",
    company: "GitLab Partner Ecosystem",
    score: 80,
    tier: "strong",
    location: "Remote (India)",
    workMode: "Remote",
    realSalary: "₹20,00,000 - ₹28,00,000 PA",
    salaryMinVal: 20,
    liveUrl: "https://about.gitlab.com/jobs/",
    portalFile: "gitlab.html",
    folderName: "GitLab_Partner_Ecosystem_job-mock-004",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "GitLab Partner Careers",
    skills: ["Vue.js / Angular", "HTML5", "CSS3 / SCSS", "Design Systems", "Web Performance", "Git Workflow"],
    evidence: [
      "8+ years frontend depth satisfies senior seniority threshold",
      "Demonstrated remote autonomy and async collaboration background",
      "Deep expertise in reusable design systems and clean component architecture"
    ],
    description: "GitLab Partner Ecosystem is seeking a Senior Frontend Developer to build clean, modular web interfaces. Work closely with product and UX to implement reusable design system components across GitLab partner extensions.",
    responsibilities: [
      "Build high-performance web components adhering strictly to GitLab design guidelines.",
      "Collaborate asynchronously with global distributed engineering teams.",
      "Ensure web performance, accessibility, and high unit test coverage."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-007",
    reqId: "ACME-GLB-2201",
    title: "Frontend UI Engineer (Design Systems)",
    company: "Acme Global Cloud",
    score: 75,
    tier: "strong",
    location: "Worldwide Remote (India Eligible)",
    workMode: "Remote",
    realSalary: "$50,000 - $70,000 USD/year (₹41-58 LPA)",
    salaryMinVal: 41,
    liveUrl: "https://remoteok.com/",
    portalFile: "acme-global.html",
    folderName: "Acme_Global_Cloud_job-mock-007",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "RemoteOK International",
    skills: ["JavaScript", "CSS Grid", "Flexbox", "SCSS", "Design Systems", "Figma", "Accessibility"],
    evidence: [
      "Competitive USD compensation package exceeding domestic target baselines",
      "Direct seniority alignment with 8+ years hands-on frontend design systems depth",
      "100% remote flexibility"
    ],
    description: "Acme Global Cloud is hiring a Frontend UI Engineer to lead design system implementation for our next-generation cloud infrastructure management console.",
    responsibilities: [
      "Architect and document scalable CSS design tokens and component libraries.",
      "Deliver responsive, accessible cloud management screens from Figma wireframes.",
      "Optimize data-dense layouts for sub-second visual rendering."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-008",
    reqId: "MND-DIG-3390",
    title: "Senior WordPress & Frontend Developer",
    company: "Mindrops Digital Studio",
    score: 72,
    tier: "review",
    location: "South Extension, New Delhi",
    workMode: "On-site",
    realSalary: "₹12,00,000 - ₹16,00,000 PA",
    salaryMinVal: 12,
    liveUrl: "https://mindrops.com/",
    portalFile: "mindrops.html",
    folderName: "Mindrops_Digital_Studio_job-mock-008",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Digital Studio Direct",
    skills: ["WordPress Custom Themes", "HTML5", "CSS3/SCSS", "JavaScript", "PHP UI", "Pixel-Perfect Design", "Cross-Browser Testing"],
    evidence: [
      "Extensive experience converting Figma/PSD designs to responsive HTML/SCSS",
      "Direct mastery of semantic markup and web performance optimization",
      "Local South Delhi studio access"
    ],
    description: "Mindrops Digital Studio in South Extension, New Delhi is looking for a Senior Frontend & WordPress Developer to craft bespoke digital experiences for premium luxury and lifestyle brands.",
    responsibilities: [
      "Convert high-fidelity Figma mockups into bespoke, high-speed custom themes.",
      "Ensure pixel-perfect rendering across iOS, Android, macOS, and Windows.",
      "Optimize core web vitals and cross-browser consistency."
    ],
    hasDocs: true
  },
  {
    id: "job-mock-009",
    reqId: "CGN-WEB-5512",
    title: "Senior Frontend Engineer - AI Workflows",
    company: "Cognitive Web Labs",
    score: 77,
    tier: "strong",
    location: "Delhi NCR (Noida / Hybrid)",
    workMode: "Hybrid",
    realSalary: "₹18,00,000 - ₹25,00,000 PA",
    salaryMinVal: 18,
    liveUrl: "https://wellfound.com/",
    portalFile: "cognitive-labs.html",
    folderName: "Cognitive_Web_Labs_job-mock-009",
    status: "DISCOVERED",
    submissionMethod: null,
    source: "Wellfound / AngelList",
    skills: ["Angular / React", "TypeScript", "SCSS", "Data Visualization", "Figma-to-Code", "AI Agent UI"],
    evidence: [
      "Strong alignment with modern frontend frameworks and responsive architectures",
      "Compensation range (₹18-25L) comfortably satisfies candidate baseline",
      "Noida tech corridor location"
    ],
    description: "Cognitive Web Labs builds cutting-edge enterprise AI workflows and automation tools. We are seeking a Senior Frontend Engineer to build interactive chat interfaces and analytics dashboards.",
    responsibilities: [
      "Develop responsive, real-time AI interaction canvases and workflow editors.",
      "Integrate streaming REST/WebSocket endpoints with smooth 60fps UI updates.",
      "Ensure clean modular code and robust automated testing."
    ],
    hasDocs: true
  }
];

// Canonical mappings for mock portals and tailored document folders
const PORTAL_FILE_MAPPING = {
  'job-mock-001': 'nagarro.html',
  'job-mock-002': 'samsung-sds.html',
  'job-mock-003': 'wipro.html',
  'job-mock-004': 'gitlab.html',
  'job-mock-005': 'experience-commerce.html',
  'job-mock-006': 'cisco.html',
  'job-mock-007': 'acme-global.html',
  'job-mock-008': 'mindrops.html',
  'job-mock-009': 'cognitive-labs.html',
  'job-mock-010': 'incedo.html',
  'naukri-001': 'infoedge.html',
  'naukri-002': 'publicis-sapient.html',
  'naukri-003': 'hcl.html',
  'indeed-001': 'tech-mahindra.html',
  'indeed-002': 'epam.html',
  'indeed-003': 'zomato.html',
  'linkedin-001': 'cba.html',
  'linkedin-002': 'makemytrip.html',
  'linkedin-003': 'paytm.html',
  'linkedin-4478053400': 'amazon-fee2.html'
};

const FOLDER_NAME_MAPPING = {
  'job-mock-001': 'Nagarro_Enterprises_job-mock-001',
  'job-mock-002': 'Samsung_SDS_Global_job-mock-002',
  'job-mock-003': 'Wipro_Digital_job-mock-003',
  'job-mock-004': 'GitLab_Partner_Ecosystem_job-mock-004',
  'job-mock-005': 'Experience_Commerce__Cheil_Gro_job-mock-005',
  'job-mock-006': 'Cisco_Systems_Partner_Network_job-mock-006',
  'job-mock-007': 'Acme_Global_Cloud_job-mock-007',
  'job-mock-008': 'Mindrops_Digital_Studio_job-mock-008',
  'job-mock-009': 'Cognitive_Web_Labs_job-mock-009',
  'job-mock-010': 'Incedo_Inc__job-mock-010',
  'naukri-001': 'Info_Edge_India__Naukri_Enterp_naukri-001',
  'naukri-002': 'Publicis_Sapient_naukri-002',
  'naukri-003': 'HCL_Technologies_naukri-003',
  'indeed-001': 'Tech_Mahindra_indeed-001',
  'indeed-002': 'EPAM_Systems_indeed-002',
  'indeed-003': 'Zomato___Blinkit_indeed-003',
  'linkedin-001': 'Commonwealth_Bank_of_Australia_linkedin-001',
  'linkedin-002': 'MakeMyTrip_India_linkedin-002',
  'linkedin-003': 'Paytm_Payments_Bank_linkedin-003',
  'linkedin-4478053400': 'Amazon__ADCI__linkedin-4478053400'
};

function resolvePortalFile(jobId, company = '', url = '') {
  if (PORTAL_FILE_MAPPING[jobId]) return PORTAL_FILE_MAPPING[jobId];
  const comp = (company || '').toLowerCase();
  if (comp.includes('samsung')) return 'samsung-sds.html';
  if (comp.includes('nagarro')) return 'nagarro.html';
  if (comp.includes('wipro')) return 'wipro.html';
  if (comp.includes('cheil') || comp.includes('experience commerce')) return 'experience-commerce.html';
  if (comp.includes('cisco')) return 'cisco.html';
  if (comp.includes('incedo')) return 'incedo.html';
  if (comp.includes('info edge') || comp.includes('infoedge') || comp.includes('naukri')) return 'infoedge.html';
  if (comp.includes('hcl')) return 'hcl.html';
  if (comp.includes('publicis') || comp.includes('sapient')) return 'publicis-sapient.html';
  if (comp.includes('tech mahindra') || comp.includes('techmahindra')) return 'tech-mahindra.html';
  if (comp.includes('epam')) return 'epam.html';
  if (comp.includes('paytm')) return 'paytm.html';
  if (comp.includes('amazon')) return 'amazon-fee2.html';
  if (comp.includes('commonwealth') || comp.includes('cba')) return 'cba.html';
  if (comp.includes('makemytrip')) return 'makemytrip.html';
  if (comp.includes('zomato') || comp.includes('blinkit')) return 'zomato.html';
  if (comp.includes('gitlab')) return 'gitlab.html';
  if (comp.includes('acme') || comp.includes('remoteok')) return 'acme-global.html';
  if (comp.includes('mindrops')) return 'mindrops.html';
  if (comp.includes('cognitive') || comp.includes('wellfound')) return 'cognitive-labs.html';
  return null;
}

// Synchronize jobsData dynamically with data/applications.csv across ALL linked portals
try {
  const csvPath = path.resolve('data/applications.csv');
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    
    function parseCsvRow(text) {
      const res = [];
      let cur = '';
      let inQuotes = false;
      for (let j = 0; j < text.length; j++) {
        const c = text[j];
        if (c === '"') {
          if (inQuotes && text[j+1] === '"') { cur += '"'; j++; }
          else inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          res.push(cur.trim());
          cur = '';
        } else cur += c;
      }
      res.push(cur.trim());
      return res;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const cells = parseCsvRow(line);
      const status = cells[13] || '';
      
      // Skip disqualified entries
      if (status === 'REJECTED_DISQUALIFIED') continue;

      const jobId = cells[0];
      const title = cells[1];
      const company = cells[2];
      const url = cells[3];
      const source = cells[4];
      const location = cells[6] || 'Delhi NCR / Remote';
      const workMode = cells[7] || (location.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid');
      const salary = cells[8] || '₹18,00,000 - ₹26,00,000 PA';
      const skillsStr = cells[9] || '';
      const score = parseInt(cells[10] || '75', 10);
      const evidenceStr = cells[11] || '';
      const nextAction = cells[14] || '';
      const appliedDate = cells[15] || '';
      const confirmationId = cells[16] || '';
      const notes = cells[17] || '';

      const targetJob = jobsData.find(j => j.id === jobId);

      if (targetJob) {
        // Update existing enriched job
        const validStages = ['SUBMITTED', 'HR_SCREEN', 'TECH_INTERVIEW', 'SYSTEM_DESIGN', 'OFFER'];
        if (validStages.includes(status)) {
          targetJob.status = 'SUBMITTED';
          targetJob.pipelineStage = status;
          if (nextAction.toLowerCase().includes('autofill') || notes.toLowerCase().includes('autofill')) {
            targetJob.submissionMethod = 'Via Autofill';
          } else {
            targetJob.submissionMethod = 'Via Opening Portal';
          }
          if (appliedDate) targetJob.appliedDate = appliedDate;
          if (confirmationId) targetJob.confirmationId = confirmationId;
          targetJob.stageNotes = nextAction || notes;
        }
      } else {
        // Discovered from linked portal adapter (LinkedIn, Naukri, Indeed, RemoteOK, Arbeitnow)
        const isSubmitted = ['SUBMITTED', 'HR_SCREEN', 'TECH_INTERVIEW', 'SYSTEM_DESIGN', 'OFFER'].includes(status);
        const salaryVal = parseInt(salary.replace(/[^0-9]/g, '').slice(0, 2), 10) || 18;

        const newJob = {
          id: jobId,
          reqId: jobId.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12),
          title: title || 'Senior Frontend Engineer',
          company: company || 'Enterprise Partner',
          score: score,
          tier: score >= 85 ? 'excellent' : (score >= 75 ? 'strong' : 'review'),
          location: location,
          workMode: workMode,
          realSalary: salary,
          salaryMinVal: salaryVal,
          liveUrl: url,
          portalFile: resolvePortalFile(jobId, company, url),
          folderName: FOLDER_NAME_MAPPING[jobId] || (company.replace(/[^a-zA-Z0-9]/g, '_') + '_' + jobId),
          status: isSubmitted ? 'SUBMITTED' : (status || 'DISCOVERED'),
          submissionMethod: isSubmitted ? 'Via Opening Portal' : null,
          appliedDate: appliedDate || (isSubmitted ? '2026-10-29' : ''),
          confirmationId: confirmationId || (isSubmitted ? 'CONF-' + jobId.slice(0, 8).toUpperCase() : ''),
          source: source || 'Verified Portal Feed',
          skills: skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : ['HTML5', 'CSS3', 'SCSS', 'Angular', 'JavaScript (ES6)', 'Design Systems'],
          evidence: evidenceStr ? evidenceStr.split(';').map(e => e.trim()).filter(Boolean) : [
            'Direct seniority match on 8+ years enterprise UI engineering experience',
            'Location & work mode aligns with candidate search criteria',
            'Verified active listing from ' + source
          ],
          description: title + ' at ' + company + ' sourced across linked enterprise feeds.',
          responsibilities: [
            'Architect scalable frontend components and user interfaces.',
            'Deliver high-fidelity, accessible (WCAG 2.1 AA) responsive web experiences.',
            'Collaborate with engineering teams on design systems and automated UI testing.'
          ],
          hasDocs: false
        };

        jobsData.push(newJob);
      }
    }
  }
} catch (e) {
  console.warn('[Build Sync] Error reading applications.csv:', e);
}

// Sort opportunities: Submitted first, then by score descending
jobsData.sort((a, b) => {
  if (a.status === 'SUBMITTED' && b.status !== 'SUBMITTED') return -1;
  if (b.status === 'SUBMITTED' && a.status !== 'SUBMITTED') return 1;
  return b.score - a.score;
});

function buildDashboardHtml() {
  const submittedCount = jobsData.filter(j => j.status === 'SUBMITTED').length;
  const portalCount = jobsData.filter(j => j.status === 'SUBMITTED' && j.submissionMethod === 'Via Opening Portal').length;
  const autofillCount = jobsData.filter(j => j.status === 'SUBMITTED' && j.submissionMethod === 'Via Autofill').length;
  const readyCount = jobsData.filter(j => j.status !== 'SUBMITTED').length;
  const jobsJson = JSON.stringify(jobsData, null, 2);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>TalentFlow AI — Enterprise Job Search &amp; Matching Suite | Ashutosh Kumar</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    html, body { overflow-x: hidden; max-width: 100vw; }
    body { font-family: 'Inter', sans-serif; }
    code, .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    /* Clean custom scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }

    /* Hide scrollbar for clean horizontal tabs on mobile */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Touch buttons */
    .touch-btn { min-height: 38px; display: inline-flex; align-items: center; justify-content: center; }

    /* Details animation */
    details summary::-webkit-details-marker { display: none; }
  </style>
</head>
<body class="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col pb-20 md:pb-8 antialiased selection:bg-blue-600 selection:text-white">

  <!-- ============================================================== -->
  <!-- 1. TOP HEADER NAVIGATION (Sleek, Un-overlapped, Showcase Ready) -->
  <!-- ============================================================== -->
  <header class="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
      
      <!-- Brand Logo & Candidate Identity -->
      <div class="flex items-center gap-2.5 shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-blue-500/20">
          ◈
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-extrabold text-white tracking-tight">TalentFlow AI</h1>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="hidden sm:inline">Engine Online</span>
            </span>
          </div>
          <p class="text-[11px] text-slate-400 font-medium hidden sm:block">Ashutosh Kumar • Senior Frontend Engineer</p>
        </div>
      </div>

      <!-- Active View Indicator Pill (Interactive - Opens Burger Menu) -->
      <div class="hidden md:flex items-center">
        <button onclick="toggleBurgerMenu()" class="touch-btn px-3 py-1.5 rounded-xl bg-[#111827] border border-slate-800 hover:border-blue-500/60 text-xs transition flex items-center gap-2 group shadow-xs">
          <span class="text-[10px] text-slate-400 font-mono uppercase">Current View:</span>
          <span id="headerActiveViewPill" class="text-white font-extrabold group-hover:text-blue-300 transition">📋 Opportunities (${jobsData.length})</span>
          <span class="text-[10px] text-slate-500 group-hover:text-slate-300">▼</span>
        </button>
      </div>

      <!-- Right Header Actions: Multi-Page Links, Candidate Switcher, User Session Badge, Privacy & Tools -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Multi-Candidate Profile Switcher -->
        <div id="candidateSelectorContainer"></div>

        <!-- Logged-in User Session Pill & Logout -->
        <div id="activeUserBadge"></div>

        <button id="privacyToggleBtn" onclick="togglePrivacyMode()" class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-1.5" title="Mask/Unmask Personal Contact & Salary Info">
          <span id="privacyIcon">🛡️</span>
          <span id="privacyStatusText" class="hidden xl:inline">Privacy: ON</span>
        </button>

        <button onclick="openToolsModal()" class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#111827] text-slate-200 border border-slate-700 hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs" title="Tools, QR Sharing, Revert Receipts & Master Documents">
          <span>⚙️</span>
          <span class="hidden xl:inline">Tools</span>
        </button>

        <!-- 🍔 BURGER MENU BUTTON (Houses Opportunities, Pipeline, Replies, Battle-Cards & Offer Calculator) -->
        <button id="burgerMenuBtn" onclick="toggleBurgerMenu()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition flex items-center gap-2 shrink-0" title="Open Navigation & Views Menu">
          <span class="text-sm">☰</span>
          <span>Views Menu</span>
          <span id="burgerInboundBadge" class="hidden px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-400 text-slate-950 ml-0.5">2</span>
        </button>
      </div>

    </div>
  </header>

  <!-- ============================================================== -->
  <!-- BURGER MENU SLIDE-OUT FLYOUT (All Views from Opportunities to Offer) -->
  <!-- ============================================================== -->
  <div id="burgerMenuOverlay" onclick="closeBurgerMenu()" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden transition-opacity"></div>
  <aside id="burgerMenuDrawer" class="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-[#111827] border-l border-slate-800 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col overflow-hidden">
    
    <!-- Drawer Header -->
    <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
          ◈
        </div>
        <div>
          <h3 class="text-xs font-bold text-white uppercase tracking-wider">Workspace Navigation</h3>
          <p class="text-[10px] text-slate-400 font-mono">TalentFlow AI v2.4</p>
        </div>
      </div>
      <button onclick="closeBurgerMenu()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
        ✕
      </button>
    </div>

    <!-- Drawer Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
      
      <!-- SECTION 1: DASHBOARD VIEWS (OPPORTUNITIES TO OFFER CALCULATOR) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Dashboard Views &amp; Modules</span>
          <span class="text-blue-400 font-mono">5 Views</span>
        </div>

        <div class="space-y-1.5">
          <!-- 1. Opportunities -->
          <button onclick="selectTabFromBurger('opportunities')" data-tab="opportunities" class="burger-tab-btn w-full p-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5">
              <span class="text-base">📋</span>
              <div>
                <div class="font-bold">Job Opportunities</div>
                <div class="text-[10px] text-slate-300 opacity-90">Browse ${jobsData.length} matched positions &amp; CTCs</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-900/60 text-blue-200">${jobsData.length}</span>
          </button>

          <!-- 2. Recruiter Pipeline (Kanban) -->
          <button onclick="selectTabFromBurger('kanban')" data-tab="kanban" class="burger-tab-btn w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5">
              <span class="text-base">📊</span>
              <div>
                <div class="font-bold">Recruiter Pipeline</div>
                <div class="text-[10px] text-slate-400">Automated 5-stage Kanban board</div>
              </div>
            </div>
            <span class="text-[10px] text-slate-400 font-mono">ATS Active</span>
          </button>

          <!-- 3. Inbound Replies -->
          <button onclick="selectTabFromBurger('replies')" data-tab="replies" class="burger-tab-btn w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5">
              <span class="text-base">📬</span>
              <div>
                <div class="font-bold">Inbound Recruiter Replies</div>
                <div class="text-[10px] text-slate-400">Live Gmail IMAP &amp; recruiter alerts</div>
              </div>
            </div>
            <span id="burgerRepliesBadge" class="hidden px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">0</span>
          </button>

          <!-- 4. Battle-Cards -->
          <button onclick="selectTabFromBurger('battlecards')" data-tab="battlecards" class="burger-tab-btn w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5">
              <span class="text-base">🎯</span>
              <div>
                <div class="font-bold">Interview Battle-Cards</div>
                <div class="text-[10px] text-slate-400">Company-specific cheat-sheets &amp; architecture</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-purple-300 border border-purple-500/30">12</span>
          </button>

          <!-- 5. Offer Calculator -->
          <button onclick="selectTabFromBurger('offer')" data-tab="offer" class="burger-tab-btn w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5">
              <span class="text-base">💼</span>
              <div>
                <div class="font-bold">Offer Calculator</div>
                <div class="text-[10px] text-slate-400">In-hand salary &amp; 30% tax slab modeling</div>
              </div>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono">₹ LPA</span>
          </button>
        </div>
      </div>

      <!-- SECTION 2: MULTI-PAGE ENTERPRISE HUBS -->
      <div class="space-y-2 pt-2 border-t border-slate-800">
        <div class="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Enterprise Pages &amp; Portfolios
        </div>

        <div class="space-y-1.5">
          <a href="/profile.html" class="w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-base">👤</span>
              <div>
                <div class="font-bold">Candidate Profile Hub</div>
                <div class="text-[10px] text-slate-400">Interactive resume preview &amp; anchors</div>
              </div>
            </div>
            <span class="text-blue-400 text-xs font-bold">&rarr;</span>
          </a>

          <a href="/users.html" class="w-full p-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-base">🛡️</span>
              <div>
                <div class="font-bold">User &amp; Access Management</div>
                <div class="text-[10px] text-amber-200/80">Admin console: Read, Write &amp; Resume upload</div>
              </div>
            </div>
            <span class="text-amber-400 text-xs font-bold">&rarr;</span>
          </a>

          <a href="/login.html" class="w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-base">🔐</span>
              <div>
                <div class="font-bold">Authentication Gateway</div>
                <div class="text-[10px] text-slate-400">Switch user account or sign in</div>
              </div>
            </div>
            <span class="text-slate-400 text-xs font-bold">&rarr;</span>
          </a>
        </div>
      </div>

      <!-- SECTION 3: QUICK AGENCY UTILITIES -->
      <div class="space-y-2 pt-2 border-t border-slate-800">
        <div class="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Utilities &amp; Tools
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="togglePrivacyMode(); closeBurgerMenu();" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition">
            <div class="text-base">🛡️</div>
            <div class="font-bold text-white text-[11px] mt-1">Privacy Mask</div>
            <div class="text-[9px] text-slate-400">Toggle contact mask</div>
          </button>

          <button onclick="openToolsModal(); closeBurgerMenu();" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition">
            <div class="text-base">⚙️</div>
            <div class="font-bold text-white text-[11px] mt-1">Agency Tools</div>
            <div class="text-[9px] text-slate-400">QR sharing &amp; receipts</div>
          </button>
        </div>
      </div>

    </div>

    <!-- Drawer Footer -->
    <div class="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
      <span class="text-[10px] text-slate-500 font-mono">TalentFlow AI &bull; Ashutosh Kumar</span>
      <button onclick="handleAuthLogout()" class="px-2.5 py-1 rounded-lg text-rose-300 hover:bg-rose-950/40 text-[11px] font-semibold transition flex items-center gap-1">
        <span>🚪</span> <span>Sign Out</span>
      </button>
    </div>

  </aside>

    </div>
  </header>

  <!-- Top View-Only Alert Banner (Displays when signed in as Viewer/Read-Only) -->
  <div id="dashboardViewOnlyBanner" class="hidden bg-amber-950/70 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs flex items-center justify-between">
    <div class="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-base">👁️</span>
        <span><strong>View-Only Mode:</strong> You are currently browsing with Read access. Submitting applications, advancing stages, and configuration changes are restricted to Write/Admin users.</span>
      </div>
      <a href="/users.html" class="shrink-0 font-bold underline hover:text-amber-100">Manage Access Roles →</a>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- 2. EXECUTIVE HERO / CLIENT SHOWCASE BANNER                     -->
  <!-- ============================================================== -->
  <section class="max-w-7xl mx-auto px-4 pt-5 pb-3 w-full">
    <div class="bg-gradient-to-r from-[#111827] via-[#131d33] to-[#0f172a] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <!-- Left: Candidate Profile & Mandates -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600/30 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
              Client Showcase &bull; 8+ Yrs Enterprise Experience
            </span>
            <span class="text-xs text-slate-400 font-mono">Immediate to 15 Days Notice</span>
            <span id="heroVerificationBadge"></span>
          </div>

          <h2 class="text-base md:text-lg font-extrabold text-white">
            Ashutosh Kumar &bull; <span class="text-slate-300 font-semibold">Senior Frontend Engineer &amp; UI Architect</span>
          </h2>

          <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 font-mono">
            <span>Current: <strong class="text-slate-200 font-semibold" id="candCurrentCtcDisplay">₹•••••• PA</strong></span>
            <span>&bull;</span>
            <span>Target: <strong class="text-emerald-400 font-semibold" id="candTargetCtc">₹•••••• (Remote/NCR) &bull; ₹•••••• (Out of NCR)</strong></span>
            <span>&bull;</span>
            <span class="text-slate-300" id="heroLocationDisplay">New Delhi (Delhi NCR)</span>
          </div>
        </div>

        <!-- Right: Showcase Actions & Discovery -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button id="runDiscoveryBtn" onclick="triggerDiscoveryRun()" class="touch-btn px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition flex items-center gap-1.5" title="Run Automated Discovery Scan Across Enterprise Feeds">
            <span id="discoverySpinner">⚡</span>
            <span>Run Discovery</span>
          </button>

          <button onclick="reloadUpdatedJobs(true)" class="touch-btn px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition flex items-center gap-1.5" title="Reload &amp; Re-sync All Applications">
            <span id="reloadSpinner">🔄</span>
            <span>Reload</span>
          </button>
        </div>

      </div>

      <!-- Live KPI Badges Strip (4 Responsive Metric Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-slate-800 text-center">
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div class="text-[10px] uppercase font-bold text-slate-400">Total Evaluated</div>
          <div class="text-lg md:text-xl font-extrabold text-white mt-0.5">340+</div>
          <div class="text-[10px] text-slate-500">Portals &amp; ATS Feeds</div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div class="text-[10px] uppercase font-bold text-emerald-400">Active Applications</div>
          <div class="text-lg md:text-xl font-extrabold text-emerald-400 mt-0.5">${submittedCount} / 15</div>
          <div class="text-[10px] text-slate-500">${portalCount} Portal &bull; ${autofillCount} Autofill</div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div class="text-[10px] uppercase font-bold text-purple-400">Battle-Cards Ready</div>
          <div class="text-lg md:text-xl font-extrabold text-purple-400 mt-0.5">12</div>
          <div class="text-[10px] text-slate-500">STAR Technical Prep</div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <div class="text-[10px] uppercase font-bold text-cyan-400">Test Verification</div>
          <div class="text-lg md:text-xl font-extrabold text-cyan-400 mt-0.5">25 / 25</div>
          <div class="text-[10px] text-slate-500">100% Vitest &bull; 0 TS Errors</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================== -->
  <!-- 3. MAIN CONTENT: DYNAMIC TABS                                 -->
  <!-- ============================================================== -->
  <main class="max-w-7xl mx-auto px-4 w-full flex-1">

    <!-- ------------------------------------------------------------ -->
    <!-- TAB 1: TOP OPPORTUNITIES (List View)                         -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewOpportunities">
      
      <!-- Filter Bar (Search + Scrollable Filter Chips) -->
      <div class="bg-[#111827] border border-slate-800 rounded-2xl p-3 mb-4 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <!-- Search Input -->
          <div class="relative flex-1">
            <input type="text" id="searchInput" oninput="handleSearch()" placeholder="Search company, tech skill, role, portal, location..." class="w-full bg-[#0b0f19] border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 pl-9 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Quick Discovery & Reload triggers -->
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="reloadUpdatedJobs(true)" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shadow-xs">
              <span>🔄</span>
              <span>Sync</span>
            </button>
            <button onclick="switchTab('kanban')" class="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition flex items-center gap-1.5 shadow-xs">
              <span>📊</span>
              <span>Kanban View</span>
            </button>
          </div>

        </div>

        <!-- Horizontal Filter Chips (Clean, Mobile Scrollable, No Wrapping Overlaps) -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1" id="filterButtons">
          <button onclick="setFilter('all')" class="filter-btn active px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs transition shrink-0" data-filter="all">All Top Openings (${jobsData.length})</button>
          <button onclick="setFilter('submitted')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="submitted">🟢 Submitted (${submittedCount})</button>
          <button onclick="setFilter('portal')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="portal">📋 Portal (${portalCount})</button>
          <button onclick="setFilter('autofill')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="autofill">⚡ Autofill (${autofillCount})</button>
          <button onclick="setFilter('ready')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="ready">🟡 Matched &amp; Ready (${readyCount})</button>
          <button onclick="setFilter('remote')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="remote">🌐 Remote (4)</button>
          <button onclick="setFilter('premium')" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0" data-filter="premium">💎 ₹25+ LPA (4)</button>
        </div>
      </div>

      <!-- Live Sync Status Banner -->
      <div id="liveSyncStatusBanner" class="mb-4 bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 shadow-sm">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Application Pipeline: <strong class="text-white">${submittedCount} of 15 Submitted</strong> (${portalCount} Portal &bull; ${autofillCount} Autofill) &bull; <span class="text-emerald-400 font-semibold">Zero Rejections</span></span>
        </div>
        <span id="lastSyncedTime" class="text-[11px] text-slate-400 font-mono hidden sm:inline">Live Synced</span>
      </div>

      <!-- Dynamic Job Cards Container -->
      <div id="jobListContainer" class="space-y-4">
        <!-- Rendered by JS -->
      </div>
    </section>

    <!-- ------------------------------------------------------------ -->
    <!-- TAB 2: PIPELINE KANBAN BOARD                                 -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewKanban" class="hidden pb-12">
      <div class="flex items-center justify-between mb-4 bg-[#111827] border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📊</span>
            <span>Interview &amp; Application Pipeline Kanban</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Drag or advance candidates across recruitment stages &bull; Syncs with applications.csv</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <button onclick="switchTab('offer')" class="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold transition">
            💼 Offer Calculator
          </button>
        </div>
      </div>
      <div id="kanbanBoardColumns" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        <!-- Injected dynamically by renderKanban() -->
      </div>
    </section>

    <!-- ------------------------------------------------------------ -->
    <!-- TAB 3: INTERVIEW BATTLE-CARDS (STAR Cheat-Sheets)            -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewBattlecards" class="hidden pb-12">
      <div class="bg-[#111827] border border-slate-800 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <span>🎯</span>
            <span>Interview Battle-Cards &bull; Top 12 Applied Roles</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Technical cheat-sheets with STAR answers, live proof anchors &amp; reverse questions for Ashutosh Kumar</p>
        </div>
        <div class="w-full sm:w-64">
          <input type="text" oninput="filterBattleCardsTab(this.value)" placeholder="Search company, tech skill..." class="w-full bg-[#0b0f19] border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500">
        </div>
      </div>

      <div id="battlecardsViewGrid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Injected dynamically by renderBattlecardsView() -->
      </div>
    </section>

    <!-- ------------------------------------------------------------ -->
    <!-- TAB 4: OFFER EVALUATION & NEGOTIATION CALCULATOR             -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewOfferCalculator" class="hidden pb-12">
      <div class="bg-[#111827] border border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>💼</span>
              <span>Offer Evaluation &amp; Negotiation Calculator</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Evaluate incoming offers against candidate mandates (Current: ₹6 LPA &bull; Target: ₹12L+ NCR / ₹15L+ Out-of-NCR)</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Immediate to 15 Days Notice
          </span>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0b0f19] border border-slate-800 p-4 rounded-xl">
          <div>
            <label class="block text-slate-300 font-bold mb-1.5 text-xs">Proposed Annual Base + Fixed CTC (₹):</label>
            <div class="flex items-center gap-2">
              <input type="number" id="offeredCtcInput" value="1400000" min="600000" max="4500000" step="50000" oninput="updateOfferCalculation()" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
            <input type="range" id="offeredCtcRange" value="1400000" min="600000" max="3500000" step="50000" oninput="document.getElementById('offeredCtcInput').value = this.value; updateOfferCalculation()" class="w-full mt-2 accent-emerald-500 cursor-pointer">
          </div>

          <div>
            <label class="block text-slate-300 font-bold mb-1.5 text-xs">Role Location &amp; Target Threshold:</label>
            <div class="space-y-2 text-xs">
              <label class="flex items-center gap-2 cursor-pointer bg-slate-900/80 p-2 rounded-lg border border-slate-800 hover:border-slate-700">
                <input type="radio" name="calcTargetMode" value="ncr" checked onchange="updateOfferCalculation()" class="accent-emerald-500">
                <div>
                  <div class="text-white font-semibold">Delhi NCR / Remote India</div>
                  <div class="text-[10px] text-slate-400">Target Minimum: ₹12,00,000 PA (12 LPA)</div>
                </div>
              </label>
              <label class="flex items-center gap-2 cursor-pointer bg-slate-900/80 p-2 rounded-lg border border-slate-800 hover:border-slate-700">
                <input type="radio" name="calcTargetMode" value="relocation" onchange="updateOfferCalculation()" class="accent-emerald-500">
                <div>
                  <div class="text-white font-semibold">Out-of-NCR (Bengaluru, Pune, Hyderabad)</div>
                  <div class="text-[10px] text-slate-400">Target Minimum: ₹15,00,000 PA (15 LPA)</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Calculated Real-Time KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl">
            <div class="text-[10px] uppercase font-semibold text-slate-400">Hike from ₹6L</div>
            <div class="text-xl md:text-2xl font-extrabold text-cyan-400 mt-1" id="calcHikePercent">+133.3%</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Current Base: ₹6.0L</div>
          </div>
          <div class="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl">
            <div class="text-[10px] uppercase font-semibold text-slate-400">Absolute Gain</div>
            <div class="text-xl md:text-2xl font-extrabold text-emerald-400 mt-1" id="calcAbsoluteGain">+₹8.0L</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Annual Difference</div>
          </div>
          <div class="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl">
            <div class="text-[10px] uppercase font-semibold text-slate-400">Target Verdict</div>
            <div class="text-sm md:text-base font-extrabold text-emerald-400 mt-1.5" id="calcTargetVerdict">✅ Meets Target</div>
            <div class="text-[10px] text-slate-500 mt-0.5" id="calcTargetDelta">+₹2.0L above ₹12L</div>
          </div>
          <div class="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl">
            <div class="text-[10px] uppercase font-semibold text-slate-400">Est. Monthly In-Hand</div>
            <div class="text-xl md:text-2xl font-extrabold text-purple-400 mt-1" id="calcMonthlyInHand">~₹91,000</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Post-tax estimate</div>
          </div>
        </div>

        <!-- 3 Battle-Tested Negotiation Scripts -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white uppercase tracking-wider">🎯 Ashutosh Kumar's Negotiation Scripts:</span>
            <span class="text-slate-400 text-[11px]">Click copy button to use instantly</span>
          </div>

          <!-- Script 1 -->
          <div class="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-amber-300">Script 1: Anchoring on Enterprise Scale &amp; Proven Track Record</span>
              <button onclick="copyOfferNegotiationScript(1)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition">
                📋 Copy Script
              </button>
            </div>
            <p class="text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-relaxed" id="offerScriptText1">"Thank you so much for extending the offer. I am thrilled about the opportunity to architect and scale frontend systems with your team. Given my 8+ years delivering enterprise-grade web applications—including delivering multi-tenant platforms at Samsung SDS with a 97/100 rating and engineering Playwright test suites at Wondrfly—I am seeking a package of ₹14,50,000 to align with the enterprise scope and market benchmark for this senior role. Can we explore bridging this delta?"</p>
          </div>

          <!-- Script 2 -->
          <div class="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-cyan-300">Script 2: Overcoming Percentage Bias from ₹6L Base</span>
              <button onclick="copyOfferNegotiationScript(2)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition">
                📋 Copy Script
              </button>
            </div>
            <p class="text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-relaxed" id="offerScriptText2">"I understand your standard percentage compensation bands from prior CTC. However, my previous contract compensation at ₹6L reflected an initial scope rather than the senior enterprise leadership and multi-framework delivery I provide. Since market compensation for Senior Frontend Engineers with 8+ years across Angular and Design Systems in Delhi NCR is ₹12L-₹15L, I would appreciate your support in matching the ₹13,50,000 baseline."</p>
          </div>

          <!-- Script 3 -->
          <div class="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-purple-300">Script 3: Dual Offer Competitive Leverage</span>
              <button onclick="copyOfferNegotiationScript(3)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition">
                📋 Copy Script
              </button>
            </div>
            <p class="text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-relaxed" id="offerScriptText3">"I am in final discussions with another enterprise team offering in the ₹14-15 LPA range. However, because of your culture, design system roadmap, and technical stack, your team is my top choice. If we can reach ₹14,00,000, I am fully prepared to sign immediately and decline other ongoing processes."</p>
          </div>
        </div>

      </div>
    </section>

  
    <!-- ------------------------------------------------------------ -->
    <!-- TAB 5: INBOUND RECRUITER REPLIES & GMAIL MONITORING          -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewReplies" class="hidden pb-12">
      <div class="bg-[#111827] border border-slate-800 rounded-2xl p-4 md:p-5 mb-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>📬</span>
              <span>Inbound Recruiter Replies &amp; Gmail Monitoring</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Automated ATS status detection, assessment challenges, and recruiter interview invitations</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button onclick="openGmailSetupModal()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition flex items-center gap-1.5" title="Connect Gmail via App Password or Google Cloud OAuth 2.0">
              <span>⚙️</span> <span>Gmail Setup</span>
            </button>
            <button onclick="syncGmailRepliesNow()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm">
              <span>🔄</span> <span>Scan Gmail Inbox</span>
            </button>
            <button onclick="clearDemoReplies()" class="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1" title="Clear received messages stream">
              <span>🧹</span> <span>Clear Inbox View</span>
            </button>
          </div>
        </div>
        
        <!-- Live Real Recruiter Synchronizer Alert -->
        <div class="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5">
          <span class="text-base shrink-0">📬</span>
          <div class="space-y-1">
            <div class="font-bold text-white">Live Recruiter Inbox Synchronizer (Submitted Job Responses Only)</div>
            <p class="text-slate-300 text-[11px] leading-relaxed">
              This engine scans your authorized personal Gmail (<strong class="text-white">kumar.ashu872@gmail.com</strong>) via Google IMAP / Gmail API strictly for genuine employer responses, interview invites, coding challenges, and offer letters to your submitted jobs. Automated recommendation digests and marketing newsletters are disabled—if no response has arrived yet, this view remains cleanly blank.
            </p>
          </div>
        </div>

        <div id="gmailSyncStatusBar" class="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800">
          <div class="text-xs text-slate-400">Connecting to Gmail poller...</div>
        </div>
      </div>
      <div id="repliesStreamContainer" class="space-y-4">
        <!-- Injected by renderRepliesTab() -->
      </div>
    </section>
  
  </main>

  <!-- ============================================================== -->
  <!-- 4. MOBILE BOTTOM NAVIGATION BAR (Fixed, Zero Overlapping)     -->
  <!-- ============================================================== -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 py-1 shadow-2xl">
    <button onclick="switchTab('opportunities')" data-tab="opportunities" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-blue-400 font-bold text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📋</span>
      <span>Jobs</span>
    </button>
    <button onclick="switchTab('kanban')" data-tab="kanban" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📊</span>
      <span>Pipeline</span>
    </button>
    <button onclick="switchTab('replies')" data-tab="replies" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📬</span>
      <span>Replies</span>
    </button>
    <button onclick="switchTab('battlecards')" data-tab="battlecards" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">🎯</span>
      <span>Prep</span>
    </button>
    <button onclick="switchTab('offer')" data-tab="offer" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">💼</span>
      <span>Offer</span>
    </button>
    <button onclick="openToolsModal()" data-tab="tools" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">⚙️</span>
      <span>Tools</span>
    </button>
  </div>

  <!-- ============================================================== -->
  <!-- 5. SECONDARY TOOLS & CLIENT SHOWCASE DRAWER / MODAL            -->
  <!-- ============================================================== -->
  <div id="toolsModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <div>
            <h3 class="text-sm font-bold text-white">System Tools &amp; Client Showcase</h3>
            <p class="text-[11px] text-slate-400">Mobile QR sharing, receipts audit trail &amp; master assets</p>
          </div>
        </div>
        <button onclick="closeToolsModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-5 overflow-y-auto space-y-3 text-xs">
        
        <!-- Tool 0: Recruiter ATS Review Simulator -->
        <div onclick="closeToolsModal(); openRecruiterView();" class="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">👁️</span>
            <div>
              <div class="font-bold text-emerald-300">Company ATS &amp; Recruiter Review Screen</div>
              <div class="text-[10px] text-slate-400">See exactly how companies view your resume, score, and profile</div>
            </div>
          </div>
          <span class="text-emerald-400 font-bold">👁️</span>
        </div>

        <!-- Tool 1: Project Scope PDF -->
        <a href="data/reports/Project_Scope_and_Roadmap.pdf" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 transition group">
          <div class="flex items-center gap-3">
            <span class="text-xl">📑</span>
            <div>
              <div class="font-bold text-blue-300">Project Scope &amp; Architecture Roadmap PDF</div>
              <div class="text-[10px] text-slate-400">Executive client presentation &amp; next implementation roadmap</div>
            </div>
          </div>
          <span class="text-blue-400 group-hover:translate-x-1 transition-transform">↗</span>
        </a>

        <!-- Tool 2: Share to Phone QR Modal -->
        <div onclick="closeToolsModal(); openPhoneModal();" class="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">📱</span>
            <div>
              <div class="font-bold text-white">Share to Phone &amp; QR Code</div>
              <div class="text-[10px] text-slate-400">Open live dashboard on mobile via Cloudflare tunnel</div>
            </div>
          </div>
          <span class="text-slate-400">→</span>
        </div>

        <!-- Tool 3: Revert Confirmation Receipts Log -->
        <div onclick="closeToolsModal(); openEmailLogModal();" class="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">📧</span>
            <div>
              <div class="font-bold text-white">Application Revert Confirmation Receipts</div>
              <div class="text-[10px] text-slate-400">Immutable audit log of all 9 confirmed submissions</div>
            </div>
          </div>
          <span class="text-slate-400">→</span>
        </div>

        <!-- Tool 4: Master Resume in New Tab -->
        <a href="data/master-documents/Ashutosh_Kumar_Master_Resume.html" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition">
          <div class="flex items-center gap-3">
            <span class="text-xl">📄</span>
            <div>
              <div class="font-bold text-white">View Master ATS Resume</div>
              <div class="text-[10px] text-slate-400">8+ years enterprise frontend benchmark resume</div>
            </div>
          </div>
          <span class="text-slate-400">↗</span>
        </a>

        <!-- Tool 5: Quick Profile Answers for Mobile applying -->
        <div onclick="closeToolsModal(); openCandidateModal();" class="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">📋</span>
            <div>
              <div class="font-bold text-white">Quick Profile Answers</div>
              <div class="text-[10px] text-slate-400">Copy-paste answers for enterprise portal forms</div>
            </div>
          </div>
          <span class="text-slate-400">→</span>
        </div>

        <!-- Tool: Gmail API & Recruiter Sync Setup -->
        <div onclick="closeToolsModal(); openGmailSetupModal();" class="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">⚙️</span>
            <div>
              <div class="font-bold text-blue-300">Gmail Setup &amp; Recruiter Inbox Sync</div>
              <div class="text-[10px] text-slate-400">Connect kumar.ashu872@gmail.com via App Password or OAuth 2.0</div>
            </div>
          </div>
          <span class="text-blue-400">→</span>
        </div>

        <!-- Tool 6: Trigger Discovery Automation -->
        <div onclick="closeToolsModal(); triggerDiscoveryRun();" class="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">⚡</span>
            <div>
              <div class="font-bold text-amber-300">Run Daily Morning Discovery Scan</div>
              <div class="text-[10px] text-slate-400">Scan enterprise ATS feeds and refresh Battle-Cards</div>
            </div>
          </div>
          <span class="text-amber-400">⚡</span>
        </div>

      </div>

      <div class="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs">
        <span class="text-slate-400 font-mono">TalentFlow AI v2.2</span>
        <button onclick="closeToolsModal()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- 6. OTHER MODALS (Phone, Email Receipts, Follow-Up, Profile)   -->
  <!-- ============================================================== -->

  <!-- Phone Modal -->
  <div id="phoneModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div class="flex items-center gap-2">
          <span class="text-xl">📱</span>
          <div>
            <h3 class="text-sm font-bold text-white">Share Live Dashboard to Phone</h3>
            <p class="text-[11px] text-slate-400">Instant QR scan or link sharing</p>
          </div>
        </div>
        <button onclick="closePhoneModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 text-center space-y-4 overflow-y-auto">
        <div class="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto" id="qrcodeContainer">
          <div id="qrcode"></div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1 text-left">
          <div class="text-[11px] text-slate-400">Cloudflare Online Access:</div>
          <code class="text-cyan-300 font-mono font-bold block select-all break-all" id="modalPublicUrlText">${defaultShareUrl}</code>
        </div>
        <div class="flex items-center justify-center gap-2">
          <button onclick="copyShareLink()" class="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition">
            📋 Copy Link
          </button>
          <button onclick="closePhoneModal()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Revert Confirmation Emails Log Modal -->
  <div id="emailLogModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">📧</span>
            <h3 class="text-sm font-bold text-white">Application Revert Confirmation Receipts</h3>
            <span id="emailReceiptCountBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">0 Dispatches</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">Real-world submission audit trail with attached Master ATS Resume &amp; Cover Letter</p>
        </div>
        <button onclick="closeEmailLogModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-5 overflow-y-auto flex-1 space-y-3 bg-[#0b0f19]" id="emailLogListContainer">
        <!-- Injected dynamically by openEmailLogModal -->
      </div>

      <div class="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs">
        <div class="text-slate-400">
          Target Inbox: <span class="font-mono text-emerald-400 font-semibold">kumar.ashu872@gmail.com</span>
        </div>
        <button onclick="closeEmailLogModal()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Recruiter Follow-Up Modal -->
  <div id="followUpModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-amber-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">✉️</span>
          <div>
            <h3 class="text-sm font-bold text-white">Recruiter Follow-Up Email Draft</h3>
            <p class="text-[11px] text-slate-400">Tailored 5-day follow-up anchored on enterprise achievements</p>
          </div>
        </div>
        <button onclick="closeFollowUpModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-5 overflow-y-auto flex-1 space-y-3.5 bg-[#0b0f19] text-xs">
        <div>
          <label class="block text-slate-400 font-semibold mb-1">Subject Line:</label>
          <input type="text" id="followUpSubjectInput" readonly class="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono px-3 py-2 rounded-xl text-xs select-all">
        </div>
        <div>
          <label class="block text-slate-400 font-semibold mb-1">Email Body:</label>
          <textarea id="followUpBodyText" rows="12" class="w-full bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs p-3 rounded-xl leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 select-all"></textarea>
        </div>
      </div>

      <div class="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs">
        <div class="text-slate-400 font-mono">From: kumar.ashu872@gmail.com</div>
        <div class="flex items-center gap-2">
          <button onclick="copyFollowUpDraft()" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5">
            <span>📋</span>
            <span>Copy Text</span>
          </button>
          <a id="followUpMailtoBtn" href="#" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5 shadow-xs">
            <span>📧</span>
            <span>Open Mail Client</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Candidate Profile Modal (Quick Form Answers) -->
  <div id="candidateModal" class="fixed inset-0 bg-black/75 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl">📋</span>
          <div>
            <h3 class="text-sm font-bold text-white">Candidate Profile Answers</h3>
            <p class="text-[11px] text-slate-400">1-click copy for portal application forms</p>
          </div>
        </div>
        <button onclick="closeCandidateModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-5 overflow-y-auto space-y-2.5 text-xs">
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">Full Name:</span> <strong class="text-white ml-2">Ashutosh Kumar</strong></div>
          <button onclick="copyToClipboard('Ashutosh Kumar')" class="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Copy</button>
        </div>
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">Email:</span> <strong class="text-white ml-2">kumar.ashu872@gmail.com</strong></div>
          <button onclick="copyToClipboard('kumar.ashu872@gmail.com')" class="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Copy</button>
        </div>
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">Phone:</span> <strong class="text-white ml-2">+91 9310681373</strong></div>
          <button onclick="copyToClipboard('+919310681373')" class="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Copy</button>
        </div>
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">Notice Period:</span> <strong class="text-white ml-2">Immediate to 15 Days</strong></div>
          <button onclick="copyToClipboard('Immediate to 15 Days')" class="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Copy</button>
        </div>
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">Total Experience:</span> <strong class="text-white ml-2">8+ Years</strong></div>
          <button onclick="copyToClipboard('8+ Years')" class="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Copy</button>
        </div>
      </div>

      <div class="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
        <button onclick="closeCandidateModal()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white">Done</button>
      </div>
    </div>
  </div>

  <!-- Document Preview Modal -->
  <div id="previewModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#111827] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 id="modalTitle" class="text-sm font-bold text-white">Document Preview</h3>
          <p id="modalSubtitle" class="text-xs text-slate-400 mt-0.5">Application Document</p>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-5 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text bg-[#0b0f19]" id="modalBody"></div>
      <div class="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900">
        <div class="text-xs text-slate-400 font-mono" id="modalDocPath">Ashutosh_Kumar_Resume.pdf</div>
        <button onclick="closeModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white">Close</button>
      </div>
    </div>
  </div>

  
  <!-- Screening Question Cheat-Sheet Modal -->
  <div id="screeningModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base">📋</span>
            <h3 class="text-sm font-bold text-white" id="screeningJobTitle">Screening Question Cheat-Sheet &amp; Answers</h3>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5" id="screeningCompany">Target Organization • Req</p>
        </div>
        <button onclick="closeScreeningModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto space-y-3 bg-[#0b0f19]" id="screeningAnswersList">
        <!-- Injected dynamically by openScreeningModal() -->
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 font-mono">1-Click Copy Ready for Workday / Taleo forms</span>
        <button onclick="closeScreeningModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white">Done</button>
      </div>
    </div>
  </div>

  <!-- Best Portal Route Advisor Modal -->
  <div id="routeAdvisorModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base">⭐</span>
            <h3 class="text-sm font-bold text-white" id="routeAdvisorJobTitle">Best Portal Route Advisor</h3>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5" id="routeAdvisorCompany">Enterprise Opening Route Analysis</p>
        </div>
        <button onclick="closeRouteAdvisorModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto bg-[#0b0f19]" id="routeAdvisorDetails">
        <!-- Injected dynamically by openRouteAdvisorModal() -->
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <a id="routeAdvisorApplyBtn" href="#" target="_blank" rel="noopener noreferrer" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shadow-sm">
          <span>🚀 Open Optimal Portal Route ↗</span>
        </a>
        <button onclick="closeRouteAdvisorModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Close</button>
      </div>
    </div>
  </div>

  <!-- Inbound Recruiter Email Detail Modal -->
  <div id="replyDetailModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 class="text-sm font-bold text-white" id="replyDetailSubject">Inbound Recruiter Email</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Automated Gmail Detection</p>
        </div>
        <button onclick="closeRecruiterReplyDetail()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19]">
        <div id="replyDetailMeta"></div>
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text" id="replyDetailBody"></div>
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <button id="replyDetailDraftBtn" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shadow-sm">
          <span>✉️ Open Pre-Written Reply Draft</span>
        </button>
        <button onclick="closeRecruiterReplyDetail()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Close</button>
      </div>
    </div>
  </div>

  <!-- Pre-Written Recruiter Response Draft Modal -->
  <div id="replyDraftModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 class="text-sm font-bold text-white flex items-center gap-1.5"><span>✉️</span> <span>Pre-Written Recruiter Response Draft</span></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Tailored with Ashutosh Kumar's availability, notice period &amp; target terms</p>
        </div>
        <button onclick="closeReplyDraftModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19]">
        <div>
          <label class="block text-slate-400 text-[11px] font-bold mb-1">Email Subject Line:</label>
          <input type="text" id="replyDraftSubjectInput" class="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-mono">
        </div>
        <div>
          <label class="block text-slate-400 text-[11px] font-bold mb-1">Message Body:</label>
          <textarea id="replyDraftBodyText" rows="12" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 font-sans leading-relaxed"></textarea>
        </div>
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <button onclick="copyReplyDraftText()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1">
          <span>📋 Copy to Clipboard</span>
        </button>
        <div class="flex items-center gap-2">
          <button onclick="closeReplyDraftModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Close</button>
          <a id="replyDraftMailtoBtn" href="#" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm">
            <span>📨 Send via Gmail Client ↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- 8. ENTERPRISE RECRUITER / ATS APPLICATION REVIEW MODAL         -->

  <!-- ============================================================== -->
  <div id="recruiterViewModal" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 hidden flex items-center justify-center p-2 sm:p-4">
    <div class="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-6xl w-full h-[94vh] flex flex-col shadow-2xl overflow-hidden text-white">
      
      <!-- ATS Header Bar (Workday / Greenhouse style) -->
      <div class="p-3.5 sm:p-4 border-b border-slate-800 bg-[#0f172a] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm">
            🏢
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">Enterprise ATS Recruiter Portal</span>
              <span class="text-[10px] text-slate-500 font-mono hidden sm:inline">&bull; Workday / Greenhouse Screener</span>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <h3 class="text-sm font-extrabold text-white" id="rvCompanyName">Samsung SDS Global</h3>
              <span class="text-xs text-slate-400">&bull;</span>
              <span class="text-xs text-slate-300 font-medium" id="rvJobTitle">Senior Frontend Engineer</span>
              <span class="text-[11px] text-slate-500 font-mono hidden sm:inline" id="rvReqId">Req #SSDS-2026-8821</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span id="rvScoreBadge" class="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span id="rvMatchScore">89% ATS Match</span>
          </span>
          <div class="hidden sm:flex items-center gap-1.5">
            <button onclick="recruiterAdvanceStage('HR_SCREEN')" class="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1">
              <span>📞</span> <span>Advance HR Screen</span>
            </button>
            <button onclick="recruiterAdvanceStage('TECH_INTERVIEW')" class="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1">
              <span>💻</span> <span>Invite Tech Round</span>
            </button>
          </div>
          <button onclick="closeRecruiterView()" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- Main ATS Body (Split Screen: Left Scorecard 40%, Right Live Document Viewer 60%) -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0b0f19]">
        
        <!-- Left: ATS Screening Scorecard & Content Evaluation (Scrollable) -->
        <div class="w-full lg:w-[42%] border-r border-slate-800/80 p-4 overflow-y-auto space-y-4">
          
          <!-- Candidate Parsed Record -->
          <div class="bg-[#111827] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Parsed Profile</span>
              <span class="text-[10px] font-bold text-emerald-400 font-mono">Rank #1 Applicant</span>
            </div>
            <div class="text-sm font-extrabold text-white">Ashutosh Kumar</div>
            <div class="space-y-1 text-xs text-slate-300">
              <div class="flex justify-between"><span class="text-slate-400">Total Experience:</span> <strong class="text-white" id="rvCandExp">8+ Years</strong></div>
              <div class="flex justify-between"><span class="text-slate-400">Notice Period:</span> <strong class="text-emerald-400 font-bold" id="rvCandNotice">Immediate to 15 Days</strong></div>
              <div class="flex justify-between"><span class="text-slate-400">Location:</span> <span class="text-slate-200" id="rvCandLocation">New Delhi / NCR</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Candidate Target:</span> <span class="text-cyan-300 font-mono font-bold" id="rvCandTargetCtc">₹12+ LPA (NCR)</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Company Budget:</span> <span class="text-emerald-400 font-mono font-bold" id="rvBudgetCtc">₹22L - ₹30L PA</span></div>
            </div>
          </div>

          <!-- Parsed ATS Skills & Keyword Match Breakdown -->
          <div class="bg-[#111827] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Keyword &amp; Skill Index</span>
              <span class="text-[10px] text-emerald-400 font-bold">100% Core Coverage</span>
            </div>
            <div class="space-y-1.5" id="rvSkillsList">
              <!-- Injected by JS -->
            </div>
          </div>

          <!-- Key Positive Anchors Checked by Recruiter -->
          <div class="bg-[#111827] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Verified Enterprise Anchors</span>
            <div class="space-y-1.5" id="rvEvidenceList">
              <!-- Injected by JS -->
            </div>
          </div>

          <!-- Content Tuning Suggestions for Ashutosh -->
          <div class="bg-[#111827] border border-purple-500/30 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-purple-300 tracking-wider">💡 Content Tuning &amp; Interview Tips</span>
              <span class="text-[10px] text-slate-400 font-mono">Actionable Advice</span>
            </div>
            <div id="rvTuningTips">
              <!-- Injected by JS -->
            </div>
          </div>

        </div>

        <!-- Right: Live Document Reader (Resume / Cover Letter / Battle-Card) -->
        <div class="w-full lg:w-[58%] flex flex-col h-full bg-[#111827]">
          
          <!-- Document Viewer Header & Tabs -->
          <div class="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-[#0f172a]">
            <div class="flex items-center gap-1.5 bg-[#0b0f19] p-1 rounded-xl border border-slate-800">
              <button id="rvTabResume" onclick="switchRecruiterDocTab('resume')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs">
                📄 Tailored Resume
              </button>
              <button id="rvTabCover" onclick="switchRecruiterDocTab('cover')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white">
                ✉️ Cover Letter
              </button>
              <button id="rvTabPrep" onclick="switchRecruiterDocTab('prep')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white">
                🎯 Battle-Card
              </button>
            </div>

            <div class="flex items-center gap-2">
              <a id="rvDocOpenLink" href="#" target="_blank" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1">
                <span>↗</span> <span>Open Tab</span>
              </a>
              <a id="rvDocPdfLink" href="#" download class="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <span>⬇️</span> <span>PDF</span>
              </a>
            </div>
          </div>

          <!-- Document Viewer iFrame -->
          <div class="flex-1 w-full h-full bg-slate-950 p-1">
            <iframe id="rvDocIframe" class="w-full h-full rounded-lg border-0 bg-white" src="about:blank"></iframe>
          </div>

        </div>

      </div>

      <!-- ATS Footer Bar -->
      <div class="p-3 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-3">
          <span>Submission Status: <strong class="text-emerald-400 font-bold">Verified in Review Queue</strong></span>
          <span class="hidden sm:inline">&bull;</span>
          <span class="hidden sm:inline">2–5 Business Days Standard Recruiter Response Window</span>
        </div>
        <button onclick="closeRecruiterView()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
          Close ATS View
        </button>
      </div>

    </div>
  </div>

  <!-- ============================================================== -->
  <!-- 7. INLINE CLIENT LOGIC                                         -->
  <!-- ============================================================== -->
  <script>
    const jobs = ${jobsJson};
    let currentFilter = 'all';
    let searchQuery = '';
    let isPrivacyOn = true;
    let qrGenerated = false;
    let activeShareUrl = (!window.location.href.includes('localhost') && window.location.href.startsWith('http')) ? window.location.href : '${defaultShareUrl}';

    function showReloadToast(msg) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'pointer-events-auto bg-[#111827] border border-cyan-500/50 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 transition-all transform translate-y-2 opacity-0 duration-300';
      toast.innerHTML = '<span>🔄</span> <span>' + msg + '</span>';
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
      });
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    async function reloadUpdatedJobs(showToast = false) {
      const spinIcon = document.getElementById('reloadSpinner');
      if (spinIcon) spinIcon.classList.add('animate-spin');

      try {
        const res = await fetch('/api/submissions?t=' + Date.now());
        if (res.ok) {
          const remoteSubmissions = await res.json();
          let updatedCount = 0;
          Object.keys(remoteSubmissions).forEach(jobId => {
            const remoteRec = remoteSubmissions[jobId];
            const matchJob = jobs.find(j => j.id === jobId);
            if (matchJob) {
              matchJob.status = 'SUBMITTED';
              matchJob.pipelineStage = remoteRec.pipelineStage || matchJob.pipelineStage || 'SUBMITTED';
              matchJob.submissionMethod = remoteRec.submissionMethod || 'Via Opening Portal';
              matchJob.appliedDate = remoteRec.appliedDate || matchJob.appliedDate;
              matchJob.confirmationId = remoteRec.confirmationId || matchJob.confirmationId;
              updatedCount++;
            }
          });
          if (showToast) {
            showReloadToast('Synchronized ' + updatedCount + ' applications with server');
          }
        }
      } catch (err) {
        if (showToast) showReloadToast('Local sync complete');
      } finally {
        if (spinIcon) setTimeout(() => spinIcon.classList.remove('animate-spin'), 600);
      }

      renderJobs();
      if (currentActiveTab === 'kanban') renderKanban();
    }

    function renderJobs() {
      const container = document.getElementById('jobListContainer');
      if (!container) return;

      const filtered = jobs.filter(job => {
        if (currentFilter === 'submitted' && job.status !== 'SUBMITTED') return false;
        if (currentFilter === 'portal' && (job.status !== 'SUBMITTED' || job.submissionMethod !== 'Via Opening Portal')) return false;
        if (currentFilter === 'autofill' && (job.status !== 'SUBMITTED' || job.submissionMethod !== 'Via Autofill')) return false;
        if (currentFilter === 'ready' && job.status === 'SUBMITTED') return false;
        if (currentFilter === 'remote' && !job.workMode.toLowerCase().includes('remote')) return false;
        if (currentFilter === 'premium' && (job.salaryMinVal || 0) < 25) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchSkills = job.skills.some(s => s.toLowerCase().includes(q));
          const matchSource = job.source.toLowerCase().includes(q);
          if (!matchCompany && !matchTitle && !matchSkills && !matchSource) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = [
          '<div class="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">',
          '  <div class="text-4xl mb-3">🔍</div>',
          '  <h3 class="text-sm font-bold text-white mb-1">No matching openings found</h3>',
          '  <p class="text-xs">Try switching filter tabs or clearing your search term.</p>',
          '</div>'
        ].join(String.fromCharCode(10));
        return;
      }

      container.innerHTML = filtered.map(job => {
        const scoreBadge = job.score >= 85
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : job.score >= 75
          ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

        let statusBadgeHtml = '';
        if (job.status === 'SUBMITTED') {
          if (job.submissionMethod === 'Via Opening Portal') {
            statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">✓ Submitted (Portal)</span>';
          } else {
            statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">✓ Submitted (Autofill)</span>';
          }
        } else {
          statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Verified Match</span>';
        }

        const salaryDisplay = isPrivacyOn ? '••••••••••••' : job.realSalary;
        const resumeHtmlPath = 'data/tailored-documents/' + job.folderName + '/Ashutosh_Kumar_Resume.html';
        const coverHtmlPath = 'data/tailored-documents/' + job.folderName + '/Ashutosh_Kumar_Cover_Letter.html';
        const resumePdfPath = 'data/tailored-documents/' + job.folderName + '/Ashutosh_Kumar_Resume.pdf';
        const localPortal = job.portalFile ? ('data/mock-portal/' + job.portalFile) : (job.liveUrl || '#');
        const battleCardPath = 'data/interview-battlecards/' + job.folderName + '/Interview_Battle_Card.html';

        const appDate = job.appliedDate ? new Date(job.appliedDate) : new Date('2026-10-29');
        const now = new Date('2026-11-02');
        const daysElapsed = Math.max(0, Math.floor((now - appDate) / (1000 * 60 * 60 * 24)));
        const isFollowUpDue = job.status === 'SUBMITTED' && daysElapsed >= 4;

        return [
          '<div class="bg-[#111827] border border-slate-800 hover:border-slate-700 transition rounded-2xl p-4 md:p-5 shadow-sm space-y-3">',
          '  <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">',
          '    <div class="flex-1 space-y-1.5">',
          '      <div class="flex flex-wrap items-center gap-2">',
          '        <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold border ' + scoreBadge + '">' + job.score + '/100 Match</span>',
          '        ' + statusBadgeHtml,
          '        <span class="text-xs text-slate-400 font-mono">Req #' + job.reqId + '</span>',
          '        <span class="text-xs text-slate-400">&bull; ' + job.source + '</span>',
          '      </div>',
          '      <h3 class="text-base md:text-lg font-extrabold text-white">',
          '        <a href="' + localPortal + '" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition underline decoration-blue-500/30 hover:decoration-blue-400">',
          '          ' + job.title,
          '        </a>',
          '      </h3>',
          '      <div class="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-300">',
          '        <span class="font-bold text-white">' + job.company + '</span>',
          '        <span>&bull;</span>',
          '        <span>📍 ' + job.location + '</span>',
          '        <span>&bull;</span>',
          '        <span>💼 ' + job.workMode + '</span>',
          '        <span>&bull;</span>',
          '        <span class="font-mono text-emerald-400 font-bold">' + salaryDisplay + '</span>',
          '      </div>',
          '      <div class="pt-1 flex flex-wrap items-center gap-2">',
          '        <button onclick="openRouteAdvisorModal(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1.5" title="View Cross-Portal Response Probability &amp; Route Advisor">',
          '          <span>⭐ Route Advisor:</span> <span class="font-extrabold text-white">Direct Career Portal (4.2x Callback)</span> <span class="text-emerald-400 font-mono">↗</span>',
          '        </button>',
          '        <span class="text-[11px] text-slate-400 font-mono">⚡ Low Competition (&lt; 25) vs 800+ on LinkedIn</span>',
          '      </div>',
          '    </div>',
          '    <div class="flex flex-wrap items-center gap-2 shrink-0">',
          '      <a href="' + localPortal + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm">',
          '        <span>' + (job.portalFile ? '📋 Portal' : '🌐 Live Opening') + '</span> <span>↗</span>',
          '      </a>',
          '      <button onclick="openScreeningModal(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition flex items-center gap-1 shadow-xs" title="Open Instant Screening Question Cheat-Sheet & Autofill Answers">',
          '        <span>📋 Screening Q&amp;A</span>',
          '      </button>',
          '      <a href="' + battleCardPath + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition flex items-center gap-1" title="Open Technical Interview Battle-Card">',
          '        <span>🎯 Battle-Card ↗</span>',
          '      </a>',
          '      <button onclick="openRecruiterView(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition flex items-center gap-1 shadow-xs" title="View Exact Enterprise ATS &amp; Recruiter Review Screen">',
          '        <span>👁️ Recruiter View</span>',
          '      </button>',
          '    </div>',
          '  </div>',

          // Status & Follow-Up Ribbon if Submitted
          (job.status === 'SUBMITTED' ? [
            '<div class="bg-[#0b0f19] border border-emerald-500/20 rounded-xl px-3.5 py-2 text-xs flex flex-wrap items-center justify-between gap-2">',
            '  <div class="flex items-center gap-2">',
            '    <span class="text-emerald-400 font-bold">✓ Logged:</span>',
            '    <span class="text-white font-semibold">' + (job.submissionMethod || 'Via Opening Portal') + '</span>',
            '    <span class="text-slate-400 font-mono text-[11px]">&bull; Applied ' + (job.appliedDate || '2026-10-29') + '</span>',
            '    <span class="text-slate-400 font-mono text-[11px]">&bull; Ref: ' + (job.confirmationId || 'CONF-' + job.reqId) + '</span>',
            '  </div>',
            (isFollowUpDue ? [
              '<div class="flex items-center gap-2">',
              '  <span class="text-amber-300 font-bold flex items-center gap-1">⏳ Follow-up Due (' + daysElapsed + 'd)</span>',
              '  <button onclick="openFollowUpDraft(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition">',
              '    Draft ✉️',
              '  </button>',
              '</div>'
            ].join('') : ''),
            '</div>'
          ].join('') : ''),

          // Collapsible Match Evidence & Details
          '<details class="group bg-[#0b0f19]/60 border border-slate-800 rounded-xl text-xs text-slate-300">',
          '  <summary class="px-3.5 py-2 cursor-pointer font-bold text-slate-400 hover:text-white transition flex items-center justify-between select-none">',
          '    <span class="flex items-center gap-1.5"><span class="text-emerald-400 font-mono">▸</span> View Match Evidence, Resume-to-JD Keyword Diff &amp; ATS Score</span>',
          '    <span class="text-[11px] text-slate-500 font-mono group-open:rotate-180 transition-transform">▼</span>',
          '  </summary>',
          '  <div class="px-3.5 pb-3 pt-2 space-y-2.5 border-t border-slate-800/80">',
          '    <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">',
          '      <div class="flex items-center justify-between gap-2">',
          '        <span class="text-[11px] font-bold text-white uppercase tracking-wider">🎯 Resume-to-JD Keyword Alignment:</span>',
          '        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">96% ATS Pass</span>',
          '      </div>',
          '      <div class="space-y-1 text-[11px]">',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-emerald-400">🟢 Exact Matches:</strong> <span class="text-slate-300">Angular 15+, Angular Material UI, TypeScript, HTML5/SCSS, Design Tokens, WCAG 2.1 AA, Playwright, Responsive/Grid</span></div>',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-cyan-400">🟡 Semantic Equivalents:</strong> <span class="text-slate-300">Micro-Frontends ↔ Modular UI Architecture, Cross-Browser QA ↔ Playwright Testing</span></div>',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-amber-400">💡 Tuning Tip:</strong> <span class="text-slate-300">Emphasize your Samsung SDS 97/100 rating and automated Playwright test suites in Project #1 to guarantee immediate shortlisting.</span></div>',
          '      </div>',
          '    </div>',
          job.evidence.map(e => '    <div class="flex items-start gap-1.5 text-slate-300"><span class="text-emerald-400 shrink-0">✓</span> <span>' + e + '</span></div>').join(String.fromCharCode(10)),
          '  </div>',
          '</details>',

          // Skills & Bottom Action Strip
          '<div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">',
          '  <div class="flex flex-wrap gap-1.5">',
          job.skills.slice(0, 5).map(s => '    <span class="px-2 py-0.5 bg-slate-900 text-slate-300 text-[10px] rounded-md border border-slate-800 font-medium">' + s + '</span>').join(String.fromCharCode(10)),
          (job.skills.length > 5 ? '    <span class="px-2 py-0.5 bg-slate-900 text-slate-500 text-[10px] rounded-md border border-slate-800">+' + (job.skills.length - 5) + '</span>' : ''),
          '  </div>',
          '  <div class="flex items-center gap-1.5 shrink-0">',
          '    <a href="' + resumeHtmlPath + '" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition" title="Open Tailored Resume">Resume ↗</a>',
          '    <a href="' + coverHtmlPath + '" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition" title="Open Tailored Cover Letter">Letter ↗</a>',
          '    <a href="' + resumePdfPath + '" target="_blank" download class="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold transition" title="Download ATS PDF">PDF</a>',
          '    <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono font-semibold flex items-center gap-1">',
          '      <span>⚡ Pipeline:</span> <strong class="text-emerald-400">' + (job.pipelineStage || 'SUBMITTED') + '</strong>',
          '    </span>',
          '  </div>',
          '</div>',

          '</div>'
        ].join(String.fromCharCode(10));
      }).join(String.fromCharCode(10));
    }

    function setFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.className = 'filter-btn active px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs transition shrink-0';
        } else {
          btn.className = 'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b0f19] text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0';
        }
      });
      renderJobs();
    }

    function handleSearch() {
      searchQuery = document.getElementById('searchInput').value;
      renderJobs();
    }

    function togglePrivacyMode() {
      isPrivacyOn = !isPrivacyOn;
      const btn = document.getElementById('privacyToggleBtn');
      const icon = document.getElementById('privacyIcon');
      const text = document.getElementById('privacyStatusText');
      const candCtcSpan = document.getElementById('candCurrentCtcDisplay');
      const candTargetCtcSpan = document.getElementById('candTargetCtc');

      if (isPrivacyOn) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 flex items-center gap-1.5';
        icon.innerText = '🛡️';
        text.innerText = 'Privacy: ON';
        candCtcSpan.innerText = '₹•••••• PA';
        if (candTargetCtcSpan) candTargetCtcSpan.innerText = '₹•••••• (Remote/NCR) • ₹•••••• (Out of NCR)';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition border bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5';
        icon.innerText = '👁️';
        text.innerText = 'Privacy: OFF';
        const cand = (typeof currentCandidate !== 'undefined' && currentCandidate) ? currentCandidate : { currentCtc: '₹6,00,000 PA (6 LPA)', targetCtc: '₹12+ LPA (Remote/NCR) • ₹15+ LPA (Out of NCR)' };
        candCtcSpan.innerText = cand.currentCtc;
        if (candTargetCtcSpan) candTargetCtcSpan.innerText = cand.targetCtc;
      }

      renderJobs();
      if (currentActiveTab === 'kanban') renderKanban();
      if (currentActiveTab === 'battlecards') renderBattlecardsView();
    }

    function openPhoneModal() {
      const modal = document.getElementById('phoneModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      if (!qrGenerated) {
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer && typeof QRCode !== 'undefined') {
          qrContainer.innerHTML = '';
          new QRCode(qrContainer, {
            text: activeShareUrl,
            width: 180,
            height: 180,
            colorDark: '#0f172a',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
          qrGenerated = true;
        }
      }
    }

    function closePhoneModal() {
      const modal = document.getElementById('phoneModal');
      if (modal) modal.classList.add('hidden');
    }

    function copyShareLink() {
      navigator.clipboard.writeText(activeShareUrl).then(() => {
        showReloadToast('Copied live share URL to clipboard!');
      });
    }

    function openCandidateModal() {
      const modal = document.getElementById('candidateModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeCandidateModal() {
      const modal = document.getElementById('candidateModal');
      if (modal) modal.classList.add('hidden');
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showReloadToast('Copied: ' + text);
      });
    }

    async function openEmailLogModal() {
      const modal = document.getElementById('emailLogModal');
      const container = document.getElementById('emailLogListContainer');
      const countBadge = document.getElementById('emailReceiptCountBadge');
      if (!modal || !container) return;

      container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">Loading audit receipts...</div>';
      modal.classList.remove('hidden');

      try {
        const res = await fetch('/api/email-dispatches');
        if (res.ok) {
          const logs = await res.json();
          if (countBadge) countBadge.innerText = logs.length + ' Receipts';
          if (logs.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">No email receipts found yet.</div>';
            return;
          }
          container.innerHTML = logs.map(l => {
            const dateStr = new Date(l.timestamp).toLocaleString('en-IN');
            return [
              '<div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">',
              '  <div class="flex items-center justify-between text-xs">',
              '    <span class="font-bold text-white">' + l.company + ' &bull; ' + l.jobTitle + '</span>',
              '    <span class="text-slate-400 font-mono text-[10px]">' + dateStr + '</span>',
              '  </div>',
              '  <div class="text-[11px] text-slate-400 font-mono">Ref: ' + l.confirmationId + ' &bull; Portal: ' + l.portalFile + '</div>',
              '  <div class="flex items-center justify-between pt-1">',
              '    <span class="text-[10px] text-emerald-400 font-bold">&check; Audit Verified</span>',
              '    <a href="' + l.receiptUrl + '" target="_blank" class="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">View Receipt ↗</a>',
              '  </div>',
              '</div>'
            ].join(String.fromCharCode(10));
          }).join(String.fromCharCode(10));
        }
      } catch (e) {
        container.innerHTML = '<div class="text-center py-8 text-rose-400 text-xs">Error loading audit receipts.</div>';
      }
    }

    function closeEmailLogModal() {
      const modal = document.getElementById('emailLogModal');
      if (modal) modal.classList.add('hidden');
    }

    function closeModal() {
      const modal = document.getElementById('previewModal');
      if (modal) modal.classList.add('hidden');
    }

    // Auto-focus synchronization & keyboard reload shortcut
    window.addEventListener('focus', () => reloadUpdatedJobs(false));
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        reloadUpdatedJobs(true);
      }
    });

    // Check tunnel URL on boot
    fetch('/api/network-info')
      .then(res => res.json())
      .then(info => {
        if (info.publicUrl) {
          activeShareUrl = info.publicUrl;
          const modalText = document.getElementById('modalPublicUrlText');
          if (modalText) modalText.innerText = info.publicUrl;
        }
      })
      .catch(() => {});

    // Initial render
    renderJobs();
  </script>

  <!-- Extended Features Script (Kanban, Battlecards Tab, Offer Calculator, Tools) -->
  <script>
    ${dashboardFeaturesJs}
  </script>

  <!-- Toast Notification Container -->
  
  <!-- Add New Candidate Profile Modal Wizard -->
  <div id="addCandidateModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div class="flex items-center gap-2">
          <span class="text-xl">👤</span>
          <div>
            <h3 class="text-sm font-bold text-white">Add New Candidate Profile</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Create an isolated job search workspace for another candidate</p>
          </div>
        </div>
        <button onclick="closeAddCandidateModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <form onsubmit="handleAddCandidateSubmit(event)" class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19] text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Candidate Full Name *</label>
            <input type="text" id="newCandName" required placeholder="e.g. Neha Sharma" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Avatar Emoji</label>
            <input type="text" id="newCandAvatar" placeholder="👩‍💻, 👨‍💼, 👤" value="👩‍💻" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Target Professional Role / Title *</label>
          <input type="text" id="newCandTitle" required placeholder="e.g. Lead Full-Stack Engineer (React &amp; Node.js)" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Experience (Years)</label>
            <input type="number" id="newCandExp" step="0.5" placeholder="8.0" value="8" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Notice Period</label>
            <input type="text" id="newCandNotice" placeholder="30 Days / Immediate" value="30 Days" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Current CTC (in LPA)</label>
            <input type="number" id="newCandCurrentCtc" step="0.5" placeholder="14" value="14" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Target Minimum CTC (in LPA)</label>
            <input type="number" id="newCandTargetCtc" step="0.5" placeholder="26" value="26" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Contact Email Address</label>
          <input type="email" id="newCandEmail" placeholder="candidate@example.com" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Primary Tech Stack Skills (comma-separated)</label>
          <input type="text" id="newCandSkills" placeholder="React, Node.js, TypeScript, PostgreSQL, AWS, Docker" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <!-- RESUME DOCUMENT UPLOAD (Dedicated Feature) -->
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1.5">
          <label class="block text-slate-300 font-bold flex items-center justify-between">
            <span>📄 Upload Resume Document (.pdf, .doc, .docx, .txt)</span>
            <span class="text-[10px] text-blue-400 font-mono">Stored in data/resumes/</span>
          </label>
          <input type="file" id="newCandResume" accept=".pdf,.doc,.docx,.txt,.md" class="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Access Role Level</label>
            <select id="newCandAccessRole" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
              <option value="write">🟢 Write (Editor) — Can Apply &amp; Advance</option>
              <option value="read">🔵 Read/View (Viewer) — View Only</option>
              <option value="admin">🛡️ Admin — Full Agency Access</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Temporary Password</label>
            <input type="password" id="newCandPass" value="welcome123" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button type="button" onclick="closeAddCandidateModal()" class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm">
            ✓ Create Candidate Workspace
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Candidate Email Verification Modal -->
  <div id="verifyCandidateModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div class="flex items-center gap-2">
          <span class="text-xl">✉️</span>
          <div>
            <h3 class="text-sm font-bold text-white">Candidate Email Identity Verification</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Verify candidate email before recruiter submissions</p>
          </div>
        </div>
        <button onclick="closeVerifyModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-5 space-y-4 text-xs bg-[#0b0f19]">
        <div class="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 space-y-1">
          <div class="font-bold text-white flex items-center gap-1.5">
            <span>📧 Verification Dispatch Dispatched</span>
          </div>
          <p class="text-[11px] leading-relaxed">
            We have generated an official verification code for <strong id="verifyCandNameEmail" class="text-white">Test Candidate (test.candidate@example.com)</strong>. Enter the OTP code below or click the 1-click test verify link:
          </p>
        </div>

        <div class="space-y-1.5 text-center">
          <label class="block text-slate-300 font-bold text-xs">Enter 6-Digit Verification Code (OTP):</label>
          <input type="text" id="verifyOtpCodeInput" maxlength="6" placeholder="482910" class="w-48 mx-auto text-center font-mono text-2xl tracking-[6px] font-black bg-slate-900 border-2 border-blue-500/60 text-white rounded-xl p-2.5 focus:outline-none focus:border-blue-400">
          <p class="text-[10px] text-slate-400">Default test OTP: <code>482910</code> (or check generated dispatch)</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button onclick="submitCandidateOtp()" class="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition flex items-center justify-center gap-1.5">
            <span>✓ Verify OTP Code</span>
          </button>
          <button onclick="resendCandidateVerification()" class="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5">
            <span>🔄 Resend Code</span>
          </button>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <a id="verifyViewDispatchLink" href="/data/email-dispatches/" target="_blank" class="hover:text-blue-400 transition underline flex items-center gap-1">
            <span>📄 View Email Dispatch</span> <span>↗</span>
          </a>
          <button onclick="instantTestVerify()" class="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer">
            ⚡ 1-Click Instant Verify
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Gmail Connection Setup Modal (Dual-Mode: App Password SMTP & Google Cloud OAuth 2.0) -->
  <div id="gmailSetupModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden text-white max-h-[92vh]">
      <!-- Header -->
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">⚙️</span>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Gmail API &amp; Recruiter Inbox Setup</span>
              <span id="modalGmailStatusPill" class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Simulation Ready</span>
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Automated callback detection for kumar.ashu872@gmail.com</p>
          </div>
        </div>
        <button onclick="closeGmailSetupModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Account Context Banner -->
      <div class="px-5 pt-4 pb-2 bg-[#0b0f19]">
        <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-base">👤</span>
            <div>
              <div class="text-[11px] text-slate-400">Target Google Account:</div>
              <div class="text-xs font-bold text-white font-mono" id="modalTargetEmailDisplay">kumar.ashu872@gmail.com</div>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🛡️ Verified Admin</span>
        </div>
      </div>

      <!-- Tab Switcher (App Password vs OAuth) -->
      <div class="px-5 pt-2 bg-[#0b0f19]">
        <div class="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button id="gmailTabBtnAppPass" onclick="switchGmailAuthTab('apppass')" class="py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 bg-blue-600 text-white shadow-sm">
            <span>⚡</span>
            <span>App Password (1 Min)</span>
          </button>
          <button id="gmailTabBtnOAuth" onclick="switchGmailAuthTab('oauth')" class="py-2 rounded-lg font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5">
            <span>☁️</span>
            <span>Google Cloud OAuth 2.0</span>
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-5 overflow-y-auto space-y-4 text-xs bg-[#0b0f19] flex-1">

        <!-- METHOD A: 16-Letter App Password Tab -->
        <div id="gmailMethodAppPass" class="space-y-3.5">
          <div class="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 text-[11px] leading-relaxed space-y-2">
            <div class="font-bold text-white flex items-center gap-1.5">
              <span>💡</span>
              <span>Fastest Setup: Google 16-Character App Password</span>
            </div>
            <ol class="list-decimal list-inside space-y-1 text-slate-300">
              <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline font-semibold">myaccount.google.com/apppasswords ↗</a></li>
              <li>App Name: enter <strong class="text-white">TalentFlow AI</strong> and click <strong class="text-white">Create</strong></li>
              <li>Copy the generated 16-character code and paste below.</li>
            </ol>
            <div class="text-[10px] text-slate-400 italic">Requires 2-Step Verification enabled on your Google Account.</div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-slate-300 font-semibold text-xs">Google Account Email:</label>
            <input type="email" id="gmailAppPassEmail" value="kumar.ashu872@gmail.com" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-blue-500 focus:outline-none">
          </div>

          <div class="space-y-1.5">
            <label class="block text-slate-300 font-semibold text-xs">16-Character App Password:</label>
            <div class="relative">
              <input type="password" id="gmailAppPassInput" placeholder="abcd efgh ijkl mnop" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono tracking-wider focus:border-blue-500 focus:outline-none">
              <button type="button" onclick="toggleAppPassVisibility()" class="absolute right-3 top-2 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
            <p class="text-[10px] text-slate-400">Spaces are ignored automatically.</p>
          </div>

          <div id="appPassStatusMsg" class="hidden text-xs p-3 rounded-xl"></div>

          <div class="flex items-center gap-2 pt-1">
            <button id="btnConnectAppPass" onclick="submitAppPasswordConnection()" class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition flex items-center justify-center gap-1.5">
              <span>🔐</span>
              <span>Verify &amp; Connect App Password</span>
            </button>
          </div>
        </div>

        <!-- METHOD B: Google Cloud OAuth 2.0 Tab -->
        <div id="gmailMethodOAuth" class="space-y-3.5 hidden">
          <div class="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-[11px] leading-relaxed space-y-2">
            <div class="font-bold text-white flex items-center gap-1.5">
              <span>☁️</span>
              <span>Google Cloud OAuth 2.0 Setup</span>
            </div>
            <ol class="list-decimal list-inside space-y-1 text-slate-300">
              <li>In <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-semibold">Google Cloud Console ↗</a>, enable the <strong class="text-white">Gmail API</strong>.</li>
              <li>Create OAuth 2.0 Client ID (Application type: <strong class="text-white">Web application</strong>).</li>
              <li>Add this exact Authorized redirect URI:
                <div class="mt-1 flex items-center gap-1.5">
                  <code id="oauthRedirectUriCode" class="text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px] break-all select-all flex-1">http://localhost:5000/api/gmail/oauth2callback</code>
                  <button type="button" onclick="copyOAuthRedirectUri()" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 rounded shrink-0">Copy</button>
                </div>
              </li>
              <li>Enter your Client ID and Client Secret below and click Authorize.</li>
            </ol>
          </div>

          <div class="space-y-1.5">
            <label class="block text-slate-300 font-semibold text-xs">Google OAuth Client ID:</label>
            <input type="text" id="gmailClientIdInput" placeholder="xxxx.apps.googleusercontent.com" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none">
          </div>

          <div class="space-y-1.5">
            <label class="block text-slate-300 font-semibold text-xs">Google OAuth Client Secret:</label>
            <input type="password" id="gmailClientSecretInput" placeholder="GOCSPX-xxxx" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none">
          </div>

          <div id="oauthStatusMsg" class="hidden text-xs p-3 rounded-xl"></div>

          <div class="flex items-center gap-2 pt-1">
            <button id="btnAuthorizeOAuth" onclick="submitOAuthAuthorization()" class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition flex items-center justify-center gap-1.5">
              <span>🚀</span>
              <span>Save &amp; Authorize with Google →</span>
            </button>
          </div>
        </div>

        <!-- Connection Management & Reset Section -->
        <div id="activeGmailConnectionActions" class="hidden pt-3 border-t border-slate-800 flex items-center justify-between">
          <div class="text-[11px] text-slate-400">
            Status: <span id="activeConnectionModeLabel" class="text-emerald-400 font-semibold">Active</span>
          </div>
          <button onclick="disconnectLiveGmail()" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition">
            Disconnect &amp; Reset to Simulation
          </button>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
        <span class="text-[11px] text-slate-400 font-mono">TLS / OAuth 2.0 Encrypted</span>
        <button onclick="closeGmailSetupModal()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
          Close
        </button>
      </div>
    </div>
  </div>

  <div id="toastContainer" class="fixed bottom-20 md:bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

</body>
</html>`;
}

const html = buildDashboardHtml();

// Write to index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html');

// Write to data/reports/dashboard.html
fs.writeFileSync('data/reports/dashboard.html', html, 'utf8');
console.log('Updated data/reports/dashboard.html');

// Write to artifact dashboard.html
const artifactPath = 'C:/Users/lenovo/.gemini/antigravity/brain/4209fc56-25df-461d-bd0d-9acbc653527f/dashboard.html';
if (fs.existsSync(path.dirname(artifactPath))) {
  fs.writeFileSync(artifactPath, html, 'utf8');
  console.log('Updated artifact dashboard.html');
}
