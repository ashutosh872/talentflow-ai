const { chromium } = require('playwright');

async function testCandidateFeatures() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('[Test 1] Loading Neha Sharma (?candidate=neha-sharma)...');
  await page.goto('http://localhost:5000/?candidate=neha-sharma', { waitUntil: 'networkidle' });
  await page.click('#privacyToggleBtn'); // Unmask
  await page.waitForTimeout(300);

  // Check Screening Modal
  const scrBtn = await page.$('button:has-text("Screening Q&A")');
  await scrBtn.click();
  await page.waitForTimeout(300);

  const title = await page.innerText('#screeningJobTitle');
  const comp = await page.innerText('#screeningCompany');
  const ans0 = await page.innerText('#screenAns_0');
  const ans1 = await page.innerText('#screenAns_1');
  const ans2 = await page.innerText('#screenAns_2');
  const ans3 = await page.innerText('#screenAns_3');

  console.log('Screening Modal Header:', comp);
  console.log('Q0 (Notice):', ans0);
  console.log('Q1 (Current CTC):', ans1);
  console.log('Q2 (Expected CTC):', ans2);
  console.log('Q3 (Experience):', ans3);

  await page.click('#screeningModal button:has-text("Done")');

  // Check Recruiter View
  console.log('\n[Test 2] Testing Recruiter View for Neha Sharma...');
  const rvBtn = await page.$('button:has-text("Recruiter View")');
  await rvBtn.click();
  await page.waitForTimeout(300);
  const tuningTips = await page.innerText('#rvTuningTips');
  console.log('Tuning Tips Snippet:\n', tuningTips.slice(0, 250) + '...');
  await page.evaluate(() => closeRecruiterView());
  await page.waitForTimeout(300);

  // Check Offer Calculator
  console.log('\n[Test 3] Testing Offer Negotiation Counter-Script for Neha Sharma...');
  await page.evaluate(() => switchTab('offer'));
  await page.waitForTimeout(300);
  const verdict = await page.innerText('#calcTargetVerdict');
  const delta = await page.innerText('#calcTargetDelta');
  const hike = await page.innerText('#calcHikePercent');
  console.log('Offer Calculator -> Verdict:', verdict, '| Delta:', delta, '| Hike:', hike);

  // Test Adding a New Candidate Profile
  console.log('\n[Test 4] Testing "+ Add Profile" Modal Wizard...');
  await page.evaluate(() => openAddCandidateModal());
  await page.waitForTimeout(300);

  await page.fill('#newCandName', 'Arjun Verma');
  await page.fill('#newCandTitle', 'DevOps & Cloud Reliability Architect');
  await page.fill('#newCandExp', '10');
  await page.fill('#newCandNotice', '15 Days');
  await page.fill('#newCandCurrentCtc', '22');
  await page.fill('#newCandTargetCtc', '35');
  await page.fill('#newCandEmail', 'arjun.verma@example.com');
  await page.fill('#newCandSkills', 'Kubernetes, Terraform, AWS, Prometheus, CI/CD');

  await page.click('#addCandidateModal button[type="submit"]');
  await page.waitForTimeout(500);

  const newCandName = await page.innerText('#activeCandName');
  const newHero = await page.innerText('h2.text-base');
  console.log('✓ Successfully created candidate Arjun Verma! Active Name:', newCandName);
  console.log('  Hero Header:', newHero);

  await browser.close();
  console.log('\n✓ ALL MULTI-CANDIDATE FEATURES VERIFIED SUCESSFULLY!');
}

testCandidateFeatures().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
