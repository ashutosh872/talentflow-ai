import { chromium } from 'playwright';
import * as fs from 'fs';
import { DocumentTailor } from '../src/applications/tailor.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';
import { JobListing, MatchResult } from '../src/types/index.js';

async function main() {
  const tailor = new DocumentTailor(VERIFIED_CANDIDATE_PROFILE, 'data/tailored-documents');

  const amazonJob: JobListing = {
    id: 'linkedin-4478053400',
    title: 'Front-End Engineer II',
    company: 'Amazon (ADCI)',
    officialUrl: 'https://www.linkedin.com/jobs/view/4478053400/',
    source: 'LinkedIn Jobs',
    postingDate: '2026-10-15',
    location: 'Bengaluru, Karnataka, India (Open to Remote / Relocation Review)',
    workMode: 'Hybrid',
    salaryMin: 3500000,
    salaryMax: 5500000,
    currency: 'INR',
    salaryRaw: '₹35,00,000 - ₹55,00,000 PA',
    employmentType: 'Full-time',
    description: `As a Front-End Engineer II at Amazon FBA Placement, you will work at the intersection of customer experience and large-scale distributed systems. You will translate complex supply-chain decisions into simple, intuitive experiences for sellers worldwide. You will build responsive, performant, accessible, and maintainable web applications.
    Key responsibilities:
    • Design, develop, test, and launch high-quality web experiences for FBA sellers worldwide.
    • Build reusable UI components, frameworks, and patterns that improve consistency.
    • Deliver responsive, performant, secure, and accessible experiences across browsers, devices, and marketplaces.
    • Experience using JavaScript frameworks such as angular and react.`,
    requiredSkills: [
      'HTML',
      'CSS',
      'JavaScript',
      'Angular',
      'Reusable UI Components',
      'Responsive Web Design',
      'Accessibility',
      'Performance Optimization'
    ],
    requisitionId: 'A10575321'
  };

  const matchResult: MatchResult = {
    jobId: amazonJob.id,
    score: 75,
    tier: 'Strong',
    breakdown: {
      technicalSkills: 26,
      experienceSeniority: 13,
      uiDesignSystems: 3,
      locationWorkMode: 15,
      compensationStability: 10,
      careerGrowthCredibility: 8
    },
    evidence: [
      'Technical match: HTML5, CSS3/SCSS, JavaScript (ES6), Angular Material component architecture',
      'Experience requirement (2-5 years) comfortably exceeded by 8+ years verified tenure',
      'Accessibility & UI component excellence: WCAG compliance and design systems',
      'Industry-leading compensation (₹35-55 LPA) well above target threshold'
    ],
    missingRequirements: [],
    disqualified: false
  };

  const paths = tailor.tailorDocuments(amazonJob, matchResult);

  // Render high-fidelity 2-page Resume & Cover Letter PDF via Chromium
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const resumeHtml = tailor.generateResumeHtml(amazonJob, matchResult, false);
  await page.setContent(resumeHtml, { waitUntil: 'load' });
  const resumePdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });
  fs.writeFileSync(paths.resumePdfPath, resumePdfBuffer);

  const coverHtml = tailor.generateCoverLetterHtml(amazonJob, false);
  await page.setContent(coverHtml, { waitUntil: 'load' });
  const coverPdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });
  fs.writeFileSync(paths.coverLetterPdfPath, coverPdfBuffer);

  await browser.close();

  console.log('Generated Tailored Application Documents for Amazon FEE II:');
  console.log(' - Resume MD:', paths.resumePath);
  console.log(' - Resume PDF:', paths.resumePdfPath, `(${resumePdfBuffer.length} bytes)`);
  console.log(' - Cover Letter MD:', paths.coverLetterPath);
  console.log(' - Cover Letter PDF:', paths.coverLetterPdfPath, `(${coverPdfBuffer.length} bytes)`);
}

main().catch(console.error);
