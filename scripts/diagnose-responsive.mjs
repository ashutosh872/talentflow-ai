import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login first
  await page.goto('http://localhost:5000/login.html');
  await page.fill('#loginEmail', 'kumar.ashu872@gmail.com');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#loginSubmitBtn');
  await page.waitForTimeout(1500);

  const viewports = [
    { name: 'Mobile (iPhone SE)', width: 375, height: 667 },
    { name: 'Mobile (iPhone 14)', width: 390, height: 844 },
    { name: 'Tablet (iPad Mini)', width: 768, height: 1024 },
    { name: 'Tablet (iPad Air)', width: 820, height: 1180 },
    { name: 'Desktop (Small)', width: 1024, height: 768 },
    { name: 'Desktop (Standard)', width: 1280, height: 800 },
    { name: 'Desktop (Wide)', width: 1920, height: 1080 }
  ];

  console.log('=== CHECKING RESPONSIVE LAYOUT ACROSS VIEWPORTS ===\n');
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5000/');
    await page.waitForTimeout(1000);

    const overflowInfo = await page.evaluate((vpWidth) => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const hasHorizontalScroll = docWidth > winWidth;

      const overflowing = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (['SCRIPT', 'STYLE', 'path', 'defs'].includes(el.tagName)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 2 && rect.width > 0 && rect.height > 0) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 70),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      }
      return {
        hasHorizontalScroll,
        docWidth,
        winWidth,
        overflowCount: overflowing.length,
        topOverflowing: overflowing.slice(0, 8)
      };
    }, vp.width);

    console.log(`Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`  Horizontal Scroll: ${overflowInfo.hasHorizontalScroll ? '❌ BROKEN (doc: ' + overflowInfo.docWidth + 'px vs win: ' + overflowInfo.winWidth + 'px)' : '✅ OK'}`);
    if (overflowInfo.overflowCount > 0) {
      console.log(`  Overflowing elements (${overflowInfo.overflowCount} total):`);
      overflowInfo.topOverflowing.forEach(o => {
        console.log(`    - <${o.tag} id="${o.id}" class="${o.className}"> right: ${o.right}px, width: ${o.width}px`);
      });
    }
  }

  await browser.close();
}

diagnose().catch(console.error);
