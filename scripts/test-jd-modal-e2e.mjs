import { chromium } from 'playwright';

async function run() {
  console.log('--- STARTING PLAYWRIGHT VERIFICATION FOR JD MODAL & CONDITIONAL RENDERING ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Inject auth token
  await page.goto('http://localhost:5000/login.html');
  await page.evaluate(() => {
    localStorage.setItem('talentflow_auth', JSON.stringify({
      authenticated: true,
      token: 'session-token-ashutosh',
      user: {
        id: 'ashutosh-kumar',
        candidateId: 'ashutosh-kumar',
        name: 'Ashutosh Kumar',
        email: 'kumar.ashu872@gmail.com',
        isAdmin: true
      }
    }));
  });

  await page.goto('http://localhost:5000/index.html', { waitUntil: 'networkidle' });
  console.log('✅ Loaded dashboard at http://localhost:5000/index.html');

  // Verify that jobs are loaded
  await page.waitForSelector('.job-card');
  const cardsCount = await page.locator('.job-card').count();
  console.log(`✅ Rendered ${cardsCount} job cards`);

  // ==============================================================
  // TEST 1: CLICKING COMPANY NAME FOR SUBMITTED JOB (Samsung SDS)
  // ==============================================================
  console.log('\n--- TEST 1: Checking Complete JD Details for Submitted Job (Samsung SDS) ---');
  // Find Samsung card
  const samsungCompanyBtn = page.locator('.job-card button:has-text("Samsung SDS Global")').first();
  await samsungCompanyBtn.click();

  // Verify JD Modal is visible
  const modal = page.locator('#jdModal');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Complete JD Modal opened successfully on clicking company name');

  // Verify details inside modal
  const compText = await page.locator('#jdModalCompany').textContent();
  const titleText = await page.locator('#jdModalTitle').textContent();
  const reqText = await page.locator('#jdModalReqId').textContent();
  const salaryText = await page.locator('#jdModalSalary').textContent();
  const descText = await page.locator('#jdModalDescription').textContent();
  const respCount = await page.locator('#jdModalResponsibilities li').count();
  const skillsCount = await page.locator('#jdModalSkills span').count();
  const evidCount = await page.locator('#jdModalEvidence li').count();

  console.log(`  • Company: ${compText}`);
  console.log(`  • Title: ${titleText}`);
  console.log(`  • Req ID: ${reqText}`);
  console.log(`  • Verified Salary: ${salaryText}`);
  console.log(`  • Responsibilities count: ${respCount}`);
  console.log(`  • Skills count: ${skillsCount}`);
  console.log(`  • Evidence count: ${evidCount}`);

  if (compText !== 'Samsung SDS Global') throw new Error('Company name mismatch in modal');
  if (respCount === 0 || skillsCount === 0) throw new Error('Responsibilities or skills empty');

  // ==============================================================
  // TEST 2: VERIFY APPLICATION FORM IS HIDDEN FOR SUBMITTED JOB
  // ==============================================================
  console.log('\n--- TEST 2: Verifying Application Form is HIDDEN for Submitted Job ---');
  const applyFormCount = await page.locator('#jdModalApplyForm').count();
  const confirmedCardCount = await page.locator('#jdModalConfirmedCard').count();

  console.log(`  • Apply form present in DOM: ${applyFormCount > 0}`);
  console.log(`  • Confirmed receipt card present in DOM: ${confirmedCardCount > 0}`);

  if (applyFormCount > 0) {
    throw new Error('FAILED: Application form should NOT be shown for already submitted job!');
  }
  if (confirmedCardCount === 0) {
    throw new Error('FAILED: Confirmed receipt card should be displayed for submitted job!');
  }

  const confText = await page.locator('#jdModalConfirmedCard').textContent();
  if (!confText.includes('CONF-SSDS-2026-8821-SUCCESS') && !confText.includes('Application Successfully Submitted')) {
    throw new Error('FAILED: Confirmation details missing from confirmed receipt card');
  }
  console.log('✅ PASS: Application form is completely hidden; Verified Confirmation Card is shown with confirmation ID');

  // Close modal
  await page.locator('#jdModal button:has-text("Close")').click();
  await modal.waitFor({ state: 'hidden', timeout: 5000 });
  console.log('✅ Modal closed successfully');

  // ==============================================================
  // TEST 3: CLICKING COMPANY NAME FOR READY JOB
  // ==============================================================
  const readyJob = await page.evaluate(() => {
    const activeStages = ['SUBMITTED', 'APPLIED', 'HR_SCREEN', 'TECH_INTERVIEW', 'SYSTEM_DESIGN', 'OFFER'];
    return (window.jobs || []).find(j => !activeStages.includes(j.status));
  });
  console.log(`\n--- TEST 3: Checking Complete JD Details for Ready Job (${readyJob.company}) ---`);
  const readyCompanyBtn = page.locator(`.job-card button:has-text("${readyJob.company}")`).first();
  await readyCompanyBtn.click();
  await modal.waitFor({ state: 'visible', timeout: 5000 });

  const readyComp = await page.locator('#jdModalCompany').textContent();
  console.log(`  • Modal Company: ${readyComp}`);

  // Verify that for ready job, the application form IS shown and confirmed card is NOT
  const readyApplyFormCount = await page.locator('#jdModalApplyForm').count();
  const readyConfirmedCardCount = await page.locator('#jdModalConfirmedCard').count();

  console.log(`  • Apply form present for ready job: ${readyApplyFormCount > 0}`);
  console.log(`  • Confirmed card present for ready job: ${readyConfirmedCardCount > 0}`);

  if (readyApplyFormCount === 0) {
    throw new Error('FAILED: Application form MUST be shown for job not yet submitted!');
  }
  if (readyConfirmedCardCount > 0) {
    throw new Error('FAILED: Confirmed card should NOT be shown before submission!');
  }
  console.log('✅ PASS: Application form is shown for ready opening');

  // ==============================================================
  // TEST 4: SUBMITTING FROM MODAL REMOVES FORM & SHOWS CONFIRMATION
  // ==============================================================
  console.log('\n--- TEST 4: Submitting Application from Modal ---');
  await page.locator('#btnModalSubmitApp').click();

  // Wait for transition to confirmed receipt card
  await page.waitForSelector('#jdModalConfirmedCard', { timeout: 6000 });
  const formAfterSubmitCount = await page.locator('#jdModalApplyForm').count();
  const cardAfterSubmitCount = await page.locator('#jdModalConfirmedCard').count();

  console.log(`  • Form present after submit: ${formAfterSubmitCount > 0}`);
  console.log(`  • Confirmed card present after submit: ${cardAfterSubmitCount > 0}`);

  if (formAfterSubmitCount > 0) {
    throw new Error('FAILED: Application form did not disappear after submission!');
  }
  if (cardAfterSubmitCount === 0) {
    throw new Error('FAILED: Confirmed card did not appear after submission!');
  }
  console.log('✅ PASS: Form immediately vanished upon submission, replaced by Verified Confirmed Receipt Card!');

  // Close modal
  await page.locator('#jdModal button:has-text("Close")').click();
  await modal.waitFor({ state: 'hidden', timeout: 5000 });

  // ==============================================================
  // TEST 5: MOCK PORTAL SAFEGUARD (compony.html & company.html)
  // ==============================================================
  console.log('\n--- TEST 5: Checking Mock Portals compony.html & company.html ---');
  for (const portalUrl of ['http://localhost:5000/data/mock-portal/compony.html', 'http://localhost:5000/data/mock-portal/company.html']) {
    await page.goto(portalUrl, { waitUntil: 'networkidle' });
    const isFormHidden = await page.evaluate(() => {
      const form = document.getElementById('apply-form');
      return !form || form.classList.contains('hidden') || form.style.display === 'none';
    });
    const isCardVisible = await page.evaluate(() => {
      const card = document.getElementById('confirmation-card');
      return !!card && !card.classList.contains('hidden') && card.style.display !== 'none';
    });

    console.log(`  • ${portalUrl}: formHidden=${isFormHidden}, cardVisible=${isCardVisible}`);
    if (!isFormHidden || !isCardVisible) {
      throw new Error(`FAILED: Portal ${portalUrl} showed apply form or hid confirmation card!`);
    }
  }
  console.log('✅ PASS: Mock portals correctly hide application form and show verified confirmed card');

  await browser.close();
  console.log('\n================================================================');
  console.log('  ALL JD MODAL & FORM-HIDING TESTS PASSED WITH 100% ACCURACY!   ');
  console.log('================================================================');
}

run().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
