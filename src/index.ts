import * as dotenv from 'dotenv';
dotenv.config();

import * as path from 'path';
import { fileURLToPath } from 'url';
import { VERIFIED_CANDIDATE_PROFILE } from './profile/candidate-profile.js';
import { JobScorer } from './matching/scorer.js';
import { Deduplicator } from './matching/deduplicator.js';
import { PersistentTracker } from './tracker/persistent-tracker.js';
import { MockJobSourceAdapter } from './sources/mock-source.js';
import { PublicJobBoardsAdapter } from './sources/public-apis.js';
import { LinkedInJobSourceAdapter } from './sources/linkedin-adapter.js';
import { NaukriJobSourceAdapter } from './sources/naukri-adapter.js';
import { IndeedJobSourceAdapter } from './sources/indeed-adapter.js';
import { JobSourceAdapter } from './sources/adapter-interface.js';
import { DocumentTailor } from './applications/tailor.js';
import { SubmissionSafeguard } from './applications/submission-safeguard.js';
import { ReportGenerator } from './reports/report-generator.js';
import { ApplicationRecord, JobListing, MatchResult } from './types/index.js';

export interface WorkflowOptions {
  mode?: 'dry-run' | 'search' | 'report';
  includePublicWeb?: boolean;
  includeExternalBoards?: boolean;
}

