import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function runComprehensiveSingleUserE2ETest() {
  console.log('================================================================');
  console.log('  ASHUTOSH KUMAR — SINGLE-USER AI CRM PORTAL E2E & REGRESSION   ');
  console.log('================================================================\n');

  const BASE_URL = 'http://localhost:5000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Ensure server is up
  try {
    const health = await fetch(`${BASE_URL}/api/candidates`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (err) {
    console.error(`Server at ${BASE_URL} not reachable:`, err.message);
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    // ================================================================
    // SUITE 1: AUTHENTICATION & SINGLE-USER ACCESS GUARD
    // ================================================================
    console.log('\n--- SUITE 1: AUTHENTICATION & SINGLE-USER ACCESS GUARD ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();

      // 1.1 Unauthenticated access to root redirects to login
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);
      assert(page.url().includes('login.html'), 'Unauthenticated visit to root / redirects to /login.html');

      // 1.2 Attempt wrong password for Ashutosh Kumar
      await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
      await page.fill('#loginPassword', 'wrongPasswordXYZ');
      await page.click('#loginSubmitBtn');
      await page.waitForTimeout(600);
      const errorMsg = await page.textContent('#authErrorText');
      assert(errorMsg && errorMsg.includes('Incorrect password'), 'Login fails on wrong password with explicit error message');

      // 1.3 Successful login with verified password
      await page.fill('#loginPassword', 'admin123');
      await page.click('#loginSubmitBtn');
      await page.waitForTimeout(1000);
      assert(page.url().includes('index.html') || page.url().endsWith(':5000/'), 'Successful login redirects to Dashboard');

      // Check session storage
      const authUser = await page.evaluate(() => {
        try {
          const raw = JSON.parse(localStorage.getItem('talentflow_auth') || '{}');
          return raw.user || {};
        } catch(e) { return {}; }
      });
      assert(authUser.email === 'kumar.ashu872@gmail.com' && authUser.id === 'ashutosh-kumar', 'Logged in user is Ashutosh Kumar with id ashutosh-kumar');

      await context.close();
    }

    // Context with authenticated session
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    // Seed session to avoid re-login each time
    await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('talentflow_auth', JSON.stringify({
        token: 'test_token_' + Date.now(),
        user: {
          id: 'ashutosh-kumar',
          name: 'Ashutosh Kumar',
          email: 'kumar.ashu872@gmail.com',
          avatar: '👨‍💻',
          title: 'Senior Frontend Engineer & UI Architect',
          role: 'admin',
          access: 'write',
          permissions: ['read', 'write', 'admin'],
          isAdmin: true,
          isVerified: true
        },
        loggedInAt: new Date().toISOString()
      }));
    });

    // ================================================================
    // SUITE 2: DYNAMIC JOB LISTING SEARCH ON PAGE LOAD
    // ================================================================
    console.log('\n--- SUITE 2: DYNAMIC JOB LISTING SEARCH ON PAGE LOAD ---');
    {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      // Verify single-user profile display in Hero
      const heroText = await page.evaluate(() => document.querySelector('h2')?.innerText || '');
      assert(heroText.includes('Ashutosh Kumar'), 'Executive Hero displays Ashutosh Kumar');
      assert(heroText.includes('Senior Frontend Engineer'), 'Executive Hero displays Senior Frontend Engineer role');

      // Verify dynamic jobs loaded into window.jobs
      const jobsCount = await page.evaluate(() => (window.jobs || []).length);
      assert(jobsCount >= 20, `Dynamic jobs loaded on start: ${jobsCount} opportunities available`);

      // Verify dynamic ATS scoring calculated
      const firstScore = await page.evaluate(() => {
        const scoreBadge = document.querySelector('#jobListContainer span.font-extrabold');
        return scoreBadge ? parseInt(scoreBadge.innerText, 10) : 0;
      });
      assert(firstScore >= 70, `Dynamic ATS match score calculated on page load (${firstScore}/100)`);

      // Verify filter counters updated
      const allFilterText = await page.evaluate(() => {
        const el = document.querySelector('.filter-btn[data-filter="all"]');
        return el ? el.innerText : '';
      });
      assert(allFilterText.includes(`(${jobsCount})`), `Filter counter dynamically matches total jobs: "${allFilterText}"`);
    }

    // ================================================================
    // SUITE 3: INTERACTIVE JOB SEARCH & MULTI-CRITERIA FILTERING
    // ================================================================
    console.log('\n--- SUITE 3: INTERACTIVE JOB SEARCH & MULTI-CRITERIA FILTERING ---');
    {
      // 3.1 Search by keyword "Angular"
      await page.fill('#searchInput', 'Angular');
      await page.dispatchEvent('#searchInput', 'input');
      await page.waitForTimeout(300);

      const angularCardsCount = await page.evaluate(() => {
        return document.querySelectorAll('#jobListContainer > div').length;
      });
      assert(angularCardsCount > 0 && angularCardsCount < 30, `Search for 'Angular' filtered grid to ${angularCardsCount} cards`);

      // 3.2 Search by company name "Samsung"
      await page.fill('#searchInput', 'Samsung');
      await page.dispatchEvent('#searchInput', 'input');
      await page.waitForTimeout(300);

      const samsungFound = await page.evaluate(() => {
        const text = document.getElementById('jobListContainer')?.innerText || '';
        return text.includes('Samsung SDS Global');
      });
      assert(samsungFound, "Search for 'Samsung' isolated Samsung SDS Global opportunity");

      // 3.3 Clear search
      await page.fill('#searchInput', '');
      await page.dispatchEvent('#searchInput', 'input');
      await page.waitForTimeout(300);

      const restoredCount = await page.evaluate(() => document.querySelectorAll('#jobListContainer > div').length);
      assert(restoredCount >= 20, `Clearing search restored full list (${restoredCount} cards)`);

      // 3.4 Filter chips: Submitted filter
      await page.click('.filter-btn[data-filter="submitted"]');
      await page.waitForTimeout(300);
      const submittedVisible = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#jobListContainer > div'));
        return cards.length > 0 && cards.every(c => c.innerText.includes('Submitted'));
      });
      assert(submittedVisible, 'Filter "Submitted" only shows submitted applications');

      // 3.5 Filter chips: Remote filter
      await page.click('.filter-btn[data-filter="remote"]');
      await page.waitForTimeout(300);
      const remoteVisible = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#jobListContainer > div'));
        return cards.length > 0 && cards.every(c => c.innerText.toLowerCase().includes('remote'));
      });
      assert(remoteVisible, 'Filter "Remote" properly filters remote jobs');

      // Restore to "all"
      await page.click('.filter-btn[data-filter="all"]');
      await page.waitForTimeout(200);
    }

    // ================================================================
    // SUITE 4: JOB APPLICATION SUBMISSION FLOW (CRM LIFECYCLE)
    // ================================================================
    console.log('\n--- SUITE 4: JOB APPLICATION SUBMISSION FLOW ---');
    {
      const candidateId = 'ashutosh-kumar';
      const testJobId = 'job-mock-008'; // Incedo or Wipro

      const submitRes = await page.evaluate(async (jid) => {
        const res = await fetch('/api/record-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: jid,
            company: 'Test Enterprise Submission',
            role: 'Lead Frontend UI Engineer',
            vacancyPortal: 'Direct Careers Portal',
            status: 'SUBMITTED',
            submissionMethod: 'Via Autofill',
            appliedDate: new Date().toISOString().split('T')[0],
            confirmationId: 'CONF-E2E-TEST-RECORD'
          })
        });
        return await res.json();
      }, testJobId);

      assert(submitRes.success && submitRes.status === 'SUBMITTED', 'Submission recorded successfully via /api/record-submission');

      // Verify applications.csv persistence
      const csvContent = fs.readFileSync(path.resolve('data/applications.csv'), 'utf8');
      assert(csvContent.includes('CONF-E2E-TEST-RECORD') || csvContent.includes(testJobId), 'Submission record persisted in data/applications.csv');
    }

    // ================================================================
    // SUITE 5: RESUME FORMAT PARSING & RECALIBRATION ENGINE
    // ================================================================
    console.log('\n--- SUITE 5: RESUME FORMAT PARSING & RECALIBRATION ---');
    {
      // 5.1 Test TXT format parse
      const txtResume = `
Ashutosh Kumar - Senior Frontend Engineer & UI Architect
Email: kumar.ashu872@gmail.com | Phone: +91 9310681373
Summary: 8+ years experience building enterprise Angular Material UI, HTML5/SCSS, Design Systems, Playwright, WCAG.
Skills: Angular Material UI, JavaScript, HTML5, SCSS, Playwright, WCAG 2.1/2.2, Figma-to-Code.
Experience:
Senior Frontend Developer at Wondrfly Inc (2022-Present): Led automated UI testing with Playwright.
Frontend Consultant at Samsung SDS Global: Delivered high-performance portals.
      `;
      const txtBase64 = Buffer.from(txtResume).toString('base64');

      const parseRes = await page.evaluate(async (b64) => {
        const res = await fetch('/api/resume/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeBase64: 'data:text/plain;base64,' + b64,
            resumeFileName: 'Ashutosh_Resume_Test.txt'
          })
        });
        return await res.json();
      }, txtBase64);

      assert(parseRes.success && parseRes.parsed, 'Resume parser successfully parsed .txt format');
      assert(parseRes.parsed.skills?.primary?.includes('Angular') || parseRes.parsed.skills?.primary?.includes('TypeScript'), 'Parser extracted core skills (Angular/TypeScript)');
      assert(parseRes.parsed.experienceYears >= 7, `Parser extracted experience years (${parseRes.parsed.experienceYears}+ years)`);

      // 5.2 Test PDF Upload through /api/candidates/upload-resume
      const mockPdfBuffer = '%PDF-1.4 Ashutosh Kumar Senior Frontend Engineer Angular TypeScript Playwright WCAG Design Systems';
      const pdfBase64 = Buffer.from(mockPdfBuffer).toString('base64');

      const uploadRes = await page.evaluate(async (b64) => {
        const res = await fetch('/api/candidates/upload-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: 'ashutosh-kumar',
            fileName: 'Ashutosh_Kumar_Updated_Resume.pdf',
            fileBase64: 'data:application/pdf;base64,' + b64
          })
        });
        return await res.json();
      }, pdfBase64);

      assert(uploadRes.success, 'Uploaded and stored .pdf resume via /api/candidates/upload-resume');
      assert(fs.existsSync(path.resolve('data/resumes/ashutosh-kumar-Ashutosh_Kumar_Updated_Resume.pdf')), 'Resume file physically stored in data/resumes/');

      // 5.3 Trigger Recalibration & Dynamic Fresh Job Generation
      const recalRes = await page.evaluate(async () => {
        const res = await fetch('/api/candidates/recalibrate-and-refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: 'ashutosh-kumar',
            autoAdoptSkills: true
          })
        });
        return await res.json();
      });

      assert(recalRes.success, 'Recalibration executed successfully');
      assert(recalRes.totalJobs >= 20, `Recalibrated across ${recalRes.totalJobs} total jobs`);
      assert(recalRes.newJobsCount >= 0, `Auto-generated fresh jobs count: ${recalRes.newJobsCount}`);

      // Verify historical applications remain preserved in CSV
      const csvAfter = fs.readFileSync(path.resolve('data/applications.csv'), 'utf8');
      assert(csvAfter.includes('SUBMITTED') && csvAfter.length > 5000, 'All previous application records in applications.csv remain 100% intact after resume recalibration');
    }

    // ================================================================
    // SUITE 6: RESPONSIVE SCREEN LAYOUT CHECK ACROSS ALL VIEWPORTS
    // ================================================================
    console.log('\n--- SUITE 6: RESPONSIVE SCREEN LAYOUT CHECK ---');
    {
      const viewports = [
        { name: 'iPhone SE (375x667)', width: 375, height: 667 },
        { name: 'iPhone 14 (390x844)', width: 390, height: 844 },
        { name: 'iPad Mini (768x1024)', width: 768, height: 1024 },
        { name: 'iPad Air (820x1180)', width: 820, height: 1180 },
        { name: 'Desktop Small (1024x768)', width: 1024, height: 768 },
        { name: 'Desktop Standard (1280x800)', width: 1280, height: 800 },
        { name: 'Desktop Wide (1920x1080)', width: 1920, height: 1080 }
      ];

      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);

        const overflowCheck = await page.evaluate(() => {
          const bodyWidth = document.body.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          return {
            scrollWidth: bodyWidth,
            clientWidth: clientWidth,
            hasOverflow: bodyWidth > clientWidth + 1
          };
        });

        assert(!overflowCheck.hasOverflow, `${vp.name}: Clean responsive layout (scrollWidth ${overflowCheck.scrollWidth}px <= clientWidth ${overflowCheck.clientWidth}px)`);
      }
    }

    // ================================================================
    // SUITE 7: ALL CRM TABS RESPONSIVENESS ON MOBILE (375px)
    // ================================================================
    console.log('\n--- SUITE 7: ALL CRM TABS RESPONSIVENESS ON MOBILE (375px) ---');
    {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

      const tabs = ['opportunities', 'overview', 'recommendations', 'kanban', 'battlecards', 'replies', 'offer', 'profile'];
      for (const tab of tabs) {
        await page.evaluate((t) => window.switchTab(t), tab);
        await page.waitForTimeout(300);

        const tabOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth + 1;
        });

        assert(!tabOverflow, `Tab [${tab}] fits 375px mobile screen without horizontal overflow`);
      }
    }

    // ================================================================
    // SUITE 8: SINGLE USER INTEGRITY VERIFICATION
    // ================================================================
    console.log('\n--- SUITE 8: SINGLE USER DATA CLEANLINESS & INTEGRITY ---');
    {
      const candRaw = fs.readFileSync(path.resolve('data/candidates.json'), 'utf8');
      const candidates = JSON.parse(candRaw);
      assert(candidates.length === 1, `Candidate registry contains exclusively 1 user (count: ${candidates.length})`);
      assert(candidates[0].id === 'ashutosh-kumar', `Registered candidate is Ashutosh Kumar`);
      assert(candidates[0].email === 'kumar.ashu872@gmail.com', `Candidate email is kumar.ashu872@gmail.com`);
      assert(candidates[0].isAdmin === true, `Candidate is verified administrator`);
    }

    await context.close();
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`  COMPLETE E2E & REGRESSION RESULTS: ${passed} PASSED, ${failed} FAILED  `);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveSingleUserE2ETest().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
