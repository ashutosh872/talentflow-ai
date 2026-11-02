import { chromium } from 'playwright';

async function testTabs() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:5000/login.html');
  await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#loginSubmitBtn');
  await page.waitForTimeout(1500);

  const viewports = [
    { name: 'Mobile (375x667)', width: 375, height: 667 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Desktop (1280x800)', width: 1280, height: 800 }
  ];

  const tabs = ['opportunities', 'overview', 'recommendations', 'kanban', 'battlecards', 'replies', 'offer', 'profile'];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`CHECKING TABS ON ${vp.name}`);
    console.log(`========================================`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const tab of tabs) {
      await page.evaluate((t) => window.switchTab(t), tab);
      await page.waitForTimeout(300);

      const info = await page.evaluate((w) => {
        const docW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const overflowingEls = [];

        const all = document.querySelectorAll('*');
        for (const el of all) {
          if (['SCRIPT', 'STYLE', 'path', 'defs'].includes(el.tagName)) continue;
          const rect = el.getBoundingClientRect();
          if (rect.right > w + 2 && rect.width > 0 && rect.height > 0) {
            overflowingEls.push({
              tag: el.tagName,
              id: el.id,
              cls: (el.className || '').toString().slice(0, 50),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        }

        return {
          docW,
          bodyW,
          isOverflow: docW > w || bodyW > w,
          overflowCount: overflowingEls.length,
          topEls: overflowingEls.slice(0, 3)
        };
      }, vp.width);

      if (info.isOverflow || info.overflowCount > 0) {
        console.log(`❌ Tab [${tab}]: Overflow detected! docW=${info.docW}px, bodyW=${info.bodyW}px, winW=${vp.width}px. (${info.overflowCount} elements exceed boundary)`);
        info.topEls.forEach(e => console.log(`   - <${e.tag} id="${e.id}" class="${e.cls}"> right=${e.right}px, w=${e.width}px`));
      } else {
        console.log(`✅ Tab [${tab}]: Clean responsive layout (no overflow)`);
      }
    }
  }

  await browser.close();
}

testTabs().catch(console.error);
