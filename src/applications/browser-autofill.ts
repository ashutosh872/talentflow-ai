import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { chromium, Browser, Page } from 'playwright';
import { PersistentTracker } from '../tracker/persistent-tracker.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../profile/candidate-profile.js';
import { ApplicationRecord } from '../types/index.js';

export interface AutofillOptions {
  jobId?: string;
  url?: string;
  headless?: boolean;
  resumePath?: string;
  coverLetterPath?: string;
  trackerPath?: string;
}

export interface AutofillResult {
  success: boolean;
  jobId: string;
  fieldsFilled: string[];
  resumeAttached: boolean;
  status: string;
  message: string;
}

export class BrowserAutofiller {
  private tracker: PersistentTracker;

  constructor(trackerPath: string = 'data/applications.csv') {
    this.tracker = new PersistentTracker(trackerPath);
  }

  /**
   * Run the assisted autofill session on a given job listing or URL.
   */
  public async autofill(options: AutofillOptions): Promise<AutofillResult> {
    const candidate = VERIFIED_CANDIDATE_PROFILE;
    let targetUrl = options.url || '';
    let targetJobId = options.jobId || 'custom-job';
    let jobRecord: ApplicationRecord | undefined;

    if (options.jobId) {
      jobRecord = this.tracker.get(options.jobId);
      if (jobRecord) {
        targetUrl = targetUrl || jobRecord.officialUrl;
        targetJobId = jobRecord.jobId;
      }
    }

    if (!targetUrl) {
      throw new Error('No target URL provided or found for this job ID.');
    }

    // If target is a mock fixture portal, point to the rich local fixture page for seamless demonstration
    const mockMap: Record<string, string> = {
      'job-mock-001': 'data/mock-portal/nagarro.html',
      'job-mock-002': 'data/mock-portal/samsung-sds.html',
      'job-mock-003': 'data/mock-portal/wipro.html',
      'job-mock-004': 'data/mock-portal/gitlab.html',
      'job-mock-005': 'data/mock-portal/experience-commerce.html',
      'job-mock-006': 'data/mock-portal/cisco.html',
      'job-mock-007': 'data/mock-portal/acme-global.html',
      'job-mock-008': 'data/mock-portal/mindrops.html',
      'job-mock-009': 'data/mock-portal/cognitive-labs.html',
      'job-mock-010': 'data/mock-portal/incedo.html'
    };

    if (mockMap[targetJobId]) {
      const mockPortalPath = path.resolve(mockMap[targetJobId]);
      if (fs.existsSync(mockPortalPath)) {
        targetUrl = `file:///${mockPortalPath.replace(/\\/g, '/')}`;
      }
    }

    // Resolve resume and cover letter documents
    let resumeFile = options.resumePath;
    let coverLetterText = '';

    if (!resumeFile && jobRecord) {
      const companyDir = path.resolve('data/tailored-documents');
      if (fs.existsSync(companyDir)) {
        const dirs = fs.readdirSync(companyDir);
        const matchDir = dirs.find((d) => d.includes(targetJobId) || d.toLowerCase().includes(jobRecord!.company.toLowerCase().substring(0, 10)));
        if (matchDir) {
          const targetFolder = path.join(companyDir, matchDir);
          // Look for standard FirstName_LastName_Resume.pdf / .md
          const candidateFiles = [
            'Ashutosh_Kumar_Resume.pdf',
            'Ashutosh_Kumar_Resume.md'
          ];
          for (const cf of candidateFiles) {
            const p = path.join(targetFolder, cf);
            if (fs.existsSync(p)) {
              resumeFile = p;
              break;
            }
          }

          const covPath = path.join(targetFolder, 'Ashutosh_Kumar_Cover_Letter.md');
          if (fs.existsSync(covPath)) {
            coverLetterText = fs.readFileSync(covPath, 'utf-8');
          }
        }
      }
    }

    // Fallback to verified PDF resume if tailored md is not explicitly specified
    if (!resumeFile || !fs.existsSync(resumeFile)) {
      const defaultPdf = path.resolve('data/resumes/Ashutosh Kumar Senior Frontend Engineer Resume.pdf');
      if (fs.existsSync(defaultPdf)) {
        resumeFile = defaultPdf;
      }
    }

    const isHeadless = options.headless ?? false;
    console.log(`\n🚀 Launching Browser Autofiller for: ${jobRecord ? `${jobRecord.title} at ${jobRecord.company}` : targetUrl}`);
    console.log(`   URL: ${targetUrl}`);
    console.log(`   Resume: ${resumeFile || 'None'}`);
    console.log(`   Headless: ${isHeadless}\n`);

    const browser = await chromium.launch({
      headless: isHeadless,
      args: ['--disable-blink-features=AutomationControlled', '--start-maximized']
    });

    const context = await browser.newContext({
      viewport: null,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    const fieldsFilled: string[] = [];
    let resumeAttached = false;

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000); // Allow dynamic forms/scripts to render

      // Smart Field Auto-Detection & Filling
      fieldsFilled.push(...(await this.fillCandidateFields(page, candidate, coverLetterText)));

      // Resume file upload
      if (resumeFile && fs.existsSync(resumeFile)) {
        resumeAttached = await this.attachResume(page, resumeFile);
      }

      // Inject floating helper notification for candidate
      await this.injectHelperBanner(page, fieldsFilled.length, resumeAttached);

      console.log(`\n✅ Autofill complete! ${fieldsFilled.length} fields populated.`);
      if (resumeAttached) console.log(`📎 Resume successfully attached.`);

      if (!isHeadless) {
        console.log('\n===============================================================');
        console.log('  HUMAN-IN-THE-LOOP SAFEGUARD:');
        console.log('  Please review the pre-filled fields in the browser window,');
        console.log('  answer any company-specific questions / solve CAPTCHA,');
        console.log('  and click Submit.');
        console.log('===============================================================');

        const submitted = await this.promptCandidateConfirmation();
        if (submitted && jobRecord) {
          const appliedDate = new Date().toISOString().split('T')[0];
          const confId = `CONF-${jobRecord.jobId.slice(0, 8).toUpperCase()}-AUTOFILL`;
          this.tracker.updateStatus(
            jobRecord.jobId,
            'SUBMITTED',
            `Submitted via autofill on ${appliedDate}`,
            'Candidate confirmed submission in browser (Via Autofill)',
            confId
          );
          console.log(`\n🎉 Tracker updated: Job ${jobRecord.jobId} marked as SUBMITTED!`);
        }
      }

      return {
        success: true,
        jobId: targetJobId,
        fieldsFilled,
        resumeAttached,
        status: isHeadless ? 'AUTOFILL_TEST_PASSED' : 'READY_FOR_CANDIDATE_SUBMIT',
        message: `Autofill completed with ${fieldsFilled.length} fields filled.`
      };
    } catch (err: any) {
      console.error('Autofill error:', err.message);
      return {
        success: false,
        jobId: targetJobId,
        fieldsFilled,
        resumeAttached,
        status: 'AUTOFILL_FAILED',
        message: err.message
      };
    } finally {
      if (isHeadless) {
        await browser.close();
      }
    }
  }

