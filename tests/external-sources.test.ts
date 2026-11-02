import { describe, it, expect } from 'vitest';
import { LinkedInJobSourceAdapter } from '../src/sources/linkedin-adapter.js';
import { NaukriJobSourceAdapter } from '../src/sources/naukri-adapter.js';
import { IndeedJobSourceAdapter } from '../src/sources/indeed-adapter.js';
import { JobScorer } from '../src/matching/scorer.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';

describe('External Job Board Adapters (LinkedIn, Naukri, Indeed)', () => {
  const scorer = new JobScorer(VERIFIED_CANDIDATE_PROFILE, 10.0, 30);

  describe('LinkedInJobSourceAdapter', () => {
    const linkedinAdapter = new LinkedInJobSourceAdapter();

    it('generates targeted LinkedIn Boolean search URLs for Delhi NCR and Remote India', () => {
      const delhiUrl = linkedinAdapter.buildSearchQueryUrl('delhi-ncr');
      expect(delhiUrl).toContain('keywords=');
      expect(delhiUrl).toContain('Senior');
      expect(delhiUrl).toContain('Delhi');
      expect(delhiUrl).toContain('f_TPR=r604800'); // past 7 days

      const remoteUrl = linkedinAdapter.buildSearchQueryUrl('remote');
      expect(remoteUrl).toContain('f_WT=2'); // remote workplace flag
      expect(remoteUrl).toContain('location=India');
    });

    it('fetches verified LinkedIn listings and correctly evaluates them with JobScorer', async () => {
      const jobs = await linkedinAdapter.fetchJobs();
      expect(jobs.length).toBeGreaterThan(0);

      const cbaJob = jobs.find((j) => j.id === 'linkedin-001');
      expect(cbaJob).toBeDefined();

      const result = scorer.scoreJob(cbaJob!);
      expect(result.disqualified).toBe(false);
      expect(result.score).toBeGreaterThanOrEqual(75); // Strong match
      expect(result.evidence.some((e) => e.includes('Angular'))).toBe(true);
    });

    it('rejects React-mandatory listings discovered from LinkedIn', async () => {
      const jobs = await linkedinAdapter.fetchJobs();
      const trap = jobs.find((j) => j.id === 'linkedin-trap-001');
      expect(trap).toBeDefined();

      const result = scorer.scoreJob(trap!);
      expect(result.disqualified).toBe(true);
      expect(result.disqualificationReason).toContain('React');
    });
  });

  describe('NaukriJobSourceAdapter', () => {
    const naukriAdapter = new NaukriJobSourceAdapter({ candidateExperienceYears: 8, minCtcLakhs: 10 });

    it('generates official Naukri query URLs with experience, CTC filters, and Delhi NCR / Remote locations', () => {
      const queryUrl = naukriAdapter.buildSearchQueryUrl('delhi-ncr');
      expect(queryUrl).toContain('naukri.com');
      expect(queryUrl).toContain('experience=8');
      expect(queryUrl).toContain('ctcFilter=10to15%2C15to25%2C25to50');
      expect(queryUrl).toContain('delhi');
    });

    it('fetches verified Naukri listings and matches senior UI developer roles', async () => {
      const jobs = await naukriAdapter.fetchJobs();
      expect(jobs.length).toBeGreaterThan(0);

      const infoEdge = jobs.find((j) => j.id === 'naukri-001');
      expect(infoEdge).toBeDefined();

      const result = scorer.scoreJob(infoEdge!);
      expect(result.disqualified).toBe(false);
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.breakdown.locationWorkMode).toBeGreaterThanOrEqual(14); // Delhi NCR hybrid locality
    });

    it('disqualifies Naukri listings below the ₹10 LPA compensation baseline', async () => {
      const jobs = await naukriAdapter.fetchJobs();
      const lowPayTrap = jobs.find((j) => j.id === 'naukri-trap-001');
      expect(lowPayTrap).toBeDefined();

      const result = scorer.scoreJob(lowPayTrap!);
      expect(result.disqualified).toBe(true);
      expect(result.disqualificationReason).toContain('below the ₹10 LPA minimum baseline');
    });
  });

  describe('IndeedJobSourceAdapter', () => {
    const indeedAdapter = new IndeedJobSourceAdapter();

    it('generates targeted Indeed India search query URLs with full-time and 7-day recency filters', () => {
      const queryUrl = indeedAdapter.buildSearchQueryUrl('delhi-ncr');
      expect(queryUrl).toContain('in.indeed.com');
      expect(queryUrl).toContain('fromage=7');
      expect(queryUrl).toContain('sc=0kf');
      const decoded = decodeURIComponent(queryUrl);
      expect(decoded).toContain('Senior UI Developer');
      expect(decoded).toContain('Delhi NCR');
    });

    it('fetches verified Indeed listings and scores enterprise opportunities', async () => {
      const jobs = await indeedAdapter.fetchJobs();
      expect(jobs.length).toBeGreaterThan(0);

      const techM = jobs.find((j) => j.id === 'indeed-001');
      expect(techM).toBeDefined();

      const result = scorer.scoreJob(techM!);
      expect(result.disqualified).toBe(false);
      expect(result.score).toBeGreaterThanOrEqual(75);
    });

    it('disqualifies on-site positions located outside Delhi NCR from Indeed', async () => {
      const jobs = await indeedAdapter.fetchJobs();
      const puneTrap = jobs.find((j) => j.id === 'indeed-trap-001');
      expect(puneTrap).toBeDefined();

      const result = scorer.scoreJob(puneTrap!);
      expect(result.disqualified).toBe(true);
      expect(result.disqualificationReason).toContain('outside candidate\'s base Delhi NCR');
    });
  });
});
