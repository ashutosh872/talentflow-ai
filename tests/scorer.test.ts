import { describe, it, expect } from 'vitest';
import { JobScorer } from '../src/matching/scorer.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';
import { JobListing } from '../src/types/index.js';

describe('JobScorer Unit Tests', () => {
  const scorer = new JobScorer(VERIFIED_CANDIDATE_PROFILE, 10.0, 30);

  it('scores an excellent frontend / UI engineering position (>85)', () => {
    const job: JobListing = {
      id: 'test-senior-ui',
      title: 'Senior UI Developer - Design Systems',
      company: 'Samsung SDS Global',
      officialUrl: 'https://samsungsds.com/jobs/senior-ui',
      source: 'Direct Portal',
      postingDate: '2026-10-25',
      location: 'Noida (Delhi NCR)',
      workMode: 'Hybrid',
      salaryMin: 2000000,
      salaryMax: 2800000,
      currency: 'INR',
      description:
        'Looking for a Senior UI Developer with 8+ years experience. Expert in HTML5, CSS3, SCSS, JavaScript (ES6), responsive web design, Angular Material UI, reusable component architecture, design systems, Figma-to-code, WCAG accessibility, and automated Playwright testing.',
      requiredSkills: [
        'HTML5',
        'SCSS',
        'Angular Material',
        'Design Systems',
        'WCAG',
        'Playwright'
      ]
    };

    const result = scorer.scoreJob(job);
    expect(result.disqualified).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.tier).toBe('Excellent');
    expect(result.breakdown.technicalSkills).toBeGreaterThanOrEqual(25);
    expect(result.breakdown.experienceSeniority).toBeGreaterThanOrEqual(15);
    expect(result.breakdown.uiDesignSystems).toBeGreaterThanOrEqual(12);
    expect(result.breakdown.locationWorkMode).toBe(14); // Hybrid Delhi NCR
  });

  it('hard-disqualifies React-mandatory positions', () => {
    const reactJob: JobListing = {
      id: 'test-react-job',
      title: 'Senior React Developer',
      company: 'React Corp',
      officialUrl: 'https://reactcorp.com/jobs/react-dev',
      source: 'Portal',
      postingDate: '2026-10-25',
      location: 'Remote',
      workMode: 'Remote',
      salaryMin: 2500000,
      salaryMax: 3000000,
      currency: 'INR',
      description: 'Mandatory: 6+ years production React experience with Redux and Next.js.',
      requiredSkills: ['React', 'Redux', 'Next.js']
    };

    const result = scorer.scoreJob(reactJob);
    expect(result.disqualified).toBe(true);
    expect(result.score).toBe(0);
    expect(result.disqualificationReason).toContain('React-heavy');
  });

  it('hard-disqualifies jobs located on-site outside Delhi NCR', () => {
    const bangaloreJob: JobListing = {
      id: 'test-bangalore-onsite',
      title: 'Senior UI Engineer',
      company: 'Tech City',
      officialUrl: 'https://techcity.com/jobs/ui-blr',
      source: 'Portal',
      postingDate: '2026-10-25',
      location: 'Bangalore, Karnataka',
      workMode: 'On-site',
      salaryMin: 2200000,
      salaryMax: 2600000,
      currency: 'INR',
      description: 'Candidate must report daily to Bangalore office.',
      requiredSkills: ['HTML5', 'SCSS', 'Angular']
    };

    const result = scorer.scoreJob(bangaloreJob);
    expect(result.disqualified).toBe(true);
    expect(result.score).toBe(0);
    expect(result.disqualificationReason).toContain('outside candidate\'s base Delhi NCR');
  });

  it('hard-disqualifies jobs offering salary strictly below ₹10 LPA baseline', () => {
    const lowSalaryJob: JobListing = {
      id: 'test-low-salary',
      title: 'UI Developer',
      company: 'Budget Corp',
      officialUrl: 'https://budgetcorp.com/jobs/ui-dev',
      source: 'Portal',
      postingDate: '2026-10-25',
      location: 'New Delhi',
      workMode: 'Hybrid',
      salaryMin: 500000,
      salaryMax: 800000,
      currency: 'INR',
      description: 'UI developer for HTML and CSS',
      requiredSkills: ['HTML5', 'CSS3']
    };

    const result = scorer.scoreJob(lowSalaryJob);
    expect(result.disqualified).toBe(true);
    expect(result.score).toBe(0);
    expect(result.disqualificationReason).toContain('strictly below the ₹10 LPA minimum baseline');
  });

  it('hard-disqualifies expired job postings older than 30 days', () => {
    const expiredJob: JobListing = {
      id: 'test-expired',
      title: 'Senior UI Developer',
      company: 'Past Corp',
      officialUrl: 'https://pastcorp.com/jobs/ui-past',
      source: 'Portal',
      postingDate: '2026-08-01',
      location: 'Remote, India',
      workMode: 'Remote',
      salaryMin: 2000000,
      salaryMax: 2500000,
      currency: 'INR',
      description: 'Senior UI Developer',
      requiredSkills: ['HTML5', 'SCSS', 'Angular']
    };

    const result = scorer.scoreJob(expiredJob);
    expect(result.disqualified).toBe(true);
    expect(result.score).toBe(0);
    expect(result.disqualificationReason).toContain('exceeds maximum threshold');
  });
});
