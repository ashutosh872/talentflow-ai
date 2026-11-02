import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { DocumentTailor } from '../src/applications/tailor.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';
import { MockJobSourceAdapter } from '../src/sources/mock-source.js';
import { LinkedInJobSourceAdapter } from '../src/sources/linkedin-adapter.js';
import { NaukriJobSourceAdapter } from '../src/sources/naukri-adapter.js';
import { IndeedJobSourceAdapter } from '../src/sources/indeed-adapter.js';
import { JobScorer } from '../src/matching/scorer.js';
import { JobListing, MatchResult } from '../src/types/index.js';

async function main() {
  console.log('--- Batch Regenerating All Application Documents with Master Resume Standard ---');

  const tailor = new DocumentTailor(VERIFIED_CANDIDATE_PROFILE, 'data/tailored-documents');
  const scorer = new JobScorer(VERIFIED_CANDIDATE_PROFILE, 10.0, 30);

  // Collect all jobs from adapters
  const mockAdapter = new MockJobSourceAdapter();
  const linkedinAdapter = new LinkedInJobSourceAdapter();
  const naukriAdapter = new NaukriJobSourceAdapter();
  const indeedAdapter = new IndeedJobSourceAdapter();

  const allJobs: JobListing[] = [
    ...(await mockAdapter.fetchJobs()),
    ...(await linkedinAdapter.fetchJobs()),
    ...(await naukriAdapter.fetchJobs()),
    ...(await indeedAdapter.fetchJobs())
  ];

  // Add Amazon Job
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
    description: 'Amazon FBA Placement Front-End Engineer II. Frameworks such as Angular and React.',
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
  allJobs.push(amazonJob);

  console.log(`Loaded ${allJobs.length} total job listings.`);

  // Launch Chromium once to render publication-grade PDFs
  console.log('Launching headless Chromium for high-fidelity PDF rendering...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let generatedCount = 0;
  for (const job of allJobs) {
    const match = scorer.scoreJob(job);
    if (!match.disqualified && match.score >= 70) {
      const output = tailor.tailorDocuments(job, match);

      // Render high-fidelity 2-page Resume PDF from HTML
      const resumeHtml = tailor.generateResumeHtml(job, match, false);
      await page.setContent(resumeHtml, { waitUntil: 'load' });
      const resumePdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
      });
      fs.writeFileSync(output.resumePdfPath, resumePdfBuffer);

      // Render high-fidelity Cover Letter PDF from HTML
      const coverHtml = tailor.generateCoverLetterHtml(job, false);
      await page.setContent(coverHtml, { waitUntil: 'load' });
      const coverPdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
      });
      fs.writeFileSync(output.coverLetterPdfPath, coverPdfBuffer);

      console.log(`Generated: ${job.company} (${job.title})`);
      console.log(`   - PDF Resume: ${output.resumePdfPath} (${resumePdfBuffer.length} bytes)`);
      console.log(`   - MD Resume:  ${output.resumePath}`);
      console.log(`   - PDF Letter: ${output.coverLetterPdfPath} (${coverPdfBuffer.length} bytes)`);
      console.log(`   - MD Letter:  ${output.coverLetterPath}`);
      generatedCount++;
    }
  }

  await browser.close();

  // Clean up any remaining Ashutosh_Kumar_Tailored_Resume.md files
  const baseDir = path.resolve('data/tailored-documents');
  if (fs.existsSync(baseDir)) {
    const subdirs = fs.readdirSync(baseDir);
    for (const subdir of subdirs) {
      const dirPath = path.join(baseDir, subdir);
      if (fs.statSync(dirPath).isDirectory()) {
        const oldFile = path.join(dirPath, 'Ashutosh_Kumar_Tailored_Resume.md');
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
          console.log(`Deleted stale file: ${oldFile}`);
        }
      }
    }
  }

  // Update data/applications.csv to remove stale references
  const csvPath = path.resolve('data/applications.csv');
  if (fs.existsSync(csvPath)) {
    let csv = fs.readFileSync(csvPath, 'utf8');
    csv = csv.replace(/Ashutosh_Kumar_Tailored_Resume\.md/g, 'Ashutosh_Kumar_Resume.pdf');
    csv = csv.replace(/Tailored documents prepared/g, 'Application documents prepared');
    fs.writeFileSync(csvPath, csv, 'utf8');
    console.log('Updated data/applications.csv references.');
  }

  // Update data/reports/daily-report-2026-10-29.md
  const reportMdPath = path.resolve('data/reports/daily-report-2026-10-29.md');
  if (fs.existsSync(reportMdPath)) {
    let reportMd = fs.readFileSync(reportMdPath, 'utf8');
    reportMd = reportMd.replace(/Ashutosh_Kumar_Tailored_Resume\.md/g, 'Ashutosh_Kumar_Resume.pdf');
    reportMd = reportMd.replace(/Tailored documents prepared/g, 'Application documents prepared');
    fs.writeFileSync(reportMdPath, reportMd, 'utf8');
    console.log('Updated data/reports/daily-report-2026-10-29.md references.');
  }

  // Update data/reports/daily-report-2026-10-29.json
  const reportJsonPath = path.resolve('data/reports/daily-report-2026-10-29.json');
  if (fs.existsSync(reportJsonPath)) {
    let reportJson = fs.readFileSync(reportJsonPath, 'utf8');
    reportJson = reportJson.replace(/Ashutosh_Kumar_Tailored_Resume\.md/g, 'Ashutosh_Kumar_Resume.pdf');
    reportJson = reportJson.replace(/Tailored documents prepared/g, 'Application documents prepared');
    fs.writeFileSync(reportJsonPath, reportJson, 'utf8');
    console.log('Updated data/reports/daily-report-2026-10-29.json references.');
  }

  console.log(`\nSuccessfully regenerated documents for ${generatedCount} opportunities with Master Resume design standards!`);
}

main().catch((err) => {
  console.error('Batch generation failed:', err);
  process.exit(1);
});
