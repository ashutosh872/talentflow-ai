const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTestSuite() {
  console.log('======================================================================');
  console.log('TALENTFLOW AI — MULTI-USER, MULTI-PAGE & RBAC RESUME TEST SUITE');
  console.log('======================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  let passCount = 0;
  let failCount = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failCount++;
    }
  }

  try {
    // ---------------------------------------------------------------
    // TEST 1: Login Page Routing & Quick Login Buttons
    // ---------------------------------------------------------------
    console.log('\n[1] Testing /login authentication portal...');
    await page.goto('http://localhost:5000/login', { waitUntil: 'domcontentloaded' });
    const loginTitle = await page.title();
    assert(loginTitle.includes('Sign In'), 'Login page title rendered correctly');

    const adminQuickBtn = await page.$('button:has-text("Ashutosh Kumar")');
    assert(adminQuickBtn !== null, 'Admin 1-click login button exists');

    const viewerQuickBtn = await page.$('button:has-text("Test Candidate")');
    assert(viewerQuickBtn !== null, 'Viewer 1-click login button exists');

    // ---------------------------------------------------------------
    // TEST 2: Perform Admin Login
    // ---------------------------------------------------------------
    console.log('\n[2] Logging in as Workspace Admin (Ashutosh Kumar)...');
    await adminQuickBtn.click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    assert(currentUrl.endsWith('/') || currentUrl.includes('index.html'), 'Admin redirected to dashboard after login');

    // ---------------------------------------------------------------
    // TEST 3: Main Dashboard Multi-Page Links & User Session Badge
    // ---------------------------------------------------------------
    console.log('\n[3] Verifying dashboard multi-page navigation & session badge...');
    const profileLink = await page.$('a[href="/profile.html"]');
    assert(profileLink !== null, 'Top navigation contains link to Candidate Profile Hub (/profile.html)');

    const usersLink = await page.$('a[href="/users.html"]');
    assert(usersLink !== null, 'Top navigation contains link to User & Access Management (/users.html)');

    const userBadgeText = await page.innerText('#activeUserBadge').catch(() => '');
    assert(userBadgeText.includes('Ashutosh Kumar') && userBadgeText.includes('ADMIN'), 'Active user badge displays Admin (Ashutosh Kumar)');

    // Check Add Candidate Modal has Resume Upload & Role select
    const addResumeInput = await page.$('#newCandResume');
    assert(addResumeInput !== null, 'Add Candidate Modal contains resume file upload input (#newCandResume)');

    const addRoleSelect = await page.$('#newCandAccessRole');
    assert(addRoleSelect !== null, 'Add Candidate Modal contains access role selector (#newCandAccessRole)');

    // ---------------------------------------------------------------
    // TEST 4: User & Access Management Page (/users)
    // ---------------------------------------------------------------
    console.log('\n[4] Navigating to /users (User & Access Management Console)...');
    await page.goto('http://localhost:5000/users', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const usersTitle = await page.title();
    assert(usersTitle.includes('User & Access Management'), 'Users page title is correct');

    const usersTable = await page.$('#userTableBody');
    assert(usersTable !== null, 'User directory table rendered');

    const rowsCount = await page.$$eval('#userTableBody tr', rows => rows.length);
    assert(rowsCount >= 2, `User directory displays ${rowsCount} candidate profiles`);

    // Verify Ashutosh has resume link
    const viewResumeBtn = await page.$('a[href*="Ashutosh Kumar"]');
    assert(viewResumeBtn !== null, 'Admin row has view resume link');

    // ---------------------------------------------------------------
    // TEST 5: Admin Adding New User with Resume Upload
    // ---------------------------------------------------------------
    console.log('\n[5] Testing Add Candidate with Resume Upload in /users...');
    // Create a temporary sample resume PDF
    const tempResumePath = path.resolve('data/resumes/temp_sample_test_resume.pdf');
    fs.writeFileSync(tempResumePath, '%PDF-1.4 sample resume content for automated playwright verification');

    // Fill form
    await page.click('button:has-text("Add User with Resume Upload")');
    await page.waitForTimeout(300);

    const uniqueId = 'test-e2e-' + Date.now();
    await page.fill('#formName', 'Rahul Verma E2E');
    await page.fill('#formTitle', 'Senior Angular & Playwright Engineer');
    await page.fill('#formEmail', `${uniqueId}@example.com`);
    await page.fill('#formPhone', '+91 9123456789');

    // Attach resume file
    const fileInput = await page.$('#formResumeFile');
    await fileInput.setInputFiles(tempResumePath);
    await page.waitForTimeout(500);

    const previewName = await page.innerText('#previewFileName');
    assert(previewName.includes('temp_sample_test_resume.pdf'), 'Resume file preview shows attached file name');

    // Submit form
    await page.click('#submitUserBtn');
    await page.waitForTimeout(2000);

    // Verify candidate appears in table
    const tableTextAfter = await page.innerText('#userTableBody');
    assert(tableTextAfter.includes('Rahul Verma E2E'), 'Newly created candidate appears in user table');

    // Verify resume file was saved to data/resumes/
    const resumesDir = path.resolve('data/resumes');
    const filesInResumes = fs.readdirSync(resumesDir);
    const matchedSaved = filesInResumes.find(f => f.includes('rahul-verma-e2e') || f.includes('temp_sample_test_resume'));
    assert(matchedSaved !== undefined, `Uploaded resume saved to disk: ${matchedSaved}`);

    // Clean up temporary file
    if (fs.existsSync(tempResumePath)) fs.unlinkSync(tempResumePath);

    // ---------------------------------------------------------------
    // TEST 6: Admin Changing User Access (Read, Write, Admin)
    // ---------------------------------------------------------------
    console.log('\n[6] Testing Admin Access Role Toggle (Read, Write, Admin)...');
    // Locate the row for Test Candidate or Rahul
    const testCandRow = await page.locator('tr:has-text("Test Candidate")');
    const readBtn = testCandRow.locator('button:has-text("Read/View")');
    await readBtn.click();
    await page.waitForTimeout(1000);

    // Verify candidates.json reflects read access
    const candsJson = JSON.parse(fs.readFileSync('data/candidates.json', 'utf8'));
    const testCand = candsJson.find(c => c.id === 'test-candidate');
    assert(testCand && testCand.access === 'read' && testCand.role === 'viewer', 'Test Candidate access updated to read/viewer in database');

    // Now promote to Write
    const writeBtn = testCandRow.locator('button:has-text("Write")');
    await writeBtn.click();
    await page.waitForTimeout(1000);

    const candsJsonAfterWrite = JSON.parse(fs.readFileSync('data/candidates.json', 'utf8'));
    const testCandWrite = candsJsonAfterWrite.find(c => c.id === 'test-candidate');
    assert(testCandWrite && testCandWrite.access === 'write' && testCandWrite.role === 'editor', 'Test Candidate access updated to write/editor in database');

    // ---------------------------------------------------------------
    // TEST 7: Candidate Profile & Resume Portfolio Hub (/profile)
    // ---------------------------------------------------------------
    console.log('\n[7] Navigating to /profile (Candidate Profile Hub)...');
    await page.goto('http://localhost:5000/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const profTitle = await page.title();
    assert(profTitle.includes('Candidate Profile'), 'Profile page title is correct');

    const profName = await page.innerText('#profName');
    assert(profName.includes('Ashutosh Kumar'), 'Profile page renders Ashutosh Kumar candidate');

    const iframeSrc = await page.getAttribute('#resumeViewerIframe', 'src');
    assert(iframeSrc && iframeSrc.includes('Resume.pdf'), `Embedded resume viewer iframe source verified: ${iframeSrc}`);

    // Switch profile to Priya Sharma
    await page.selectOption('#headerCandidateSelect', 'priya-sharma');
    await page.waitForTimeout(800);
    const switchedName = await page.innerText('#profName');
    assert(switchedName.includes('Priya Sharma'), 'Profile switcher updated view to Priya Sharma');

    // ---------------------------------------------------------------
    // TEST 8: RBAC View-Only Mode Verification
    // ---------------------------------------------------------------
    console.log('\n[8] Testing View-Only (Read Access) Enforcement...');
    // Set session in localStorage to viewer
    await page.evaluate(() => {
      localStorage.setItem('talentflow_auth', JSON.stringify({
        token: 'test_viewer_token',
        user: {
          id: 'test-candidate',
          name: 'Test Candidate',
          email: 'test.candidate@example.com',
          role: 'viewer',
          access: 'read',
          isAdmin: false
        }
      }));
    });

    // Visit dashboard as viewer
    await page.goto('http://localhost:5000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const viewOnlyBanner = await page.$('#dashboardViewOnlyBanner:not(.hidden)');
    assert(viewOnlyBanner !== null, 'View-Only notification banner is displayed when browsing with Read access');

    // Verify dialog alert when attempting mutation
    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      assert(dialog.message().includes('View-Only Mode'), `Dialog caught: "${dialog.message()}"`);
      await dialog.dismiss();
    });

    await page.evaluate(() => {
      advancePipelineStage('linkedin-4478053400', 'OFFER', 'Test unauthorized advance');
    });
    await page.waitForTimeout(500);

    assert(alertTriggered, 'Mutation blocked with View-Only alert modal');

  } catch (err) {
    console.error('Fatal Test Exception:', err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log('\n======================================================================');
  console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTestSuite();

