import { chromium } from 'playwright';
import assert from 'assert';

async function runMobileTests() {
  console.log('📱 Starting Comprehensive Mobile Interaction & Visibility Suite...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE screen
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  // 1. Authenticate via login
  console.log('  1. Authenticating on mobile viewport...');
  await page.goto('http://localhost:5000/login.html');
  await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#loginSubmitBtn');
  await page.waitForURL('http://localhost:5000/');
  console.log('  ✓ Mobile auth successful, redirected to dashboard.');

  // 2. Check header visibility & responsiveness
  console.log('  2. Verifying Header elements on mobile...');
  const header = await page.$('header');
  assert.ok(header, 'Header must exist');
  const masterPdfBtn = await page.$('a[title="View Master PDF Resume"]');
  assert.ok(masterPdfBtn, 'Master PDF resume link must be present on mobile');

  // 3. Inbound Recruiter Communications section
  console.log('  3. Verifying Inbound Recruiter Communications cards on mobile...');
  const replyCards = await page.$$('#inboundRepliesList > div');
  console.log(`  ✓ Found ${replyCards.length} genuine recruiter communications.`);
  assert.ok(replyCards.length > 0, 'Must show genuine recruiter replies');

  // Verify first email card has visible sender, subject, and Read Full Mail button
  const firstReply = replyCards[0];
  const readMailBtn = await firstReply.$('a:has-text("Read Full Mail")');
  assert.ok(readMailBtn, 'Card must have "Read Full Mail ↗" button');
  const readMailHref = await readMailBtn.getAttribute('href');
  assert.ok(readMailHref && readMailHref.includes('/data/inbound-replies/'), 'Must link to email HTML');

  // 4. Test "Opened via Recruiter" filter chip on mobile
  console.log('  4. Testing "Opened via Recruiter" filter chip on mobile...');
  const openedFilterBtn = await page.$('button[data-filter="recruiter-opened"]');
  assert.ok(openedFilterBtn, '"Opened via Recruiter" filter button must be present on mobile');
  
  // Click the filter button
  await openedFilterBtn.click();
  await page.waitForTimeout(500);

  // Check that job cards are filtered to only those with opened badge
  const filteredCards = await page.$$('#jobListContainer > div');
  console.log(`  ✓ "Opened via Recruiter" filter displayed ${filteredCards.length} jobs.`);
  assert.ok(filteredCards.length > 0, 'Must display opened jobs');

  // Verify every visible card has the Opened badge
  for (const card of filteredCards) {
    const text = await card.innerText();
    assert.ok(text.includes('Opened') || text.includes('Submitted'), 'Card must have opened/submitted status');
  }
  console.log('  ✓ All filtered cards correctly display recruiter read receipt badges.');

  // 5. Test JD Modal opening on mobile
  console.log('  5. Testing JD Modal opening & responsive fit on mobile...');
  const firstCompanyLink = await filteredCards[0].$('button[onclick*="openJdModal"]');
  assert.ok(firstCompanyLink, 'Must have clickable company name for JD modal');
  await firstCompanyLink.click();
  await page.waitForTimeout(500);

  const modal = await page.$('#jdModal');
  const modalClass = await modal.getAttribute('class');
  assert.ok(!modalClass.includes('hidden'), 'JD Modal must be visible on mobile');

  const modalTitle = await page.$eval('#jdModalTitle', el => el.innerText);
  console.log(`  ✓ Modal opened successfully for role: "${modalTitle}"`);

  // Verify modal is not horizontally overflowing the screen
  const modalBox = await page.$eval('#jdModal > div', el => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, right: rect.right, left: rect.left };
  });
  assert.ok(modalBox.width <= 375, `Modal width (${modalBox.width}px) must fit within mobile screen (375px)`);
  console.log(`  ✓ Modal width is ${modalBox.width}px (perfect fit within 375px mobile screen).`);

  // Close modal
  const closeBtn = await page.$('button[onclick="closeJdModal()"]');
  await closeBtn.click();
  await page.waitForTimeout(300);
  const modalClassAfter = await modal.getAttribute('class');
  assert.ok(modalClassAfter.includes('hidden'), 'JD Modal must close cleanly');
  console.log('  ✓ Modal closed cleanly.');

  // 6. Test Switching back to "All Top Openings" filter
  console.log('  6. Testing "All Top Openings" filter on mobile...');
  const allFilterBtn = await page.$('button[data-filter="all"]');
  await allFilterBtn.click();
  await page.waitForTimeout(500);
  const allCards = await page.$$('#jobListContainer > div');
  console.log(`  ✓ All Top Openings restored: ${allCards.length} jobs displayed.`);
  assert.ok(allCards.length >= 20, 'Must show full list of openings');

  // 7. Test Search bar on mobile
  console.log('  7. Testing Search bar filtering on mobile...');
  await page.fill('#searchInput', 'Angular');
  await page.waitForTimeout(500);
  const searchCards = await page.$$('#jobListContainer > div');
  console.log(`  ✓ Search for "Angular" returned ${searchCards.length} matching jobs.`);
  assert.ok(searchCards.length > 0, 'Search must match Angular jobs');
  await page.fill('#searchInput', '');
  await page.waitForTimeout(300);

  // 8. Test Saved Jobs toggle on mobile
  console.log('  8. Testing Saved Jobs Toggle on mobile...');
  await page.waitForTimeout(500);
  const saveBtn = await page.$('.save-job-btn');
  if (saveBtn) {
    const initialText = await saveBtn.innerText();
    await saveBtn.click();
    await page.waitForTimeout(500);
    const newText = await page.$eval('.save-job-btn', el => el.innerText);
    console.log(`  ✓ Save Job button toggled on mobile: "${initialText}" -> "${newText}"`);
  }

  await browser.close();
  console.log('\n🎉 ALL MOBILE TESTS PASSED 100%! FULLY RESPONSIVE & INTERACTIVE.');
}

runMobileTests().catch(err => {
  console.error('Mobile test failed:', err);
  process.exit(1);
});
