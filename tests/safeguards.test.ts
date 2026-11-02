import { describe, it, expect } from 'vitest';
import { SubmissionSafeguard } from '../src/applications/submission-safeguard.js';
import { JobListing, MatchResult } from '../src/types/index.js';

describe('SubmissionSafeguard Unit Tests', () => {
  const dummyJob: JobListing = {
    id: 'safe-job-1',
    title: 'Senior UI Developer',
    company: 'Enterprise Systems',
    officialUrl: 'https://enterprise.com/careers/ui-dev',
    source: 'Career Portal',
    postingDate: '2026-10-25',
    location: 'Noida (Delhi NCR)',
    workMode: 'Hybrid',
    description: 'Looking for a Senior UI Developer. Must agree to 2-year service bond and background check.',
    requiredSkills: ['HTML5', 'SCSS', 'Angular']
  };

  const dummyMatch: MatchResult = {
    jobId: 'safe-job-1',
    score: 88,
    tier: 'Excellent',
    breakdown: {
      technicalSkills: 28,
      experienceSeniority: 18,
      uiDesignSystems: 14,
      locationWorkMode: 14,
      compensationStability: 7,
      careerGrowthCredibility: 7
    },
    evidence: ['Verified UI skills'],
    missingRequirements: [],
    disqualified: false
  };

  it('strictly blocks live submission in DRY-RUN mode (dryRun = true)', () => {
    const safeguard = new SubmissionSafeguard(true, false);
    const decision = safeguard.evaluateSubmission(
      dummyJob,
      dummyMatch,
      'data/tailored-documents/test_resume.md',
      'data/tailored-documents/test_cover.md'
    );

    expect(decision.canProceedAutomated).toBe(false);
    expect(decision.status).toBe('TAILORED');
    expect(decision.reason).toContain('Operating in DRY-RUN mode');
    expect(decision.nextAction).toContain('[DRY-RUN]');
  });

  it('blocks live submission when ENABLE_AUTOSUBMIT is false even if dryRun is false', () => {
    const safeguard = new SubmissionSafeguard(false, false);
    const decision = safeguard.evaluateSubmission(
      dummyJob,
      dummyMatch,
      'data/tailored-documents/test_resume.md',
      'data/tailored-documents/test_cover.md'
    );

    expect(decision.canProceedAutomated).toBe(false);
    expect(decision.status).toBe('MANUAL_ACTION_REQUIRED');
    expect(decision.reason).toContain('ENABLE_AUTOSUBMIT=false');
  });

  it('detects sensitive questions/legal declarations (bonds, background checks) and halts for manual review', () => {
    const safeguard = new SubmissionSafeguard(false, true);
    const decision = safeguard.evaluateSubmission(
      dummyJob,
      dummyMatch,
      'data/tailored-documents/test_resume.md',
      'data/tailored-documents/test_cover.md'
    );

    expect(decision.canProceedAutomated).toBe(false);
    expect(decision.status).toBe('MANUAL_REVIEW_NEEDED');
    expect(decision.reason.toLowerCase()).toContain('service bond / agreement');
    expect(decision.manualActionPacket?.questionsForCandidate).toEqual(
      expect.arrayContaining([expect.stringContaining('bond')])
    );
  });
});
