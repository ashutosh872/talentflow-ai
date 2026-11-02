import * as fs from 'fs';
import * as path from 'path';
import { CandidateProfile, JobListing, MatchResult, TailoredDocumentOutput } from '../types/index.js';

export class DocumentTailor {
  private candidate: CandidateProfile;
  private outputBaseDir: string;

  constructor(candidate: CandidateProfile, outputBaseDir: string = 'data/tailored-documents') {
    this.candidate = candidate;
    this.outputBaseDir = path.resolve(outputBaseDir);
    this.ensureDirectoryExists(this.outputBaseDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public getCandidateFilePrefix(): string {
    const parts = this.candidate.name.trim().split(/\s+/);
    const first = parts[0] || 'Ashutosh';
    const last = parts.slice(1).join('_') || 'Kumar';
    return `${first}_${last}`;
  }

  public tailorDocuments(job: JobListing, match: MatchResult): TailoredDocumentOutput {
    const jobSpecificDir = path.join(
      this.outputBaseDir,
      `${this.sanitizeFileName(job.company)}_${this.sanitizeFileName(job.id)}`
    );
    this.ensureDirectoryExists(jobSpecificDir);

    const resumeMarkdown = this.generateATSResume(job, match);
    const coverLetterMarkdown = this.generateCoverLetter(job, match);
    const interviewPrepNotes = this.generateInterviewPrepNotes(job, match);

    // Standard naming convention: FirstName_LastName_Resume & FirstName_LastName_Cover_Letter
    const prefix = this.getCandidateFilePrefix();
    const resumePath = path.join(jobSpecificDir, `${prefix}_Resume.md`);
    const coverLetterPath = path.join(jobSpecificDir, `${prefix}_Cover_Letter.md`);
    const resumePdfPath = path.join(jobSpecificDir, `${prefix}_Resume.pdf`);
    const coverLetterPdfPath = path.join(jobSpecificDir, `${prefix}_Cover_Letter.pdf`);
    const resumeHtmlPath = path.join(jobSpecificDir, `${prefix}_Resume.html`);
    const coverLetterHtmlPath = path.join(jobSpecificDir, `${prefix}_Cover_Letter.html`);
    const notesPath = path.join(jobSpecificDir, 'Application_Notes_And_Prep.md');

    // Write standard Markdown source files
    fs.writeFileSync(resumePath, resumeMarkdown, 'utf-8');
    fs.writeFileSync(coverLetterPath, coverLetterMarkdown, 'utf-8');
    fs.writeFileSync(notesPath, interviewPrepNotes.join('\n\n'), 'utf-8');

    // Write HTML templates with new-tab top navigation
    const resumeHtml = this.generateResumeHtml(job, match);
    const coverLetterHtml = this.generateCoverLetterHtml(job);
    fs.writeFileSync(resumeHtmlPath, resumeHtml, 'utf-8');
    fs.writeFileSync(coverLetterHtmlPath, coverLetterHtml, 'utf-8');

    // Generate valid, multi-page, properly wrapped ATS PDF documents
    const resumePdfBuffer = this.buildMultiPagePdfBuffer(this.generateResumeLines(job, match));
    const coverLetterPdfBuffer = this.buildMultiPagePdfBuffer(this.generateCoverLetterLines(job));
    fs.writeFileSync(resumePdfPath, resumePdfBuffer);
    fs.writeFileSync(coverLetterPdfPath, coverLetterPdfBuffer);

    return {
      jobId: job.id,
      company: job.company,
      title: job.title,
      resumeMarkdown,
      coverLetterMarkdown,
      resumePath,
      coverLetterPath,
      resumePdfPath,
      coverLetterPdfPath,
      interviewPrepNotes
    };
  }

  /**
   * Generates a single, coherent, customized professional summary tailored to the
   * specific opening title and JD requirements without awkward separated blocks.
   */
  public buildTailoredSummary(job: JobListing, match: MatchResult): string {
    const titleLower = job.title.toLowerCase();

    let focusPhrase = 'scalable component architectures, responsive web interfaces, and high-performance frontend solutions';
    if (titleLower.includes('design system') || titleLower.includes('figma')) {
      focusPhrase = 'enterprise design systems, component-based architectures, and pixel-perfect Figma-to-code implementation';
    } else if (titleLower.includes('accessibility') || titleLower.includes('wcag')) {
      focusPhrase = 'accessible web engineering, WCAG 2.1/2.2 AA compliance, semantic markup, and inclusive user experiences';
    } else if (titleLower.includes('angular') || titleLower.includes('material')) {
      focusPhrase = 'enterprise Angular and Angular Material UI engineering, modular component architecture, and responsive web platforms';
    } else if (titleLower.includes('performance') || titleLower.includes('vitals')) {
      focusPhrase = 'high-performance frontend delivery, Core Web Vitals optimization, and maintainable CSS architecture';
    } else if (titleLower.includes('automation') || titleLower.includes('test') || titleLower.includes('playwright')) {
      focusPhrase = 'production frontend delivery, component architectures, and Playwright-driven UI test automation';
    }

    return `Senior Frontend/UI Engineer with 8+ years of dedicated enterprise experience delivering ${focusPhrase} for industry leaders including Samsung SDS, Cisco, and Wondrfly. Skilled in HTML5, CSS3, SCSS/Sass, JavaScript (ES6+), Angular Material UI, reusable component libraries, design systems, and pixel-perfect design translation. Experienced in WCAG 2.1/2.2 accessibility standards, cross-browser compatibility, responsive HTML email templating, and frontend performance practices. Actively leverages Cursor AI, Claude, and Playwright to streamline test authoring, accelerate bug reproduction, and validate critical user flows aligned with ${job.company}'s engineering standards.`;
  }

  /**
   * Builds a valid, multi-page, word-wrapped PDF document in pure Node.js.
   */
  private buildMultiPagePdfBuffer(lines: string[]): Buffer {
    const processedLines: { text: string; isBold: boolean; isHeading: boolean; isBlank: boolean }[] = [];

    for (const rawLine of lines) {
      if (!rawLine.trim()) {
        processedLines.push({ text: '', isBold: false, isHeading: false, isBlank: true });
        continue;
      }

      const isHeading =
        rawLine === rawLine.toUpperCase() &&
        rawLine.length > 3 &&
        !rawLine.includes('|') &&
        !rawLine.includes('•') &&
        !rawLine.startsWith('-');

      const isSubHeading =
        rawLine.startsWith('Frontend Developer') ||
        rawLine.startsWith('Assistant Manager') ||
        rawLine.startsWith('Web Publisher') ||
        rawLine.startsWith('UI/UX') ||
        rawLine.startsWith('Associate Software') ||
        rawLine.startsWith('Master of Computer') ||
        rawLine.startsWith('Bachelor of Computer') ||
        rawLine.startsWith('Enterprise Platforms') ||
        rawLine.startsWith('Commercial & Client');

      if (rawLine.startsWith('- ') || rawLine.startsWith('* ')) {
        const bulletText = rawLine.substring(2).trim();
        const wrapped = this.wrapText(bulletText, 80);
        wrapped.forEach((wLine, idx) => {
          processedLines.push({
            text: idx === 0 ? `  * ${wLine}` : `    ${wLine}`,
            isBold: false,
            isHeading: false,
            isBlank: false
          });
        });
      } else if (rawLine.startsWith('------------------------')) {
        processedLines.push({
          text: '__________________________________________________________________________________',
          isBold: false,
          isHeading: false,
          isBlank: false
        });
      } else {
        const wrapped = this.wrapText(rawLine, isHeading ? 75 : 84);
        wrapped.forEach((wLine) => {
          processedLines.push({
            text: wLine,
            isBold: isHeading || isSubHeading,
            isHeading,
            isBlank: false
          });
        });
      }
    }

    const LINES_PER_PAGE = 48;
    const pages: (typeof processedLines)[] = [];
    let currentBatch: typeof processedLines = [];

    for (const item of processedLines) {
      currentBatch.push(item);
      if (currentBatch.length >= LINES_PER_PAGE) {
        pages.push(currentBatch);
        currentBatch = [];
      }
    }
    if (currentBatch.length > 0) {
      pages.push(currentBatch);
    }
    if (pages.length === 0) {
      pages.push([{ text: 'Ashutosh Kumar', isBold: true, isHeading: true, isBlank: false }]);
    }

    const numPages = pages.length;
    let out = '%PDF-1.4\n';
    const offsets: number[] = [];

    offsets.push(out.length);
    out += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

    const pageObjIds: string[] = [];
    for (let p = 0; p < numPages; p++) {
      const pageId = 3 + p * 2;
      pageObjIds.push(`${pageId} 0 R`);
    }

    offsets.push(out.length);
    out += `2 0 obj\n<< /Type /Pages /Kids [${pageObjIds.join(' ')}] /Count ${numPages} >>\nendobj\n`;

    const font1Id = 3 + numPages * 2;
    const font2Id = font1Id + 1;

    for (let p = 0; p < numPages; p++) {
      const pageId = 3 + p * 2;
      const contentId = pageId + 1;
      const pageLines = pages[p];

      offsets.push(out.length);
      out += `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`;

      let stream = 'BT\n/F1 9.5 Tf\n45 800 Td\n14 TL\n';
      let currentFont = 'F1';

      for (const item of pageLines) {
        if (item.isBlank) {
          stream += '() Tj\nT*\n';
          continue;
        }

        const desiredFont = item.isBold ? 'F2' : 'F1';
        const fontSize = item.isHeading ? '10.5' : '9.5';

        if (currentFont !== desiredFont) {
          stream += `/${desiredFont} ${fontSize} Tf\n`;
          currentFont = desiredFont;
        }

        const sanitized = item.text
          .replace(/\\/g, '\\\\')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/[^\x20-\x7E]/g, ' ');

        stream += `(${sanitized}) Tj\nT*\n`;
      }
      stream += 'ET';

      const streamLen = Buffer.byteLength(stream);
      offsets.push(out.length);
      out += `${contentId} 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
    }

    offsets.push(out.length);
    out += `${font1Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

    offsets.push(out.length);
    out += `${font2Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;

    const totalObjs = font2Id + 1;
    const startxref = out.length;
    out += `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
    for (const off of offsets) {
      out += String(off).padStart(10, '0') + ' 00000 n \n';
    }
    out += `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

    return Buffer.from(out, 'utf-8');
  }

  private wrapText(text: string, maxLen: number): string[] {
    if (text.length <= maxLen) return [text];
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';

    for (const w of words) {
      if ((cur + ' ' + w).trim().length > maxLen) {
        if (cur) lines.push(cur);
        cur = w;
      } else {
        cur = cur ? `${cur} ${w}` : w;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  private generateResumeLines(job: JobListing, match: MatchResult): string[] {
    const c = this.candidate;
    const tailoredSummary = this.buildTailoredSummary(job, match);
    const tailoredTitle = job.title ? job.title.toUpperCase() : c.title.toUpperCase();

    const lines: string[] = [
      c.name.toUpperCase(),
      `${tailoredTitle} • 8+ Years Enterprise Experience`,
      `${c.contact.location} | Phone: ${c.contact.phone} | Email: ${c.contact.email} | LinkedIn: ${c.contact.linkedin}`,
      '------------------------------------------------------------------------------------------------',
      'PROFESSIONAL SUMMARY',
      tailoredSummary,
      '------------------------------------------------------------------------------------------------',
      'TECHNICAL SKILLS',
      `Frontend Core: ${c.skills.frontendCore.join(', ')}`,
      `UI Engineering: ${c.skills.uiEngineering.join(', ')}`,
      `Testing & Automation: ${c.skills.testingAutomation.join(', ')}`,
      `Accessibility & SEO: ${c.skills.accessibilityAndSeo.join(', ')}`,
      `Performance: ${c.skills.performance.join(', ')}`,
      `Tools & AI Workflows: ${c.skills.toolsAndAi.join(', ')}`,
      '------------------------------------------------------------------------------------------------',
      'PROFESSIONAL EXPERIENCE'
    ];

    for (const item of c.workHistory) {
      lines.push(`${item.role} - ${item.company} (${item.period})`);
      for (const highlight of item.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push('');
    }

    lines.push('------------------------------------------------------------------------------------------------');
    lines.push('SELECTED PROJECTS');
    lines.push(`Enterprise Platforms: ${c.projects.enterprisePlatforms.join('; ')}`);
    lines.push(`Commercial & Client Websites: ${c.projects.commercialWebsites.join(', ')}`);
    lines.push('------------------------------------------------------------------------------------------------');
    lines.push('EDUCATION');
    for (const edu of c.education) {
      lines.push(`${edu.degree} (${edu.years}) - ${edu.institution}`);
    }
    lines.push('------------------------------------------------------------------------------------------------');
    lines.push('HONORS & RECOGNITION');
    for (const honor of c.honors) {
      lines.push(honor);
    }

    return lines;
  }

  private generateCoverLetterLines(job: JobListing): string[] {
    const c = this.candidate;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return [
      `Date: ${dateStr}`,
      `To: Hiring Team at ${job.company}`,
      `Position: ${job.title} | Requisition: ${job.requisitionId || 'Direct Listing'}`,
      '------------------------------------------------------------------------------------------------',
      'Dear Hiring Team,',
      '',
      `I am writing to express my strong interest in the ${job.title} position at ${job.company}. With over 8 years of dedicated experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and scaling businesses—including Samsung SDS, Cisco, and Wondrfly—I specialize in turning complex Figma designs into production-ready HTML5, SCSS, and Angular Material component architectures.`,
      '',
      `At Wondrfly, I build responsive website interfaces from design specifications, ensuring visual consistency across complex layouts and responsive breakpoints while authoring Playwright-based test automation to validate UI behavior. I also conceptualized an impact-aware bug validation workflow connecting task context, Git change analysis, and targeted Playwright tests so validation focuses on impacted components.`,
      '',
      `Prior to my current engagement, as Assistant Manager - Web Publisher at Samsung SDS, I received a 97/100 performance rating for outstanding code quality, precision, and adherence to strict enterprise design systems and accessibility standards across core Samsung HQ platforms. Similarly, for Cisco, I engineered frontend components for the Business Process Automation (BPA) Portal and SD-WAN UI interfaces.`,
      '',
      `I take pride in writing clean, semantic markup, upholding WCAG accessibility standards, optimizing Core Web Vitals, and continuously leveraging AI-assisted workflows (Cursor AI, Claude) to accelerate defect isolation and test generation.`,
      '',
      `I welcome the opportunity to discuss how my frontend depth can support ${job.company}.`,
      '',
      'Warm regards,',
      c.name,
      c.title,
      `Phone: ${c.contact.phone} | Email: ${c.contact.email} | LinkedIn: ${c.contact.linkedin}`
    ];
  }

  public generateATSResume(job: JobListing, match: MatchResult): string {
    const c = this.candidate;
    const tailoredSummary = this.buildTailoredSummary(job, match);
    const tailoredTitle = job.title ? job.title.toUpperCase() : c.title.toUpperCase();

    return `# ${c.name.toUpperCase()}
**${tailoredTitle}**  
${c.contact.location} | Phone: ${c.contact.phone} | Email: ${c.contact.email} | LinkedIn: [${c.contact.linkedin.replace('https://', '')}](${c.contact.linkedin})

---

## PROFESSIONAL SUMMARY
${tailoredSummary}

---

## TECHNICAL SKILLS
- **Frontend Core:** ${c.skills.frontendCore.join(', ')}
- **UI Engineering:** ${c.skills.uiEngineering.join(', ')}
- **Testing & Automation:** ${c.skills.testingAutomation.join(', ')}
- **Accessibility & SEO:** ${c.skills.accessibilityAndSeo.join(', ')}
- **Performance:** ${c.skills.performance.join(', ')}
- **Tools & AI Workflows:** ${c.skills.toolsAndAi.join(', ')}

---

## PROFESSIONAL EXPERIENCE

${c.workHistory
  .map(
    (item) => `### ${item.role} — ${item.company}
*${item.period}*
${item.highlights.map((h) => `- ${h}`).join('\n')}`
  )
  .join('\n\n')}

---

## SELECTED PROJECTS

### Enterprise Platforms
- **Samsung SDS Platforms:** Metadata Platform and Annual General Meeting (AGM) Platform.
- **Cisco Enterprise Systems:** Business Process Automation (BPA) Portal and SD-WAN management interfaces.

### Commercial & Client Websites
${c.projects.commercialWebsites.join(', ')}.

---

## EDUCATION
${c.education.map((e) => `- **${e.degree}** — ${e.institution} (${e.years})`).join('\n')}

---

## HONORS & RECOGNITION
- **97/100 Performance Rating — Samsung SDS:** Awarded for exceptional code quality, UI accuracy, and consistent on-schedule delivery across enterprise platform deliverables.
`;
  }

  public generateCoverLetter(job: JobListing, match: MatchResult): string {
    const c = this.candidate;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `**Date:** ${dateStr}

**To:** Hiring Team at ${job.company}  
**Position:** ${job.title}  
**Requisition ID / Reference:** ${job.requisitionId || 'Direct Listing'}

Dear Hiring Team,

I am writing to express my strong interest in the **${job.title}** position at **${job.company}**. With over 8 years of dedicated experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and scaling businesses—including Samsung SDS, Cisco (via Infinity Labs), and Wondrfly—I am eager to contribute my technical depth and frontend craftsmanship to your team.

Throughout my career, I have specialized in turning intricate design specifications into scalable, production-ready frontend architectures. At **Wondrfly**, I actively translate complex Figma designs into responsive layouts using HTML5, SCSS, JavaScript, and Angular Material UI while contributing to Playwright-based browser automation to validate UI behavior and prevent regressions in mission-critical user flows. I also conceptualized an impact-based bug validation workflow that correlates task context and Git change analysis to run targeted tests, saving team verification overhead.

Prior to Wondrfly, as Assistant Manager - Web Publisher at **Samsung SDS**, I received a 97/100 performance rating for outstanding code quality, precision, and adherence to strict enterprise design systems and accessibility standards across core Samsung HQ platforms. Similarly, for **Cisco**, I engineered frontend components for the Business Process Automation (BPA) Portal and SD-WAN UI interfaces.

What excites me about **${job.company}** is the opportunity to solve meaningful frontend engineering challenges. Here is how my verified experience directly matches what you are seeking:
${match.evidence.map((ev) => `- **${ev}**`).join('\n')}

I take pride in writing clean, semantic markup, upholding WCAG accessibility standards, optimizing Core Web Vitals, and continuously leveraging AI-assisted workflows (Cursor AI, Claude) to accelerate defect isolation and test generation.

Thank you for your time and consideration. I welcome the opportunity to discuss how my frontend engineering skills and enterprise delivery track record can support ${job.company}'s objectives.

Warm regards,

**${c.name}**  
${c.title}  
Phone: ${c.contact.phone} | Email: ${c.contact.email}  
LinkedIn: [${c.contact.linkedin.replace('https://', '')}](${c.contact.linkedin})
`;
  }

  public generateResumeHtml(job: JobListing, match: MatchResult, isPrivacy: boolean = false): string {
    const c = this.candidate;
    const phone = isPrivacy ? '+91 ••••• •••••' : c.contact.phone;
    const email = isPrivacy ? 'k••••.••••@gmail.com' : c.contact.email;
    const employer = isPrivacy ? '[Current Tech Employer (Contract)]' : 'Wondrfly';
    const tailoredSummary = this.buildTailoredSummary(job, match);
    const tailoredTitle = job.title ? job.title.toUpperCase() : c.title.toUpperCase();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${c.name} - Resume (${job.company})</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 14mm 10mm 14mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
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
      <span style="color: #60a5fa; font-weight: 600;">Resume for ${job.company}</span>
      <span style="color: #94a3b8; font-size: 12px; margin-left: 6px;">(${job.title})</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="Ashutosh_Kumar_Resume.pdf" download style="background: #2563eb; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 5px;">
        <span>⬇️</span> Download ATS PDF
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
        <h1 class="name">${c.name.toUpperCase()}</h1>
        <div class="title">${tailoredTitle}</div>
        <div class="contact-line">
          ${c.contact.location} &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; <a href="mailto:${email}">${email}</a> &nbsp;|&nbsp; <a href="${c.contact.linkedin}" target="_blank">linkedin.com/in/kumarashu872</a>
        </div>
      </div>
      <div class="divider"></div>

      <div class="section-title">PROFESSIONAL SUMMARY</div>
      <p class="summary-text">${tailoredSummary}</p>

      <div class="section-title">TECHNICAL SKILLS</div>
      <div class="skills-grid">
        <div class="skills-row">
          <div class="skills-label">Frontend Core:</div>
          <div class="skills-value">${c.skills.frontendCore.join(', ')}</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">UI Engineering:</div>
          <div class="skills-value">${c.skills.uiEngineering.join(', ')}</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Testing &amp; Automation:</div>
          <div class="skills-value">${c.skills.testingAutomation.join(', ')}</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Accessibility &amp; SEO:</div>
          <div class="skills-value">${c.skills.accessibilityAndSeo.join(', ')}</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Performance:</div>
          <div class="skills-value">${c.skills.performance.join(', ')}</div>
        </div>
        <div class="skills-row">
          <div class="skills-label">Tools &amp; AI Workflows:</div>
          <div class="skills-value">${c.skills.toolsAndAi.join(', ')}</div>
        </div>
      </div>

      <div class="section-title">PROFESSIONAL EXPERIENCE</div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer (Contract) — <span class="exp-company">${employer}</span></div>
          <div class="exp-date">${c.workHistory[0].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[0].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer (Freelance) — <span class="exp-company">Multiple Clients</span></div>
          <div class="exp-date">${c.workHistory[1].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[1].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>

    <!-- PAGE 2 -->
    <div class="page" style="padding-top: 2px;">
      <div class="section-title" style="margin-top: 0;">PROFESSIONAL EXPERIENCE (CONTINUED)</div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Assistant Manager - Web Publisher — <span class="exp-company">Samsung SDS</span></div>
          <div class="exp-date">${c.workHistory[2].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[2].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Web Publisher &amp; Designer — <span class="exp-company">Experience Commerce (Samsung SDS Client)</span></div>
          <div class="exp-date">${c.workHistory[3].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[3].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">UI/UX &amp; Frontend Developer — <span class="exp-company">Mindrops</span></div>
          <div class="exp-date">${c.workHistory[4].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[4].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Associate Software Engineer — <span class="exp-company">Infinity Labs India (Cisco Client)</span></div>
          <div class="exp-date">${c.workHistory[5].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[5].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">Frontend Developer — <span class="exp-company">Codifier Technologies</span></div>
          <div class="exp-date">${c.workHistory[6].period}</div>
        </div>
        <ul class="bullets">
          ${c.workHistory[6].highlights.map((h) => `<li>${h}</li>`).join('\n          ')}
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
          <p>${c.projects.commercialWebsites.join(', ')}.</p>
        </div>
      </div>

      <div class="section-title">EDUCATION</div>
      ${c.education
        .map(
          (e) => `<div class="edu-item">
        <div class="edu-header">
          <div>${e.degree}</div>
          <div>${e.years}</div>
        </div>
        <div class="edu-inst">${e.institution}</div>
      </div>`
        )
        .join('\n      ')}

      <div class="section-title">HONORS &amp; RECOGNITION</div>
      <div class="honor-box">
        <strong>97/100 Performance Rating — Samsung SDS:</strong> Awarded for exceptional code quality, UI accuracy, and consistent on-schedule delivery across enterprise platform deliverables.
      </div>
    </div>
  </div>

</body>
</html>`;
  }

  public generateCoverLetterHtml(job: JobListing, isPrivacy: boolean = false): string {
    const c = this.candidate;
    const phone = isPrivacy ? '+91 ••••• •••••' : c.contact.phone;
    const email = isPrivacy ? 'k••••.••••@gmail.com' : c.contact.email;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cover Letter - ${c.name} (${job.company})</title>
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
      <span style="color: #a855f7; font-weight: 600;">Cover Letter for ${job.company}</span>
      <span style="color: #94a3b8; font-size: 12px; margin-left: 6px;">(${job.title})</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="Ashutosh_Kumar_Cover_Letter.pdf" download style="background: #9333ea; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 5px;">
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
      <h1 class="name">${c.name.toUpperCase()}</h1>
      <div class="title">${c.title.toUpperCase()}</div>
      <div class="contact-line">
        ${c.contact.location} &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; ${email} &nbsp;|&nbsp; linkedin.com/in/kumarashu872
      </div>
    </div>

    <div class="meta">
      <div><strong>Date:</strong> ${dateStr}</div>
      <div><strong>To:</strong> Hiring Team at ${job.company}</div>
      <div><strong>Position:</strong> ${job.title} &nbsp;(Ref: ${job.requisitionId || 'Direct Listing'})</div>
    </div>

    <div class="salutation">Dear Hiring Team,</div>

    <p>
      I am writing to express my strong interest in the <strong>${job.title}</strong> position at <strong>${job.company}</strong>. With over 8 years of dedicated experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and scaling businesses—including Samsung SDS, Cisco, and Wondrfly—I specialize in translating complex Figma designs into production-ready HTML5, SCSS, and Angular Material component architectures.
    </p>

    <p>
      At Wondrfly, I translate design specifications into production-ready UI, ensuring visual consistency across complex layouts and responsive breakpoints while contributing to Playwright-based browser automation to validate UI behavior. I also designed an impact-based bug validation workflow connecting task context, Git change analysis, and targeted Playwright tests so verification focuses on impacted components instead of executing full end-to-end suites.
    </p>

    <p>
      Prior to Wondrfly, as Assistant Manager - Web Publisher at Samsung SDS, I received a 97/100 performance rating for outstanding code quality, precision, and adherence to strict enterprise design systems and accessibility standards across core Samsung HQ platforms. Similarly, for Cisco, I engineered frontend components for the Business Process Automation (BPA) Portal and SD-WAN UI interfaces.
    </p>

    <p>
      I take pride in writing clean, semantic markup, upholding WCAG accessibility standards, optimizing Core Web Vitals, and continuously leveraging AI-assisted workflows (Cursor AI, Claude) to accelerate defect isolation and test generation. I welcome the opportunity to discuss how my frontend depth and enterprise delivery track record can support ${job.company}'s objectives.
    </p>

    <div class="signoff">
      <div>Warm regards,</div>
      <div class="sig-name">${c.name}</div>
      <div class="sig-title">${c.title}</div>
      <div class="contact-line" style="margin-top: 4px;">${phone} &nbsp;|&nbsp; ${email}</div>
    </div>
  </div>
</body>
</html>`;
  }

  private generateInterviewPrepNotes(job: JobListing, match: MatchResult): string[] {
    return [
      `# Application Action & Interview Prep Notes for ${job.company} - ${job.title}`,
      `**Job URL:** ${job.officialUrl}`,
      `**Match Score:** ${match.score}/100 (${match.tier})`,
      `**Location / Mode:** ${job.location} (${job.workMode})`,
      `**Salary Indication:** ${job.salaryRaw || 'Target baseline: ₹12+ LPA Remote/Delhi NCR | ₹15+ LPA Out of NCR'}`,
      `### Key Talking Points:
1. **8+ Years Enterprise Experience:** Highlight Samsung SDS (97/100 rating) and Cisco BPA Portal.
2. **UI Architecture & Design Systems:** Detail your Figma-to-code execution, design tokens, and Angular Material UI component design.
3. **Quality & Playwright Automation:** Explain your impact-aware bug validation concept at Wondrfly and test generation.
4. **Accessibility:** Reference WCAG 2.1 AA compliance and semantic HTML.`,
      `### Items Requiring Candidate Attention / Verification:
${match.missingRequirements.length > 0 ? match.missingRequirements.map((m) => `- Missing / Clarify: ${m}`).join('\n') : '- No missing technical requirements identified.'}
- Confirm exact notice period / availability date with employer.
- Align on target fixed vs. variable compensation structure during first screening.`
    ];
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  }
}
