import { JobListing } from '../types/index.js';
import { JobSourceAdapter } from './adapter-interface.js';

export class MockJobSourceAdapter implements JobSourceAdapter {
  public name = 'Mock Verified Enterprise Feeds';
  public capabilities = {
    canDiscover: true,
    canFetchDetails: true,
    canVerifyEmployer: true,
    canUploadResume: false,
    canSubmit: false,
    canCheckStatus: false
  };

  public async fetchJobs(): Promise<JobListing[]> {
    // Current date reference: October 2026
    return [
      {
        id: 'job-mock-001',
        title: 'Senior UI Developer - Design Systems',
        company: 'Nagarro Enterprises',
        officialUrl: 'https://www.nagarro.com/en/careers',
        source: 'Nagarro Career Portal',
        postingDate: '2026-10-25',
        location: 'Gurugram / Noida (Delhi NCR)',
        workMode: 'Hybrid',
        salaryMin: 1800000,
        salaryMax: 2600000,
        currency: 'INR',
        salaryRaw: '₹18,00,000 - ₹26,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Seeking a Senior UI Developer with 7-10 years experience to lead our enterprise design system implementation. Must possess expert mastery of HTML5, CSS3, SCSS, JavaScript (ES6+), Angular Material UI, reusable component architecture, and pixel-perfect Figma-to-code workflow. Experience in WCAG 2.1 AA accessibility standards, semantic markup, and automated UI testing with Playwright or Cypress is highly valued.',
        requiredSkills: [
          'HTML5',
          'CSS3',
          'SCSS',
          'JavaScript (ES6)',
          'Angular Material UI',
          'Design Systems',
          'Figma-to-Code',
          'WCAG 2.1',
          'Playwright'
        ],
        requisitionId: 'NAG-UI-4912'
      },
      {
        id: 'job-mock-002',
        title: 'Senior Frontend Engineer (UI/UX Engineering)',
        company: 'Samsung SDS Global',
        officialUrl: 'https://www.samsungsds.com/en/careers/careers.html',
        source: 'Samsung SDS Career Page',
        postingDate: '2026-10-26',
        location: 'New Delhi / Remote India',
        workMode: 'Remote',
        salaryMin: 2200000,
        salaryMax: 3000000,
        currency: 'INR',
        salaryRaw: '₹22,00,000 - ₹30,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Samsung SDS is looking for an experienced Senior Frontend Engineer with 8+ years experience in enterprise platform development. Role focuses on high-performance web interfaces, scalable CSS architecture, Angular/Angular Material UI components, Core Web Vitals optimization, and cross-browser consistency. Candidate will partner closely with global product teams to convert Zeplin/Figma designs into accessible, responsive interfaces.',
        requiredSkills: [
          'Angular',
          'Angular Material',
          'HTML5',
          'SCSS',
          'JavaScript',
          'WCAG Accessibility',
          'Core Web Vitals',
          'Figma-to-Code',
          'Enterprise Platforms'
        ],
        requisitionId: 'SSDS-2026-8821'
      },
      {
        id: 'job-mock-003',
        title: 'Lead UI Engineer / Design Systems Architect',
        company: 'Wipro Digital',
        officialUrl: 'https://careers.wipro.com/',
        source: 'Wipro Careers',
        postingDate: '2026-10-24',
        location: 'Noida, Delhi NCR',
        workMode: 'Hybrid',
        salaryMin: 2000000,
        salaryMax: 2800000,
        currency: 'INR',
        salaryRaw: '₹20,00,000 - ₹28,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Lead UI Engineer needed to build reusable UI component libraries and design tokens across enterprise web applications. Requires strong background in HTML5, CSS Grid, Flexbox, SCSS, JavaScript, Angular component architecture, accessibility compliance (Section 508 / WCAG), and automated UI regression testing with Playwright.',
        requiredSkills: [
          'Design Systems',
          'Design Tokens',
          'Angular',
          'HTML5',
          'CSS3',
          'SCSS',
          'Accessibility',
          'Playwright'
        ],
        requisitionId: 'WIP-DEL-7731'
      },
      {
        id: 'job-mock-004',
        title: 'Senior Frontend Developer (Remote India)',
        company: 'GitLab Partner Ecosystem',
        officialUrl: 'https://about.gitlab.com/jobs/',
        source: 'Remote Tech Board',
        postingDate: '2026-10-27',
        location: 'Remote, India',
        workMode: 'Remote',
        salaryMin: 2500000,
        salaryMax: 3500000,
        currency: 'INR',
        salaryRaw: '₹25,00,000 - ₹35,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Join our global remote team building frontend applications and internal tooling. Looking for 6-9 years of frontend experience with deep expertise in JavaScript, modern CSS/SCSS, responsive design, component-driven UI development, Figma asset conversion, and Playwright automated end-to-end testing.',
        requiredSkills: [
          'JavaScript (ES6+)',
          'CSS3',
          'SCSS',
          'Responsive Web Design',
          'Figma-to-Code',
          'Playwright Test',
          'Git'
        ]
      },
      {
        id: 'job-mock-005',
        title: 'Senior UI Developer & Email Operations Specialist',
        company: 'Experience Commerce (Cheil Group)',
        officialUrl: 'https://www.experiencecommerce.com/',
        source: 'Company Website',
        postingDate: '2026-10-23',
        location: 'Gurugram, Delhi NCR',
        workMode: 'Hybrid',
        salaryMin: 1400000,
        salaryMax: 1900000,
        currency: 'INR',
        salaryRaw: '₹14,00,000 - ₹19,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Dual-focus role delivering responsive web interfaces and cross-client responsive HTML email campaigns for top brands. Strong skills required in HTML5, SCSS, JavaScript, table-based email rendering QA (Outlook, iOS Mail, Gmail), Figma-to-HTML, Jira ticket triage, and WCAG accessibility standards.',
        requiredSkills: [
          'HTML5',
          'SCSS',
          'Responsive HTML Email Templating',
          'Cross-Browser QA',
          'Figma-to-Code',
          'Jira',
          'Accessibility'
        ]
      },
      {
        id: 'job-mock-006',
        title: 'Senior UI/Frontend Engineer',
        company: 'Cisco Systems Partner Network',
        officialUrl: 'https://jobs.cisco.com/',
        source: 'Enterprise Partner Portal',
        postingDate: '2026-10-28',
        location: 'Remote (India)',
        workMode: 'Remote',
        salaryMin: 2400000,
        salaryMax: 3200000,
        currency: 'INR',
        salaryRaw: '₹24,00,000 - ₹32,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Seeking a Senior UI Engineer to craft mission-critical enterprise portal screens and network workflow management consoles. Direct experience with Angular Material UI, Bootstrap, responsive design, wireframe-to-prototype realization, and Playwright UI regression suites is preferred.',
        requiredSkills: [
          'Angular Material UI',
          'HTML5',
          'CSS3',
          'Bootstrap',
          'JavaScript',
          'Playwright',
          'Enterprise Portals'
        ]
      },
      {
        id: 'job-mock-007',
        title: 'Frontend UI Engineer (Design Systems)',
        company: 'Acme Global Cloud',
        officialUrl: 'https://remoteok.com/',
        source: 'Public Board',
        postingDate: '2026-10-26',
        location: 'Worldwide Remote (India Eligible)',
        workMode: 'Remote',
        salaryMin: 50000,
        salaryMax: 70000,
        currency: 'USD',
        salaryRaw: '$50,000 - $70,000 USD/year',
        employmentType: 'Full-time Contract',
        description:
          'We are seeking a Frontend UI Engineer to build accessible, clean web components and design systems. Looking for expertise in vanilla JavaScript, CSS Grid, Flexbox, SCSS, Figma design handoff, and UI test automation. India-based candidates welcome.',
        requiredSkills: [
          'JavaScript',
          'CSS Grid',
          'Flexbox',
          'SCSS',
          'Design Systems',
          'Figma',
          'Accessibility'
        ]
      },
      {
        id: 'job-mock-008',
        title: 'Senior WordPress & Frontend Developer',
        company: 'Mindrops Digital Studio',
        officialUrl: 'https://mindrops.com/',
        source: 'Mindrops Portal',
        postingDate: '2026-10-22',
        location: 'New Delhi / Remote India',
        workMode: 'Hybrid',
        salaryMin: 1200000,
        salaryMax: 1600000,
        currency: 'INR',
        salaryRaw: '₹12,00,000 - ₹16,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Looking for a Senior WordPress and Frontend Developer with 6+ years experience. Expert in custom theme development, PHP/WordPress templates, responsive HTML5/SCSS, semantic markup, SEO best practices, and Figma/PSD conversion.',
        requiredSkills: [
          'WordPress',
          'HTML5',
          'SCSS',
          'JavaScript',
          'SEO-friendly markup',
          'Figma-to-Code'
        ]
      },
      {
        id: 'job-mock-009',
        title: 'Senior Frontend Engineer - AI Workflows',
        company: 'Cognitive Web Labs',
        officialUrl: 'https://wellfound.com/',
        source: 'AngelList / Wellfound',
        postingDate: '2026-10-25',
        location: 'Remote (India)',
        workMode: 'Remote',
        salaryMin: 2000000,
        salaryMax: 2800000,
        currency: 'INR',
        salaryRaw: '₹20,00,000 - ₹28,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Help build the next generation of AI-assisted web applications. We need a Senior Frontend Developer skilled in modern JavaScript/HTML/CSS, component-based architectures, and AI development workflows (Cursor AI, Claude, LLM integration). Experience authoring Playwright UI test automation is highly desired.',
        requiredSkills: [
          'JavaScript (ES6)',
          'HTML5',
          'CSS3',
          'Cursor AI',
          'Claude',
          'Playwright',
          'Design Systems'
        ]
      },
      {
        id: 'job-mock-010',
        title: 'Senior UI/UX Developer',
        company: 'Incedo Inc.',
        officialUrl: 'https://www.incedoinc.com/careers/',
        source: 'Incedo Careers',
        postingDate: '2026-10-24',
        location: 'Gurugram, Delhi NCR',
        workMode: 'Hybrid',
        salaryMin: 1600000,
        salaryMax: 2200000,
        currency: 'INR',
        salaryRaw: '₹16,00,000 - ₹22,00,000 PA',
        employmentType: 'Full-time',
        description:
          'Seeking a Senior UI/UX Developer with substantial frontend implementation experience. Candidate must be capable of translating complex Figma designs into responsive HTML5/SCSS pages, crafting reusable UI components, and ensuring strict WCAG accessibility and cross-browser compatibility.',
        requiredSkills: [
          'HTML5',
          'SCSS',
          'JavaScript',
          'Figma-to-Code',
          'WCAG',
          'Responsive Web Design',
          'Reusable UI Patterns'
        ]
      },

      // --- Intentional Trap/Disqualification Test Fixtures ---
      {
        id: 'job-trap-react-01',
        title: 'Senior React Developer (Mandatory Production React)',
        company: 'Fintech Solutions Ltd',
        officialUrl: 'https://fintechsolutions.com/careers/sr-react-dev',
        source: 'Public Board',
        postingDate: '2026-10-26',
        location: 'Remote, India',
        workMode: 'Remote',
        salaryMin: 2500000,
        salaryMax: 3500000,
        currency: 'INR',
        salaryRaw: '₹25,00,000 - ₹35,00,000 PA',
        description:
          'Expert in React.js and Redux needed. Mandatory: 6+ years production React experience with deep knowledge of React hooks, Next.js, and Redux toolkit.',
        requiredSkills: ['React', 'Redux', 'Next.js', 'TypeScript']
      },
      {
        id: 'job-trap-location-01',
        title: 'Senior UI Developer (On-site Bangalore Only)',
        company: 'Bangalore Tech Park Corp',
        officialUrl: 'https://bangaloretech.in/jobs/ui-dev-blr',
        source: 'Public Board',
        postingDate: '2026-10-26',
        location: 'Bangalore / Bengaluru (Karnataka)',
        workMode: 'On-site',
        salaryMin: 2000000,
        salaryMax: 2600000,
        currency: 'INR',
        salaryRaw: '₹20,00,000 - ₹26,00,000 PA',
        description:
          'Strictly on-site position located at our Whitefield campus in Bangalore. Candidate must report in-person daily. Expert HTML5, SCSS, Angular Material.',
        requiredSkills: ['HTML5', 'SCSS', 'Angular Material']
      },
      {
        id: 'job-trap-salary-01',
        title: 'Junior/Mid UI Developer',
        company: 'Budget Web Services',
        officialUrl: 'https://budgetweb.in/jobs/ui-dev-low',
        source: 'Public Board',
        postingDate: '2026-10-26',
        location: 'New Delhi',
        workMode: 'On-site',
        salaryMin: 400000,
        salaryMax: 600000,
        currency: 'INR',
        salaryRaw: '₹4,00,000 - ₹6,00,000 PA',
        description: 'Frontend developer needed for HTML/CSS landing pages. Salary strictly ₹6 LPA max.',
        requiredSkills: ['HTML5', 'CSS3']
      },
      {
        id: 'job-trap-expired-01',
        title: 'Senior UI Developer (Expired)',
        company: 'Old Portal Inc',
        officialUrl: 'https://oldportal.com/jobs/senior-ui-old',
        source: 'Old Feed',
        postingDate: '2026-08-01', // > 80 days ago
        location: 'Noida (Delhi NCR)',
        workMode: 'Hybrid',
        salaryMin: 1800000,
        salaryMax: 2400000,
        currency: 'INR',
        description: 'Senior UI Developer needed. HTML5, SCSS, Angular Material.',
        requiredSkills: ['HTML5', 'SCSS', 'Angular']
      }
    ];
  }
}
