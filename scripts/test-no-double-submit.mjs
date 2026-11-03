import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testNoDoubleSubmitFlow() {
  console.log('--- STARTING COMPREHENSIVE NO-DOUBLE-SUBMIT & REVERT EMAIL TEST ---');

  // Setup: Ensure job-mock-008 (Mindrops Digital Studio) is clean in baseline and csv for live end-to-end testing
  const testTargetId = 'job-mock-008';
  const csvPath = path.resolve('data/applications.csv');
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
    const filtered = lines.filter(l => !l.startsWith(testTargetId + ','));
    fs.writeFileSync(csvPath, filtered.join('\n'), 'utf8');
  }

  const baselinePath = path.resolve('data/baseline-jobs.json');
  if (fs.existsSync(baselinePath)) {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    const t = baseline.find(j => j.id === testTargetId);
    if (t) {
      t.status = 'DISCOVERED';
      t.appliedDate = '';
      t.confirmationId = '';
      fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2), 'utf8');
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Authenticate as Ashutosh Kumar & clear test submission from localStorage
  await page.goto('http://localhost:5000/login.html');
  await page.evaluate((targetId) => {
    localStorage.setItem('talentflow_auth', JSON.stringify({
      authenticated: true,
      token: 'session-ashu-token',
      user: {
        id: 'ashutosh-kumar',
        candidateId: 'ashutosh-kumar',
        name: 'Ashutosh Kumar',
        email: 'kumar.ashu872@gmail.com',
        isAdmin: true
      }
    }));
    try {
      const subs = JSON.parse(localStorage.getItem('job_submissions') || '{}');
      delete subs[targetId];
      delete subs['min-ui-2219'];
      localStorage.setItem('job_submissions', JSON.stringify(subs));
    } catch (e) {}
  }, testTargetId);

  await page.goto('http://localhost:5000/index.html', { waitUntil: 'networkidle' });
  console.log('✅ Dashboard loaded');

  // 2. Locate an unsubmitted/ready job dynamically
  const readyJob = await page.evaluate(() => {
    const activeStages = ['SUBMITTED', 'APPLIED', 'HR_SCREEN', 'TECH_INTERVIEW', 'SYSTEM_DESIGN', 'OFFER'];
    return (window.jobs || []).find(j => !activeStages.includes(j.status) && j.portalFile);
  });
  console.log(`✅ Selected ready job for test: ${readyJob.company} (${readyJob.id}, portal: ${readyJob.portalFile})`);

  const card = page.locator(`.job-card:has-text("${readyJob.company}")`).first();
  await card.waitFor({ state: 'visible' });

  // Verify it has "⚡ Direct 1-Click Apply" button
  const applyBtn = card.locator('button:has-text("Direct 1-Click Apply")');
  const hasApplyBtn = (await applyBtn.count()) > 0;
  console.log(`✅ ${readyJob.company} initial state ready to apply: ${hasApplyBtn}`);
  if (!hasApplyBtn) throw new Error(`${readyJob.company} card did not have Direct 1-Click Apply button`);

  // 3. Click "Direct 1-Click Apply" from OUTSIDE (card button)
  console.log(`⚡ Clicking "Direct 1-Click Apply" on card for ${readyJob.company}...`);
  await applyBtn.click();

  // Wait for button to transition to disabled locked state
  const lockedBtn = card.locator('button:has-text("Applied")');
  await lockedBtn.waitFor({ state: 'visible', timeout: 6000 });
  const isDisabled = await lockedBtn.isDisabled();
  console.log(`✅ Card apply button updated to "🔒 Applied" and disabled: ${isDisabled}`);
  if (!isDisabled) throw new Error('Apply button was not disabled after submission');

  // Attempting to click disabled button should do nothing
  try {
    await lockedBtn.click({ timeout: 1000, force: false });
  } catch (e) {
    console.log('✅ PASS: Clicking locked card button is rejected as expected');
  }

  // 4. Open it by clicking Company Name
  console.log(`📄 Opening JD Modal by clicking Company Name "${readyJob.company}"...`);
  const compBtn = card.locator(`button:has-text("${readyJob.company}")`);
  await compBtn.click();

  const modal = page.locator('#jdModal');
  await modal.waitFor({ state: 'visible' });

  // Verify that inside the modal:
  // - Application form is NOT rendered
  // - Confirmed receipt card IS rendered
  const modalFormCount = await page.locator('#jdModalApplyForm').count();
  const modalReceiptCount = await page.locator('#jdModalConfirmedCard').count();

  console.log(`  • Modal apply form present: ${modalFormCount > 0}`);
  console.log(`  • Modal confirmed card present: ${modalReceiptCount > 0}`);

  if (modalFormCount > 0) {
    throw new Error('FAILED: Modal showed application form for role just submitted via 1-click apply!');
  }
  if (modalReceiptCount === 0) {
    throw new Error('FAILED: Modal did not show confirmed receipt card!');
  }

  // 5. Check revert confirmation email receipt button in modal
  const revertEmailBtn = page.locator('#jdModalConfirmedCard a:has-text("View Revert Confirmation Email")');
  const hasRevertBtn = (await revertEmailBtn.count()) > 0;
  const revertHref = await revertEmailBtn.getAttribute('href');
  console.log(`✅ Revert Confirmation Email link present in modal: ${hasRevertBtn} (href: ${revertHref})`);
  if (!hasRevertBtn || !revertHref) throw new Error('Revert email button missing or href empty');

  // Close modal
  await page.locator('#jdModal button:has-text("Close")').click();
  await modal.waitFor({ state: 'hidden' });

  // 6. Test the Portal Route: Navigate to /data/mock-portal/${readyJob.portalFile}
  const portalUrl = `http://localhost:5000/data/mock-portal/${readyJob.portalFile}`;
  console.log(`🌐 Navigating to ${portalUrl}...`);
  await page.goto(portalUrl, { waitUntil: 'networkidle' });

  const portalFormHidden = await page.evaluate(() => {
    const form = document.getElementById('apply-form');
    return !form || form.classList.contains('hidden') || form.style.display === 'none';
  });
  const portalCardVisible = await page.evaluate(() => {
    const card = document.getElementById('confirmation-card');
    return !!card && !card.classList.contains('hidden') && card.style.display !== 'none';
  });

  console.log(`  • ${readyJob.portalFile}: formHidden=${portalFormHidden}, cardVisible=${portalCardVisible}`);
  if (!portalFormHidden || !portalCardVisible) {
    throw new Error(`FAILED: Portal ${readyJob.portalFile} showed form or hid confirmation card after 1-click apply!`);
  }

  // 7. Refresh Dashboard: Verify NO regenerating as unsubmitted
  console.log(`🔄 Reloading Dashboard to verify ${readyJob.company} does NOT regenerate as ready...`);
  await page.goto('http://localhost:5000/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Allow dynamic jobs load to complete

  const reloadedCard = page.locator(`.job-card:has-text("${readyJob.company}")`).first();
  const reloadedLockedBtn = reloadedCard.locator('button:has-text("Applied")');
  const isStillLocked = (await reloadedLockedBtn.count()) > 0;
  console.log(`✅ After dashboard page reload, ${readyJob.company} is STILL SUBMITTED & LOCKED: ${isStillLocked}`);
  if (!isStillLocked) {
    throw new Error('FAILED: Opening regenerated as unsubmitted after page reload!');
  }

  // 8. Verify Revert Email in backend API
  console.log('📨 Verifying email revert record in /api/email-dispatches...');
  const res = await page.request.get('http://localhost:5000/api/email-dispatches');
  const dispatches = await res.json();
  const targetDispatch = dispatches.find(d => (d.jobId === readyJob.id) || (d.company && d.company.includes(readyJob.company.slice(0, 5))) || (d.subject && d.subject.includes(readyJob.company.slice(0, 5))));
  console.log(`✅ Verified Revert Confirmation Email in audit trail:`, targetDispatch ? {
    subject: targetDispatch.subject,
    recipientEmail: targetDispatch.recipientEmail,
    confirmationId: targetDispatch.confirmationId,
    webUrl: targetDispatch.webUrl
  } : 'NOT FOUND');

  if (!targetDispatch) {
    throw new Error(`FAILED: Revert confirmation email was not found in audit trail for ${readyJob.company}`);
  }

  await browser.close();
  console.log('\n================================================================');
  console.log('  ZERO DOUBLE SUBMIT & REVERT EMAIL VERIFICATION: 100% SUCCESS  ');
  console.log('================================================================');
}

testNoDoubleSubmitFlow().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
