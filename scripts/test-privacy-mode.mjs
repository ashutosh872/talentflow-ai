import { chromium } from 'playwright';
import assert from 'assert';

async function testPrivacyMode() {
  console.log('🔒 Starting Privacy Mode Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Authenticate session
  await page.goto('http://localhost:5000');
  await page.evaluate(() => {
    localStorage.setItem('talentflow_auth', JSON.stringify({
      user: { id: 'ashutosh-kumar', name: 'Ashutosh Kumar', role: 'admin', access: 'write' },
      token: 'jwt-token-verified-admin',
      timestamp: Date.now()
    }));
    // Start with privacy mode clean/false
    localStorage.setItem('talentflow_privacy_mode', 'false');
  });

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForSelector('.job-card', { timeout: 5000 });

  // 2. Verify Initial State (Privacy OFF)
  console.log('--- 1. Testing Initial State (Privacy OFF) ---');
  const navBtnText = await page.$eval('#navPrivacyToggle', el => el.innerText.trim());
  console.log(`  ✓ Nav Privacy Button text: "${navBtnText}"`);
  assert.ok(navBtnText.includes('Hide Private'), 'Nav button should offer to Hide Private');

  const curCtcBefore = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Current CTC before toggle: "${curCtcBefore}"`);
  assert.strictEqual(curCtcBefore, '₹6,00,000 PA', 'Current CTC should be visible initially');

  const targetCtcBefore = await page.$eval('#candTargetCtc', el => el.innerText.trim());
  console.log(`  ✓ Target CTC before toggle: "${targetCtcBefore}"`);
  assert.ok(targetCtcBefore.includes('12,00,000'), 'Target CTC should be visible initially');

  const emailBefore = await page.$eval('#inboundHeaderEmail', el => el.innerText.trim());
  console.log(`  ✓ Inbound Header Email before toggle: "${emailBefore}"`);
  assert.strictEqual(emailBefore, 'kumar.ashu872@gmail.com', 'Email should be visible initially');

  // Check job card salaries
  const jobSalBefore = await page.$eval('.job-card [data-private="amount"]', el => el.innerText.trim());
  console.log(`  ✓ Job card salary before toggle: "${jobSalBefore}"`);
  assert.ok(!jobSalBefore.includes('••••••'), 'Job card salary should not be masked initially');

  // 3. Click Nav Privacy Toggle -> Turn Privacy Mode ON
  console.log('\n--- 2. Toggling Privacy Mode ON via Navbar Button ---');
  await page.click('#navPrivacyToggle');
  await page.waitForTimeout(300);

  const isPrivacyActive = await page.evaluate(() => document.body.classList.contains('privacy-active'));
  console.log(`  ✓ body.privacy-active is applied: ${isPrivacyActive}`);
  assert.ok(isPrivacyActive, 'body should have privacy-active class');

  const navBtnTextAfter = await page.$eval('#navPrivacyToggle', el => el.innerText.trim());
  console.log(`  ✓ Nav button updated text: "${navBtnTextAfter}"`);
  assert.ok(navBtnTextAfter.includes('Private ON'), 'Nav button should show Private ON');

  const curCtcMasked = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Current CTC masked: "${curCtcMasked}"`);
  assert.strictEqual(curCtcMasked, '₹ ••••••', 'Current CTC should be masked to ₹ ••••••');

  const targetCtcMasked = await page.$eval('#candTargetCtc', el => el.innerText.trim());
  console.log(`  ✓ Target CTC masked: "${targetCtcMasked}"`);
  assert.strictEqual(targetCtcMasked, '₹ ••••••', 'Target CTC should be masked');

  const emailMasked = await page.$eval('#inboundHeaderEmail', el => el.innerText.trim());
  console.log(`  ✓ Email masked: "${emailMasked}"`);
  assert.strictEqual(emailMasked, 'k•••••••@gmail.com', 'Email should be masked');

  const jobSalMasked = await page.$eval('.job-card [data-private="amount"]', el => el.innerText.trim());
  console.log(`  ✓ Job card salary masked: "${jobSalMasked}"`);
  assert.strictEqual(jobSalMasked, '₹ ••••••', 'Job card salary should be masked');

  const storageVal = await page.evaluate(() => localStorage.getItem('talentflow_privacy_mode'));
  console.log(`  ✓ localStorage talentflow_privacy_mode: "${storageVal}"`);
  assert.strictEqual(storageVal, 'true', 'localStorage should persist privacy mode true');

  // 4. Test JD Modal when Privacy Mode is ON
  console.log('\n--- 3. Testing Job Details Modal with Privacy Mode ON ---');
  await page.click('.job-card button[onclick^="openJdModal"]');
  await page.waitForSelector('#jdModal:not(.hidden)', { timeout: 3000 });
  const jdSalaryMasked = await page.$eval('#jdModalSalary', el => el.innerText.trim());
  console.log(`  ✓ JD Modal Salary masked: "${jdSalaryMasked}"`);
  assert.strictEqual(jdSalaryMasked, '₹ ••••••', 'JD Modal salary must be masked in privacy mode');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 5. Test Click-to-Peek functionality
  console.log('\n--- 4. Testing Click-to-Peek on Masked CTC ---');
  await page.click('#candCurrentCtcDisplay');
  await page.waitForTimeout(100);
  const curCtcPeek = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Current CTC temporarily revealed on click: "${curCtcPeek}"`);
  assert.strictEqual(curCtcPeek, '₹6,00,000 PA', 'Should peek real CTC on click');

  // 6. Test Keyboard Shortcut "P"
  console.log('\n--- 5. Testing Keyboard Shortcut "P" to toggle back OFF ---');
  await page.keyboard.press('p');
  await page.waitForTimeout(300);

  const isPrivacyActiveOff = await page.evaluate(() => document.body.classList.contains('privacy-active'));
  console.log(`  ✓ body.privacy-active removed: ${!isPrivacyActiveOff}`);
  assert.ok(!isPrivacyActiveOff, 'body should not have privacy-active class');

  const curCtcReverted = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Current CTC reverted to: "${curCtcReverted}"`);
  assert.strictEqual(curCtcReverted, '₹6,00,000 PA', 'Current CTC should be restored');

  // 7. Test Hero Benchmarks inline button
  console.log('\n--- 6. Testing Hero Salary Benchmarks Inline Button ---');
  await page.click('#heroPrivacyBtn');
  await page.waitForTimeout(300);
  const curCtcHeroToggled = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Current CTC masked via Hero button: "${curCtcHeroToggled}"`);
  assert.strictEqual(curCtcHeroToggled, '₹ ••••••', 'Hero button should toggle privacy mode');

  // 8. Test Page Reload Persistence
  console.log('\n--- 7. Testing Persistence across Page Reload ---');
  await page.reload({ waitUntil: 'networkidle' });
  const reloadedCurCtc = await page.$eval('#candCurrentCtcDisplay', el => el.innerText.trim());
  console.log(`  ✓ Reloaded Current CTC (Privacy Mode persisted): "${reloadedCurCtc}"`);
  assert.strictEqual(reloadedCurCtc, '₹ ••••••', 'Privacy mode must persist across page reload');

  await browser.close();
  console.log('\n===============================================================');
  console.log('  🎉 ALL PRIVACY MODE TESTS PASSED 100%!');
  console.log('===============================================================');
}

testPrivacyMode().catch(err => {
  console.error('Privacy Mode Test Failure:', err);
  process.exit(1);
});
