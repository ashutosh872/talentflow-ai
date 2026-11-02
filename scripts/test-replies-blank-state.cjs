const { chromium } = require('playwright');

(async () => {
  let passed = 0;
  let failed = 0;
  function assert(cond, desc) {
    if (cond) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
      failed++;
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Dashboard Page & Inbound Replies Tab ---');
  await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });

  // Check title
  const title = await page.title();
  assert(title.includes('TalentFlow AI') || title.includes('Job Search'), `Page title valid: ${title}`);

  // Check burger badges (should be hidden when 0 replies)
  const burgerInboundBadge = page.locator('#burgerInboundBadge');
  const badgeClass = await burgerInboundBadge.getAttribute('class');
  assert(badgeClass.includes('hidden'), `Burger inbound badge is hidden when 0 replies: "${badgeClass}"`);

  // Switch to Inbound Replies Tab
  await page.evaluate(() => switchTab('replies'));
  await page.waitForTimeout(1000);

  // Check section visibility & header view pill
  const repliesSection = page.locator('#viewReplies');
  const isRepliesVisible = await repliesSection.isVisible();
  assert(isRepliesVisible, 'Inbound Replies view section is visible');

  const pillText = await page.locator('#headerActiveViewPill').innerText();
  assert(pillText.includes('Inbound Replies'), `Header active view pill shows: "${pillText}"`);

  // Check Status Bar
  const statusBarText = await page.locator('#gmailSyncStatusBar').innerText();
  assert(statusBarText.includes('kumar.ashu872@gmail.com'), 'Status bar shows authorized email');
  assert(statusBarText.includes('Submitted Job Responses: 0'), 'Status bar shows 0 submitted job responses');
  assert(statusBarText.includes('Interviews: 0'), 'Status bar shows 0 interviews');
  assert(statusBarText.includes('Assessments: 0'), 'Status bar shows 0 assessments');
  assert(statusBarText.includes('Offers: 0'), 'Status bar shows 0 offers');
  assert(!statusBarText.includes('Job Lead Alerts:'), 'No legacy job lead alerts in status bar');
  assert(!statusBarText.includes('Platform Job Leads'), 'No platform job leads in status bar');

  // Check Explainer Banner
  assert(statusBarText.includes('Responses from Submitted Jobs Only'), 'Banner clarifies submitted jobs only');
  assert(statusBarText.includes('Automated recommendation emails & daily digests disabled'), 'Banner clarifies automated digests disabled');

  // Check Filter Chips
  const filterButtons = page.locator('.replies-filter-btn');
  const btnCount = await filterButtons.count();
  assert(btnCount === 5, `Found 5 clean submitted job filter buttons (got ${btnCount})`);

  // Check Blank State Card
  const streamText = await page.locator('#repliesStreamContainer').innerText();
  assert(streamText.includes('No Responses from Submitted Jobs Yet'), 'Blank state card renders title correctly');
  assert(streamText.includes('kumar.ashu872@gmail.com'), 'Blank state references monitoring email');
  assert(streamText.includes('Scan Gmail Now'), 'Blank state has "Scan Gmail Now" button');

  console.log('\n--- 2. Testing Burger Menu on Desktop & Mobile ---');
  // Open Burger Menu
  await page.click('#burgerMenuBtn');
  await page.waitForTimeout(300);
  const isDrawerOpen = await page.locator('#burgerMenuDrawer').evaluate(el => !el.classList.contains('-translate-x-full'));
  assert(isDrawerOpen, 'Burger menu drawer opens successfully');

  // Check burger badge count (should be hidden)
  const burgerRepliesBadge = page.locator('#burgerRepliesBadge');
  const drawerBadgeClass = await burgerRepliesBadge.getAttribute('class');
  assert(drawerBadgeClass.includes('hidden'), 'Burger drawer replies badge is hidden when count is 0');

  // Close Burger Menu
  await page.click('#burgerMenuCloseBtn');
  await page.waitForTimeout(300);
  const isDrawerClosed = await page.locator('#burgerMenuDrawer').evaluate(el => el.classList.contains('-translate-x-full'));
  assert(isDrawerClosed, 'Burger menu drawer closes cleanly');

  console.log('\n--- 3. Testing Mobile Responsive Viewport (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  // Check no horizontal scrollbar on body
  const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert(!hasHorizontalScroll, 'Mobile view has zero horizontal overflow/scrollbar');

  console.log('\n--- 4. Testing Multi-Page Routes ---');
  // Users page
  await page.goto('http://localhost:5000/users', { waitUntil: 'networkidle' });
  const usersTitle = await page.title();
  assert(usersTitle.includes('User Management'), `Users page loaded: ${usersTitle}`);

  // Profile page
  await page.goto('http://localhost:5000/profile', { waitUntil: 'networkidle' });
  const profileTitle = await page.title();
  assert(profileTitle.includes('Candidate Profile'), `Profile page loaded: ${profileTitle}`);

  // Login page
  await page.goto('http://localhost:5000/login', { waitUntil: 'networkidle' });
  const loginTitle = await page.title();
  assert(loginTitle.includes('Sign In'), `Login page loaded: ${loginTitle}`);

  await browser.close();

  console.log(`\n========================================`);
  console.log(`E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
})();
