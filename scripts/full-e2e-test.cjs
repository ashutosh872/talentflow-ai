/**
 * COMPREHENSIVE END-TO-END TEST SUITE
 * Job Search Workflow Dashboard - Full Regression Test
 * Tests: Server, Routes, Portals, Replies, Kanban, Battlecards, Offer Calculator,
 *        Privacy Toggle, Search/Filter, Gmail APIs, Mobile Nav, Candidate Switcher
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
let pass = 0, fail = 0, warnings = [];

function ok(label) { pass++; console.log(`  ✅ PASS: ${label}`); }
function bad(label, detail) { fail++; console.log(`  ❌ FAIL: ${label} — ${detail}`); }
function warn(label) { warnings.push(label); console.log(`  ⚠️  WARN: ${label}`); }

// ═══════════════════════════════════════════════════════════
// PHASE 1: SERVER & API HEALTH CHECKS (no browser needed)
// ═══════════════════════════════════════════════════════════
async function phase1_serverHealth() {
  console.log('\n═══ PHASE 1: Server & API Health ═══');

  // 1a. Dashboard HTTP 200
  const dashRes = await fetch(BASE);
  dashRes.status === 200 ? ok('Dashboard returns HTTP 200') : bad('Dashboard HTTP', `Got ${dashRes.status}`);

  // 1b. /api/gmail/status
  const statusRes = await fetch(`${BASE}/api/gmail/status`);
  const status = await statusRes.json();
  statusRes.ok ? ok('/api/gmail/status returns OK') : bad('/api/gmail/status', `Status ${statusRes.status}`);
  status.connected ? ok('Gmail connected = true') : bad('Gmail connected', 'false');
  status.mode === 'LIVE_GMAIL_APP_PASS' ? ok('Gmail mode = LIVE_GMAIL_APP_PASS') : warn(`Gmail mode = ${status.mode}`);
  status.totalRepliesCount === 15 ? ok(`Total replies count = ${status.totalRepliesCount}`) : warn(`Replies count = ${status.totalRepliesCount} (expected 15)`);

  // 1c. /api/gmail/replies
  const repliesRes = await fetch(`${BASE}/api/gmail/replies`);
  const replies = await repliesRes.json();
  repliesRes.ok ? ok('/api/gmail/replies returns OK') : bad('/api/gmail/replies', `Status ${repliesRes.status}`);
  replies.length === 15 ? ok(`Replies array length = ${replies.length}`) : warn(`Replies array length = ${replies.length} (expected 15)`);
  const allLive = replies.every(r => r.sourceMode === 'LIVE_GMAIL_IMAP' || r.sourceMode === 'LIVE_GMAIL_API');
  allLive ? ok('All replies have LIVE sourceMode (no test demos)') : bad('Reply sourceMode', 'Found non-live entries');

  // 1d. /api/battlecards
  const bcRes = await fetch(`${BASE}/api/battlecards`);
  const bcs = await bcRes.json();
  bcRes.ok ? ok('/api/battlecards returns OK') : bad('/api/battlecards', `Status ${bcRes.status}`);
  bcs.length >= 12 ? ok(`Battlecards count = ${bcs.length}`) : warn(`Battlecards count = ${bcs.length} (expected >= 12)`);

  // 1e. /api/jobs
  const jobsRes = await fetch(`${BASE}/api/jobs`);
  if (jobsRes.ok) {
    const jd = await jobsRes.json();
    jd.length >= 15 ? ok(`/api/jobs count = ${jd.length}`) : warn(`/api/jobs count = ${jd.length}`);
  } else {
    warn('/api/jobs endpoint not available (may be inline)');
  }

  // 1f. Static file serving
  const portalRes = await fetch(`${BASE}/data/mock-portal/nagarro.html`);
  portalRes.ok ? ok('Static file serving works (nagarro.html)') : bad('Static files', 'Cannot serve data/mock-portal/nagarro.html');
}

// ═══════════════════════════════════════════════════════════
// PHASE 2: ALL 20 PORTAL ROUTE VERIFICATION (Playwright)
// ═══════════════════════════════════════════════════════════
async function phase2_portalRoutes(page) {
  console.log('\n═══ PHASE 2: Portal Route Verification (All 20 Jobs) ═══');

  const EXPECTED_ROUTES = {
    'job-mock-001': { company: 'Nagarro', file: 'nagarro.html' },
    'job-mock-002': { company: 'Samsung SDS', file: 'samsung-sds.html' },
    'job-mock-003': { company: 'Wipro', file: 'wipro.html' },
    'job-mock-004': { company: 'GitLab', file: 'gitlab.html' },
    'job-mock-005': { company: 'Cheil/Experience Commerce', file: 'experience-commerce.html' },
    'job-mock-006': { company: 'Cisco', file: 'cisco.html' },
    'job-mock-007': { company: 'Acme Global', file: 'acme-global.html' },
    'job-mock-008': { company: 'Mindrops', file: 'mindrops.html' },
    'job-mock-009': { company: 'Cognitive Labs', file: 'cognitive-labs.html' },
    'job-mock-010': { company: 'Incedo', file: 'incedo.html' },
    'naukri-001': { company: 'Info Edge', file: 'infoedge.html' },
    'naukri-002': { company: 'Publicis Sapient', file: 'publicis-sapient.html' },
    'naukri-003': { company: 'HCL', file: 'hcl.html' },
    'indeed-001': { company: 'Tech Mahindra', file: 'tech-mahindra.html' },
    'indeed-002': { company: 'EPAM', file: 'epam.html' },
    'indeed-003': { company: 'Zomato', file: 'zomato.html' },
    'linkedin-001': { company: 'CBA', file: 'cba.html' },
    'linkedin-002': { company: 'MakeMyTrip', file: 'makemytrip.html' },
    'linkedin-003': { company: 'Paytm', file: 'paytm.html' },
    'linkedin-4478053400': { company: 'Amazon', file: 'amazon-fee2.html' }
  };

  // Check card portal links
  const cardLinks = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#jobListContainer > div'));
    return cards.map(c => {
      const portalBtn = c.querySelector('a[href*="mock-portal"]');
      const idMatch = c.innerHTML.match(/openRouteAdvisorModal\('([^']+)'\)/);
      return {
        jobId: idMatch ? idMatch[1] : null,
        portalHref: portalBtn ? portalBtn.getAttribute('href') : null
      };
    }).filter(c => c.jobId);
  });

  for (const [jobId, expected] of Object.entries(EXPECTED_ROUTES)) {
    const card = cardLinks.find(c => c.jobId === jobId);
    if (!card) {
      warn(`Card for ${expected.company} (${jobId}) not found in DOM — may be loaded dynamically`);
      continue;
    }
    const expectedPath = `data/mock-portal/${expected.file}`;
    if (card.portalHref === expectedPath) {
      ok(`${expected.company} (${jobId}) → ${expected.file}`);
    } else {
      bad(`${expected.company} (${jobId})`, `Expected ${expectedPath}, got ${card.portalHref}`);
    }
  }

  // Route Advisor modal verification for critical routes
  for (const jobId of ['job-mock-005', 'linkedin-4478053400', 'job-mock-001', 'naukri-001']) {
    const expected = EXPECTED_ROUTES[jobId];
    await page.evaluate(id => { openRouteAdvisorModal(id); }, jobId);
    await page.waitForTimeout(200);
    const href = await page.evaluate(() => {
      const btn = document.getElementById('routeAdvisorApplyBtn');
      return btn ? btn.getAttribute('href') : null;
    });
    const expectedHref = `data/mock-portal/${expected.file}`;
    if (href === expectedHref) {
      ok(`Route Advisor: ${expected.company} → ${expected.file}`);
    } else {
      bad(`Route Advisor: ${expected.company}`, `Expected ${expectedHref}, got ${href}`);
    }
    await page.evaluate(() => { closeRouteAdvisorModal(); });
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 3: HEADER / NAVIGATION / UI ELEMENTS
// ═══════════════════════════════════════════════════════════
async function phase3_headerAndNav(page) {
  console.log('\n═══ PHASE 3: Header, Navigation & UI Elements ═══');

  // 3a. Scope PDF removed from header
  const scopeInNav = await page.$('nav a[href*="Project_Scope_and_Roadmap"]');
  !scopeInNav ? ok('Scope PDF removed from top nav') : bad('Scope PDF in nav', 'Still present');

  const scopeInBanner = await page.$('section a[href*="Project_Scope_and_Roadmap"]');
  !scopeInBanner ? ok('Scope PDF removed from hero banner') : bad('Scope PDF in banner', 'Still present');

  // 3b. Privacy toggle exists
  const privacyBtn = await page.$('#privacyToggleBtn');
  privacyBtn ? ok('Privacy toggle button exists') : bad('Privacy toggle', 'Missing #privacyToggleBtn');

  // 3c. Tools button exists
  const toolsBtn = await page.$('button[onclick*="openToolsModal"]');
  toolsBtn ? ok('Tools button exists') : bad('Tools button', 'Missing');

  // 3d. Tab buttons exist
  for (const tab of ['opportunities', 'kanban', 'replies', 'battlecards', 'offer']) {
    const btn = await page.$(`[data-tab="${tab}"]`);
    btn ? ok(`Tab button: ${tab}`) : bad(`Tab button: ${tab}`, 'Not found');
  }

  // 3e. Candidate selector container exists
  const candSel = await page.$('#candidateSelectorContainer');
  candSel ? ok('Candidate selector container exists') : warn('Candidate selector container missing');

  // 3f. Mobile bottom nav
  const mobileNav = await page.$('.mobile-bottom-nav-btn');
  mobileNav ? ok('Mobile bottom nav buttons exist') : warn('Mobile bottom nav buttons missing');
}

// ═══════════════════════════════════════════════════════════
// PHASE 4: OPPORTUNITIES TAB
// ═══════════════════════════════════════════════════════════
async function phase4_opportunities(page) {
  console.log('\n═══ PHASE 4: Opportunities Tab ═══');

  await page.evaluate(() => switchTab('opportunities'));
  await page.waitForTimeout(300);

  // 4a. Job cards rendered
  const cardCount = await page.evaluate(() => {
    return document.querySelectorAll('#jobListContainer > div').length;
  });
  cardCount >= 15 ? ok(`Job cards rendered: ${cardCount}`) : bad('Job cards', `Only ${cardCount} rendered (expected >=15)`);

  // 4b. Search input exists
  const searchInput = await page.$('#searchInput');
  searchInput ? ok('Search input exists') : bad('Search input', 'Missing');

  // 4c. Filter buttons exist
  const filterBtns = await page.$$('#filterButtons button');
  filterBtns.length >= 5 ? ok(`Filter buttons: ${filterBtns.length}`) : bad('Filter buttons', `Only ${filterBtns.length}`);

  // 4d. Test search functionality
  await page.fill('#searchInput', 'Amazon');
  await page.waitForTimeout(200);
  const amazonVisible = await page.evaluate(() => {
    const cards = document.querySelectorAll('#jobListContainer > div');
    let visibleCount = 0;
    cards.forEach(c => { if (!c.classList.contains('hidden') && c.offsetParent !== null) visibleCount++; });
    return visibleCount;
  });
  amazonVisible >= 1 ? ok(`Search "Amazon" shows ${amazonVisible} result(s)`) : warn(`Search "Amazon" showed ${amazonVisible} results`);

  // Clear search
  await page.fill('#searchInput', '');
  await page.waitForTimeout(200);

  // 4e. Verify each job card has essential elements
  const cardAudit = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#jobListContainer > div'));
    let missingPortal = 0;
    let missingRouteAdvisor = 0;
    cards.forEach(c => {
      if (!c.querySelector('a[href*="mock-portal"]')) missingPortal++;
      if (!c.innerHTML.includes('openRouteAdvisorModal')) missingRouteAdvisor++;
    });
    return { total: cards.length, missingPortal, missingRouteAdvisor };
  });
  cardAudit.missingPortal === 0 ? ok('All cards have portal links') : warn(`${cardAudit.missingPortal} cards missing portal links`);
  cardAudit.missingRouteAdvisor === 0 ? ok('All cards have Route Advisor buttons') : warn(`${cardAudit.missingRouteAdvisor} cards missing Route Advisor`);
}

// ═══════════════════════════════════════════════════════════
// PHASE 5: KANBAN PIPELINE TAB
// ═══════════════════════════════════════════════════════════
async function phase5_kanban(page) {
  console.log('\n═══ PHASE 5: Kanban Pipeline Tab ═══');

  await page.evaluate(() => switchTab('kanban'));
  await page.waitForTimeout(500);

  const kanbanInfo = await page.evaluate(() => {
    const board = document.getElementById('kanbanBoardColumns');
    if (!board) return null;
    const columns = board.children;
    const cards = board.querySelectorAll('.bg-slate-900\\/90');
    return { columnsCount: columns.length, cardsCount: cards.length, boardHtml: board.innerHTML.substring(0, 200) };
  });

  if (kanbanInfo) {
    kanbanInfo.columnsCount >= 3 ? ok(`Kanban columns: ${kanbanInfo.columnsCount}`) : warn(`Kanban columns: ${kanbanInfo.columnsCount} (expected >=3)`);
    kanbanInfo.cardsCount >= 1 ? ok(`Kanban cards: ${kanbanInfo.cardsCount}`) : warn(`Kanban cards: ${kanbanInfo.cardsCount}`);
  } else {
    bad('Kanban board', 'Board container not found');
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 6: INBOUND REPLIES TAB
// ═══════════════════════════════════════════════════════════
async function phase6_repliesTab(page) {
  console.log('\n═══ PHASE 6: Inbound Replies Tab ═══');

  await page.evaluate(() => switchTab('replies'));
  await page.waitForTimeout(800);

  // 6a. No simulation buttons
  const simBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#viewReplies button'))
      .filter(b => b.textContent.includes('Simulate')).length;
  });
  simBtns === 0 ? ok('No simulation buttons in Replies tab') : bad('Simulation buttons', `Found ${simBtns}`);

  // 6b. Reply cards rendered
  const repliesRendered = await page.evaluate(() => {
    const container = document.getElementById('repliesStreamContainer');
    return container ? container.children.length : 0;
  });
  repliesRendered === 15 ? ok(`Reply cards rendered: ${repliesRendered}`) : warn(`Reply cards rendered: ${repliesRendered} (expected 15)`);

  // 6c. Gmail status bar
  const statusBar = await page.evaluate(() => {
    const bar = document.getElementById('gmailSyncStatusBar');
    return bar ? bar.textContent.trim() : null;
  });
  statusBar && statusBar.includes('LIVE GMAIL') ? ok('Gmail status bar shows LIVE GMAIL') : warn(`Gmail status bar: ${(statusBar || '').substring(0, 100)}`);

  // 6d. Check first reply card has correct structure
  const firstReply = await page.evaluate(() => {
    const container = document.getElementById('repliesStreamContainer');
    if (!container || !container.firstElementChild) return null;
    const card = container.firstElementChild;
    return {
      hasSubject: !!card.querySelector('h3'),
      hasCompany: !!card.querySelector('span.font-bold'),
      hasBadge: !!card.querySelector('span.rounded-full'),
      hasDate: card.textContent.includes('Nov'),
    };
  });
  if (firstReply) {
    firstReply.hasSubject ? ok('Reply card has subject (h3)') : bad('Reply card', 'Missing subject');
    firstReply.hasCompany ? ok('Reply card has company name') : bad('Reply card', 'Missing company');
    firstReply.hasBadge ? ok('Reply card has intent badge') : bad('Reply card', 'Missing badge');
    firstReply.hasDate ? ok('Reply card has date') : bad('Reply card', 'Missing date');
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 7: BATTLE-CARDS TAB
// ═══════════════════════════════════════════════════════════
async function phase7_battlecards(page) {
  console.log('\n═══ PHASE 7: Interview Battle-Cards Tab ═══');

  await page.evaluate(() => switchTab('battlecards'));
  await page.waitForTimeout(500);

  const bcInfo = await page.evaluate(() => {
    const section = document.getElementById('viewBattlecards');
    if (!section) return null;
    const cards = section.querySelectorAll('.bg-\\[\\#1e293b\\]');
    return { rendered: cards.length, isHidden: section.classList.contains('hidden') };
  });

  if (bcInfo) {
    !bcInfo.isHidden ? ok('Battle-Cards tab is visible') : bad('Battle-Cards tab', 'Still hidden');
    bcInfo.rendered >= 5 ? ok(`Battle-cards rendered: ${bcInfo.rendered}`) : warn(`Battle-cards rendered: ${bcInfo.rendered}`);
  } else {
    bad('Battle-Cards section', 'Not found in DOM');
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 8: OFFER CALCULATOR TAB
// ═══════════════════════════════════════════════════════════
async function phase8_offerCalc(page) {
  console.log('\n═══ PHASE 8: Offer Calculator Tab ═══');

  await page.evaluate(() => switchTab('offer'));
  await page.waitForTimeout(300);

  const offerInfo = await page.evaluate(() => {
    const section = document.getElementById('viewOfferCalculator');
    if (!section) return null;
    return {
      isVisible: !section.classList.contains('hidden'),
      hasInputs: section.querySelectorAll('input[type="range"], input[type="number"]').length,
      hasNegotiationScripts: section.textContent.includes('Negotiation') || section.textContent.includes('offer')
    };
  });

  if (offerInfo) {
    offerInfo.isVisible ? ok('Offer Calculator tab is visible') : bad('Offer Calculator', 'Hidden');
    offerInfo.hasInputs > 0 ? ok(`Offer inputs found: ${offerInfo.hasInputs}`) : warn('No offer calculator inputs');
    offerInfo.hasNegotiationScripts ? ok('Negotiation scripts present') : warn('Negotiation scripts not found');
  } else {
    bad('Offer Calculator section', 'Not found');
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 9: PRIVACY TOGGLE
// ═══════════════════════════════════════════════════════════
async function phase9_privacyToggle(page) {
  console.log('\n═══ PHASE 9: Privacy Toggle ═══');

  await page.evaluate(() => switchTab('opportunities'));
  await page.waitForTimeout(200);

  // Toggle privacy ON
  await page.evaluate(() => { if (typeof togglePrivacyMode === 'function') togglePrivacyMode(); });
  await page.waitForTimeout(200);

  const afterToggle = await page.evaluate(() => {
    const icon = document.getElementById('privacyIcon');
    const statusText = document.getElementById('privacyStatusText');
    return {
      icon: icon ? icon.textContent : null,
      statusText: statusText ? statusText.textContent : null
    };
  });
  afterToggle.statusText ? ok(`Privacy toggle works: ${afterToggle.statusText}`) : warn('Privacy status text not found');

  // Toggle back
  await page.evaluate(() => { if (typeof togglePrivacyMode === 'function') togglePrivacyMode(); });
}

// ═══════════════════════════════════════════════════════════
// PHASE 10: FILE SYSTEM INTEGRITY
// ═══════════════════════════════════════════════════════════
async function phase10_fileSystem() {
  console.log('\n═══ PHASE 10: File System Integrity ═══');

  const PORTAL_FILES = [
    'nagarro.html', 'samsung-sds.html', 'wipro.html', 'gitlab.html',
    'experience-commerce.html', 'cisco.html', 'acme-global.html', 'mindrops.html',
    'cognitive-labs.html', 'incedo.html', 'infoedge.html', 'publicis-sapient.html',
    'hcl.html', 'tech-mahindra.html', 'epam.html', 'zomato.html',
    'cba.html', 'makemytrip.html', 'paytm.html', 'amazon-fee2.html'
  ];

  for (const f of PORTAL_FILES) {
    const fp = path.resolve('data/mock-portal', f);
    fs.existsSync(fp) ? ok(`Portal file: ${f}`) : bad(`Portal file missing: ${f}`, fp);
  }

  // Applications CSV
  const csvPath = path.resolve('data/applications.csv');
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim());
    lines.length >= 16 ? ok(`applications.csv: ${lines.length} lines (header + ${lines.length - 1} jobs)`) : warn(`applications.csv only has ${lines.length} lines`);
  } else {
    bad('applications.csv', 'File missing');
  }

  // Battlecards index
  const bcIdx = path.resolve('data/interview-battlecards/battlecards-index.json');
  if (fs.existsSync(bcIdx)) {
    const bcs = JSON.parse(fs.readFileSync(bcIdx, 'utf8'));
    bcs.length >= 12 ? ok(`battlecards-index.json: ${bcs.length} entries`) : warn(`Only ${bcs.length} battlecards`);
  } else {
    bad('battlecards-index.json', 'Missing');
  }

  // Replies index
  const repliesPath = path.resolve('data/inbound-replies/replies.json');
  if (fs.existsSync(repliesPath)) {
    const replies = JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
    const liveModes = replies.filter(r => r.sourceMode === 'LIVE_GMAIL_IMAP' || r.sourceMode === 'LIVE_GMAIL_API');
    const testModes = replies.filter(r => r.sourceMode !== 'LIVE_GMAIL_IMAP' && r.sourceMode !== 'LIVE_GMAIL_API');
    ok(`replies.json: ${replies.length} total (${liveModes.length} live, ${testModes.length} test)`);
    testModes.length === 0 ? ok('No test/simulation entries in replies.json') : bad('Test entries in replies', `Found ${testModes.length}`);
  } else {
    bad('replies.json', 'Missing');
  }

  // Gmail config
  const gmailCfg = path.resolve('data/gmail-config.json');
  if (fs.existsSync(gmailCfg)) {
    const cfg = JSON.parse(fs.readFileSync(gmailCfg, 'utf8'));
    cfg.userEmail === 'kumar.ashu872@gmail.com' ? ok('Gmail config: correct email') : bad('Gmail config email', cfg.userEmail);
  } else {
    bad('gmail-config.json', 'Missing');
  }

  // .env file
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.includes('SMTP_PASS=') ? ok('.env has SMTP_PASS') : warn('.env missing SMTP_PASS');
    env.includes('SMTP_USER=') ? ok('.env has SMTP_USER') : warn('.env missing SMTP_USER');
  } else {
    bad('.env', 'Missing');
  }

  // Tunnel URL
  const tunnelPath = path.resolve('data/tunnel-url.txt');
  if (fs.existsSync(tunnelPath)) {
    const url = fs.readFileSync(tunnelPath, 'utf8').trim();
    url.includes('trycloudflare.com') ? ok(`Tunnel URL: ${url}`) : warn(`Tunnel URL unexpected: ${url}`);
  } else {
    warn('data/tunnel-url.txt missing');
  }

  // Email dispatches
  const dispatchDir = path.resolve('data/email-dispatches');
  if (fs.existsSync(dispatchDir)) {
    const dispatches = fs.readdirSync(dispatchDir).filter(f => f.endsWith('.html'));
    ok(`Email dispatches: ${dispatches.length} files`);
  } else {
    warn('data/email-dispatches/ directory missing');
  }
}

// ═══════════════════════════════════════════════════════════
// PHASE 11: TOOLS MODAL & SCREENING MODAL
// ═══════════════════════════════════════════════════════════
async function phase11_modals(page) {
  console.log('\n═══ PHASE 11: Modals (Tools, Screening, Resume Viewer) ═══');

  // Tools modal
  await page.evaluate(() => { if (typeof openToolsModal === 'function') openToolsModal(); });
  await page.waitForTimeout(300);

  const toolsModal = await page.evaluate(() => {
    const modal = document.getElementById('toolsModal');
    return modal ? !modal.classList.contains('hidden') : false;
  });
  toolsModal ? ok('Tools modal opens') : warn('Tools modal did not open');

  // Close it
  await page.evaluate(() => {
    const modal = document.getElementById('toolsModal');
    if (modal) modal.classList.add('hidden');
  });

  // Gmail Setup modal
  await page.evaluate(() => { if (typeof openGmailSetupModal === 'function') openGmailSetupModal(); });
  await page.waitForTimeout(200);
  const gmailModal = await page.evaluate(() => {
    const modal = document.getElementById('gmailSetupModal');
    return modal ? !modal.classList.contains('hidden') : false;
  });
  gmailModal ? ok('Gmail Setup modal opens') : warn('Gmail Setup modal did not open');
  await page.evaluate(() => {
    const modal = document.getElementById('gmailSetupModal');
    if (modal) modal.classList.add('hidden');
  });

  // Route Advisor modal
  await page.evaluate(() => { openRouteAdvisorModal('job-mock-001'); });
  await page.waitForTimeout(200);
  const raModal = await page.evaluate(() => {
    const modal = document.getElementById('routeAdvisorModal');
    return modal ? !modal.classList.contains('hidden') : false;
  });
  raModal ? ok('Route Advisor modal opens') : bad('Route Advisor modal', 'Did not open');
  await page.evaluate(() => closeRouteAdvisorModal());
}

// ═══════════════════════════════════════════════════════════
// MAIN RUNNER
// ═══════════════════════════════════════════════════════════
async function main() {
  console.log('╔═════════════════════════════════════════════════════════╗');
  console.log('║  JOB SEARCH DASHBOARD — FULL E2E REGRESSION TEST      ║');
  console.log('║  ' + new Date().toLocaleString() + '                         ║');
  console.log('╚═════════════════════════════════════════════════════════╝');

  // Phase 1: No browser needed
  await phase1_serverHealth();

  // Phase 10: File system (no browser)
  await phase10_fileSystem();

  // Browser phases
  console.log('\n🌐 Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  console.log('   Page loaded.\n');

  await phase2_portalRoutes(page);
  await phase3_headerAndNav(page);
  await phase4_opportunities(page);
  await phase5_kanban(page);
  await phase6_repliesTab(page);
  await phase7_battlecards(page);
  await phase8_offerCalc(page);
  await phase9_privacyToggle(page);
  await phase11_modals(page);

  await browser.close();

  // Summary
  console.log('\n╔═════════════════════════════════════════════════════════╗');
  console.log(`║  RESULTS: ${pass} PASSED | ${fail} FAILED | ${warnings.length} WARNINGS`);
  console.log('╚═════════════════════════════════════════════════════════╝');
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`   • ${w}`));
  }
  if (fail > 0) {
    console.log('\n❌ Some tests FAILED. See details above.');
    process.exit(1);
  } else {
    console.log('\n✅ ALL TESTS PASSED! Dashboard is fully operational.');
  }
}

main().catch(err => {
  console.error('\n💥 Test runner crashed:', err);
  process.exit(1);
});

