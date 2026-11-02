import { PersistentTracker } from '../src/tracker/persistent-tracker.js';

const tracker = new PersistentTracker('data/applications.csv');

tracker.upsert({
  jobId: 'linkedin-4478053400',
  title: 'Front-End Engineer II',
  company: 'Amazon (ADCI)',
  officialUrl: 'https://www.linkedin.com/jobs/view/4478053400/',
  source: 'LinkedIn Jobs',
  postingDate: '2026-10-15',
  location: 'Bengaluru, Karnataka, India',
  workMode: 'Hybrid',
  salary: '₹35,00,000 - ₹55,00,000 PA',
  requiredSkills: 'HTML5, CSS3, JavaScript, Angular, Reusable UI Components, WCAG, Distributed Systems',
  matchScore: 75,
  evidence: 'Strong technical fit (HTML/CSS/JS/Angular); 8+ years experience exceeds 2-5 yr bar; WCAG & reusable UI components; Exceeds compensation threshold (₹35-55 LPA)',
  missingRequirements: 'Location constraint: Hybrid in Bengaluru (outside base Delhi NCR)',
  applicationStatus: 'MANUAL_REVIEW_NEEDED',
  nextAction: 'Candidate relocation decision required. Tailored documents prepared at data/tailored-documents/Amazon__ADCI__linkedin-4478053400/',
  notes: 'Amazon FBA Placement Organization. Req #A10575321. Framework accepts Angular.'
});

console.log('Amazon FEE II successfully upserted into tracker.');

