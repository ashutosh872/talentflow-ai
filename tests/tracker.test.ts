import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { PersistentTracker } from '../src/tracker/persistent-tracker.js';
import { ApplicationRecord } from '../src/types/index.js';

describe('PersistentTracker Unit Tests', () => {
  const testCsvPath = path.resolve('data/test-applications.csv');

  beforeEach(() => {
    if (fs.existsSync(testCsvPath)) {
      fs.unlinkSync(testCsvPath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testCsvPath)) {
      fs.unlinkSync(testCsvPath);
    }
  });

  it('initializes empty CSV file with appropriate headers', () => {
    const tracker = new PersistentTracker(testCsvPath);
    expect(fs.existsSync(testCsvPath)).toBe(true);
    const content = fs.readFileSync(testCsvPath, 'utf-8');
    expect(content).toContain('Job ID,Title,Company,Official URL');
  });

  it('persists and retrieves records with special characters (commas, quotes, newlines)', () => {
    const tracker = new PersistentTracker(testCsvPath);
    const rec: ApplicationRecord = {
      jobId: 'test-rec-1',
      title: 'Senior UI Engineer, Core Platform',
      company: 'Acme "Global", Inc.',
      officialUrl: 'https://acme.com/jobs/1',
      source: 'Portal',
      postingDate: '2026-10-25',
      location: 'Noida, Delhi NCR',
      workMode: 'Hybrid',
      salary: '₹20,00,000 - ₹25,00,000',
      requiredSkills: 'HTML5, CSS3, Angular',
      matchScore: 92,
      evidence: 'Matches 8+ years experience; Strong enterprise background',
      missingRequirements: 'None',
      applicationStatus: 'TAILORED',
      nextAction: 'Ready for review in dry-run mode.'
    };

    tracker.upsert(rec);

    // Re-instantiate from the same CSV file to verify persistence
    const loadedTracker = new PersistentTracker(testCsvPath);
    const retrieved = loadedTracker.get('test-rec-1');

    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe('Senior UI Engineer, Core Platform');
    expect(retrieved?.company).toBe('Acme "Global", Inc.');
    expect(retrieved?.matchScore).toBe(92);
    expect(retrieved?.applicationStatus).toBe('TAILORED');
  });

  it('updates application status, notes and confirmation ID correctly', () => {
    const tracker = new PersistentTracker(testCsvPath);
    const rec: ApplicationRecord = {
      jobId: 'test-rec-2',
      title: 'Senior Frontend Developer',
      company: 'Test Org',
      officialUrl: 'https://testorg.com/jobs/2',
      source: 'Portal',
      postingDate: '2026-10-25',
      location: 'Remote',
      workMode: 'Remote',
      salary: 'Competitive',
      requiredSkills: 'JavaScript, CSS3',
      matchScore: 80,
      evidence: 'Evidence',
      missingRequirements: '',
      applicationStatus: 'READY_TO_SUBMIT',
      nextAction: 'Submit application'
    };

    tracker.upsert(rec);
    tracker.updateStatus('test-rec-2', 'SUBMITTED', 'Submitted via authorized channel', 'Submission verified', 'CONF-99881');

    const updated = tracker.get('test-rec-2');
    expect(updated?.applicationStatus).toBe('SUBMITTED');
    expect(updated?.confirmationId).toBe('CONF-99881');
    expect(updated?.appliedDate).toBeDefined();
  });
});