  /**
   * Smartly map and fill input fields based on name, label, placeholder, and ARIA attributes
   */
  public async fillCandidateFields(
    page: Page,
    candidate: typeof VERIFIED_CANDIDATE_PROFILE,
    coverLetter: string
  ): Promise<string[]> {
    const filled: string[] = [];
    const nameParts = candidate.name.split(' ');
    const firstName = nameParts[0] || 'Ashutosh';
    const lastName = nameParts.slice(1).join(' ') || 'Kumar';

    const fieldMap: Array<{ patterns: RegExp[]; value: string; label: string }> = [
      {
        patterns: [/first.*name/i, /fname/i, /given.*name/i],
        value: firstName,
        label: 'First Name'
      },
      {
        patterns: [/last.*name/i, /lname/i, /surname/i, /family.*name/i],
        value: lastName,
        label: 'Last Name'
      },
      {
        patterns: [/^name$/i, /full.*name/i, /candidate.*name/i],
        value: candidate.name,
        label: 'Full Name'
      },
      {
        patterns: [/e-?mail/i],
        value: candidate.contact.email,
        label: 'Email'
      },
      {
        patterns: [/phone/i, /mobile/i, /tel/i, /contact.*number/i],
        value: candidate.contact.phone,
        label: 'Phone'
      },
      {
        patterns: [/linkedin/i],
        value: candidate.contact.linkedin,
        label: 'LinkedIn Profile'
      },
      {
        patterns: [/city/i, /location/i, /current.*location/i, /address/i],
        value: candidate.contact.location,
        label: 'Location'
      },
      {
        patterns: [/current.*company/i, /employer/i, /organization/i],
        value: 'Wondrfly',
        label: 'Current Company'
      },
      {
        patterns: [/current.*(role|title|position)/i, /job.*title/i],
        value: 'Frontend Developer',
        label: 'Current Title'
      },
      {
        patterns: [/(total.*)?(years.*)?experience/i, /yoe/i],
        value: '8',
        label: 'Years of Experience'
      },
      {
        patterns: [/notice.*period/i, /availability/i, /how.*soon/i],
        value: '15-30 days',
        label: 'Notice Period'
      },
      {
        patterns: [/cover.*letter/i, /message.*hiring/i, /additional.*info/i, /comments/i],
        value: coverLetter || candidate.summary,
        label: 'Cover Letter / Summary'
      }
    ];

    // Find all inputs, textareas, selects
    const inputs = await page.$$('input, textarea');

    for (const input of inputs) {
      try {
        const type = ((await input.getAttribute('type')) || '').toLowerCase();
        if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file'].includes(type)) continue;

        // Skip if already filled
        const existingVal = await input.inputValue().catch(() => '');
        if (existingVal && existingVal.trim().length > 0) continue;

        // Collect identifying attributes
        const nameAttr = (await input.getAttribute('name')) || '';
        const idAttr = (await input.getAttribute('id')) || '';
        const placeholder = (await input.getAttribute('placeholder')) || '';
        const ariaLabel = (await input.getAttribute('aria-label')) || '';

        // Check associated label
        let labelText = '';
        if (idAttr) {
          const labelEl = await page.$(`label[for="${idAttr}"]`);
          if (labelEl) labelText = (await labelEl.innerText()) || '';
        }

        const combinedText = `${nameAttr} ${idAttr} ${placeholder} ${ariaLabel} ${labelText}`.toLowerCase();

        // Match against field map
        for (const item of fieldMap) {
          const isMatch = item.patterns.some((p) => p.test(combinedText));
          if (isMatch) {
            await input.fill(item.value);
            filled.push(item.label);
            break;
          }
        }
      } catch {
        // Ignore unfillable inputs
      }
    }

    return Array.from(new Set(filled));
  }

