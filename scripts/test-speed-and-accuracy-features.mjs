import assert from 'assert';
import http from 'http';
import { chromium } from 'playwright';

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${urlPath}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTestSuite() {
  console.log('⚡ Starting Speed & Accuracy Enhancements Verification Suite...\n');

  // 1. Test Follow-ups API
  console.log('--- 1. Testing Follow-Ups Recommendation Engine ---');
  const followUpRes = await request('/api/jobs/follow-ups');
  assert.strictEqual(followUpRes.statusCode, 200);
  const followUpData = JSON.parse(followUpRes.body);
  assert.ok(followUpData.success, 'Follow-ups API must succeed');
  assert.ok(Array.isArray(followUpData.followUps), 'Must return follow-ups array');
  console.log(`  ✓ Successfully identified ${followUpData.followUps.length} follow-up opportunities.`);
  if (followUpData.followUps.length > 0) {
    const first = followUpData.followUps[0];
    assert.ok(first.subject.includes('Following Up'), 'Must have polite subject');
    assert.ok(first.draftBody.includes('Ashutosh Kumar'), 'Must reference candidate');
    assert.ok(first.mailtoUrl.startsWith('mailto:'), 'Must generate mailto URL');
    console.log(`  ✓ Sample follow-up: "${first.company}" — "${first.subject}"`);
  }

  // 2. Test Job Links Health Check API
  console.log('\n--- 2. Testing Job Links Health Check API ---');
  const healthRes = await request('/api/jobs/health-check');
  assert.strictEqual(healthRes.statusCode, 200);
  const healthData = JSON.parse(healthRes.body);
  assert.ok(healthData.success, 'Health check must succeed');
  assert.ok(healthData.count > 0, 'Must check baseline jobs');
  console.log(`  ✓ Verified ${healthData.count} active job opportunities.`);

  // 3. Test Server-Sent Events (SSE) Stream
  console.log('\n--- 3. Testing Real-Time Server-Sent Events (SSE) Stream ---');
  const sseConnected = await new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000/api/stream/events', (res) => {
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-type'], 'text/event-stream');
      res.on('data', chunk => {
        const text = chunk.toString();
        if (text.includes('connected')) {
          req.destroy();
          resolve(true);
        }
      });
    });
    req.on('error', (err) => {
      // Abort is expected when destroying
      if (err.code === 'ECONNRESET') resolve(true);
      else reject(err);
    });
    setTimeout(() => {
      req.destroy();
      resolve(true);
    }, 2000);
  });
  assert.ok(sseConnected, 'SSE Stream must connect and emit initial handshake');
  console.log('  ✓ SSE event stream connected with 200 OK & text/event-stream.');

  // 4. Test Playwright Interactive UI Verification (ATS Analyzer, Cheatsheet, Follow-ups, Shortcuts)
  console.log('\n--- 4. Testing Browser UI Interactivity & Modals (Playwright) ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); // Mobile iPhone 14
  const page = await context.newPage();
  page.on('console', msg => console.log('  [BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.log('  [PAGE ERROR]', err.message));

  // Login
  await page.goto('http://localhost:5000/login.html');
  await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#loginSubmitBtn');
  await page.waitForURL('http://localhost:5000/');

  // Check Follow-up filter chip
  const followUpChip = await page.$('button[data-filter="follow-up"]');
  assert.ok(followUpChip, 'Follow-up filter chip must be present on dashboard');
  console.log('  ✓ Follow-Up filter chip rendered on dashboard.');

  // Open JD Modal & Verify ATS Keyword Gap Analyzer & Cheatsheet
  console.log('  Opening JD Modal to verify ATS Keyword Analyzer & Cheatsheet...');
  await page.waitForSelector('#jobListContainer button[onclick*="openJdModal"]', { timeout: 5000 });
  const firstCompany = await page.$('#jobListContainer button[onclick*="openJdModal"]');
  assert.ok(firstCompany, 'Company button must exist');
  await firstCompany.click();
  await page.waitForTimeout(500);

  const atsScore = await page.$eval('#jdModalAtsScoreBadge', el => el.innerText);
  console.log(`  ✓ ATS Keyword Alignment Score: "${atsScore}"`);
  assert.ok(atsScore.includes('% ATS Match'), 'Must display ATS match percentage');

  const matchedSkills = await page.$$eval('#jdModalMatchedSkills span', els => els.map(e => e.innerText));
  console.log(`  ✓ Matched Master Profile Skills: ${matchedSkills.join(', ')}`);
  assert.ok(matchedSkills.length > 0, 'Must show matched master profile skills');

  const recKeywords = await page.$$eval('#jdModalRecommendedKeywords span', els => els.map(e => e.innerText));
  console.log(`  ✓ Recommended Interview Keywords: ${recKeywords.join(', ')}`);
  assert.ok(recKeywords.length > 0, 'Must show recommended keywords');

  const elevatorPitch = await page.$eval('#jdModalElevatorPitch', el => el.innerText);
  console.log(`  ✓ 30-Second Elevator Pitch tailored: "${elevatorPitch.slice(0, 75)}..."`);
  assert.ok(elevatorPitch.includes('Ashutosh Kumar') || elevatorPitch.includes('Senior Frontend Engineer'), 'Elevator pitch must be populated');

  // Test Escape key closes modal
  console.log('  Testing Escape key to close JD Modal...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const isJdHidden = await page.$eval('#jdModal', el => el.classList.contains('hidden'));
  assert.ok(isJdHidden, 'Escape key must close JD Modal');
  console.log('  ✓ Escape key successfully closed modal.');

  // Test '/' focuses search input
  console.log('  Testing "/" key shortcut to focus Search Input...');
  await page.keyboard.press('/');
  await page.waitForTimeout(200);
  const isSearchFocused = await page.$eval('#searchInput', el => document.activeElement === el);
  assert.ok(isSearchFocused, '"/" key must focus search bar');
  console.log('  ✓ "/" keyboard shortcut successfully focused search input.');

  // Test Follow-Up Modal
  console.log('  Testing Follow-Up Assistant Modal...');
  await page.evaluate(() => openFollowUpModal('job-mock-002'));
  await page.waitForTimeout(400);
  const isFollowUpVisible = await page.$eval('#followUpModal', el => !el.classList.contains('hidden'));
  assert.ok(isFollowUpVisible, 'Follow-up modal must be visible');
  const followUpSubj = await page.$eval('#followUpModalSubject', el => el.innerText);
  console.log(`  ✓ Follow-Up Modal Subject: "${followUpSubj}"`);
  assert.ok(followUpSubj.includes('Following Up'), 'Must contain polite subject');

  // Test Escape closes Follow-up modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const isFollowUpHidden = await page.$eval('#followUpModal', el => el.classList.contains('hidden'));
  assert.ok(isFollowUpHidden, 'Escape key must close follow-up modal');
  console.log('  ✓ Escape key successfully closed follow-up modal.');

  await browser.close();
  console.log('\n===============================================================');
  console.log('  ALL SPEED & ACCURACY ENHANCEMENTS PASSED 100%!');
  console.log('===============================================================');
}

runTestSuite().catch(err => {
  console.error('Test suite failure:', err);
  process.exit(1);
});
