import { ApplicationRecord, ApplicationStatus, JobListing, MatchResult } from '../types/index.js';

export interface SubmissionDecision {
  canProceedAutomated: boolean;
  status: ApplicationStatus;
  reason: string;
  nextAction: string;
  manualActionPacket?: {
    officialUrl: string;
    preparedResumePath: string;
    preparedCoverLetterPath: string;
    questionsForCandidate: string[];
    suggestedResponses: Record<string, string>;
  };
}

export class SubmissionSafeguard {
  private dryRun: boolean;
  private enableAutoSubmit: boolean;

  constructor(dryRun: boolean = true, enableAutoSubmit: boolean = false) {
    this.dryRun = dryRun;
    this.enableAutoSubmit = enableAutoSubmit;
  }

  public evaluateSubmission(
    job: JobListing,
    match: MatchResult,
    preparedResumePath: string,
    preparedCoverLetterPath: string
  ): SubmissionDecision {
    // 1. Dry run enforcement
    if (this.dryRun) {
      return {
        canProceedAutomated: false,
        status: 'TAILORED',
        reason: 'Operating in DRY-RUN mode. Live submission is intentionally withheld.',
        nextAction: `[DRY-RUN] Verified match (Score ${match.score}/100). Application documents prepared at ${preparedResumePath}. Ready for review.`,
        manualActionPacket: {
          officialUrl: job.officialUrl,
          preparedResumePath,
          preparedCoverLetterPath,
          questionsForCandidate: this.detectCustomQuestions(job),
          suggestedResponses: this.getSuggestedResponses()
        }
      };
    }

    // 2. Global autosubmit safety flag check
    if (!this.enableAutoSubmit) {
      return {
        canProceedAutomated: false,
        status: 'MANUAL_ACTION_REQUIRED',
        reason: 'Automated submission is disabled by system policy (ENABLE_AUTOSUBMIT=false).',
        nextAction: `Review prepared documents and submit via official career portal: ${job.officialUrl}`,
        manualActionPacket: {
          officialUrl: job.officialUrl,
          preparedResumePath,
          preparedCoverLetterPath,
          questionsForCandidate: this.detectCustomQuestions(job),
          suggestedResponses: this.getSuggestedResponses()
        }
      };
    }

    // 3. Human Approval Gates: Check for sensitive declarations or custom requirements
    const sensitiveQuestions = this.detectCustomQuestions(job);
    if (sensitiveQuestions.length > 0) {
      return {
        canProceedAutomated: false,
        status: 'MANUAL_REVIEW_NEEDED',
        reason: `Application contains questions or legal declarations requiring candidate confirmation: ${sensitiveQuestions.join('; ')}`,
        nextAction: `Review sensitive questions before completing application at ${job.officialUrl}`,
        manualActionPacket: {
          officialUrl: job.officialUrl,
          preparedResumePath,
          preparedCoverLetterPath,
          questionsForCandidate: sensitiveQuestions,
          suggestedResponses: this.getSuggestedResponses()
        }
      };
    }

    // 4. Portal automation channel check
    const isChannelAutomated = this.supportsAutomatedSubmission(job.officialUrl);
    if (!isChannelAutomated) {
      return {
        canProceedAutomated: false,
        status: 'MANUAL_ACTION_REQUIRED',
        reason: 'Target application portal requires authenticated candidate login, CAPTCHA, or external ATS flow.',
        nextAction: `Submit manually on official portal: ${job.officialUrl} with prepared application documents.`,
        manualActionPacket: {
          officialUrl: job.officialUrl,
          preparedResumePath,
          preparedCoverLetterPath,
          questionsForCandidate: [],
          suggestedResponses: this.getSuggestedResponses()
        }
      };
    }

    // 5. If everything passes and authorization is explicitly enabled
    return {
      canProceedAutomated: true,
      status: 'READY_TO_SUBMIT',
      reason: 'Authorized automated submission channel available.',
      nextAction: `Submit via API/automation channel and verify confirmation receipt.`
    };
  }

  private detectCustomQuestions(job: JobListing): string[] {
    const questions: string[] = [];
    const desc = job.description.toLowerCase();

    if (desc.includes('bond') || desc.includes('service agreement')) {
      questions.push('Service bond / agreement requirement detected');
    }
    if (desc.includes('background check') || desc.includes('security clearance')) {
      questions.push('Formal background check / security clearance declaration required');
    }
    if (desc.includes('relocation') && !desc.includes('remote')) {
      questions.push('Relocation willingness declaration');
    }
    if (desc.includes('notice period') || desc.includes('how soon can you join')) {
      questions.push('Notice period confirmation (Ashutosh: standard 30-day / immediate contract availability)');
    }

    return questions;
  }

  private supportsAutomatedSubmission(url: string): boolean {
    // Only sanctioned official API webhook endpoints or whitelisted automation targets
    // Standard platforms like Workday, Taleo, LinkedIn EasyApply, Naukri require user-session login or human presence.
    return false; // Default to false for enterprise safety unless authorized connector configured
  }

  private getSuggestedResponses(): Record<string, string> {
    return {
      'Full Name': 'Ashutosh Kumar',
      'Email': 'kumar.ashu872@gmail.com',
      'Phone': '+91 9310681373',
      'Location': 'New Delhi, India',
      'LinkedIn': 'https://linkedin.com/in/kumarashu872',
      'Total Experience': '8+ years',
      'Current Employer': 'Wondrfly (Contract)',
      'Primary Skills': 'HTML5, CSS3, SCSS, JavaScript, Angular Material UI, Design Systems, Playwright, WCAG',
      'Notice Period': 'Immediate / 15-30 days',
      'Current CTC': '₹6,00,000 PA (6 LPA)',
      'Expected CTC': '₹12,00,000+ PA (Remote / Delhi NCR) | ₹15,00,000+ PA (Out of NCR)',
      'Work Mode Preference': 'Remote / Hybrid (Delhi NCR)'
    };
  }
}
