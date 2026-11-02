import { JobScorer } from '../src/matching/scorer.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';
import { JobListing } from '../src/types/index.js';

const scorer = new JobScorer(VERIFIED_CANDIDATE_PROFILE, 10.0, 30);

// Scenario 1: Strict search preference matching (As posted: Bengaluru, Hybrid)
const amazonAsPosted: JobListing = {
  id: 'linkedin-4478053400',
  title: 'Front-End Engineer II',
  company: 'Amazon (ADCI)',
  officialUrl: 'https://www.linkedin.com/jobs/view/4478053400/',
  source: 'LinkedIn Jobs',
  postingDate: '2026-10-15',
  location: 'Bengaluru, Karnataka, India',
  workMode: 'Hybrid',
  salaryMin: 3500000,
  salaryMax: 5500000,
  currency: 'INR',
  salaryRaw: '₹35,00,000 - ₹55,00,000 PA',
  employmentType: 'Full-time',
  description: `Fulfillment by Amazon (FBA) Placement team is seeking a Front-End Engineer II. Translate complex supply chain decisions into simple, intuitive web experiences. Deliver responsive, performant, secure, and accessible experiences across browsers and devices. Build reusable UI components, frameworks, and patterns. 2+ years professional frontend with HTML/CSS/JavaScript; 4+ years computer science fundamentals; Experience with JavaScript frameworks such as angular and react. Preferred: HTML, CSS, JS, TypeScript, Node.`,
  requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Angular', 'Reusable UI Components', 'Responsive Web Design', 'Accessibility'],
  requisitionId: 'A10575321'
};

// Scenario 2: If candidate considers relocation or Remote India arrangement
const amazonIfRelocatingOrRemote: JobListing = {
  ...amazonAsPosted,
  location: 'Remote (India) / Bengaluru',
  workMode: 'Remote'
};

console.log('=== SCENARIO 1: STRICT POLICY (Delhi NCR / Remote Only) ===');
const res1 = scorer.scoreJob(amazonAsPosted);
console.log('Status:', res1.disqualified ? '❌ DISQUALIFIED' : '✅ QUALIFIED');
if (res1.disqualified) console.log('Reason:', res1.disqualificationReason);
console.log('Score:', res1.score, '/ 100 | Tier:', res1.tier);

console.log('\n=== SCENARIO 2: TECHNICAL & EXPERIENCE FIT (If Remote / Open to Relocation) ===');
const res2 = scorer.scoreJob(amazonIfRelocatingOrRemote);
console.log('Status:', res2.disqualified ? '❌ DISQUALIFIED' : '✅ QUALIFIED');
console.log('Score:', res2.score, '/ 100 | Tier:', res2.tier);
console.log('Breakdown:', JSON.stringify(res2.breakdown, null, 2));
console.log('Matched Evidence:');
res2.evidence.forEach(e => console.log(' •', e));
console.log('Missing / Flagged Requirements:');
res2.missingRequirements.forEach(m => console.log(' !', m));
