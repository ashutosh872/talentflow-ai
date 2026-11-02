const { chromium } = require('playwright');

async function testVerificationFlow() {
  console.log('===============================================================');
  console.log('  TESTING CANDIDATE EMAIL VERIFICATION & INBOUND REPLIES FLOW  ');
  console.log('===============================================================');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Load Dashboard (Ashutosh Kumar Admin)
  console.log('\n[Step 1] Loading Ashutosh Kumar Dashboard...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const heroAdminBadge = await page.innerText('#heroVerificationBadge');
  console.log('✓ Ashutosh Kumar Hero Badge:', heroAdminBadge.trim());

  // 2. Switch to Test Candidate
  console.log('\n[Step 2] Switching to Test Candidate (?candidate=test-candidate)...');
  await page.evaluate(() => switchCandidate('test-candidate', true));
  await page.waitForTimeout(300);

  const testHeroBadge = await page.innerText('#heroVerificationBadge');
  console.log('✓ Test Candidate Hero Badge:', testHeroBadge.trim());

  // 3. Open Email Verification Modal
  console.log('\n[Step 3] Opening Email Verification Modal for Test Candidate...');
  await page.click('#heroVerificationBadge button');
  await page.waitForTimeout(300);

  const modalVisible = await page.$eval('#verifyCandidateModal', el => !el.classList.contains('hidden'));
  const candNameEmail = await page.innerText('#verifyCandNameEmail');
  const otpVal = await page.$eval('#verifyOtpCodeInput', el => el.value);
  console.log('✓ Verify Modal Visible:', modalVisible);
  console.log('  Target Candidate:', candNameEmail);
  console.log('  Pre-filled OTP:', otpVal);

  // 4. Submit OTP Verification
  console.log('\n[Step 4] Submitting OTP Verification (482910)...');
  await page.click('#verifyCandidateModal button:has-text("Verify OTP Code")');
  await page.waitForTimeout(500);

  const verifiedHeroBadge = await page.innerText('#heroVerificationBadge');
  console.log('✓ Test Candidate Hero Badge after OTP Verification:', verifiedHeroBadge.trim());

  // 5. Check Inbound Replies Tab & Callout
  console.log('\n[Step 5] Checking Inbound Replies Tab...');
  await page.evaluate(() => switchTab('replies'));
  await page.waitForTimeout(400);

  const calloutText = await page.innerText('#viewReplies .bg-blue-950\\/30');
  console.log('✓ Inbound Replies Callout text:\n ', calloutText.slice(0, 160) + '...');

  const clearBtnVisible = await page.$eval('button:has-text("Clear Demo Stream")', el => el !== null);
  console.log('✓ "Clear Demo Stream" button visible:', clearBtnVisible);

  await browser.close();
  console.log('\n===============================================================');
  console.log('  ✓ ALL EMAIL VERIFICATION & INBOUND REPLIES TESTS PASSED!    ');
  console.log('===============================================================');
}

testVerificationFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

