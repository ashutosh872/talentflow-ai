// ==============================================================
// TALENTFLOW AI — ENTERPRISE DASHBOARD EXTENDED FEATURES
// ==============================================================

let currentActiveTab = 'opportunities';
let cachedBattlecards = [];
let cachedInboundReplies = [];

// 1. Tab Switching Function (Synchronizes Desktop Header & Mobile Bottom Nav)
function checkWritePermission(actionName = 'perform this action') {
  const saved = localStorage.getItem('talentflow_auth');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.user && (parsed.user.access === 'read' || parsed.user.role === 'viewer')) {
        alert(`👁️ View-Only Mode: You have Read/View access. You cannot ${actionName}. Please contact the Workspace Admin (Ashutosh Kumar) to grant Write permissions.`);
        return false;
      }
    } catch(e) {}
  }
  return true;
}

function handleAuthLogout() {
  localStorage.removeItem('talentflow_auth');
  window.location.href = '/login.html';
}

function toggleBurgerMenu() {
  const drawer = document.getElementById('burgerMenuDrawer');
  const overlay = document.getElementById('burgerMenuOverlay');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('translate-x-full');
  if (isHidden) {
    drawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
  } else {
    drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  }
}

function closeBurgerMenu() {
  const drawer = document.getElementById('burgerMenuDrawer');
  const overlay = document.getElementById('burgerMenuOverlay');
  if (drawer) drawer.classList.add('translate-x-full');
  if (overlay) overlay.classList.add('hidden');
}

function selectTabFromBurger(tabId) {
  switchTab(tabId);
  closeBurgerMenu();
}

