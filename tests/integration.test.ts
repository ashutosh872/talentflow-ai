import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { runJobSearchWorkflow } from '../src/index.js';

describe('Job Search End-to-End Workflow Integration', () => {
  const testTrackerPath = path.resolve('data/test-workflow-tracker.csv');
  const testReportsPath = path.resolve('data/test-reports');
  const testDocsPath = path.resolve('data/test-tailored-docs');

  beforeEach(() => {
    process.env.TRACKER_PATH = testTrackerPath;
    process.env.REPORTS_PATH = testReportsPath;
    process.env.OUTPUT_DOCS_PATH = testDocsPath;
    process.env.DRY_RUN = 'true';
    process.env.ENABLE_AUTOSUBMIT = 'false';
  });

  afterEach(() => {
    if (fs.existsSync(testTrackerPath)) {
      fs.unlinkSync(testTrackerPath);
    }
    if (fs.existsSync(testReportsPath)) {
      fs.rmSync(testReportsPath, { recursive: true, force: true });
    }
    if (fs.existsSync(testDocsPath)) {
      fs.rmSync(testDocsPath, { recursive: true, force: true });
    }
  });

  it('executes full dry-run pipeline, filters disqualified jobs, tailors documents, and produces daily report', async () => {
    // Run workflow using mock source (without triggering live web calls in tests)
    const result = await runJobSearchWorkflow({
      mode: 'dry-run',
      includePublicWeb: false
    });

    expect(result).toBeDefined();
    expect(result?.summary.totalEvaluated).toBeGreaterThan(0);
    expect(result?.summary.qualifiedCount).toBeGreaterThan(0);
    expect(result?.summary.disqualifiedCount).toBeGreaterThan(0);

    // Verify top 10 opportunities generated
    expect(result?.summary.topOpportunities.length).toBeLessThanOrEqual(10);
    expect(result?.summary.topOpportunities.length).toBeGreaterThan(0);

    // Verify report markdown created on disk
    expect(fs.existsSync(result?.markdownPath!)).toBe(true);
    const reportContent = fs.readFileSync(result?.markdownPath!, 'utf-8');
    expect(reportContent).toContain('AI Job Search & Application Report: Ashutosh Kumar');
    expect(reportContent).toContain('Top 10 Verified Opportunities');

    // Verify tailored documents were created on disk for top opportunities
    expect(fs.existsSync(testDocsPath)).toBe(true);
    const generatedDirs = fs.readdirSync(testDocsPath);
    expect(generatedDirs.length).toBeGreaterThan(0);

    const sampleDir = path.join(testDocsPath, generatedDirs[0]);
    // Verify standard FirstName_LastName_Resume & FirstName_LastName_Cover_Letter naming (.pdf & .md)
    expect(fs.existsSync(path.join(sampleDir, 'Ashutosh_Kumar_Resume.pdf'))).toBe(true);
    expect(fs.existsSync(path.join(sampleDir, 'Ashutosh_Kumar_Resume.md'))).toBe(true);
    expect(fs.existsSync(path.join(sampleDir, 'Ashutosh_Kumar_Cover_Letter.pdf'))).toBe(true);
    expect(fs.existsSync(path.join(sampleDir, 'Ashutosh_Kumar_Cover_Letter.md'))).toBe(true);

    // Verify tracker persisted records
    const allRecords = result?.tracker.getAll() || [];
    expect(allRecords.length).toBeGreaterThan(0);
    const disqualified = allRecords.find((r) => r.applicationStatus === 'REJECTED_DISQUALIFIED');
    expect(disqualified).toBeDefined();
    expect(disqualified?.notes).toBeDefined();
  });
});
