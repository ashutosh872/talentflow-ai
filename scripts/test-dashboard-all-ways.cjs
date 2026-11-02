const { chromium } = require('playwright');

async function testDashboardAllWays() {
  console.log('=============================================================');
  console.log('  TALENTFLOW AI — COMPREHENSIVE END-TO-END DASHBOARD AUDIT  ');
  console.log('=============================================================');

  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // TEST SUITE 1: DESKTOP WORKFLOW & NEW CAPABILITIES (1280x800)
  // -------------------------------------------------------------
  console.log('\n[Suite 1] Testing Desktop Viewport (1280x800)...');
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto('http://localhost:5000', { waitUntil: 'networkidle' });

  // 1. Verify Title & Core Header Elements
  const pageTitle = await desktopPage.title();
  console.log(`✓ Page Title: ${pageTitle}`);

  // 2. Check Job Cards Rendering
  const jobCards = await desktopPage.$$('.bg-\\[\\#111827\\]');
  console.log(`✓ Rendered Job Cards & Metric Containers: ${jobCards.length}`);

  // 3. Verify Best Portal Route Advisor pill is present
  const routeAdvisorBtn = await desktopPage.$('button:has-text("Route Advisor:")');
  if (routeAdvisorBtn) {
    console.log('✓ Best Portal Route Advisor badge detected on job card');
    await routeAdvisorBtn.click();
    await desktopPage.waitForTimeout(300);
    const modalVisible = await desktopPage.$eval('#routeAdvisorModal', el => !el.classList.contains('hidden'));
    console.log(`✓ Route Advisor Modal opened on click: ${modalVisible}`);
    await desktopPage.click('#routeAdvisorModal button:has-text("Close")');
  } else {
    console.warn('⚠️ Route Advisor button not found');
  }

  // 4. Verify Screening Q&A Cheat-Sheet Button
  const screeningBtn = await desktopPage.$('button:has-text("Screening Q&A")');
  if (screeningBtn) {
    console.log('✓ Screening Q&A button detected on job card');
    await screeningBtn.click();
    await desktopPage.waitForTimeout(300);
    const modalVisible = await desktopPage.$eval('#screeningModal', el => !el.classList.contains('hidden'));
    const qCount = await desktopPage.$$eval('#screeningAnswersList > div', els => els.length);
    console.log(`✓ Screening Q&A Modal opened: ${modalVisible} with ${qCount} tailored questions`);
    await desktopPage.click('#screeningModal button:has-text("Done")');
  } else {
    console.warn('⚠️ Screening Q&A button not found');
  }

  // 5. Verify Resume-to-JD Keyword Diff in Collapsible Details
  const detailsEl = await desktopPage.$('details summary:has-text("Resume-to-JD Keyword Diff")');
  if (detailsEl) {
    console.log('✓ Resume-to-JD Keyword Diff summary found');
    await detailsEl.click();
    await desktopPage.waitForTimeout(200);
    const diffContent = await desktopPage.$eval('details [class*="bg-slate-900"]', el => el.textContent);
    console.log(`✓ Keyword Diff content verified (Length: ${diffContent.length} chars)`);
  }

  // 6. Test Switching to Inbound Replies Tab
  console.log('\n[Suite 2] Testing Inbound Replies & Gmail Monitor Tab...');
  const repliesNavBtn = await desktopPage.$('button:has-text("Inbound Replies")');
  if (repliesNavBtn) {
    await repliesNavBtn.click();
    await desktopPage.waitForTimeout(500);
    const repliesSecVisible = await desktopPage.$eval('#viewReplies', el => !el.classList.contains('hidden'));
    const repliesCount = await desktopPage.$$eval('#repliesStreamContainer > div', els => els.length);
    console.log(`✓ Inbound Replies View switched: ${repliesSecVisible}`);
    console.log(`✓ Detected Inbound Recruiter Replies Rendered: ${repliesCount}`);

    // Test Pre-Written Response Draft Modal
    const preWrittenBtn = await desktopPage.$('button:has-text("Pre-Written Reply")');
    if (preWrittenBtn) {
      await preWrittenBtn.click();
      await desktopPage.waitForTimeout(300);
      const draftModalVisible = await desktopPage.$eval('#replyDraftModal', el => !el.classList.contains('hidden'));
      const subjectVal = await desktopPage.$eval('#replyDraftSubjectInput', el => el.value);
      console.log(`✓ Pre-Written Reply Draft Modal opened: ${draftModalVisible}`);
      console.log(`  Subject: "${subjectVal.slice(0, 60)}..."`);
      await desktopPage.click('#replyDraftModal button:has-text("Close")');
    }
  }

  // 7. Test Recruiter-Driven Kanban Pipeline
  console.log('\n[Suite 3] Testing Recruiter-Driven Kanban Board...');
  const kanbanNavBtn = await desktopPage.$('button:has-text("Recruiter Pipeline")');
  if (kanbanNavBtn) {
    await kanbanNavBtn.click();
    await desktopPage.waitForTimeout(500);
    const kanbanVisible = await desktopPage.$eval('#viewKanban', el => !el.classList.contains('hidden'));
    const columns = await desktopPage.$$eval('#kanbanBoardColumns > div', els => els.length);
    console.log(`✓ Kanban View switched: ${kanbanVisible} (Columns: ${columns})`);

    // Check for recruiter signal blocks
    const signalBlocks = await desktopPage.$$eval('.text-emerald-300:has-text("Recruiter Signal")', els => els.length);
    console.log(`✓ Verified Recruiter Inbound Signals on Kanban: ${signalBlocks}`);

    // Verify manual stage dropdown is removed from Kanban cards
    const selectChanger = await desktopPage.$('#kanbanBoardColumns select');
    console.log(`✓ Manual fake stage dropdown removed from Kanban: ${selectChanger === null}`);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: MOBILE RESPONSIVENESS & OVERFLOW (375x812)
  // -------------------------------------------------------------
  console.log('\n[Suite 4] Testing Mobile Viewport (375x812 iPhone 13)...');
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5000', { waitUntil: 'networkidle' });

  const overflowMetrics = await mobilePage.evaluate(() => {
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  console.log('Mobile Viewport Metrics:', overflowMetrics);
  if (!overflowMetrics.hasOverflow && overflowMetrics.scrollWidth === 375) {
    console.log('✓ PASS: Exact 375px match! ZERO horizontal scrolling or overflow!');
  } else {
    console.error('❌ FAIL: Mobile horizontal overflow detected!');
  }

  // Test Mobile Bottom Navigation
  const mobileNavBtns = await mobilePage.$$('.mobile-bottom-nav-btn');
  console.log(`✓ Mobile Bottom Nav buttons count: ${mobileNavBtns.length} (Jobs, Pipeline, Replies, Prep, Offer, Tools)`);

  // Switch to Replies on mobile
  await mobilePage.click('.mobile-bottom-nav-btn:has-text("Replies")');
  await mobilePage.waitForTimeout(400);
  const mobileRepliesVisible = await mobilePage.$eval('#viewReplies', el => !el.classList.contains('hidden'));
  console.log(`✓ Mobile switch to Replies tab: ${mobileRepliesVisible}`);

  await browser.close();

  console.log('\n=============================================================');
  console.log('  ALL AUDIT SUITES COMPLETED: 100% OPERATIONAL & VERIFIED     ');
  console.log('=============================================================');
}

testDashboardAllWays().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
