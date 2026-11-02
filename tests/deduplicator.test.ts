import { describe, it, expect } from 'vitest';
import { Deduplicator } from '../src/matching/deduplicator.js';
import { JobListing } from '../src/types/index.js';

describe('Deduplicator Unit Tests', () => {
  it('normalizes URLs by removing tracking and referral query parameters', () => {
    const dedup = new Deduplicator();
    const dirtyUrl1 = 'https://example.com/jobs/123/?utm_source=linkedin&utm_campaign=winter2026&ref=board';
    const dirtyUrl2 = 'https://example.com/jobs/123?gh_src=partner&lever-source=agency';

    expect(dedup.normalizeUrl(dirtyUrl1)).toBe('https://example.com/jobs/123');
    expect(dedup.normalizeUrl(dirtyUrl2)).toBe('https://example.com/jobs/123');
  });

  it('detects duplicate jobs with the same URL', () => {
    const dedup = new Deduplicator();
    const job1: JobListing = {
      id: 'job-1',
      title: 'Senior Frontend Developer',
      company: 'Acme Corp',
      officialUrl: 'https://acme.com/jobs/frontend?utm_source=feed',
      source: 'Feed A',
      postingDate: '2026-10-25',
      location: 'Remote',
      workMode: 'Remote',
      description: 'Desc',
      requiredSkills: ['HTML5']
    };

    const job2: JobListing = {
      id: 'job-2',
      title: 'Senior Frontend Developer',
      company: 'Acme Corp',
      officialUrl: 'https://acme.com/jobs/frontend/?utm_medium=email',
      source: 'Feed B',
      postingDate: '2026-10-25',
      location: 'Remote',
      workMode: 'Remote',
      description: 'Desc',
      requiredSkills: ['HTML5']
    };

    dedup.register(job1);
    const check = dedup.isDuplicate(job2);
    expect(check.isDup).toBe(true);
    expect(check.reason).toContain('matching normalized URL');
  });

  it('detects duplicates matching company, normalized title, and location signature', () => {
    const dedup = new Deduplicator();
    const job1: JobListing = {
      id: 'job-alpha',
      title: 'Senior UI Engineer',
      company: 'TechCorp India',
      officialUrl: 'https://source-a.com/job-1',
      source: 'Source A',
      postingDate: '2026-10-25',
      location: 'Gurugram',
      workMode: 'Hybrid',
      description: 'Desc',
      requiredSkills: []
    };

    const job2: JobListing = {
      id: 'job-beta',
      title: 'Sr. UI Engineer',
      company: 'TechCorp India',
      officialUrl: 'https://source-b.com/job-999',
      source: 'Source B',
      postingDate: '2026-10-26',
      location: 'Gurugram',
      workMode: 'Hybrid',
      description: 'Desc',
      requiredSkills: []
    };

    dedup.register(job1);
    const check = dedup.isDuplicate(job2);
    expect(check.isDup).toBe(true);
    expect(check.reason).toContain('matching company/role/location signature');
  });
});
