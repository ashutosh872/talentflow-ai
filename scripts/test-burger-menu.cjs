const { chromium } = require('playwright');

async function testBurgerMenu() {
  console.log('======================================================================');
  console.log('TALENTFLOW AI — BURGER MENU & HEADER INTEGRATION TEST SUITE');
  console.log('======================================================================');

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'Mobile (390x844)', width: 390, height: 844 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Standard Laptop (1280x800)', width: 1280, height: 800 },
    { name: 'Desktop Widescreen (1920x1080)', width: 1920, height: 1080 }
  ];

  let passCount = 0;
  let failCount = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
      failCount++;
    }
  }

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:5000/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);

      // Verify no horizontal document overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      assert(scrollWidth <= clientWidth + 1, `No horizontal page overflow on ${vp.name} (scroll: ${scrollWidth}, client: ${clientWidth})`);

      // Verify Burger Menu button is visible
      const burgerBtn = await page.$('#burgerMenuBtn');
      assert(burgerBtn !== null, `Burger menu button exists on ${vp.name}`);

      // Open Burger Menu
      await burgerBtn.click();
      await page.waitForTimeout(400);

      // Check drawer opened
      const isDrawerOpen = await page.evaluate(() => {
        const drawer = document.getElementById('burgerMenuDrawer');
        return drawer && !drawer.classList.contains('translate-x-full');
      });
      assert(isDrawerOpen, `Burger menu drawer opened on ${vp.name}`);

      // Verify all 5 views exist inside drawer
      const oppBtn = await page.$('button[data-tab="opportunities"].burger-tab-btn');
      assert(oppBtn !== null, 'Opportunities view button exists in drawer');

      const kanbanBtn = await page.$('button[data-tab="kanban"].burger-tab-btn');
      assert(kanbanBtn !== null, 'Recruiter Pipeline (Kanban) button exists in drawer');

      const repliesBtn = await page.$('button[data-tab="replies"].burger-tab-btn');
      assert(repliesBtn !== null, 'Inbound Replies button exists in drawer');

      const battleBtn = await page.$('button[data-tab="battlecards"].burger-tab-btn');
      assert(battleBtn !== null, 'Battle-Cards button exists in drawer');

      const offerBtn = await page.$('button[data-tab="offer"].burger-tab-btn');
      assert(offerBtn !== null, 'Offer Calculator button exists in drawer');

      // Test switching to Kanban via burger menu
      await kanbanBtn.click();
      await page.waitForTimeout(500);

      const isKanbanVisible = await page.evaluate(() => {
        const sec = document.getElementById('viewKanban');
        return sec && !sec.classList.contains('hidden');
      });
      assert(isKanbanVisible, `Switched to Recruiter Pipeline (Kanban) view successfully`);

      // Verify drawer automatically closed on tab selection
      const isDrawerClosed = await page.evaluate(() => {
        const drawer = document.getElementById('burgerMenuDrawer');
        return drawer && drawer.classList.contains('translate-x-full');
      });
      assert(isDrawerClosed, `Burger menu drawer closed upon view selection`);

      // Test switching to Battle-Cards via burger menu
      await burgerBtn.click();
      await page.waitForTimeout(400);
      await battleBtn.click();
      await page.waitForTimeout(500);

      const isBattleVisible = await page.evaluate(() => {
        const sec = document.getElementById('viewBattlecards');
        return sec && !sec.classList.contains('hidden');
      });
      assert(isBattleVisible, `Switched to Battle-Cards view successfully`);

      // Switch back to opportunities
      await burgerBtn.click();
      await page.waitForTimeout(400);
      await oppBtn.click();
      await page.waitForTimeout(500);

      const isOppVisible = await page.evaluate(() => {
        const sec = document.getElementById('viewOpportunities');
        return sec && !sec.classList.contains('hidden');
      });
      assert(isOppVisible, `Switched back to Opportunities view successfully`);

    } catch (err) {
      console.error(`Error on ${vp.name}:`, err);
      failCount++;
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('\n======================================================================');
  console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================================');

  if (failCount > 0) process.exit(1);
}

testBurgerMenu();