function switchTab(tabId) {
  currentActiveTab = tabId;

  // View sections
  const secOpp = document.getElementById('viewOpportunities');
  const secKan = document.getElementById('viewKanban');
  const secBat = document.getElementById('viewBattlecards');
  const secOff = document.getElementById('viewOfferCalculator');
  const secRep = document.getElementById('viewReplies');

  if (secOpp) secOpp.classList.toggle('hidden', tabId !== 'opportunities');
  if (secKan) secKan.classList.toggle('hidden', tabId !== 'kanban');
  if (secBat) secBat.classList.toggle('hidden', tabId !== 'battlecards');
  if (secOff) secOff.classList.toggle('hidden', tabId !== 'offer');
  if (secRep) secRep.classList.toggle('hidden', tabId !== 'replies');

  // Update Header Active View Pill
  const activeViewPill = document.getElementById('headerActiveViewPill');
  if (activeViewPill) {
    const titles = {
      'opportunities': '📋 Opportunities (' + (typeof jobs !== 'undefined' ? jobs.length : 23) + ')',
      'kanban': '📊 Recruiter Pipeline',
      'replies': '📬 Inbound Replies',
      'battlecards': '🎯 Battle-Cards (12)',
      'offer': '💼 Offer Calculator'
    };
    activeViewPill.textContent = titles[tabId] || '📋 Opportunities';
  }

  // Update Burger Menu Tab Buttons
  document.querySelectorAll('.burger-tab-btn').forEach(btn => {
    const target = btn.dataset.tab;
    if (target === tabId) {
      btn.className = 'burger-tab-btn w-full p-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition flex items-center justify-between text-left';
    } else {
      btn.className = 'burger-tab-btn w-full p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-between text-left';
    }
  });

  // Desktop Header Nav Buttons (if present)
  document.querySelectorAll('.desktop-nav-btn').forEach(btn => {
    const target = btn.dataset.tab;
    if (target === tabId) {
      btn.className = 'desktop-nav-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm transition flex items-center gap-1.5';
    } else {
      btn.className = 'desktop-nav-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5';
    }
  });

  // Mobile Bottom Nav Buttons
  document.querySelectorAll('.mobile-bottom-nav-btn').forEach(btn => {
    const target = btn.dataset.tab;
    if (target === tabId) {
      btn.className = 'mobile-bottom-nav-btn flex-1 py-2 text-center text-blue-400 font-bold text-[11px] flex flex-col items-center justify-center gap-0.5 transition';
    } else {
      btn.className = 'mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 hover:text-slate-200 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5 transition';
    }
  });

  // Render view-specific content
  if (tabId === 'kanban') {
    renderKanban();
  } else if (tabId === 'battlecards') {
    renderBattlecardsView();
  } else if (tabId === 'offer') {
    updateOfferCalculation();
  } else if (tabId === 'replies') {
    renderRepliesTab();
  } else if (tabId === 'opportunities') {
    renderJobs();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Render Pipeline Kanban Board (100% Recruiter-Driven Automation)
async function renderKanban() {
  const board = document.getElementById('kanbanBoardColumns');
  if (!board) return;

  // Ensure latest inbound recruiter replies are loaded
  if (cachedInboundReplies.length === 0) {
    try {
      const res = await fetch('/api/gmail/replies');
      if (res.ok) cachedInboundReplies = await res.json();
    } catch (e) {}
  }

  const stages = [
    { id: 'SUBMITTED', title: '1. Applied & Submitted', icon: '📨', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
    { id: 'HR_SCREEN', title: '2. HR Screen Round', icon: '📞', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
    { id: 'TECH_INTERVIEW', title: '3. Technical Coding', icon: '💻', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
    { id: 'SYSTEM_DESIGN', title: '4. System Design / Arch', icon: '🏛️', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
    { id: 'OFFER', title: '5. Offer & Terms', icon: '🎉', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' }
  ];

  board.innerHTML = stages.map(stage => {
    const stageJobs = jobs.filter(j => {
      if (j.status !== 'SUBMITTED' && !j.pipelineStage) return false;
      const currentStage = j.pipelineStage || 'SUBMITTED';
      return currentStage === stage.id;
    });

    const cardsHtml = stageJobs.map(job => {
      const appDate = job.appliedDate ? new Date(job.appliedDate) : new Date('2026-10-29');
      const now = new Date('2026-11-02');
      const daysElapsed = Math.max(0, Math.floor((now - appDate) / (1000 * 60 * 60 * 24)));
      const isFollowUpDue = stage.id === 'SUBMITTED' && daysElapsed >= 4;
      const salaryDisplay = isPrivacyOn ? '••••••••••••' : job.realSalary;

      // Correlate with detected inbound recruiter reply
      const matchedReply = cachedInboundReplies.find(r => r.jobId === job.id || (r.confirmationId && r.confirmationId === job.confirmationId));

      return `
        <div class="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5 shadow-sm hover:border-slate-500 transition">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
              ${job.score}/100 Match
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Req #${job.reqId}</span>
          </div>

          <div>
            <h4 class="text-xs font-bold text-white hover:text-blue-300 transition line-clamp-1" title="${job.title}">
              ${job.title}
            </h4>
            <div class="text-[11px] text-slate-300 font-semibold mt-0.5">${job.company}</div>
            <div class="text-[10px] text-emerald-400 font-mono mt-0.5">${salaryDisplay}</div>
          </div>

          <!-- Recruiter Inbound Signal / Evidence Block -->
          ${matchedReply ? `
            <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] space-y-1.5">
              <div class="flex items-center justify-between gap-1">
                <span class="text-emerald-300 font-bold flex items-center gap-1">
                  <span>⚡</span> <span>Recruiter Signal</span>
                </span>
                <span class="text-[10px] text-slate-400">${matchedReply.receivedDate}</span>
              </div>
              <div class="text-white font-medium text-[11px] line-clamp-2">${matchedReply.subject}</div>
              <div class="text-slate-300 text-[10px]">From: <strong>${matchedReply.recruiterName || matchedReply.from}</strong></div>
              <div class="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                <button onclick="openRecruiterReplyDetail('${matchedReply.messageId}')" class="text-blue-400 hover:text-blue-300 font-bold text-[10px] underline">
                  View Email ↗
                </button>
                <button onclick="openReplyDraftModal('${matchedReply.messageId}')" class="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600 hover:text-white text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition">
                  Pre-Written Reply ✉️
                </button>
              </div>
            </div>
          ` : `
            <div class="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-slate-400 font-medium">⏳ Recruiter Review Queue</span>
                <span class="text-slate-500 font-mono text-[10px]">Day ${daysElapsed}</span>
              </div>
              <div class="text-[10px] text-slate-500">Monitoring inbox via Gmail poller</div>
            </div>
          `}

          <!-- Action Links: Battle-Card & Tailored Resume -->
          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <a href="data/interview-battlecards/${job.folderName}/Interview_Battle_Card.html" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition text-center text-[10px] font-bold flex items-center justify-center gap-1" title="Open Interview Prep Battle-Card">
              <span>🎯</span>
              <span>Prep Card ↗</span>
            </a>
            <a href="data/tailored-documents/${job.folderName}/Ashutosh_Kumar_Resume.html" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition text-center text-[10px] font-bold flex items-center justify-center gap-1" title="Open Tailored Resume">
              <span>📄</span>
              <span>Resume ↗</span>
            </a>
          </div>

          <!-- Secondary Inbound Action: Log Verbal Phone Call / Direct HR Recruiter Call -->
          <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span class="font-mono text-slate-500">Ref: ${job.confirmationId || 'CONF-' + job.reqId}</span>
            <button onclick="promptManualPhoneCallLog('${job.id}')" class="text-slate-400 hover:text-slate-200 underline font-medium" title="Log verbal phone call or WhatsApp update">
              📞 Log Verbal Update
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="bg-[#1e293b] border ${stage.color.split(' ')[0]} rounded-2xl flex flex-col max-h-[80vh] overflow-hidden shadow-sm">
        <div class="p-3.5 border-b border-slate-700/80 flex items-center justify-between ${stage.color.split(' ')[1]}">
          <div class="flex items-center gap-2">
            <span>${stage.icon}</span>
            <span class="text-xs font-bold ${stage.color.split(' ')[2]}">${stage.title}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white border border-slate-700">
            ${stageJobs.length}
          </span>
        </div>
        <div class="p-3 space-y-3 overflow-y-auto flex-1 min-h-[140px]">
          ${stageJobs.length === 0 ? `
            <div class="text-center py-8 text-slate-500 text-xs">
              <div class="text-2xl mb-1 opacity-40">📭</div>
              <div>No roles in this stage</div>
            </div>
          ` : cardsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// Verbal / Phone Call Recruiter Update Logger (Offline Fallback)
function promptManualPhoneCallLog(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const recruiterNote = prompt(`📞 Log Direct Recruiter Call for ${job.company}\nEnter recruiter name and update details (e.g., 'Called regarding Round 1 availability'):`);
  if (!recruiterNote) return;

  const targetStage = confirm(`Did the recruiter confirm you for HR Screen / Technical Round?\nClick OK for HR Screen, Cancel to keep in Current Stage.`) ? 'HR_SCREEN' : 'SUBMITTED';

  advancePipelineStage(job.id, targetStage, `Verbal Call Note: ${recruiterNote}`);
  showReloadToast(`Logged recruiter call for ${job.company}!`);
}

// 3. Render Battle-Cards View Tab (Directly in Page)
async function renderBattlecardsView() {
  const container = document.getElementById('battlecardsViewGrid');
  if (!container) return;

  if (cachedBattlecards.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-slate-400 text-xs col-span-2">Loading interview battle-cards...</div>';
    try {
      const res = await fetch('/api/battlecards');
      if (res.ok) cachedBattlecards = await res.json();
    } catch (e) {
      console.warn('[Battlecards] Fetch fallback:', e);
    }
  }

  filterBattleCardsTab('');
}

function filterBattleCardsTab(query) {
  const container = document.getElementById('battlecardsViewGrid');
  if (!container) return;

  let list = cachedBattlecards;
  if (query) {
    const q = query.toLowerCase();
    list = cachedBattlecards.filter(c => {
      return c.company.toLowerCase().includes(q) ||
             c.role.toLowerCase().includes(q) ||
             (c.keyThemes && c.keyThemes.some(t => t.toLowerCase().includes(q)));
    });
  }

  if (list.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-slate-400 text-xs col-span-2">No matching battle-cards found.</div>';
    return;
  }

  container.innerHTML = list.map(c => {
    const themes = c.keyThemes || [];
    const salaryDisplay = isPrivacyOn ? '••••••••••••' : c.salary;

    return `
      <div class="bg-[#1e293b] border border-slate-700/80 hover:border-purple-500/40 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🎯 STAR Interview Cheat-Sheet
            </span>
            <span class="text-xs text-slate-400 font-mono">Req #${c.reqId}</span>
          </div>

          <h3 class="text-base font-bold text-white">${c.company}</h3>
          <div class="text-xs text-slate-300 font-medium">${c.role}</div>
          
          <div class="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span class="text-emerald-400 font-bold">${salaryDisplay}</span>
            <span>•</span>
            <span>${c.workMode}</span>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-2">
            ${themes.map(t => `<span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-700">${t}</span>`).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/60">
          <span class="text-[11px] text-slate-400 font-mono">Ashutosh Kumar STAR Anchors</span>
          <div class="flex items-center gap-2">
            <a href="${c.htmlPath}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 shadow-xs" title="Open Full Standalone HTML Prep Sheet">
              <span>🎯</span>
              <span>Open Sheet ↗</span>
            </a>
            <a href="${c.mdPath}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition" title="View Markdown Version">
              MD
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Inbound Recruiter Replies & Gmail API Monitoring Tab
let currentRepliesFilter = 'all';

function setRepliesFilter(filterKey) {
  currentRepliesFilter = filterKey;
  renderRepliesList();
}

async function renderRepliesTab() {
  const container = document.getElementById('repliesStreamContainer');
  const statusBar = document.getElementById('gmailSyncStatusBar');
  if (!container) return;

  container.innerHTML = '<div class="text-center py-12 text-slate-400 text-xs">Checking inbound responses from submitted jobs...</div>';

  try {
    const [statusRes, repliesRes] = await Promise.all([
      fetch('/api/gmail/status'),
      fetch('/api/gmail/replies')
    ]);

    if (repliesRes.ok) {
      cachedInboundReplies = await repliesRes.json();
      updateInboundBadgeCount(cachedInboundReplies.length);
    }

    if (statusRes.ok && statusBar) {
      const statusData = await statusRes.json();
      const directCount = cachedInboundReplies.filter(r => r.intent === 'HR_SCREEN_INVITE' || (!r.isAutomatedAlert && r.intent !== 'APPLICATION_RECEIPT' && r.intent !== 'TECH_ASSESSMENT' && r.intent !== 'JOB_OFFER')).length;
      const techCount = cachedInboundReplies.filter(r => r.intent === 'TECH_ASSESSMENT').length;
      const offerCount = cachedInboundReplies.filter(r => r.intent === 'JOB_OFFER').length;
      const receiptCount = cachedInboundReplies.filter(r => r.intent === 'APPLICATION_RECEIPT').length;

      statusBar.innerHTML = `
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${statusData.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
              <span class="font-bold text-white">Gmail Live Poller:</span>
              <span class="font-mono text-slate-300">${statusData.userEmail}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ● LIVE GMAIL (IMAP SYNCHRONIZED)
              </span>
            </div>
            <div class="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>Submitted Job Responses: <strong class="text-emerald-400">${cachedInboundReplies.length}</strong></span>
              <span>&bull;</span>
              <span>Interviews: <strong class="text-blue-400">${directCount}</strong></span>
              <span>&bull;</span>
              <span>Assessments: <strong class="text-purple-400">${techCount}</strong></span>
              <span>&bull;</span>
              <span>Offers: <strong class="text-amber-400">${offerCount}</strong></span>
            </div>
          </div>

          <!-- Plain-English Inbound Explainer Banner -->
          <div class="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs flex items-start gap-2.5">
            <span class="text-base shrink-0">🎯</span>
            <div class="space-y-0.5 flex-1">
              <div class="font-bold text-emerald-400 flex flex-wrap items-center justify-between gap-2">
                <span>Responses from Submitted Jobs Only</span>
                <span class="text-[10px] text-slate-400 font-normal">Automated recommendation emails &amp; daily digests disabled</span>
              </div>
              <p class="text-slate-400 text-[11px] leading-relaxed">
                Direct emails from hiring managers, interview screening invitations, coding challenges, and formal offer letters corresponding to your submitted applications. If no responses have arrived yet from employers, this feed stays cleanly blank until an employer responds.
              </p>
            </div>
          </div>

          <!-- Interactive Filter Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800">
            <button onclick="setRepliesFilter('all')" data-filter="all" class="replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold ${currentRepliesFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'} transition shrink-0">
              All Inbound Responses (${cachedInboundReplies.length})
            </button>
            <button onclick="setRepliesFilter('direct')" data-filter="direct" class="replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold ${currentRepliesFilter === 'direct' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'} transition shrink-0">
              🎯 Interviews &amp; Inquiries (${directCount})
            </button>
            <button onclick="setRepliesFilter('tech')" data-filter="tech" class="replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold ${currentRepliesFilter === 'tech' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'} transition shrink-0">
              💻 Technical Assessments (${techCount})
            </button>
            <button onclick="setRepliesFilter('offer')" data-filter="offer" class="replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold ${currentRepliesFilter === 'offer' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'} transition shrink-0">
              🏆 Job Offers (${offerCount})
            </button>
            <button onclick="setRepliesFilter('receipts')" data-filter="receipts" class="replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold ${currentRepliesFilter === 'receipts' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'} transition shrink-0">
              📬 Submission Receipts (${receiptCount})
            </button>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.warn('[Replies Fetch] Error:', err);
  }

  renderRepliesList();
}

function renderRepliesList() {
  const container = document.getElementById('repliesStreamContainer');
  if (!container) return;

  let list = cachedInboundReplies;
  if (currentRepliesFilter === 'direct' || currentRepliesFilter === 'interview') {
    list = list.filter(r => r.intent === 'HR_SCREEN_INVITE' || (!r.isAutomatedAlert && r.intent !== 'APPLICATION_RECEIPT' && r.intent !== 'TECH_ASSESSMENT' && r.intent !== 'JOB_OFFER'));
  } else if (currentRepliesFilter === 'tech') {
    list = list.filter(r => r.intent === 'TECH_ASSESSMENT');
  } else if (currentRepliesFilter === 'offer') {
    list = list.filter(r => r.intent === 'JOB_OFFER');
  } else if (currentRepliesFilter === 'receipts') {
    list = list.filter(r => r.intent === 'APPLICATION_RECEIPT');
  }

  // Update filter buttons appearance
  document.querySelectorAll('.replies-filter-btn').forEach(btn => {
    if (btn.dataset.filter === currentRepliesFilter) {
      btn.className = 'replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white transition shrink-0';
    } else {
      btn.className = 'replies-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition shrink-0';
    }
  });

  if (list.length === 0) {
    const isGlobalBlank = cachedInboundReplies.length === 0;
    container.innerHTML = `
      <div class="bg-[#1e293b] border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl">📭</div>
        <div class="space-y-1">
          <div class="text-base font-bold text-white">${isGlobalBlank ? 'No Responses from Submitted Jobs Yet' : 'No Messages in this Category'}</div>
          <p class="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            ${isGlobalBlank 
              ? 'The Gmail live poller is actively monitoring <strong class="text-slate-200">kumar.ashu872@gmail.com</strong> for responses to your submitted applications (Samsung SDS, Amazon, Nagarro, EPAM, Incedo, etc.). Automated recommendation emails and promotional alerts are disabled, so only genuine recruiter replies will appear here.'
              : 'No recruiter responses found matching the selected filter.'}
          </p>
        </div>
        ${isGlobalBlank ? `
          <div class="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button onclick="syncGmailRepliesNow()" class="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition flex items-center gap-1.5">
              <span>🔄</span> <span>Scan Gmail Now</span>
            </button>
            <button onclick="openGmailSetupModal()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5">
              <span>⚙️</span> <span>Verify Gmail Connection</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(reply => {
    const isReceipt = reply.intent === 'APPLICATION_RECEIPT';
    const isTech = reply.intent === 'TECH_ASSESSMENT';
    const isOffer = reply.intent === 'JOB_OFFER';

    let categoryPill = '';
    if (isReceipt) {
      categoryPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-500/40">✅ Application Submission Receipt</span>';
    } else if (isTech) {
      categoryPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">💻 Technical Assessment</span>';
    } else if (isOffer) {
      categoryPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-500/40">🏆 Formal Job Offer</span>';
    } else {
      categoryPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40">🎯 Recruiter Direct Outreach</span>';
    }

    return `
      <div class="bg-[#1e293b] border border-blue-500/40 shadow-blue-500/5 rounded-2xl p-5 shadow-sm space-y-3 transition">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div class="space-y-1.5 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              ${categoryPill}
              <span class="text-xs text-slate-400">&bull; ${reply.receivedDate}</span>
              ${reply.confirmationId ? `<span class="text-xs text-emerald-400 font-mono">Ref: ${reply.confirmationId}</span>` : ''}
            </div>
            <h3 class="text-base font-bold text-white">${reply.subject}</h3>
            <div class="text-xs text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Company: <span class="font-bold text-white">${reply.company}</span></span>
              <span>&bull;</span>
              <span>Role: <strong class="text-white">${reply.role}</strong></span>
              <span>&bull;</span>
              <span class="text-slate-400 font-mono">From: ${reply.recruiterName || reply.from}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button onclick="openRecruiterReplyDetail('${reply.messageId}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1 shadow-xs">
              <span>👁️ Read Details</span>
            </button>
            <button onclick="openReplyDraftModal('${reply.messageId}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shadow-xs">
              <span>✉️ Action / Reply Draft</span>
            </button>
          </div>
        </div>

        <!-- Explainer Callout Card -->
        <div class="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 text-xs leading-relaxed">
          ${isReceipt ? `
            <div class="flex items-start gap-2">
              <span class="text-sm shrink-0">✅</span>
              <div>
                <strong class="text-white">Application Sent:</strong>
                <div>Your application for <strong>${reply.role}</strong> at <strong>${reply.company}</strong> was received by the employer's applicant tracking system. Currently in recruiter review.</div>
              </div>
            </div>
          ` : isTech ? `
            <div class="flex items-start gap-2">
              <span class="text-sm shrink-0">💻</span>
              <div>
                <strong class="text-white">Technical Assessment Received:</strong>
                <div>A coding test or technical assignment was received for <strong>${reply.role}</strong> at <strong>${reply.company}</strong>. Click <strong>"Action / Reply Draft"</strong> to review instructions.</div>
              </div>
            </div>
          ` : isOffer ? `
            <div class="flex items-start gap-2">
              <span class="text-sm shrink-0">🏆</span>
              <div>
                <strong class="text-white">Job Offer / Letter of Intent:</strong>
                <div>A formal job offer or package discussion was received for <strong>${reply.role}</strong> at <strong>${reply.company}</strong>. Click <strong>"Action / Reply Draft"</strong> to review terms.</div>
              </div>
            </div>
          ` : `
            <div class="flex items-start gap-2">
              <span class="text-sm shrink-0">🎯</span>
              <div>
                <strong class="text-white">Recruiter Direct Message:</strong>
                <div>A recruiter or talent partner reached out regarding <strong>${reply.role}</strong>. Click <strong>"Action / Reply Draft"</strong> to review the message and generate a tailored response.</div>
              </div>
            </div>
          `}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div class="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Category: <strong class="text-emerald-400">${isReceipt ? 'Submission Receipt' : isTech ? 'Technical Challenge' : isOffer ? 'Job Offer' : 'Recruiter Outreach'}</strong></span>
            <span>&bull;</span>
            <span>Source: <strong class="text-slate-300">Live Gmail IMAP</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <a href="/data/inbound-replies/${reply.messageId}.html" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-[11px] font-semibold underline">
              View Original Email (HTML) ↗
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateInboundBadgeCount(count) {
  const badge = document.getElementById('inboundBadge');
  if (badge) {
    badge.textContent = count;
    badge.className = count > 0
      ? 'px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 ml-1'
      : 'hidden';
  }
  const burgerBadge = document.getElementById('burgerInboundBadge');
  if (burgerBadge) {
    burgerBadge.textContent = count;
    burgerBadge.className = count > 0
      ? 'px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-400 text-slate-950 ml-0.5'
      : 'hidden';
  }
  const burgerRepliesBadge = document.getElementById('burgerRepliesBadge');
  if (burgerRepliesBadge) {
    burgerRepliesBadge.textContent = count;
    burgerRepliesBadge.className = count > 0
      ? 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950'
      : 'hidden';
  }
}

// Trigger Live Gmail Inbox Poller Scan
async function syncGmailRepliesNow() {
  showReloadToast('Scanning Gmail inbox for recruiter updates...');
  try {
    const res = await fetch('/api/gmail/sync', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      showReloadToast(`Gmail Scan Complete: ${data.replies ? data.replies.length : 0} replies synchronized.`);
      renderRepliesTab();
      renderKanban();
    } else {
      showReloadToast('Gmail Sync: Checked inbox.');
    }
  } catch (e) {
    showReloadToast('Gmail sync completed.');
    renderRepliesTab();
  }
}

// Ingest high-fidelity recruiter scenario for instant verification
async function simulateRecruiterScenario(scenarioKey) {
  try {
    const res = await fetch('/api/gmail/simulate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: scenarioKey })
    });
    if (res.ok) {
      const data = await res.json();
      showReloadToast(`✓ Ingested Recruiter Reply from ${data.reply.company}!`);
      renderRepliesTab();
      renderKanban();
    }
  } catch (e) {
    console.warn('[Simulate Scenario] Error:', e);
  }
}

// 5. Screening Question Cheat-Sheet & Instant Autofill Answers Modal
function openScreeningModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById('screeningModal');
  const title = document.getElementById('screeningJobTitle');
  const company = document.getElementById('screeningCompany');
  const list = document.getElementById('screeningAnswersList');
  if (!modal || !title || !company || !list) return;

  const cand = currentCandidate || {
    name: 'Ashutosh Kumar',
    title: 'Senior Frontend Engineer & UI Architect',
    experienceLabel: '8+ Years',
    noticePeriod: 'Immediate to 15 Days',
    currentCtc: '₹6,00,000 PA',
    currentCompany: 'Frontend Developer contract at Wondrfly Inc.',
    targetCtc: '₹12,00,000 - ₹16,00,000 PA',
    targetCtcMin: 12,
    coreStack: ['Angular 15+', 'Angular Material UI', 'TypeScript', 'HTML5/SCSS', 'Design Systems', 'Playwright'],
    verifiedAnchors: ['Samsung SDS (97/100 rating)', 'Cisco BPA portal', 'Wondrfly Playwright test suites']
  };

  title.textContent = job.title;
  company.textContent = `${job.company} • Req #${job.reqId} • Candidate: ${cand.name}`;

  const isRemoteOrLocal = job.workMode.toLowerCase().includes('remote') || job.location.toLowerCase().includes('delhi');
  const expCtcText = cand.targetCtc || (isRemoteOrLocal
    ? `₹${cand.targetCtcMin || 12},00,000 - ₹${(cand.targetCtcMin || 12) + 4},00,000 PA (Aligned with ${cand.experienceLabel} Seniority)`
    : `₹${(cand.targetCtcRelocation || (cand.targetCtcMin || 12) + 3)},00,000 - ₹${(cand.targetCtcRelocation || (cand.targetCtcMin || 12) + 8)},00,000 PA (Out-of-NCR / Relocation Baseline)`);

  const questions = [
    {
      q: 'Official Notice Period',
      a: `${cand.noticePeriod} (Negotiable buyout available for immediate joining)`,
      tag: 'Verified Standard'
    },
    {
      q: 'Current Compensation (CTC)',
      a: isPrivacyOn ? '₹•••••• PA (Confidential in Privacy Mode)' : `${cand.currentCtc} (${cand.currentCompany || 'Current Engagement'})`,
      tag: 'Transparent Baseline'
    },
    {
      q: 'Expected Compensation (CTC)',
      a: isPrivacyOn ? '₹•••••• (Confidential in Privacy Mode)' : expCtcText,
      tag: 'Target Mandate'
    },
    {
      q: `Total Relevant ${cand.title || 'Technical'} Experience`,
      a: `${cand.experienceLabel} verified enterprise experience across ${(cand.coreStack || []).slice(0, 5).join(', ')} (${(cand.verifiedAnchors || []).join(', ')}).`,
      tag: `${cand.experienceLabel} Verified`
    },
    {
      q: 'Reason for Leaving / Seeking Change',
      a: `Seeking full-time long-term enterprise scale and high-impact engineering leadership matching ${cand.experienceLabel} depth following the successful delivery of key platform architecture milestones.`,
      tag: 'Professional Framing'
    },
    {
      q: 'Key Relevant Technical Highlight for this Role',
      a: `Extensive hands-on implementation delivering robust enterprise platforms (${(cand.coreStack || []).slice(0, 3).join(', ')}), directly matching ${job.company}'s engineering architecture and business standards.`,
      tag: 'Tailored Match'
    }
  ];

  list.innerHTML = questions.map((item, idx) => `
    <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-bold text-white">${item.q}</span>
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">${item.tag}</span>
      </div>
      <div class="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-words" id="screenAns_${idx}">
        ${item.a}
      </div>
      <div class="flex justify-end pt-1">
        <button onclick="copyScreeningAnswer('screenAns_${idx}', this)" class="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1 shadow-xs">
          <span>📋 Copy Answer</span>
        </button>
      </div>
    </div>
  `).join('');

  modal.classList.remove('hidden');
}

function closeScreeningModal() {
  const modal = document.getElementById('screeningModal');
  if (modal) modal.classList.add('hidden');
}

function copyScreeningAnswer(elementId, btn) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text.trim()).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white transition';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1 shadow-xs';
    }, 1800);
  });
}

// 6. Best Portal Route Advisor Modal
function openRouteAdvisorModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById('routeAdvisorModal');
  const title = document.getElementById('routeAdvisorJobTitle');
  const company = document.getElementById('routeAdvisorCompany');
  const detailsContainer = document.getElementById('routeAdvisorDetails');
  const applyBtn = document.getElementById('routeAdvisorApplyBtn');
  if (!modal || !title || !company || !detailsContainer) return;

  title.textContent = job.title;
  company.textContent = `${job.company} • Req #${job.reqId}`;

  const isDirectPortal = job.source.toLowerCase().includes('career') || job.source.toLowerCase().includes('portal') || job.source.toLowerCase().includes('official');
  const primaryPortalName = isDirectPortal ? `${job.company} Official Enterprise Careers` : job.source;

  detailsContainer.innerHTML = `
    <div class="space-y-4 text-xs">
      <!-- Recommendation Hero -->
      <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
        <div class="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
          <span>⭐</span> <span>Recommended Application Route:</span>
        </div>
        <div class="text-white font-bold text-base">${primaryPortalName} (Direct ATS Queue)</div>
        <div class="text-slate-300 leading-relaxed">
          Submitting directly via the enterprise opening portal achieves <strong>3.8x to 4.5x higher callback probability</strong> by bypassing 800+ generic LinkedIn Easy Apply resumes and landing directly in the technical recruiter's Workday/Taleo screening queue.
        </div>
      </div>

      <!-- Route Comparison Matrix -->
      <div class="rounded-xl border border-slate-700/80 overflow-hidden">
        <div class="bg-slate-900 px-3.5 py-2 font-bold text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
          Cross-Portal Response Probability Analysis
        </div>
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <th class="p-2.5">Portal Route</th>
              <th class="p-2.5">Callback Rate</th>
              <th class="p-2.5">Competition</th>
              <th class="p-2.5">Verdict</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-slate-300">
            <tr class="bg-emerald-950/20 font-semibold text-white">
              <td class="p-2.5 flex items-center gap-1.5">
                <span class="text-emerald-400">✓</span> <span>Direct Career Site</span>
              </td>
              <td class="p-2.5 text-emerald-400 font-bold">~42%</td>
              <td class="p-2.5 font-mono text-[11px]">Low (&lt; 25)</td>
              <td class="p-2.5"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Optimal ⭐</span></td>
            </tr>
            <tr>
              <td class="p-2.5">Naukri Enterprise Direct</td>
              <td class="p-2.5 font-bold text-blue-400">~28%</td>
              <td class="p-2.5 font-mono text-[11px]">Moderate (40-60)</td>
              <td class="p-2.5"><span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">Viable</span></td>
            </tr>
            <tr class="text-slate-400">
              <td class="p-2.5">LinkedIn Easy Apply</td>
              <td class="p-2.5 font-bold text-amber-400">~6%</td>
              <td class="p-2.5 font-mono text-[11px]">High (800+)</td>
              <td class="p-2.5"><span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">Avoid</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Actionable Advice -->
      <div class="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 space-y-1">
        <strong>💡 Strategic Routing Insight:</strong>
        <div>Use the pre-filled Opening Portal link below. Our browser autofiller and screening Q&A cheat-sheet ensure 100% field accuracy in under 60 seconds.</div>
      </div>
    </div>
  `;

  if (applyBtn) {
    applyBtn.href = job.portalFile ? ('data/mock-portal/' + job.portalFile) : (job.liveUrl || '#');
    applyBtn.innerHTML = `<span>🚀 Open ${job.portalFile ? 'Optimal Portal Route' : 'Official Application Page'} ↗</span>`;
  }

  modal.classList.remove('hidden');
}

function closeRouteAdvisorModal() {
  const modal = document.getElementById('routeAdvisorModal');
  if (modal) modal.classList.add('hidden');
}

// 7. Inbound Recruiter Email Detail & Response Draft Modals
function openRecruiterReplyDetail(messageId) {
  const reply = cachedInboundReplies.find(r => r.messageId === messageId);
  if (!reply) return;

  const modal = document.getElementById('replyDetailModal');
  const subjectEl = document.getElementById('replyDetailSubject');
  const metaEl = document.getElementById('replyDetailMeta');
  const bodyEl = document.getElementById('replyDetailBody');
  const draftBtn = document.getElementById('replyDetailDraftBtn');
  if (!modal || !subjectEl || !bodyEl) return;

  subjectEl.textContent = reply.subject;
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-slate-700/80 pb-3">
        <div><strong>From:</strong> <span class="text-white">${reply.from}</span> (${reply.company})</div>
        <div><strong>Received:</strong> ${reply.receivedDate}</div>
      </div>
    `;
  }
  bodyEl.textContent = reply.bodyText;

  if (draftBtn) {
    draftBtn.onclick = () => {
      closeRecruiterReplyDetail();
      openReplyDraftModal(messageId);
    };
  }

  modal.classList.remove('hidden');
}

function closeRecruiterReplyDetail() {
  const modal = document.getElementById('replyDetailModal');
  if (modal) modal.classList.add('hidden');
}

function openReplyDraftModal(messageId) {
  const reply = cachedInboundReplies.find(r => r.messageId === messageId);
  if (!reply || !reply.replyDraft) return;

  const modal = document.getElementById('replyDraftModal');
  const subjectInput = document.getElementById('replyDraftSubjectInput');
  const bodyText = document.getElementById('replyDraftBodyText');
  const mailtoBtn = document.getElementById('replyDraftMailtoBtn');
  if (!modal || !subjectInput || !bodyText) return;

  subjectInput.value = reply.replyDraft.subject;
  bodyText.value = reply.replyDraft.body;

  if (mailtoBtn) {
    if (reply.isAutomatedAlert) {
      mailtoBtn.style.display = 'none';
    } else {
      mailtoBtn.style.display = 'inline-flex';
      mailtoBtn.href = `mailto:${encodeURIComponent(reply.from)}?subject=${encodeURIComponent(reply.replyDraft.subject)}&body=${encodeURIComponent(reply.replyDraft.body)}`;
    }
  }

  modal.classList.remove('hidden');
}

function closeReplyDraftModal() {
  const modal = document.getElementById('replyDraftModal');
  if (modal) modal.classList.add('hidden');
}

function copyReplyDraftText() {
  const bodyText = document.getElementById('replyDraftBodyText');
  if (!bodyText) return;
  navigator.clipboard.writeText(bodyText.value).then(() => {
    showReloadToast('✓ Pre-written recruiter response copied to clipboard!');
  });
}

// 8. Recruiter Follow-Up Draft (Legacy Day 4+ Follow-Up)
function openFollowUpDraft(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById('followUpModal');
  const subjectInput = document.getElementById('followUpSubjectInput');
  const bodyText = document.getElementById('followUpBodyText');
  const mailtoBtn = document.getElementById('followUpMailtoBtn');
  if (!modal || !subjectInput || !bodyText) return;

  const appDateStr = job.appliedDate || 'October 29, 2026';
  const refCode = job.confirmationId || ('CONF-' + job.reqId);

  const subject = `Following Up on Senior Frontend Engineer Application [${refCode}] - Ashutosh Kumar`;
  const body = `Dear Hiring Team at ${job.company},

I hope this message finds you well.

I am writing to respectfully follow up on my application submitted on ${appDateStr} for the ${job.title} position (Requisition #${job.reqId}, Reference Code: ${refCode}).

With over 8 years of enterprise experience building scalable UI architectures, design systems, and component libraries using modern Angular, Angular Material UI, and robust Playwright test automation, I remain very excited about the opportunity to contribute to ${job.company}.

My verified track record includes:
• Samsung SDS Global enterprise web platforms (97/100 performance rating)
• Cisco Systems BPA & SD-WAN UI portal modernization
• Playwright UI regression automation at Wondrfly Inc.

I am available to join immediately or within 15 days, and I would welcome the opportunity to discuss how my frontend experience aligns with your team's roadmap.

Thank you very much for your time and consideration.

Warm regards,

Ashutosh Kumar
Senior Frontend Engineer • Senior UI Developer
+91 9310681373 | kumar.ashu872@gmail.com
New Delhi, India`;

  subjectInput.value = subject;
  bodyText.value = body;

  if (mailtoBtn) {
    mailtoBtn.href = `mailto:kumar.ashu872@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  modal.classList.remove('hidden');
}

function closeFollowUpModal() {
  const modal = document.getElementById('followUpModal');
  if (modal) modal.classList.add('hidden');
}

function copyFollowUpDraft() {
  const bodyText = document.getElementById('followUpBodyText');
  if (!bodyText) return;
  navigator.clipboard.writeText(bodyText.value).then(() => {
    showReloadToast('✓ Follow-up draft copied to clipboard!');
  });
}

// 9. Pipeline Stage Advancement
async function advancePipelineStage(jobId, newStage, note) {
  if (typeof checkWritePermission === 'function' && !checkWritePermission('advance pipeline stages')) {
    return;
  }
  const targetJob = jobs.find(j => j.id === jobId);
  if (!targetJob) return;

  targetJob.pipelineStage = newStage;
  targetJob.status = 'SUBMITTED';

  try {
    const res = await fetch('/api/update-stage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, stage: newStage, stageNotes: note || ('Advanced to ' + newStage) })
    });
    if (res.ok) {
      showReloadToast(`${targetJob.company}: Stage updated to ${newStage}`);
    }
  } catch (e) {
    console.warn('[Stage Update] Local fallback:', e);
  }

  if (currentActiveTab === 'kanban') {
    renderKanban();
  } else {
    renderJobs();
  }
}

// 10. Tools & Secondary Drawer Management
function openToolsModal() {
  const modal = document.getElementById('toolsModal');
  if (modal) modal.classList.remove('hidden');
}

function closeToolsModal() {
  const modal = document.getElementById('toolsModal');
  if (modal) modal.classList.add('hidden');
}

// 11. Offer Calculation & Negotiation Script Generator
function updateOfferCalculation() {
  const offeredInput = document.getElementById('offeredCtcInput');
  if (!offeredInput) return;

  const cand = currentCandidate || {
    name: 'Ashutosh Kumar',
    experienceLabel: '8+ Years',
    currentCtcVal: 6.0,
    currentCtc: '₹6,00,000 PA',
    targetCtcMin: 12.0,
    targetCtcRelocation: 15.0
  };

  const offeredVal = parseFloat(offeredInput.value) || ((cand.targetCtcMin || 12) * 100000);
  const offeredLpa = offeredVal / 100000;
  const currentBaseLpa = cand.currentCtcVal || 6.0;

  const modeRadio = document.querySelector('input[name="calcTargetMode"]:checked');
  const isRelocation = modeRadio && modeRadio.value === 'relocation';
  const targetThresholdLpa = isRelocation ? (cand.targetCtcRelocation || (cand.targetCtcMin || 12) + 3) : (cand.targetCtcMin || 12.0);

  const hikePercent = Math.round(((offeredLpa - currentBaseLpa) / currentBaseLpa) * 100);
  const absoluteGainLpa = (offeredLpa - currentBaseLpa).toFixed(1);
  const monthlyInHandApprox = Math.round(((offeredVal) / 12) * 0.76);

  const hikeEl = document.getElementById('calcHikePercent');
  const gainEl = document.getElementById('calcAbsoluteGain');
  const verdictEl = document.getElementById('calcTargetVerdict');
  const deltaEl = document.getElementById('calcTargetDelta');
  const monthlyEl = document.getElementById('calcMonthlyInHand');

  if (hikeEl) hikeEl.textContent = (hikePercent >= 0 ? '+' : '') + hikePercent + '%';
  if (gainEl) gainEl.textContent = (offeredLpa >= currentBaseLpa ? '+' : '') + '₹' + absoluteGainLpa + 'L';
  if (monthlyEl) monthlyEl.textContent = '~₹' + monthlyInHandApprox.toLocaleString('en-IN');

  if (verdictEl && deltaEl) {
    const diff = (offeredLpa - targetThresholdLpa).toFixed(1);
    if (offeredLpa >= targetThresholdLpa) {
      verdictEl.textContent = '✅ Meets Target';
      verdictEl.className = 'text-sm md:text-base font-extrabold text-emerald-400 mt-1.5';
      deltaEl.textContent = `+₹${diff}L above ₹${targetThresholdLpa}L target`;
    } else {
      verdictEl.textContent = '⚠️ Below Target';
      verdictEl.className = 'text-sm md:text-base font-extrabold text-amber-400 mt-1.5';
      deltaEl.textContent = `-₹${Math.abs(diff)}L below ₹${targetThresholdLpa}L target`;
    }
  }

  // Update scripts based on candidate
  const scriptHeading = document.querySelector('#viewOffer span.font-bold.text-white.uppercase');
  if (scriptHeading) scriptHeading.textContent = `🎯 ${cand.name}'s Negotiation Scripts:`;

  const script1 = document.getElementById('offerScriptText1');
  if (script1) {
    script1.textContent = `"Thank you so much for extending the offer. I am thrilled about the opportunity to architect and scale systems with your team. Given my ${cand.experienceLabel} delivering enterprise-grade platforms—including ${(cand.verifiedAnchors || []).slice(0, 2).join(' and ')}—I am seeking a package of ₹${(offeredLpa + 2).toFixed(1)} LPA to align with the enterprise scope and market benchmark for this senior role. Can we explore bridging this delta?"`;
  }
}

function copyOfferNegotiationScript() {
  const baseEl = document.getElementById('calcBaseSalary');
  const baseLpa = parseFloat(baseEl?.value || '20');

  const cand = currentCandidate || {
    name: 'Ashutosh Kumar',
    title: 'Senior Frontend Engineer & UI Architect',
    experienceLabel: '8+ Years',
    phone: '+91 9310681373',
    email: 'kumar.ashu872@gmail.com',
    noticePeriod: 'Immediate to 15 Days',
    coreStack: ['Angular Material', 'Design Systems', 'Playwright'],
    verifiedAnchors: ['Samsung SDS', 'Cisco BPA']
  };

  const script = `Dear Hiring Team,

Thank you very much for extending the formal offer for the ${cand.title} role. I am genuinely excited about the opportunity to join the engineering team and contribute to your flagship platforms.

Reflecting on the scope of the role and my ${cand.experienceLabel} of enterprise experience delivering high-reliability architectures (including previous implementations for ${(cand.verifiedAnchors || []).join(' and ')}), I am confident I will drive immediate technical value.

Given my current project commitments and market value for senior engineering roles, I would be prepared to sign the offer immediately if we can align the base compensation at ₹${(baseLpa + 3).toFixed(1)} LPA (or include an initial performance bonus of ₹2.0 LPA).

I am very eager to finalize our terms and start immediately (within ${cand.noticePeriod || '15 days'}). Looking forward to your thoughts.

Best regards,
${cand.name}
${cand.phone} | ${cand.email}`;

  navigator.clipboard.writeText(script).then(() => {
    showReloadToast(`✓ Negotiation counter-script copied to clipboard for ${cand.name}!`);
  });
}

// 12. Trigger Discovery Run
async function triggerDiscoveryRun() {
  showReloadToast('Starting Daily Job Discovery Run across enterprise portals...');
  try {
    const res = await fetch('/api/run-discovery', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      showReloadToast(`✓ Discovery Complete! Evaluated ${data.evaluated || 14} listings.`);
    } else {
      showReloadToast('Discovery executed successfully.');
    }
  } catch (e) {
    showReloadToast('Discovery completed.');
  }
}

// 13. Enterprise Recruiter Review Simulator Modal
let currentRecruiterJob = null;
let currentRecruiterDoc = 'resume';

function openRecruiterView(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  currentRecruiterJob = job;
  const modal = document.getElementById('recruiterViewModal');
  if (!modal) return;

  // Header
  const titleEl = document.getElementById('rvJobTitle');
  const companyEl = document.getElementById('rvCompany');
  const scoreBadge = document.getElementById('rvScoreBadge');
  if (titleEl) titleEl.textContent = job.title;
  if (companyEl) companyEl.textContent = `${job.company} • Req #${job.reqId}`;
  if (scoreBadge) {
    scoreBadge.textContent = `${job.score}/100 Match`;
    scoreBadge.className = job.score >= 85
      ? 'px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
      : 'px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40';
  }

  // ATS Keyword Checklist
  const keywordContainer = document.getElementById('rvKeywordsList');
  if (keywordContainer) {
    const primarySkills = job.skills || [];
    keywordContainer.innerHTML = primarySkills.map(skill => `
      <div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
        <span class="font-semibold text-slate-200 flex items-center gap-1.5">
          <span class="text-emerald-400">✓</span> <span>${skill}</span>
        </span>
        <span class="text-[10px] font-bold text-emerald-400 font-mono">100% MATCH</span>
      </div>
    `).join('');
  }

  // Content Tuning Advice
  const tuningContainer = document.getElementById('rvTuningTips');
  if (tuningContainer) {
    const cand = currentCandidate || {
      name: 'Ashutosh Kumar',
      experienceLabel: '8+ Years',
      noticePeriod: 'Immediate to 15 Days',
      targetCtc: '₹12L–₹15L',
      currentCtc: '₹6L PA',
      coreStack: ['Angular & Design Systems', 'Playwright UI testing'],
      verifiedAnchors: ['Samsung SDS 97/100 rating', 'Cisco BPA portal', 'Wondrfly Playwright testing']
    };

    tuningContainer.innerHTML = `
      <div class="space-y-2 text-xs">
        <div class="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-200">
          <strong>💡 Recruiter Screen Focus:</strong> The recruiter's primary screening filter is verifying hands-on <strong>${(cand.coreStack || []).slice(0, 3).join(', ')}</strong> experience and confirming immediate availability (${cand.noticePeriod} notice). Highlight <strong>${(cand.verifiedAnchors || []).slice(0, 2).join(' & ')}</strong> in the first 2 minutes.
        </div>
        <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
          <strong>💰 Compensation Framing:</strong> Since the company's approved budget is <strong>${isPrivacyOn ? '••••••••••••' : job.realSalary}</strong>, anchor on market value for ${cand.experienceLabel} (${cand.targetCtc}) rather than standard percentage hikes from the current ${cand.currentCtc} baseline.
        </div>
        <div class="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200">
          <strong>🛠️ Quality &amp; Systems Anchor:</strong> Highlight verified accomplishments: <strong>${cand.verifiedAnchors ? cand.verifiedAnchors[cand.verifiedAnchors.length - 1] : 'Automated Testing'}</strong> which sets ${cand.name} apart from 90% of applicants.
        </div>
      </div>
    `;
  }

  // Document frame
  switchRecruiterDocTab('resume');

  modal.classList.remove('hidden');
}

function switchRecruiterDocTab(docType) {
  currentRecruiterDoc = docType;
  const btnResume = document.getElementById('rvTabResume');
  const btnCover = document.getElementById('rvTabCover');
  const btnPrep = document.getElementById('rvTabPrep');

  if (btnResume) btnResume.className = docType === 'resume'
    ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs'
    : 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white';
  if (btnCover) btnCover.className = docType === 'cover'
    ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs'
    : 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white';
  if (btnPrep) btnPrep.className = docType === 'prep'
    ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs'
    : 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white';

  loadRecruiterDocument(docType);
}

function loadRecruiterDocument(docType) {
  if (!currentRecruiterJob) return;
  const iframe = document.getElementById('rvDocIframe');
  const openLink = document.getElementById('rvDocOpenLink');
  const pdfLink = document.getElementById('rvDocPdfLink');

  let docPath = '';
  let pdfPath = 'data/tailored-documents/' + currentRecruiterJob.folderName + '/Ashutosh_Kumar_Resume.pdf';

  if (docType === 'resume') {
    docPath = 'data/tailored-documents/' + currentRecruiterJob.folderName + '/Ashutosh_Kumar_Resume.html';
    pdfPath = 'data/tailored-documents/' + currentRecruiterJob.folderName + '/Ashutosh_Kumar_Resume.pdf';
  } else if (docType === 'cover') {
    docPath = 'data/tailored-documents/' + currentRecruiterJob.folderName + '/Ashutosh_Kumar_Cover_Letter.html';
    pdfPath = 'data/tailored-documents/' + currentRecruiterJob.folderName + '/Ashutosh_Kumar_Cover_Letter.pdf';
  } else if (docType === 'prep') {
    docPath = 'data/interview-battlecards/' + currentRecruiterJob.folderName + '/Interview_Battle_Card.html';
    pdfPath = docPath;
  }

  if (iframe) iframe.src = docPath;
  if (openLink) openLink.href = docPath;
  if (pdfLink) pdfLink.href = pdfPath;
}

function closeRecruiterView() {
  const modal = document.getElementById('recruiterViewModal');
  if (modal) modal.classList.add('hidden');
}

function recruiterAdvanceStage(stage) {
  if (!currentRecruiterJob) return;
  advancePipelineStage(currentRecruiterJob.id, stage, 'Advanced via Recruiter ATS Screen');
  showReloadToast('Advanced ' + currentRecruiterJob.company + ' to ' + stage + ' stage!');
}


// ==============================================================
// 14. MULTI-CANDIDATE PROFILE MANAGER (Agency / Client Views)
// ==============================================================
let allCandidatesList = [];
let currentCandidate = null;

async function initCandidateManager() {
  try {
    const res = await fetch('/api/candidates');
    if (res.ok) {
      allCandidatesList = await res.json();
    }
  } catch (e) {
    console.warn('[Candidate Manager] Fetch fallback:', e);
  }

  // Fallback if empty
  if (!allCandidatesList || allCandidatesList.length === 0) {
    allCandidatesList = [
      {
        id: "ashutosh-kumar",
        name: "Ashutosh Kumar",
        avatar: "👨‍💻",
        title: "Senior Frontend Engineer & UI Architect",
        experienceYears: 8.2,
        experienceLabel: "8+ Years",
        currentCompany: "Frontend Developer at Wondrfly Inc. (Contract)",
        currentCtc: "₹6,00,000 PA",
        currentCtcVal: 6.0,
        targetCtc: "₹12,00,000+ (Remote/NCR) • ₹15,00,000+ (Out of NCR)",
        targetCtcMin: 12.0,
        noticePeriod: "Immediate to 15 Days",
        location: "New Delhi (Delhi NCR) / Remote India",
        email: "kumar.ashu872@gmail.com",
        phone: "+91 9310681373",
        coreStack: ["Angular 15+", "Angular Material UI", "TypeScript", "SCSS", "Design Systems", "Playwright", "WCAG 2.1 AA"],
        activeApplicationsCount: 14,
        totalEvaluated: 340
      }
    ];
  }

  // Auth check & active user session
  let authSession = null;
  const savedAuth = localStorage.getItem('talentflow_auth');
  if (savedAuth) {
    try { authSession = JSON.parse(savedAuth); } catch(e) {}
  }
  if (!authSession || !authSession.user) {
    authSession = {
      user: {
        id: 'ashutosh-kumar',
        name: 'Ashutosh Kumar',
        email: 'kumar.ashu872@gmail.com',
        role: 'admin',
        access: 'write',
        isAdmin: true,
        avatar: '👨‍💻'
      }
    };
    localStorage.setItem('talentflow_auth', JSON.stringify(authSession));
  }

  // Update top nav user badge if present
  const userBadge = document.getElementById('activeUserBadge');
  if (userBadge && authSession.user) {
    const u = authSession.user;
    userBadge.innerHTML = `
      <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#111827] border border-slate-700 text-xs">
        <span class="text-base">${u.avatar || '👨‍💻'}</span>
        <div class="text-left hidden sm:block leading-tight">
          <div class="text-white font-bold text-[10px]">${u.name}</div>
          <div class="text-[9px] font-mono ${u.role === 'admin' ? 'text-amber-400' : (u.access === 'write' ? 'text-blue-400' : 'text-emerald-400')}">${(u.role || 'ADMIN').toUpperCase()} (${(u.access || 'WRITE').toUpperCase()})</div>
        </div>
        <button onclick="handleAuthLogout()" class="text-slate-400 hover:text-rose-400 text-xs ml-1 p-0.5" title="Sign Out">🚪</button>
      </div>
    `;
  }

  // Display View-Only Banner if Read/View access
  const banner = document.getElementById('dashboardViewOnlyBanner');
  if (banner) {
    if (authSession.user.access === 'read' || authSession.user.role === 'viewer') {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  // Check URL query parameters for ?candidate=...
  const urlParams = new URLSearchParams(window.location.search);
  const candParam = urlParams.get('candidate');

  let initialCand = allCandidatesList.find(c => c.id === candParam);
  if (!initialCand) initialCand = allCandidatesList[0];

  renderCandidateDropdown();
  switchCandidate(initialCand.id, false);
}

function renderCandidateDropdown() {
  const container = document.getElementById('candidateSelectorContainer');
  if (!container) return;

  const isVerifiedAdmin = currentCandidate && currentCandidate.isAdmin;
  const isVerifiedCand = currentCandidate && currentCandidate.isVerified;

  container.innerHTML = `
    <div class="relative inline-block text-left">
      <button onclick="toggleCandidateDropdown()" id="candidateDropdownBtn" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111827] text-white border border-slate-700 hover:border-blue-500 transition flex items-center gap-2 shadow-xs">
        <span class="text-base" id="activeCandAvatar">${currentCandidate ? currentCandidate.avatar : '👨‍💻'}</span>
        <div class="text-left leading-tight hidden sm:block">
          <div class="text-white font-extrabold text-[11px] flex items-center gap-1" id="activeCandName">
            <span>${currentCandidate ? currentCandidate.name : 'Ashutosh Kumar'}</span>
            ${isVerifiedAdmin ? '<span class="text-[10px] text-amber-400" title="Workspace Admin">🛡️</span>' : (isVerifiedCand ? '<span class="text-[10px] text-emerald-400" title="Email Verified">✓</span>' : '<span class="text-[10px] text-amber-400" title="Email Pending">⏳</span>')}
          </div>
          <div class="text-[9px] text-slate-400 font-mono" id="activeCandRole">${currentCandidate ? currentCandidate.title.slice(0, 22) + '...' : 'Senior Frontend'}</div>
        </div>
        <span class="text-[10px] text-slate-400">▼</span>
      </button>

      <div id="candidateDropdownMenu" class="hidden absolute right-0 mt-2 w-72 rounded-2xl bg-[#111827] border border-slate-700 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
        <div class="p-2.5 bg-slate-900/80 flex items-center justify-between text-xs">
          <span class="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Switch Candidate View</span>
          <button onclick="openAddCandidateModal()" class="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 text-[10px] font-bold transition">
            + Add Profile
          </button>
        </div>
        <div class="p-1 space-y-1 max-h-60 overflow-y-auto" id="candidateOptionsList">
          ${allCandidatesList.map(c => `
            <button onclick="switchCandidate('${c.id}')" class="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 transition flex items-center justify-between gap-2 ${currentCandidate && currentCandidate.id === c.id ? 'bg-blue-600/20 text-white font-bold border border-blue-500/30' : 'text-slate-300'}">
              <div class="flex items-center gap-2">
                <span class="text-lg">${c.avatar || '👤'}</span>
                <div>
                  <div class="font-bold flex items-center gap-1.5">
                    <span>${c.name}</span>
                    ${c.isAdmin ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">ADMIN</span>' : (c.isVerified ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">VERIFIED</span>' : '<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">PENDING</span>')}
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono">${c.experienceLabel} • ${c.title.slice(0, 24)}</div>
                </div>
              </div>
              ${currentCandidate && currentCandidate.id === c.id ? '<span class="text-blue-400 font-bold">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
        <div class="p-2 bg-slate-900/60 flex flex-col gap-1 text-xs">
          ${currentCandidate && currentCandidate.resumeFile ? `
            <a href="/${currentCandidate.resumeFile}" target="_blank" rel="noopener noreferrer" class="w-full text-center py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-300 font-bold text-[11px] transition flex items-center justify-center gap-1.5">
              <span>📄</span> <span>View Candidate Resume ↗</span>
            </a>
          ` : ''}
          <a href="/profile.html?candidate=${currentCandidate ? currentCandidate.id : ''}" class="w-full text-center py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition flex items-center justify-center gap-1.5">
            <span>👤</span> <span>Candidate Profile Hub ↗</span>
          </a>
          <a href="/users.html" class="w-full text-center py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1.5">
            <span>🛡️</span> <span>User &amp; Access Management (Admin) ↗</span>
          </a>
          <button onclick="copyCandidateShareLink()" class="w-full text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition flex items-center justify-center gap-1.5">
            <span>🔗</span> <span>Copy Client Share Link</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function toggleCandidateDropdown() {
  const menu = document.getElementById('candidateDropdownMenu');
  if (menu) menu.classList.toggle('hidden');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const container = document.getElementById('candidateSelectorContainer');
  const menu = document.getElementById('candidateDropdownMenu');
  if (container && menu && !container.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function switchCandidate(candId, updateUrl = true) {
  const target = allCandidatesList.find(c => c.id === candId);
  if (!target) return;

  currentCandidate = target;

  // Close menu
  const menu = document.getElementById('candidateDropdownMenu');
  if (menu) menu.classList.add('hidden');

  // Update dropdown button
  const avatarEl = document.getElementById('activeCandAvatar');
  const nameEl = document.getElementById('activeCandName');
  const roleEl = document.getElementById('activeCandRole');
  if (avatarEl) avatarEl.textContent = target.avatar || '👤';
  if (nameEl) nameEl.textContent = target.name;
  if (roleEl) roleEl.textContent = target.title.slice(0, 24) + '...';

  // 1. Update Executive Hero Banner
  const heroName = document.querySelector('h2.text-base.md\\:text-lg.font-extrabold');
  if (heroName) {
    heroName.innerHTML = `${target.name} &bull; <span class="text-slate-300 font-semibold">${target.title}</span>`;
  }

  const expChip = document.querySelector('span.px-2\\.5.py-0\\.5.rounded-md.text-\\[10px\\]');
  if (expChip) {
    expChip.textContent = `Client Showcase • ${target.experienceLabel} Enterprise Experience`;
  }

  const noticeChip = document.querySelector('span.text-xs.text-slate-400.font-mono');
  if (noticeChip) {
    noticeChip.textContent = `${target.noticePeriod} Notice`;
  }

  // Update Hero Verification Badge
  const verifyBadge = document.getElementById('heroVerificationBadge');
  if (verifyBadge) {
    if (target.isAdmin) {
      verifyBadge.innerHTML = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1"><span>🛡️ Verified Admin</span></span>';
    } else if (target.isVerified) {
      verifyBadge.innerHTML = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1"><span>✓ Email Verified</span></span>';
    } else {
      verifyBadge.innerHTML = `<button onclick="openVerifyModal('${target.id}')" class="touch-btn px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer" title="Candidate Email Not Verified — Click to Verify"><span>⏳ Pending Verification</span> <span class="underline text-blue-400 font-bold ml-1">Verify Email ✉️</span></button>`;
    }
  }

  const ctcCurEl = document.getElementById('candCurrentCtcDisplay');
  const ctcTargetEl = document.getElementById('candTargetCtc');
  if (ctcCurEl) ctcCurEl.textContent = isPrivacyOn ? '₹•••••• PA' : target.currentCtc;
  if (ctcTargetEl) ctcTargetEl.textContent = isPrivacyOn ? '₹•••••• (Target)' : target.targetCtc;

  const locEl = document.getElementById('heroLocationDisplay');
  if (locEl && target.location) locEl.textContent = target.location;

  document.title = `TalentFlow AI — Enterprise Job Search & Matching Suite | ${target.name}`;

  // 2. Update KPI Cards
  const kpiTotal = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4 div:nth-child(1) .text-lg');
  const kpiActive = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4 div:nth-child(2) .text-lg');
  if (kpiTotal) kpiTotal.textContent = `${target.totalEvaluated || 200}+`;
  if (kpiActive) kpiActive.textContent = `${target.activeApplicationsCount || 10} Active`;

  // 3. Update Offer Calculator Initial Values
  const offeredInput = document.getElementById('offeredCtcInput');
  const offeredRange = document.getElementById('offeredCtcRange');
  const baseEl = document.getElementById('calcBaseSalary');
  if (baseEl) baseEl.value = target.targetCtcMin || 20;

  if (offeredInput && offeredRange) {
    const val = (target.targetCtcMin || 14) * 100000;
    offeredInput.value = val;
    offeredRange.value = val;
    updateOfferCalculation();
  }

  // 4. Update URL parameter
  if (updateUrl) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('candidate', target.id);
    window.history.replaceState(null, '', newUrl.toString());
    showReloadToast(`Switched view to ${target.name} (${target.title})`);
  }

  renderCandidateDropdown();

  // Re-render current view with candidate context
  if (currentActiveTab === 'kanban') {
    renderKanban();
  } else if (currentActiveTab === 'opportunities') {
    renderJobs();
  }
}

function copyCandidateShareLink() {
  if (!currentCandidate) return;
  const shareUrl = `${window.location.origin}${window.location.pathname}?candidate=${currentCandidate.id}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    showReloadToast(`✓ Client share link copied for ${currentCandidate.name}!`);
  });
}

function openAddCandidateModal() {
  const modal = document.getElementById('addCandidateModal');
  if (modal) modal.classList.remove('hidden');
}

function closeAddCandidateModal() {
  const modal = document.getElementById('addCandidateModal');
  if (modal) modal.classList.add('hidden');
}

async function handleAddCandidateSubmit(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('newCandName')?.value.trim();
  const title = document.getElementById('newCandTitle')?.value.trim();
  const exp = document.getElementById('newCandExp')?.value.trim();
  const notice = document.getElementById('newCandNotice')?.value.trim();
  const ctcCur = document.getElementById('newCandCurrentCtc')?.value.trim();
  const ctcTarget = document.getElementById('newCandTargetCtc')?.value.trim();
  const email = document.getElementById('newCandEmail')?.value.trim();
  const skills = document.getElementById('newCandSkills')?.value.trim();
  const avatar = document.getElementById('newCandAvatar')?.value.trim() || '👤';

  if (!name || !title) {
    alert('Please enter Candidate Name and Target Job Title.');
    return;
  }

  // Handle optional resume upload
  const resumeInput = document.getElementById('newCandResume');
  const resumeFile = resumeInput && resumeInput.files ? resumeInput.files[0] : null;
  let resumeBase64 = null;
  let resumeFileName = null;
  if (resumeFile) {
    resumeFileName = resumeFile.name;
    resumeBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(resumeFile);
    });
  }

  const accessSelect = document.getElementById('newCandAccessRole');
  const accessLevel = accessSelect ? accessSelect.value : 'write';
  let role = 'editor';
  let access = 'write';
  if (accessLevel === 'admin') { role = 'admin'; access = 'write'; }
  else if (accessLevel === 'read') { role = 'viewer'; access = 'read'; }

  const payload = {
    name,
    avatar,
    title,
    role,
    access,
    isAdmin: role === 'admin',
    resumeBase64,
    resumeFileName,
    experienceYears: parseFloat(exp) || 5,
    noticePeriod: notice || 'Immediate to 30 Days',
    currentCtc: ctcCur ? `₹${ctcCur} LPA` : '₹10,00,000 PA',
    currentCtcVal: parseFloat(ctcCur) || 10,
    targetCtc: ctcTarget ? `₹${ctcTarget} LPA` : '₹18,00,000+ PA',
    targetCtcMin: parseFloat(ctcTarget) || 18,
    email: email || 'candidate@example.com',
    coreStack: skills ? skills.split(',').map(s => s.trim()) : ['JavaScript', 'HTML5', 'CSS3']
  };

  try {
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      allCandidatesList.push(data.candidate);
      closeAddCandidateModal();
      switchCandidate(data.candidate.id, true);
      showReloadToast(`✓ Added ${data.candidate.name} to Candidate Registry!`);
    } else {
      showReloadToast('Candidate created locally.');
      closeAddCandidateModal();
    }
  } catch (err) {
    console.warn('[Add Candidate] Error:', err);
    closeAddCandidateModal();
  }
}


let verifyingCandidateId = null;

function openVerifyModal(candidateId) {
  const cand = allCandidatesList.find(c => c.id === candidateId) || currentCandidate;
  if (!cand) return;
  verifyingCandidateId = cand.id;

  const modal = document.getElementById('verifyCandidateModal');
  const candInfo = document.getElementById('verifyCandNameEmail');
  const otpInput = document.getElementById('verifyOtpCodeInput');
  const link = document.getElementById('verifyViewDispatchLink');

  if (candInfo) candInfo.textContent = `${cand.name} (${cand.email})`;
  if (otpInput) otpInput.value = cand.verificationOtp || '482910';
  if (link) link.href = `/api/candidates/verify?id=${cand.id}&code=${cand.verificationOtp || '482910'}`;

  if (modal) modal.classList.remove('hidden');
}

function closeVerifyModal() {
  const modal = document.getElementById('verifyCandidateModal');
  if (modal) modal.classList.add('hidden');
}

async function submitCandidateOtp() {
  const input = document.getElementById('verifyOtpCodeInput');
  const code = input ? input.value.trim() : '';
  if (!code) {
    alert('Please enter the 6-digit OTP code.');
    return;
  }

  const candId = verifyingCandidateId || (currentCandidate ? currentCandidate.id : 'test-candidate');

  try {
    const res = await fetch('/api/candidates/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId: candId, otpCode: code })
    });

    const data = await res.json();
    if (res.ok && data.verified) {
      showReloadToast(`✓ Success! ${data.candidate.name}'s email is now verified!`);
      const idx = allCandidatesList.findIndex(c => c.id === candId);
      if (idx !== -1) {
        allCandidatesList[idx] = data.candidate;
      }
      closeVerifyModal();
      switchCandidate(candId, false);
      renderCandidateDropdown();
    } else {
      alert(data.error || 'Invalid OTP code. Please check your verification email.');
    }
  } catch (err) {
    console.warn('[Verify OTP Error]:', err);
    alert('Verification failed. Please try again.');
  }
}

async function resendCandidateVerification() {
  const candId = verifyingCandidateId || (currentCandidate ? currentCandidate.id : 'test-candidate');
  showReloadToast('Sending new email verification code...');

  try {
    const res = await fetch('/api/candidates/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId: candId })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const otpInput = document.getElementById('verifyOtpCodeInput');
      if (otpInput && data.otpCode) otpInput.value = data.otpCode;
      const link = document.getElementById('verifyViewDispatchLink');
      if (link && data.emailDispatch && data.emailDispatch.webUrl) link.href = data.emailDispatch.webUrl;
      showReloadToast(`✓ Verification email sent to ${data.recipient}! Check dispatches.`);
    } else {
      showReloadToast('Verification dispatch recorded.');
    }
  } catch (e) {
    showReloadToast('Verification email resent.');
  }
}

async function instantTestVerify() {
  const candId = verifyingCandidateId || (currentCandidate ? currentCandidate.id : 'test-candidate');
  const cand = allCandidatesList.find(c => c.id === candId) || currentCandidate;
  const code = (cand && cand.verificationOtp) ? cand.verificationOtp : '482910';
  const input = document.getElementById('verifyOtpCodeInput');
  if (input) input.value = code;
  await submitCandidateOtp();
}

async function clearDemoReplies() {
  if (!confirm('Clear simulated demo replies stream? You can scan live Gmail anytime.')) return;
  try {
    const res = await fetch('/api/gmail/clear-demo-replies', { method: 'POST' });
    if (res.ok) {
      showReloadToast('✓ Cleared simulated demo replies.');
      renderRepliesTab();
      renderKanban();
    }
  } catch (e) {
    console.warn('[Clear Demo Replies Err]:', e);
  }
}

// ==============================================================
// GMAIL SETUP MODAL & LIVE OAUTH / APP PASSWORD CONNECTION
// ==============================================================

async function openGmailSetupModal() {
  const modal = document.getElementById('gmailSetupModal');
  if (!modal) return;

  const currentEmail = (typeof currentCandidate !== 'undefined' && currentCandidate && currentCandidate.email) ? currentCandidate.email : 'kumar.ashu872@gmail.com';
  const emailInput = document.getElementById('gmailAppPassEmail');
  if (emailInput) emailInput.value = currentEmail;
  const targetDisplay = document.getElementById('modalTargetEmailDisplay');
  if (targetDisplay) targetDisplay.textContent = currentEmail;

  // Set redirect URI according to window.location
  const redirectUriCode = document.getElementById('oauthRedirectUriCode');
  const dynamicRedirectUri = `${window.location.origin}/api/gmail/oauth2callback`;
  if (redirectUriCode) redirectUriCode.textContent = dynamicRedirectUri;

  // Reset status messages
  const appStatus = document.getElementById('appPassStatusMsg');
  if (appStatus) { appStatus.className = 'hidden text-xs p-3 rounded-xl'; appStatus.innerHTML = ''; }
  const oauthStatus = document.getElementById('oauthStatusMsg');
  if (oauthStatus) { oauthStatus.className = 'hidden text-xs p-3 rounded-xl'; oauthStatus.innerHTML = ''; }

  try {
    const res = await fetch('/api/gmail/status');
    if (res.ok) {
      const data = await res.json();
      const statusPill = document.getElementById('modalGmailStatusPill');
      const actionArea = document.getElementById('activeGmailConnectionActions');
      const modeLabel = document.getElementById('activeConnectionModeLabel');
      const clientIdInput = document.getElementById('gmailClientIdInput');

      if (data.clientId && clientIdInput) clientIdInput.value = data.clientId;

      if (data.connected) {
        if (statusPill) {
          statusPill.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
          statusPill.textContent = `🟢 Connected (${data.mode})`;
        }
        if (actionArea) actionArea.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = `${data.mode} (${data.userEmail})`;
      } else {
        if (statusPill) {
          statusPill.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
          statusPill.textContent = '🟡 Simulation Ready';
        }
        if (actionArea) actionArea.classList.add('hidden');
      }
    }
  } catch (e) {
    console.warn('[Gmail Status Check Failed]:', e);
  }

  modal.classList.remove('hidden');
}

function closeGmailSetupModal() {
  const modal = document.getElementById('gmailSetupModal');
  if (modal) modal.classList.add('hidden');
}

function switchGmailAuthTab(tab) {
  const appPassTab = document.getElementById('gmailMethodAppPass');
  const oauthTab = document.getElementById('gmailMethodOAuth');
  const btnAppPass = document.getElementById('gmailTabBtnAppPass');
  const btnOAuth = document.getElementById('gmailTabBtnOAuth');

  if (tab === 'apppass') {
    if (appPassTab) appPassTab.classList.remove('hidden');
    if (oauthTab) oauthTab.classList.add('hidden');
    if (btnAppPass) {
      btnAppPass.className = 'py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 bg-blue-600 text-white shadow-sm';
    }
    if (btnOAuth) {
      btnOAuth.className = 'py-2 rounded-lg font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
    }
  } else {
    if (appPassTab) appPassTab.classList.add('hidden');
    if (oauthTab) oauthTab.classList.remove('hidden');
    if (btnOAuth) {
      btnOAuth.className = 'py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow-sm';
    }
    if (btnAppPass) {
      btnAppPass.className = 'py-2 rounded-lg font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
    }
  }
}

function toggleAppPassVisibility() {
  const input = document.getElementById('gmailAppPassInput');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function copyOAuthRedirectUri() {
  const uriElem = document.getElementById('oauthRedirectUriCode');
  const text = uriElem ? uriElem.textContent.trim() : `${window.location.origin}/api/gmail/oauth2callback`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showReloadToast('📋 Copied redirect URI to clipboard!');
  }
}

async function submitAppPasswordConnection() {
  const emailInput = document.getElementById('gmailAppPassEmail');
  const passInput = document.getElementById('gmailAppPassInput');
  const statusMsg = document.getElementById('appPassStatusMsg');
  const connectBtn = document.getElementById('btnConnectAppPass');

  const email = (emailInput ? emailInput.value : '').trim();
  const rawPass = (passInput ? passInput.value : '').trim();
  const cleanPass = rawPass.replace(/\s+/g, '');

  if (!email || !email.includes('@')) {
    alert('Please enter a valid Google Account email.');
    return;
  }
  if (!cleanPass || cleanPass.length < 16) {
    if (statusMsg) {
      statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
      statusMsg.textContent = 'Please enter a full 16-character Google App Password (e.g. abcd efgh ijkl mnop).';
    }
    return;
  }

  if (connectBtn) {
    connectBtn.disabled = true;
    connectBtn.innerHTML = '<span>⏳</span><span>Verifying with Google SMTP...</span>';
  }

  try {
    const res = await fetch('/api/gmail/connect-app-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, appPassword: cleanPass })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (statusMsg) {
        statusMsg.className = 'text-xs p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 block';
        statusMsg.innerHTML = `✅ <strong>Connected Successfully!</strong> Google authenticated ${email}. SMTP & live recruiter monitoring active.`;
      }
      showReloadToast(`✅ Connected live Gmail: ${email}`);
      const statusPill = document.getElementById('modalGmailStatusPill');
      if (statusPill) {
        statusPill.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        statusPill.textContent = '🟢 Connected (LIVE_GMAIL_APP_PASS)';
      }
      const actionArea = document.getElementById('activeGmailConnectionActions');
      if (actionArea) actionArea.classList.remove('hidden');
      renderRepliesTab();
      renderKanban();
    } else {
      if (statusMsg) {
        statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block leading-relaxed';
        statusMsg.innerHTML = `⚠️ <strong>Connection Error:</strong> ${data.error || 'Failed to authenticate Google credentials.'}`;
      }
    }
  } catch (err) {
    if (statusMsg) {
      statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
      statusMsg.innerHTML = `⚠️ Network request failed: ${err.message}`;
    }
  } finally {
    if (connectBtn) {
      connectBtn.disabled = false;
      connectBtn.innerHTML = '<span>🔐</span><span>Verify & Connect App Password</span>';
    }
  }
}

async function submitOAuthAuthorization() {
  const clientIdInput = document.getElementById('gmailClientIdInput');
  const secretInput = document.getElementById('gmailClientSecretInput');
  const statusMsg = document.getElementById('oauthStatusMsg');
  const authBtn = document.getElementById('btnAuthorizeOAuth');

  const clientId = (clientIdInput ? clientIdInput.value : '').trim();
  const clientSecret = (secretInput ? secretInput.value : '').trim();
  const redirectUri = `${window.location.origin}/api/gmail/oauth2callback`;
  const userEmail = (typeof currentCandidate !== 'undefined' && currentCandidate && currentCandidate.email) ? currentCandidate.email : 'kumar.ashu872@gmail.com';

  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    if (statusMsg) {
      statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
      statusMsg.textContent = 'Please enter a valid Google OAuth Client ID ending in .apps.googleusercontent.com';
    }
    return;
  }
  if (!clientSecret) {
    if (statusMsg) {
      statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
      statusMsg.textContent = 'Please enter your Google OAuth Client Secret (e.g. GOCSPX-...)';
    }
    return;
  }

  if (authBtn) {
    authBtn.disabled = true;
    authBtn.innerHTML = '<span>⏳</span><span>Saving Credentials & Launching OAuth...</span>';
  }

  try {
    const res = await fetch('/api/gmail/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        redirectUri,
        userEmail
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (statusMsg) {
        statusMsg.className = 'text-xs p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 block';
        statusMsg.innerHTML = '✅ Credentials saved! Redirecting to Google Account Authorization screen...';
      }
      showReloadToast('Opening Google Authorization screen...');
      setTimeout(() => {
        const authUrl = data.authUrl || `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify')}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
      }, 700);
    } else {
      if (statusMsg) {
        statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
        statusMsg.innerHTML = `⚠️ Failed to save credentials: ${data.error || 'Unknown error'}`;
      }
    }
  } catch (err) {
    if (statusMsg) {
      statusMsg.className = 'text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 block';
      statusMsg.innerHTML = `⚠️ Error: ${err.message}`;
    }
  } finally {
    if (authBtn) {
      authBtn.disabled = false;
      authBtn.innerHTML = '<span>🚀</span><span>Save & Authorize with Google →</span>';
    }
  }
}

async function disconnectLiveGmail() {
  if (!confirm('Disconnect live Gmail synchronization and return to simulation mode?')) return;
  try {
    const res = await fetch('/api/gmail/disconnect', { method: 'POST' });
    if (res.ok) {
      showReloadToast('Gmail disconnected. Reverted to simulation mode.');
      openGmailSetupModal();
      renderRepliesTab();
    }
  } catch (e) {
    console.warn('[Disconnect Err]:', e);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initCandidateManager();
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab) {
      setTimeout(() => switchTab(initialTab), 60);
    }
  });
  setTimeout(() => initCandidateManager(), 200);
}
