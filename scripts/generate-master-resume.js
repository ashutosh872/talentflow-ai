import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';

export function getMasterResumeHtml(isPrivacy = false) {
  const phone = isPrivacy ? '+91 ••••• •••••' : '+91 9310681373';
  const email = isPrivacy ? 'k••••.••••@gmail.com' : 'kumar.ashu872@gmail.com';
  const employer = isPrivacy ? '[Current Tech Employer (Contract)]' : 'Wondrfly';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ashutosh Kumar - Master Resume</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 14mm 10mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 8.8pt;
      line-height: 1.35;
      -webkit-font-smoothing: antialiased;
    }
    .no-print {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.25);
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
    }
    @media print {
      .no-print { display: none !important; }
      body { background: transparent; }
    }
    .page-wrapper {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 0 20px rgba(0,0,0,0.08);
    }
    @media print {
      .page-wrapper { max-width: 100%; margin: 0; box-shadow: none; }
    }
    .page {
      width: 100%;
      page-break-after: always;
      page-break-inside: avoid;
      padding: 10mm 14mm;
    }
    .page:last-child {
      page-break-after: auto;
    }
    @media print {
      .page { padding: 0; }
    }
    .header { margin-bottom: 4px; }
    h1.name { font-size: 21pt; font-weight: 800; letter-spacing: 0.5px; color: #0f172a; line-height: 1.1; margin-bottom: 3px; }
    .title { font-size: 10.5pt; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px; margin-bottom: 4px; text-transform: uppercase; }
    .contact-line { font-size: 8.8pt; color: #334155; }
    .contact-line a { color: #1d4ed8; text-decoration: none; }
    .divider { height: 1.5px; background: #0f172a; margin: 6px 0 8px 0; }
    .section-title {
      font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 8px; margin-bottom: 5px;
    }
    .summary-text { color: #334155; text-align: justify; margin-bottom: 4px; font-size: 8.8pt; line-height: 1.38; }
    .skills-grid { display: table; width: 100%; margin-bottom: 3px; }
    .skills-row { display: table-row; }
    .skills-label { display: table-cell; font-weight: 700; color: #0f172a; width: 155px; padding: 1.8px 0; vertical-align: top; font-size: 8.7pt; }
    .skills-value { display: table-cell; color: #334155; padding: 1.8px 0 1.8px 6px; vertical-align: top; font-size: 8.7pt; line-height: 1.34; }
    .exp-item { margin-bottom: 7px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
    .exp-role { font-size: 9pt; font-weight: 700; color: #0f172a; }
    .exp-company { font-weight: 700; color: #1d4ed8; }
    .exp-date { font-size: 8.7pt; font-weight: 600; color: #0f172a; white-space: nowrap; }
    ul.bullets { list-style-type: disc; margin-left: 16px; }
    ul.bullets li { color: #334155; font-size: 8.6pt; line-height: 1.34; margin-bottom: 2px; }
    .projects-container { display: flex; gap: 10px; margin-top: 4px; margin-bottom: 4px; }
    .project-card { flex: 1; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 9px; background: #ffffff; }
    .project-card h4 { font-size: 8.7pt; font-weight: 700; color: #0f172a; margin-bottom: 3px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
    .project-card p, .project-card li { font-size: 8.4pt; color: #334155; line-height: 1.32; }
    .project-card ul { list-style-type: disc; margin-left: 13px; }
    .edu-item { margin-bottom: 4px; }
    .edu-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 8.9pt; color: #0f172a; }
    .edu-inst { font-size: 8.6pt; color: #475569; }
    .honor-box {
      border: 1px solid #cbd5e1; border-left: 3.5px solid #1d4ed8; background: #f8fafc;
      padding: 6px 10px; border-radius: 4px; font-size: 8.6pt; color: #334155; line-height: 1.36; margin-top: 3px;
    }
    .honor-box strong { color: #0f172a; }
  </style>
</head>
<body>

  <!-- Top Sticky Bar for Web/Tab Viewing (Hidden on Print) -->
  <div class="no-print">
    <div>
      <span style="font-weight: 700; font-size: 14px;">Ashutosh Kumar</span>
      <span style="color: #94a3b8; margin: 0 8px;">•</span>
      <span style="color: #60a5fa; font-weight: 600;">Official Master Resume (Source of Truth)</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="Ashutosh_Kumar_Master_Resume.pdf" download style="background: #2563eb; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 5px;">
        <span>⬇️</span> Download Master PDF
      </a>
      <button onclick="window.print()" style="background: #334155; color: #ffffff; border: 1px solid #475569; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="page-wrapper">
    <!-- PAGE 1 -->
    <div class="page">
      <div class="header">
        <h1 class="name">ASHUTOSH KUMAR</h1>
        <div class="title">SENIOR FRONTEND ENGINEER • SENIOR UI DEVELOPER</div>
        <div class="contact-line">
          New Delhi, India &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; <a href="mailto:${email}">${email}</a> &nbsp;|&nbsp; <a href="https://linkedin.com/in/kumarashu872" target="_blank">linkedin.com/in/kumarashu872</a>
        </div>
      </div>
      <div class="divider"></div>

      <div class="section-title">PROFESSIONAL SUMMARY</div>
      <p class="summary-text">
        Senior Frontend/UI Engineer with 8+ years of experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and growing businesses, including Samsung SDS, Cisco, and Wondrfly. Skilled in HTML5, CSS3, SCSS/Sass, JavaScript (ES6), Angular Material UI, reusable UI patterns, design systems, and pixel-perfect Figma-to-code implementation. Experienced in WCAG accessibility, cross-browser compatibility, responsive HTML email templating, SEO-friendly markup, and frontend performance practices. Actively leverages Cursor AI and Claude to streamline AI-assisted development workflows, test authoring, and bug reproduction. At Wondrfly, contributed to Playwright-based test automation and an impact-aware bug validation workflow.
      </p>

      <div class="section-title">TECHNICAL SKILLS</div>
      <div class="skills-grid">
        <div class="skills-row">
          <div class="skills-label">Frontend Core:</div>
          <div class="skills-value">HTML5, CSS3, SCSS/Sass, JavaScript (ES6), jQuery, Bootstrap, CSS Grid, Flexbox, Responsive Web Design, Cross-Browser Compatibility, Responsive HTML Email Templating</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">UI Engineering:</div>
          <div class="skills-value">Angular Material UI, Reusable UI Components, Component-Based Architecture, Design Systems, Pixel-Perfect UI, Figma-to-Code, Design-to-Code, PSD-to-HTML</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Testing &amp; Automation:</div>
          <div class="skills-value">Playwright, Playwright Test, Targeted Regression Testing, UI Validation, Bug Reproduction, Test Reporting</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Accessibility &amp; SEO:</div>
          <div class="skills-value">WCAG 2.1/2.2, Section 508, Semantic HTML, Accessible Forms, SEO-Friendly Markup</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Performance:</div>
          <div class="skills-value">Web Performance Optimization, Core Web Vitals Awareness, Scalable &amp; Maintainable CSS Architecture</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Tools &amp; AI Workflows:</div>
          <div class="skills-value">Cursor AI, Claude, ChatGPT, Figma, Zeplin, Photoshop, InVision, WordPress, Git, Jira, ClickUp, VS Code, Agile/Scrum, Code Reviews</div>
        </div>
      </div>

      <div class="section-title">PROFESSIONAL EXPERIENCE</div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer (Contract) — <span class="exp-company">${employer}</span></div>
          <div class="exp-date">Sep 2025 – Present</div>
        </div>
        <ul class="bullets">
          <li>Build and maintain responsive, pixel-perfect website interfaces from Figma designs using HTML5, SCSS, JavaScript, and Angular Material UI.</li>
          <li>Translate design specifications into production-ready UI, ensuring visual consistency across complex layouts and responsive breakpoints.</li>
          <li>Develop and maintain reusable UI patterns and scalable styling architecture to support long-term codebase maintainability.</li>
          <li>Contribute to Playwright-based browser automation to validate UI behavior and catch regressions in critical user flows.</li>
          <li>Designed an impact-based bug-fix workflow concept connecting task context, Git change analysis, and targeted Playwright tests so validation focuses on impacted components instead of executing full end-to-end suites.</li>
          <li>Leverage AI-assisted tools (Cursor AI, Claude) to accelerate bug investigation, automated test generation, and fix-and-retest workflows; review outputs to isolate application defects from outdated test definitions.</li>
          <li>Resolve UI defects and responsive layout issues while upholding WCAG accessibility, cross-browser behavior, and web performance standards.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer (Freelance) — <span class="exp-company">Multiple Clients</span></div>
          <div class="exp-date">Mar 2023 – Aug 2025</div>
        </div>
        <ul class="bullets">
          <li>Delivered high-quality frontend solutions for startups, commercial businesses, and NGOs, including Tripknock, Tripomate, and Urja for Women.</li>
          <li>Converted Figma and PSD design assets into clean, responsive, and production-ready web interfaces with standards-compliant markup.</li>
          <li>Built and customized WordPress websites and marketing landing pages, applying semantic markup and SEO-friendly implementation.</li>
          <li>Handled cross-browser UI defect resolution, responsiveness enhancements, and post-launch maintenance across client engagements.</li>
        </ul>
      </div>
    </div>

    <!-- PAGE 2 -->
    <div class="page" style="padding-top: 2px;">
      <div class="section-title" style="margin-top: 0;">PROFESSIONAL EXPERIENCE (CONTINUED)</div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Assistant Manager - Web Publisher — <span class="exp-company">Samsung SDS</span></div>
          <div class="exp-date">Sep 2022 – Mar 2023</div>
        </div>
        <ul class="bullets">
          <li>Delivered and maintained enterprise web interfaces for Samsung HQ platforms utilizing internal UI frameworks and design systems.</li>
          <li>Maintained responsive behavior, content accuracy, and web accessibility standards while collaborating closely with global stakeholders.</li>
          <li>Received a 97/100 performance rating for outstanding code quality, precision, and timely delivery across platform deliverables.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Web Publisher &amp; Designer — <span class="exp-company">Experience Commerce (Samsung SDS Client)</span></div>
          <div class="exp-date">Aug 2021 – Sep 2022</div>
        </div>
        <ul class="bullets">
          <li>Published enterprise web pages from Zeplin designs and structured requirement documents for core Samsung SDS platforms.</li>
          <li>Performed UI quality assurance checks and championed reusable, cross-browser-compatible frontend coding standards.</li>
          <li>Demonstrated consistent delivery and domain competence, directly facilitating promotion to an on-role position with Samsung SDS.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">UI/UX &amp; Frontend Developer — <span class="exp-company">Mindrops</span></div>
          <div class="exp-date">Aug 2020 – Aug 2021</div>
        </div>
        <ul class="bullets">
          <li>Designed and developed clean, responsive page layouts strictly aligned with functional and business requirements.</li>
          <li>Converted visual design assets into accessible HTML/CSS, strengthened semantic and SEO structures, and resolved multi-device UI defects.</li>
          <li>Engineered modular, reusable UI components and created cross-client compatible HTML email templates.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Associate Software Engineer — <span class="exp-company">Infinity Labs India (Cisco Client)</span></div>
          <div class="exp-date">Dec 2018 – Jul 2020</div>
        </div>
        <ul class="bullets">
          <li>Engineered front-end interfaces for the Cisco Business Process Automation (BPA) Portal and contributed to Cisco SD-WAN UI screens.</li>
          <li>Constructed wireframes, functional prototypes, and production UI components utilizing HTML, CSS, Bootstrap, and Angular Material UI.</li>
          <li>Collaborated with enterprise cross-functional teams to deploy interface enhancements and uphold consistent design guidelines.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer — <span class="exp-company">Codifier Technologies</span></div>
          <div class="exp-date">Nov 2016 – Jun 2018</div>
        </div>
        <ul class="bullets">
          <li>Developed responsive WordPress websites and implemented pixel-perfect web pages from Photoshop (PSD) design mockups.</li>
          <li>Constructed cross-client verified HTML email templates and supported concurrent client projects under strict release deadlines.</li>
        </ul>
      </div>

      <div class="section-title">SELECTED PROJECTS</div>
      <div class="projects-container">
        <div class="project-card">
          <h4>Enterprise Platforms</h4>
          <ul>
            <li><strong>Samsung SDS Platforms:</strong> Metadata Platform and Annual General Meeting (AGM) Platform.</li>
            <li><strong>Cisco Enterprise Systems:</strong> Business Process Automation (BPA) Portal and SD-WAN management interfaces.</li>
          </ul>
        </div>
        <div class="project-card">
          <h4>Commercial &amp; Client Websites</h4>
          <p>Mindrops, Codifier, Wondrfly, Tripknock, Tripomate, Buddha Trail, Urja for Women, MSP Asia, Toplad, Address Home, and EZR.</p>
        </div>
      </div>

      <div class="section-title">EDUCATION</div>
      <div class="edu-item">
        <div class="edu-header">
          <div>Master of Computer Applications (MCA)</div>
          <div>2013 – 2016</div>
        </div>
        <div class="edu-inst">Guru Gobind Singh Indraprastha University, New Delhi</div>
      </div>
      <div class="edu-item">
        <div class="edu-header">
          <div>Bachelor of Computer Applications (BCA)</div>
          <div>2010 – 2013</div>
        </div>
        <div class="edu-inst">Sikkim Manipal University</div>
      </div>

      <div class="section-title">HONORS &amp; RECOGNITION</div>
      <div class="honor-box">
        <strong>97/100 Performance Rating — Samsung SDS:</strong> Awarded for exceptional code quality, UI accuracy, and consistent on-schedule delivery across enterprise platform deliverables.
      </div>
    </div>
  </div>

</body>
</html>`;
}

export function getMasterCoverLetterHtml(isPrivacy = false) {
  const phone = isPrivacy ? '+91 ••••• •••••' : '+91 9310681373';
  const email = isPrivacy ? 'k••••.••••@gmail.com' : 'kumar.ashu872@gmail.com';
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ashutosh Kumar - Master Cover Letter</title>
  <style>
    @page { size: A4; margin: 16mm 18mm 16mm 18mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a; background: #ffffff; font-size: 9.8pt; line-height: 1.5;
    }
    .no-print {
      position: sticky; top: 0; background: #0f172a; color: #ffffff;
      padding: 10px 20px; display: flex; justify-content: space-between; align-items: center;
      z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.25);
      font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px;
    }
    @media print {
      .no-print { display: none !important; }
    }
    .content-wrapper {
      max-width: 210mm; margin: 0 auto; padding: 16mm 18mm; background: #fff;
    }
    @media print {
      .content-wrapper { padding: 0; margin: 0; max-width: 100%; }
    }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 18px; }
    h1.name { font-size: 21pt; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
    .title { font-size: 10.5pt; font-weight: 700; color: #1d4ed8; margin-bottom: 5px; }
    .contact-line { font-size: 8.8pt; color: #475569; }
    .meta { margin-bottom: 18px; font-size: 9.2pt; color: #334155; }
    .meta strong { color: #0f172a; }
    .salutation { font-weight: 700; margin-bottom: 12px; }
    p { margin-bottom: 12px; text-align: justify; }
    .signoff { margin-top: 22px; }
    .sig-name { font-weight: 700; color: #0f172a; margin-top: 4px; }
    .sig-title { color: #475569; font-size: 9.2pt; }
  </style>
</head>
<body>
  <div class="no-print">
    <div>
      <span style="font-weight: 700; font-size: 14px;">Ashutosh Kumar</span>
      <span style="color: #94a3b8; margin: 0 8px;">•</span>
      <span style="color: #a855f7; font-weight: 600;">Official Master Cover Letter</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="Ashutosh_Kumar_Master_Cover_Letter.pdf" download style="background: #9333ea; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 5px;">
        <span>⬇️</span> Download PDF
      </a>
      <button onclick="window.print()" style="background: #334155; color: #ffffff; border: 1px solid #475569; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">
        🖨️ Print
      </button>
      <button onclick="window.close()" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="header">
      <h1 class="name">ASHUTOSH KUMAR</h1>
      <div class="title">SENIOR FRONTEND ENGINEER • SENIOR UI DEVELOPER</div>
      <div class="contact-line">
        New Delhi, India &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; ${email} &nbsp;|&nbsp; linkedin.com/in/kumarashu872
      </div>
    </div>

    <div class="meta">
      <div><strong>Date:</strong> ${dateStr}</div>
      <div><strong>To:</strong> Hiring Team / Engineering Leadership</div>
      <div><strong>Position:</strong> Senior Frontend Engineer • Senior UI Developer</div>
    </div>

    <div class="salutation">Dear Hiring Team,</div>

    <p>
      I am writing to express my enthusiastic interest in senior frontend and UI engineering opportunities with your organization. With over 8 years of dedicated experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and scaling businesses—including Samsung SDS, Cisco, and Wondrfly—I specialize in translating intricate design specifications into production-ready HTML5, SCSS, and Angular Material component architectures.
    </p>

    <p>
      At Wondrfly, I translate complex Figma designs into responsive layouts and author Playwright-based browser automation to validate UI behavior and prevent regressions in critical user flows. I also conceptualized an impact-based bug validation workflow connecting task context, Git change analysis, and targeted Playwright tests so verification focuses on impacted components instead of executing full end-to-end suites.
    </p>

    <p>
      Prior to my current engagement, as Assistant Manager - Web Publisher at Samsung SDS, I received a 97/100 performance rating for outstanding code quality, precision, and adherence to strict enterprise design systems and accessibility standards across core Samsung HQ platforms. Similarly, for Cisco, I engineered frontend components for the Business Process Automation (BPA) Portal and SD-WAN UI interfaces.
    </p>

    <p>
      I take pride in writing clean, semantic markup, upholding WCAG accessibility standards, optimizing Core Web Vitals, and continuously leveraging AI-assisted workflows (Cursor AI, Claude) to accelerate defect isolation and test generation. I welcome the opportunity to discuss how my frontend depth and enterprise delivery track record can support your engineering objectives.
    </p>

    <div class="signoff">
      <div>Warm regards,</div>
      <div class="sig-name">Ashutosh Kumar</div>
      <div class="sig-title">Senior Frontend Engineer • Senior UI Developer</div>
      <div class="contact-line" style="margin-top: 4px;">${phone} &nbsp;|&nbsp; ${email}</div>
    </div>
  </div>
</body>
</html>`;
}

async function generate() {
  const masterDir = path.resolve('data/master-documents');
  if (!fs.existsSync(masterDir)) fs.mkdirSync(masterDir, { recursive: true });

  const html = getMasterResumeHtml(false);
  fs.writeFileSync(path.join(masterDir, 'Ashutosh_Kumar_Master_Resume.html'), html, 'utf8');

  const letterHtml = getMasterCoverLetterHtml(false);
  fs.writeFileSync(path.join(masterDir, 'Ashutosh_Kumar_Master_Cover_Letter.html'), letterHtml, 'utf8');

  console.log('Rendering Master Documents PDF via Chromium...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Render Master Resume PDF
  await page.setContent(html, { waitUntil: 'load' });
  const resumePdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });
  const resumePdfPath = path.join(masterDir, 'Ashutosh_Kumar_Master_Resume.pdf');
  fs.writeFileSync(resumePdfPath, resumePdfBuffer);

  // Render Master Cover Letter PDF
  await page.setContent(letterHtml, { waitUntil: 'load' });
  const letterPdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });
  const letterPdfPath = path.join(masterDir, 'Ashutosh_Kumar_Master_Cover_Letter.pdf');
  fs.writeFileSync(letterPdfPath, letterPdfBuffer);

  await browser.close();

  console.log(`Master Resume PDF: ${resumePdfPath} (${resumePdfBuffer.length} bytes)`);
  console.log(`Master Cover Letter PDF: ${letterPdfPath} (${letterPdfBuffer.length} bytes)`);
}

generate().catch(err => {
  console.error('Error generating master documents:', err);
  process.exit(1);
});
