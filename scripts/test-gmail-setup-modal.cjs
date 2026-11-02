const { chromium } = require('playwright');

async function testGmailSetupModal() {
  console.log('🚀 Starting Playwright test for Gmail Setup Modal...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(msg.text()));
  page.on('pageerror', err => console.error('Browser Page Error:', err.message));

  try {
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
    console.log('✓ Loaded Dashboard');

    // Switch to Inbound Replies tab explicitly
    await page.click('.desktop-nav-btn[data-tab="replies"]');
    await page.waitForTimeout(300);

    // 1. Check if "⚙️ Gmail Setup" button is visible
    const gmailSetupBtn = page.locator('#viewReplies button:has-text("Gmail Setup")').first();
    await gmailSetupBtn.waitFor({ state: 'visible', timeout: 5000 });
    const isBtnVisible = await gmailSetupBtn.isVisible();
    console.log(`✓ "Gmail Setup" button visible: ${isBtnVisible}`);
    if (!isBtnVisible) throw new Error('Gmail Setup button not visible in header');

    // 2. Click "⚙️ Gmail Setup"
    await gmailSetupBtn.click();
    await page.waitForTimeout(400);

    // 3. Verify modal is displayed
    const modal = page.locator('#gmailSetupModal');
    const isModalVisible = await modal.isVisible();
    console.log(`✓ Gmail Setup Modal visible: ${isModalVisible}`);
    if (!isModalVisible) throw new Error('#gmailSetupModal did not open');

    // 4. Verify target account display
    const targetEmail = await page.locator('#modalTargetEmailDisplay').innerText();
    console.log(`✓ Target Email displayed: ${targetEmail}`);
    if (!targetEmail.includes('kumar.ashu872@gmail.com')) {
      throw new Error(`Expected kumar.ashu872@gmail.com, got ${targetEmail}`);
    }

    // 5. Verify App Password Tab elements
    const appPassInput = page.locator('#gmailAppPassInput');
    const isAppPassInputVisible = await appPassInput.isVisible();
    console.log(`✓ App Password input visible: ${isAppPassInputVisible}`);

    // Try submitting with short password to verify validation message
    await appPassInput.fill('short123');
    await page.locator('#btnConnectAppPass').click();
    await page.waitForTimeout(300);
    const appPassMsg = page.locator('#appPassStatusMsg');
    const msgText = await appPassMsg.innerText();
    console.log(`✓ Validation message displayed on short password: "${msgText}"`);
    if (!msgText.includes('16-character Google App Password')) {
      throw new Error('Short app password validation message not triggered');
    }

    // 6. Switch to OAuth 2.0 Tab
    await page.locator('#gmailTabBtnOAuth').click();
    await page.waitForTimeout(300);
    const isOAuthVisible = await page.locator('#gmailMethodOAuth').isVisible();
    const isAppPassHidden = !(await page.locator('#gmailMethodAppPass').isVisible());
    console.log(`✓ OAuth Tab active: ${isOAuthVisible}, App Password hidden: ${isAppPassHidden}`);
    if (!isOAuthVisible || !isAppPassHidden) throw new Error('Tab switching failed');

    // 7. Verify Redirect URI
    const redirectUri = await page.locator('#oauthRedirectUriCode').innerText();
    console.log(`✓ Redirect URI displayed: ${redirectUri}`);
    if (!redirectUri.includes('/api/gmail/oauth2callback')) {
      throw new Error(`Unexpected redirect URI: ${redirectUri}`);
    }

    // 8. Test OAuth validation
    await page.locator('#btnAuthorizeOAuth').click();
    await page.waitForTimeout(300);
    const oauthMsg = await page.locator('#oauthStatusMsg').innerText();
    console.log(`✓ OAuth validation message: "${oauthMsg}"`);
    if (!oauthMsg.includes('.apps.googleusercontent.com')) {
      throw new Error('OAuth Client ID validation message not triggered');
    }

    // 9. Close Modal
    await page.locator('#gmailSetupModal button:has-text("Close")').click();
    await page.waitForTimeout(300);
    const isModalClosed = !(await modal.isVisible());
    console.log(`✓ Modal closed successfully: ${isModalClosed}`);
    if (!isModalClosed) throw new Error('Modal failed to close');

    // 10. Test Mobile Viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    await gmailSetupBtn.click();
    await page.waitForTimeout(300);

    const mobileModalVisible = await modal.isVisible();
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`✓ Mobile Viewport (375px) Modal visible: ${mobileModalVisible}, Zero Horizontal Scroll: ${!hasHorizontalScroll}`);
    if (hasHorizontalScroll) throw new Error('Detected horizontal scroll on mobile viewport!');

    console.log('\n🎉 ALL GMAIL SETUP MODAL TESTS PASSED 100%!');
  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testGmailSetupModal();