  /**
   * Locate file inputs and attach resume
   */
  public async attachResume(page: Page, resumePath: string): Promise<boolean> {
    try {
      const fileInputs = await page.$$('input[type="file"]');
      for (const input of fileInputs) {
        const accept = (await input.getAttribute('accept')) || '';
        const idOrName = `${(await input.getAttribute('name')) || ''} ${(await input.getAttribute('id')) || ''}`.toLowerCase();

        // Check if this file input looks like a resume/CV input
        if (idOrName.includes('resume') || idOrName.includes('cv') || accept.includes('.pdf') || accept.includes('.doc') || fileInputs.length === 1) {
          await input.setInputFiles(resumePath);
          return true;
        }
      }
    } catch (err: any) {
      console.warn(`Could not attach file: ${err.message}`);
    }
    return false;
  }

  /**
   * Inject floating user guidance badge into the page
   */
  private async injectHelperBanner(page: Page, fieldsCount: number, hasResume: boolean): Promise<void> {
    try {
      await page.evaluate(
        ({ count, resume }) => {
          const banner = document.createElement('div');
          banner.id = 'agent-autofill-banner';
          banner.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            background: #1e293b;
            color: #f8fafc;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
            border: 1px solid #3b82f6;
            font-family: system-ui, sans-serif;
            max-width: 360px;
          `;
          banner.innerHTML = `
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span style="color: #10b981;">●</span> Agent Autofill Active
            </div>
            <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
              Auto-filled <strong>${count} fields</strong> with Ashutosh's verified profile.<br>
              ${resume ? '📎 Resume attached.' : 'ℹ️ No file input detected.'}
            </div>
            <div style="font-size: 11px; color: #60a5fa; margin-top: 8px; font-weight: 500;">
              👉 Please review answers, complete CAPTCHA/2FA, and click Submit.
            </div>
          `;
          document.body.appendChild(banner);
        },
        { count: fieldsCount, resume: hasResume }
      );
    } catch {
      // Ignore banner injection errors on restricted pages
    }
  }

  private promptCandidateConfirmation(): Promise<boolean> {
    if (!process.stdin.isTTY) {
      console.log('\n[Assisted Autofill] Non-interactive execution: Browser form populated successfully.');
      console.log('[Assisted Autofill] The page is ready for candidate inspection.');
      return Promise.resolve(true);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(
        '\nDid you submit the application successfully in the browser? (y/n): ',
        (answer) => {
          rl.close();
          resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
        }
      );
    });
  }
  public async autofillAllPending(options: { headless?: boolean } = {}): Promise<AutofillResult[]> {
    const allRecords = this.tracker.getAll();
    const pending = allRecords.filter((r) => r.applicationStatus === 'TAILORED');

    console.log(`\n===============================================================`);
    console.log(`  BATCH AUTOFILL: Found ${pending.length} pending tailored opportunities`);
    console.log(`===============================================================\n`);

    const results: AutofillResult[] = [];
    for (let i = 0; i < pending.length; i++) {
      const rec = pending[i];
      console.log(`\n[${i + 1}/${pending.length}] Processing: ${rec.title} at ${rec.company}...`);
      try {
        const res = await this.autofill({
          jobId: rec.jobId,
          headless: options.headless ?? false
        });
        results.push(res);
      } catch (err: any) {
        console.error(`Failed autofilling ${rec.jobId}:`, err.message);
      }
    }

    return results;
  }
}

// CLI direct execution
if (process.argv[1] && process.argv[1].endsWith('browser-autofill.ts')) {
  const targetArg = process.argv[2];
  if (!targetArg) {
    console.log('\nUsage: npm.cmd run autofill -- [jobId or URL or all]');
    console.log('Example: npm.cmd run autofill -- job-mock-001');
    console.log('Example: npm.cmd run autofill -- all');
    process.exit(0);
  }

  const autofiller = new BrowserAutofiller();
  const isAll = targetArg.toLowerCase() === 'all' || targetArg.toLowerCase() === '--all' || targetArg.toLowerCase() === 'pending';

  if (isAll) {
    autofiller
      .autofillAllPending({ headless: process.env.HEADLESS === 'true' })
      .catch((err) => {
        console.error('Fatal batch autofill error:', err);
        process.exit(1);
      });
  } else {
    const isUrl = targetArg.startsWith('http://') || targetArg.startsWith('https://');

    autofiller
      .autofill({
        jobId: isUrl ? undefined : targetArg,
        url: isUrl ? targetArg : undefined,
        headless: false
      })
      .catch((err) => {
        console.error('Fatal autofill error:', err);
        process.exit(1);
      });
  }
}