export async function runJobSearchWorkflow(options: WorkflowOptions = {}) {
  const mode = options.mode || (process.env.MODE as any) || 'dry-run';
  const dryRun = process.env.DRY_RUN !== 'false';
  const enableAutoSubmit = process.env.ENABLE_AUTOSUBMIT === 'true';
  const trackerPath = process.env.TRACKER_PATH || 'data/applications.csv';
  const reportsPath = process.env.REPORTS_PATH || 'data/reports';
  const outputDocsPath = process.env.OUTPUT_DOCS_PATH || 'data/tailored-documents';
  const minScore = parseInt(process.env.MIN_MATCH_SCORE || '75', 10);

  console.log('===============================================================');
  console.log('  ASHUTOSH KUMAR — AI JOB SEARCH & APPLICATION AGENT');
  console.log(`  Mode: ${mode.toUpperCase()} | Dry Run: ${dryRun} | AutoSubmit: ${enableAutoSubmit}`);
  console.log('===============================================================\n');

  // 1. Initialize Modules
  const tracker = new PersistentTracker(trackerPath);
  const deduplicator = new Deduplicator();
  const scorer = new JobScorer(VERIFIED_CANDIDATE_PROFILE, 10.0, 30);
  const tailor = new DocumentTailor(VERIFIED_CANDIDATE_PROFILE, outputDocsPath);
  const safeguard = new SubmissionSafeguard(dryRun, enableAutoSubmit);
  const reporter = new ReportGenerator(reportsPath);

  // Register existing tracker records into deduplicator
  deduplicator.registerExisting(tracker.getAll());

  // If mode is just 'report', generate and exit
  if (mode === 'report') {
    const existingRecords = tracker.getAll();
    console.log(`Generating report from ${existingRecords.length} stored tracker records...`);
    const { markdownPath } = reporter.generateDailyReport(existingRecords, []);
    console.log(`Report generated successfully: ${markdownPath}`);
    return;
  }

  // 2. Job Discovery Phase
  console.log('[Phase 1: Job Discovery] Fetching listings from source adapters...');
  const adapters: JobSourceAdapter[] = [new MockJobSourceAdapter()];

  // Include Indeed, Naukri, and LinkedIn external board adapters
  if (options.includeExternalBoards || (options.includeExternalBoards !== false && options.includePublicWeb !== false)) {
    adapters.push(new LinkedInJobSourceAdapter());
    adapters.push(new NaukriJobSourceAdapter());
    adapters.push(new IndeedJobSourceAdapter());
  }

  if (options.includePublicWeb !== false) {
    adapters.push(new PublicJobBoardsAdapter());
  }

  const rawJobs: JobListing[] = [];
  for (const adapter of adapters) {
    console.log(` - Querying adapter: ${adapter.name}...`);
    try {
      const jobs = await adapter.fetchJobs();
      console.log(`   Found ${jobs.length} listings from ${adapter.name}.`);
      rawJobs.push(...jobs);
    } catch (err: any) {
      console.warn(`   Warning: Failed fetching from ${adapter.name}: ${err.message}`);
    }
  }

  console.log(`\nTotal raw listings discovered across adapters: ${rawJobs.length}`);

  // 3. Deduplication & Scoring Phase
  console.log('\n[Phase 2: Deduplication & Scoring] Evaluating listings against profile...');
  const evaluatedResults: MatchResult[] = [];
  const processedRecords: ApplicationRecord[] = [];

  let duplicateCount = 0;
  for (const job of rawJobs) {
    // Check duplicates
    const dupCheck = deduplicator.isDuplicate(job);
    if (dupCheck.isDup) {
      duplicateCount++;
      continue;
    }

    // Register job in deduplicator
    deduplicator.register(job);

    // Score job against verified candidate profile
    const match = scorer.scoreJob(job);
    evaluatedResults.push(match);

    let applicationStatus: ApplicationRecord['applicationStatus'] = 'DISCOVERED';
    let nextAction = 'Evaluate suitability.';
    let preparedResumePath = '';
    let preparedCoverLetterPath = '';

    if (match.disqualified) {
      applicationStatus = 'REJECTED_DISQUALIFIED';
      nextAction = `Disqualified: ${match.disqualificationReason}`;
    } else if (match.score >= minScore) {
      // 4. Tailoring Phase for High-Match Opportunities
      const tailored = tailor.tailorDocuments(job, match);
      preparedResumePath = tailored.resumePath || '';
      preparedCoverLetterPath = tailored.coverLetterPath || '';

      // 5. Submission Safeguard Evaluation
      const decision = safeguard.evaluateSubmission(
        job,
        match,
        preparedResumePath,
        preparedCoverLetterPath
      );

      applicationStatus = decision.status;
      nextAction = decision.nextAction;
    } else if (match.score >= 60) {
      applicationStatus = 'MANUAL_REVIEW_NEEDED';
      nextAction = `Manual review recommended (Match Score: ${match.score}/100).`;
    } else {
      applicationStatus = 'REJECTED_DISQUALIFIED';
      nextAction = `Score ${match.score}/100 is below the minimum threshold.`;
    }

    const record: ApplicationRecord = {
      jobId: job.id,
      title: job.title,
      company: job.company,
      officialUrl: job.officialUrl,
      source: job.source,
      postingDate: job.postingDate,
      location: job.location,
      workMode: job.workMode,
      salary: job.salaryRaw || (job.salaryMin ? `${job.salaryMin} - ${job.salaryMax}` : 'Unspecified'),
      requiredSkills: job.requiredSkills.join(', '),
      matchScore: match.score,
      evidence: match.evidence.join('; '),
      missingRequirements: match.missingRequirements.join('; '),
      applicationStatus,
      nextAction,
      appliedDate: applicationStatus === 'SUBMITTED' ? new Date().toISOString().split('T')[0] : undefined,
      notes: match.disqualificationReason || undefined
    };

    tracker.upsert(record);
    processedRecords.push(record);
  }

  console.log(` - Evaluated: ${processedRecords.length} unique opportunities.`);
  console.log(` - Filtered duplicates: ${duplicateCount}`);

  // 6. Generate Daily Report
  console.log('\n[Phase 3: Persistent Tracking & Reporting]');
  const allTrackerRecords = tracker.getAll();
  const { markdownPath, summary } = reporter.generateDailyReport(allTrackerRecords, evaluatedResults);

  console.log(`\n===============================================================`);
  console.log(`  WORKFLOW RUN COMPLETE`);
  console.log(`  Report Generated: ${markdownPath}`);
  console.log(`  Qualified Candidates: ${summary.qualifiedCount} | Excluded: ${summary.disqualifiedCount}`);
  console.log(`  Tracker CSV: ${trackerPath}`);
  console.log(`===============================================================\n`);

  // Print Top 5 to stdout for immediate visibility
  console.log('TOP VERIFIED OPPORTUNITIES:');
  const topMatches = summary.topOpportunities.slice(0, 5);
  for (let i = 0; i < topMatches.length; i++) {
    const opp = topMatches[i];
    console.log(` ${i + 1}. [${opp.matchScore}/100] ${opp.title} at ${opp.company} (${opp.location})`);
    console.log(`    Status: ${opp.applicationStatus} | Mode: ${opp.workMode}`);
    console.log(`    URL: ${opp.officialUrl}`);
    console.log(`    Action: ${opp.nextAction}\n`);
  }

  return { summary, tracker, markdownPath };
}

// Allow CLI execution directly
const currentFilePath = fileURLToPath(import.meta.url).toLowerCase();
const scriptArg = process.argv[1] ? path.resolve(process.argv[1]).toLowerCase() : '';
const isDirectExecution = currentFilePath === scriptArg || scriptArg.endsWith('index.ts') || scriptArg.endsWith('index.js');

if (isDirectExecution) {
  const args = process.argv.slice(2);
  const modeArg = args.find((a) => a.startsWith('--mode=') || a === '--mode');
  let mode: WorkflowOptions['mode'] = 'dry-run';
  if (modeArg) {
    const val = modeArg.includes('=') ? modeArg.split('=')[1] : args[args.indexOf(modeArg) + 1];
    if (val === 'search' || val === 'report' || val === 'dry-run') {
      mode = val as WorkflowOptions['mode'];
    }
  }

  runJobSearchWorkflow({ mode }).catch((err) => {
    console.error('Fatal workflow error:', err);
    process.exit(1);
  });
}
