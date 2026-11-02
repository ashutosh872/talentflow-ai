import { CandidateProfile } from '../types/index.js';

/**
 * SOURCE OF TRUTH: Ashutosh Kumar Verified Resume (October 2026)
 * As extracted from "Ashutosh Kumar Senior Frontend Engineer Resume.pdf"
 * 
 * Rules:
 * - 8+ years experience
 * - Current: Frontend Developer (Contract) at Wondrfly (Sep 2025 - Present)
 * - Enterprise history: Samsung SDS, Cisco (via Infinity Labs), Experience Commerce, Mindrops, Codifier
 * - Core skills: HTML5, CSS3, SCSS, JavaScript, jQuery, Bootstrap, Responsive Design, CSS Grid, Flexbox,
 *   Angular Material UI, Reusable UI Patterns, Design Systems, Figma-to-Code, WCAG 2.1/2.2, Section 508,
 *   Performance, Core Web Vitals, Playwright, Cursor AI, Claude, Git, Jira, ClickUp, WordPress.
 * - Non-Specialization: React is NOT Ashutosh's primary specialization. React-mandatory positions must be excluded.
 */
export const VERIFIED_CANDIDATE_PROFILE: CandidateProfile = {
  name: 'Ashutosh Kumar',
  title: 'Senior Frontend Engineer • Senior UI Developer',
  contact: {
    email: 'kumar.ashu872@gmail.com',
    phone: '+91 9310681373',
    location: 'New Delhi, India',
    linkedin: 'https://linkedin.com/in/kumarashu872'
  },
  yearsOfExperience: 8,
  summary:
    'Senior Frontend/UI Engineer with 8+ years of experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and growing businesses, including Samsung SDS, Cisco, and Wondrfly. Skilled in HTML5, CSS3, SCSS/Sass, JavaScript (ES6), Angular Material UI, reusable UI patterns, design systems, and pixel-perfect Figma-to-code implementation. Experienced in WCAG accessibility, cross-browser compatibility, responsive HTML email templating, SEO-friendly markup, and frontend performance practices. Actively leverages Cursor AI and Claude to streamline AI-assisted development workflows, test authoring, and bug reproduction. At Wondrfly, contributed to Playwright-based test automation and an impact-aware bug validation workflow.',
  skills: {
    frontendCore: [
      'HTML5',
      'CSS3',
      'SCSS/Sass',
      'JavaScript (ES6)',
      'jQuery',
      'Bootstrap',
      'CSS Grid',
      'Flexbox',
      'Responsive Web Design',
      'Cross-Browser Compatibility',
      'Responsive HTML Email Templating'
    ],
    uiEngineering: [
      'Angular Material UI',
      'Reusable UI Components',
      'Component-Based Architecture',
      'Design Systems',
      'Design Tokens',
      'Pixel-Perfect UI',
      'Figma-to-Code',
      'Design-to-Code',
      'PSD-to-HTML'
    ],
    testingAutomation: [
      'Playwright',
      'Playwright Test',
      'Targeted Regression Testing',
      'UI Validation',
      'Bug Reproduction',
      'Test Reporting',
      'Impact-Aware Bug Validation'
    ],
    accessibilityAndSeo: [
      'WCAG 2.1/2.2',
      'Section 508',
      'Semantic HTML',
      'Accessible Forms',
      'SEO-Friendly Markup'
    ],
    performance: [
      'Web Performance Optimization',
      'Core Web Vitals Awareness',
      'Scalable & Maintainable CSS Architecture'
    ],
    toolsAndAi: [
      'Cursor AI',
      'Claude',
      'ChatGPT',
      'Figma',
      'Zeplin',
      'Photoshop',
      'InVision',
      'WordPress',
      'Git',
      'Jira',
      'ClickUp',
      'VS Code',
      'Agile/Scrum',
      'Code Reviews'
    ]
  },
  workHistory: [
    {
      role: 'Frontend Developer (Contract)',
      company: 'Wondrfly',
      period: 'Sep 2025 – Present',
      highlights: [
        'Build and maintain responsive, pixel-perfect website interfaces from Figma designs using HTML5, SCSS, JavaScript, and Angular Material UI.',
        'Translate design specifications into production-ready UI, ensuring visual consistency across complex layouts and responsive breakpoints.',
        'Develop and maintain reusable UI patterns and scalable styling architecture to support long-term codebase maintainability.',
        'Contribute to Playwright-based browser automation to validate UI behavior and catch regressions in critical user flows.',
        'Designed an impact-based bug-fix workflow concept connecting task context, Git change analysis, and targeted Playwright tests so validation focuses on impacted components instead of executing full end-to-end suites.',
        'Leverage AI-assisted tools (Cursor AI, Claude) to accelerate bug investigation, automated test generation, and fix-and-retest workflows; review outputs to isolate application defects from outdated test definitions.',
        'Resolve UI defects and responsive layout issues while upholding WCAG accessibility, cross-browser behavior, and web performance standards.'
      ]
    },
    {
      role: 'Frontend Developer (Freelance)',
      company: 'Multiple Clients',
      period: 'Mar 2023 – Aug 2025',
      highlights: [
        'Delivered high-quality frontend solutions for startups, commercial businesses, and NGOs, including Tripknock, Tripomate, and Urja for Women.',
        'Converted Figma and PSD design assets into clean, responsive, and production-ready web interfaces with standards-compliant markup.',
        'Built and customized WordPress websites and marketing landing pages, applying semantic markup and SEO-friendly implementation.',
        'Handled cross-browser UI defect resolution, responsiveness enhancements, and post-launch maintenance across client engagements.'
      ]
    },
    {
      role: 'Assistant Manager - Web Publisher',
      company: 'Samsung SDS',
      period: 'Sep 2022 – Mar 2023',
      highlights: [
        'Delivered and maintained enterprise web interfaces for Samsung HQ platforms utilizing internal UI frameworks and design systems.',
        'Maintained responsive behavior, content accuracy, and web accessibility standards while collaborating closely with global stakeholders.',
        'Received a 97/100 performance rating for outstanding code quality, precision, and timely delivery across platform deliverables.'
      ]
    },
    {
      role: 'Web Publisher & Designer',
      company: 'Experience Commerce (Samsung SDS Client)',
      period: 'Aug 2021 – Sep 2022',
      highlights: [
        'Published enterprise web pages from Zeplin designs and structured requirement documents for core Samsung SDS platforms.',
        'Performed UI quality assurance checks and championed reusable, cross-browser-compatible frontend coding standards.',
        'Demonstrated consistent delivery and domain competence, directly facilitating promotion to an on-role position with Samsung SDS.'
      ]
    },
    {
      role: 'UI/UX & Frontend Developer',
      company: 'Mindrops',
      period: 'Aug 2020 – Aug 2021',
      highlights: [
        'Designed and developed clean, responsive page layouts strictly aligned with functional and business requirements.',
        'Converted visual design assets into accessible HTML/CSS, strengthened semantic and SEO structures, and resolved multi-device UI defects.',
        'Engineered modular, reusable UI components and created cross-client compatible HTML email templates.'
      ]
    },
    {
      role: 'Associate Software Engineer',
      company: 'Infinity Labs India (Cisco Client)',
      period: 'Dec 2018 – Jul 2020',
      highlights: [
        'Engineered front-end interfaces for the Cisco Business Process Automation (BPA) Portal and contributed to Cisco SD-WAN UI screens.',
        'Constructed wireframes, functional prototypes, and production UI components utilizing HTML, CSS, Bootstrap, and Angular Material UI.',
        'Collaborated with enterprise cross-functional teams to deploy interface enhancements and uphold consistent design guidelines.'
      ]
    },
    {
      role: 'Frontend Developer',
      company: 'Codifier Technologies',
      period: 'Nov 2016 – Jun 2018',
      highlights: [
        'Developed responsive WordPress websites and implemented pixel-perfect web pages from Photoshop (PSD) design mockups.',
        'Constructed cross-client verified HTML email templates and supported concurrent client projects under strict release deadlines.'
      ]
    }
  ],
  projects: {
    enterprisePlatforms: [
      'Samsung SDS Metadata Platform & Annual General Meeting (AGM) Platform',
      'Cisco Enterprise Systems: Business Process Automation (BPA) Portal & SD-WAN UI'
    ],
    commercialWebsites: [
      'Mindrops',
      'Codifier',
      'Wondrfly',
      'Tripknock',
      'Tripomate',
      'Buddha Trail',
      'Urja for Women',
      'MSP Asia',
      'Toplad',
      'Address Home',
      'EZR'
    ]
  },
  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'Guru Gobind Singh Indraprastha University, New Delhi',
      years: '2013 – 2016'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Sikkim Manipal University',
      years: '2010 – 2013'
    }
  ],
  honors: [
    '97/100 Performance Rating — Samsung SDS: Awarded for exceptional code quality, UI accuracy, and consistent on-schedule delivery across enterprise platform deliverables.'
  ],
  nonSpecializations: ['React', 'React.js', 'React Native'],
  compensation: {
    currentCtc: '₹6,00,000 PA (6 LPA)',
    currentCtcLpa: 6.0,
    expectedCtcRemoteAndLocal: '₹12,00,000+ PA (12+ LPA for Remote & Delhi/Gurugram/Noida)',
    expectedCtcRemoteAndLocalLpa: 12.0,
    expectedCtcRelocation: '₹15,00,000+ PA (15+ LPA for Out of Delhi/NCR)',
    expectedCtcRelocationLpa: 15.0
  }
};
