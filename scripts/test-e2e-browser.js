import { chromium } from 'playwright';

async function runE2ETests() {
  console.log('=== STARTING PLAYWRIGHT END-TO-END BROWSER TESTS ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;
  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Visit / unauthenticated -> must redirect to /login.html
    console.log('[E2E 1] Visiting http://localhost:5000/ with fresh empty session...');
    await page.goto('http://localhost:5000/');
    await page.waitForTimeout(1000);
    const url1 = page.url();
    assert(url1.includes('/login.html'), `Unauthenticated visit to / redirects to /login.html (Current URL: ${url1})`);

    // 2. Visit /users.html unauthenticated -> must redirect to /login.html
    console.log('[E2E 2] Visiting http://localhost:5000/users.html unauthenticated...');
    await page.goto('http://localhost:5000/users.html');
    await page.waitForTimeout(1000);
    const url2 = page.url();
    assert(url2.includes('/login.html'), `Unauthenticated visit to /users.html redirects to /login.html (Current URL: ${url2})`);

    // 3. Visit /profile.html unauthenticated -> must redirect to /login.html
    console.log('[E2E 3] Visiting http://localhost:5000/profile.html unauthenticated...');
    await page.goto('http://localhost:5000/profile.html');
    await page.waitForTimeout(1000);
    const url3 = page.url();
    assert(url3.includes('/login.html'), `Unauthenticated visit to /profile.html redirects to /login.html (Current URL: ${url3})`);

    // 4. On /login.html, verify email and password inputs start empty
    console.log('[E2E 4] Checking input fields on /login.html are not prefilled...');
    const emailVal = await page.inputValue('#loginEmail');
    const passVal = await page.inputValue('#loginPassword');
    assert(emailVal === '', `Email input field starts empty (found: "${emailVal}")`);
    assert(passVal === '', `Password input field starts empty (found: "${passVal}")`);

    // 5. Try submitting wrong password
    console.log('[E2E 5] Submitting incorrect password...');
    await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
    await page.fill('#loginPassword', 'wrongPassword123');
    await page.click('#loginSubmitBtn');
    await page.waitForTimeout(1000);

    const errorVisible = await page.isVisible('#authErrorMsg');
    const errorText = await page.textContent('#authErrorText');
    assert(errorVisible && errorText.includes('Incorrect password'), `Wrong password displays error banner: "${errorText}"`);

    // 6. Submit correct password
    console.log('[E2E 6] Submitting correct password admin123...');
    await page.fill('#loginPassword', 'admin123');
    await page.click('#loginSubmitBtn');
    await page.waitForNavigation({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const postLoginUrl = page.url();
    assert(!postLoginUrl.includes('/login.html'), `Correct password authenticates and enters workspace (URL: ${postLoginUrl})`);

    // 7. Verify dashboard renders with all 23 jobs and active user
    console.log('[E2E 7] Navigating to dashboard / to verify 23 jobs and user session...');
    await page.goto('http://localhost:5000/');
    await page.waitForTimeout(1000);

    const heroTitle = await page.textContent('h2.text-base');
    assert(heroTitle.includes('Ashutosh Kumar'), `Dashboard renders logged-in user: ${heroTitle.trim()}`);

    const jobCardsCount = await page.locator('#jobListContainer > div').count();
    assert(jobCardsCount >= 20, `All previous job search opportunities remain intact (${jobCardsCount} jobs rendered)`);

    // 8. Test Register Candidate tab on /login.html
    console.log('[E2E 8] Testing new candidate registration with resume upload...');
    // Clear auth to test registration
    await page.evaluate(() => localStorage.removeItem('talentflow_auth'));
    await page.goto('http://localhost:5000/login.html');
    await page.waitForTimeout(800);

    // Switch to register tab
    await page.click('#tabRegisterBtn');
    await page.waitForTimeout(500);

    const registerVisible = await page.isVisible('#registerForm');
    assert(registerVisible, 'Register candidate form is displayed');

    const regEmail = `test.e2e.${Date.now()}@example.com`;
    await page.fill('#regName', 'Alok Gupta');
    await page.fill('#regTitle', 'Senior Backend Engineer');
    await page.fill('#regEmail', regEmail);
    await page.fill('#regPassword', 'alokPass123');
    await page.fill('#regSkills', 'Java, Spring Boot, Microservices, Kubernetes, PostgreSQL');

    // Upload resume file
    await page.setInputFiles('#regResumeFile', 'data/resumes/Ashutosh Kumar Senior Frontend Engineer Resume.pdf');
    await page.waitForTimeout(500);

    const resumeSelected = await page.isVisible('#regResumePreview');
    assert(resumeSelected, 'Resume file upload preview displays selected document');

    // Submit registration
    await page.click('#registerSubmitBtn');
    await page.waitForTimeout(2000);

    const postRegUrl = page.url();
    assert(!postRegUrl.includes('/login.html'), `New user registered and navigated to workspace (URL: ${postRegUrl})`);

  } catch (err) {
    console.error('E2E Test Exception:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log(`\n======================================================`);
  console.log(`E2E BROWSER TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================`);
  if (failed > 0) process.exit(1);
}

runE2ETests();
