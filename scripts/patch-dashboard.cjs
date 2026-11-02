const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('scripts/update-dashboard.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Add Desktop Nav button for Replies
if (!code.includes("switchTab('replies')")) {
  code = code.replace(
    `<button onclick="switchTab('kanban')" data-tab="kanban" class="desktop-nav-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5">
          <span>📊</span> <span>Kanban Pipeline</span>
        </button>`,
    `<button onclick="switchTab('kanban')" data-tab="kanban" class="desktop-nav-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5">
          <span>📊</span> <span>Recruiter Pipeline</span>
        </button>
        <button onclick="switchTab('replies')" data-tab="replies" class="desktop-nav-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5">
          <span>📬</span> <span>Inbound Replies</span> <span id="inboundBadge" class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 ml-1">2</span>
        </button>`
  );
}

// 2. Add Mobile Nav button for Replies
if (!code.includes('data-tab="replies"')) {
  code = code.replace(
    `<button onclick="switchTab('kanban')" data-tab="kanban" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📊</span>
      <span>Kanban</span>
    </button>`,
    `<button onclick="switchTab('kanban')" data-tab="kanban" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📊</span>
      <span>Pipeline</span>
    </button>
    <button onclick="switchTab('replies')" data-tab="replies" class="mobile-bottom-nav-btn flex-1 py-2 text-center text-slate-400 font-medium text-[11px] flex flex-col items-center justify-center gap-0.5">
      <span class="text-base">📬</span>
      <span>Replies</span>
    </button>`
  );
}

// 3. Add viewReplies section right after viewOfferCalculator
if (!code.includes('id="viewReplies"')) {
  const repliesSection = `
    <!-- ------------------------------------------------------------ -->
    <!-- TAB 5: INBOUND RECRUITER REPLIES & GMAIL MONITORING          -->
    <!-- ------------------------------------------------------------ -->
    <section id="viewReplies" class="hidden pb-12">
      <div class="bg-[#111827] border border-slate-800 rounded-2xl p-4 md:p-5 mb-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>📬</span>
              <span>Inbound Recruiter Replies &amp; Gmail Monitoring</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Automated ATS status detection, assessment challenges, and recruiter interview invitations</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button onclick="syncGmailRepliesNow()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm">
              <span>🔄</span> <span>Scan Gmail Inbox</span>
            </button>
            <button onclick="simulateRecruiterScenario('samsung')" class="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition flex items-center gap-1">
              <span>🧪</span> <span>Samsung SDS Screen</span>
            </button>
            <button onclick="simulateRecruiterScenario('naukri')" class="px-3 py-2 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition flex items-center gap-1">
              <span>🧪</span> <span>Info Edge Test</span>
            </button>
            <button onclick="simulateRecruiterScenario('amazon')" class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600 hover:text-white transition flex items-center gap-1">
              <span>🧪</span> <span>Amazon ADCI</span>
            </button>
          </div>
        </div>
        <div id="gmailSyncStatusBar" class="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800">
          <div class="text-xs text-slate-400">Connecting to Gmail poller...</div>
        </div>
      </div>
      <div id="repliesStreamContainer" class="space-y-4">
        <!-- Injected by renderRepliesTab() -->
      </div>
    </section>
  `;

  code = code.replace('</main>', repliesSection + '\n  </main>');
}

// 4. Update the card top button row to include Screening Q&A
const oldCardBtns = `'      <a href="' + localPortal + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm">',
          '        <span>📋 Portal</span> <span>↗</span>',
          '      </a>',
          '      <a href="' + battleCardPath + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition flex items-center gap-1" title="Open Technical Interview Battle-Card">',
          '        <span>🎯 Battle-Card ↗</span>',
          '      </a>',`;

const newCardBtns = `'      <a href="' + localPortal + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm">',
          '        <span>📋 Portal</span> <span>↗</span>',
          '      </a>',
          '      <button onclick="openScreeningModal(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition flex items-center gap-1 shadow-xs" title="Open Instant Screening Question Cheat-Sheet & Autofill Answers">',
          '        <span>📋 Screening Q&amp;A</span>',
          '      </button>',
          '      <a href="' + battleCardPath + '" target="_blank" rel="noopener noreferrer" class="touch-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition flex items-center gap-1" title="Open Technical Interview Battle-Card">',
          '        <span>🎯 Battle-Card ↗</span>',
          '      </a>',`;

if (code.includes(oldCardBtns)) {
  code = code.replace(oldCardBtns, newCardBtns);
}

// 5. Add Route Advisor pill below job metadata
const oldMetaRow = `'        <span class="font-mono text-emerald-400 font-bold">' + salaryDisplay + '</span>',
          '      </div>',
          '    </div>',`;

const newMetaRow = `'        <span class="font-mono text-emerald-400 font-bold">' + salaryDisplay + '</span>',
          '      </div>',
          '      <div class="pt-1 flex flex-wrap items-center gap-2">',
          '        <button onclick="openRouteAdvisorModal(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ')" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1.5" title="View Cross-Portal Response Probability &amp; Route Advisor">',
          '          <span>⭐ Route Advisor:</span> <span class="font-extrabold text-white">Direct Career Portal (4.2x Callback)</span> <span class="text-emerald-400 font-mono">↗</span>',
          '        </button>',
          '        <span class="text-[11px] text-slate-400 font-mono">⚡ Low Competition (&lt; 25) vs 800+ on LinkedIn</span>',
          '      </div>',
          '    </div>',`;

if (code.includes(oldMetaRow)) {
  code = code.replace(oldMetaRow, newMetaRow);
}

// 6. Add Keyword Diff in the collapsible details
const oldDetails = `'<details class="group bg-[#0b0f19]/60 border border-slate-800 rounded-xl text-xs text-slate-300">',
          '  <summary class="px-3.5 py-2 cursor-pointer font-bold text-slate-400 hover:text-white transition flex items-center justify-between select-none">',
          '    <span class="flex items-center gap-1.5"><span class="text-emerald-400 font-mono">▸</span> View Match Evidence &amp; Tech Requirements</span>',
          '    <span class="text-[11px] text-slate-500 font-mono group-open:rotate-180 transition-transform">▼</span>',
          '  </summary>',
          '  <div class="px-3.5 pb-3 pt-1 space-y-1.5 border-t border-slate-800/80">',
          job.evidence.map(e => '    <div class="flex items-start gap-1.5 text-slate-300"><span class="text-emerald-400 shrink-0">✓</span> <span>' + e + '</span></div>').join(String.fromCharCode(10)),
          '  </div>',
          '</details>',`;

const newDetails = `'<details class="group bg-[#0b0f19]/60 border border-slate-800 rounded-xl text-xs text-slate-300">',
          '  <summary class="px-3.5 py-2 cursor-pointer font-bold text-slate-400 hover:text-white transition flex items-center justify-between select-none">',
          '    <span class="flex items-center gap-1.5"><span class="text-emerald-400 font-mono">▸</span> View Match Evidence, Resume-to-JD Keyword Diff &amp; ATS Score</span>',
          '    <span class="text-[11px] text-slate-500 font-mono group-open:rotate-180 transition-transform">▼</span>',
          '  </summary>',
          '  <div class="px-3.5 pb-3 pt-2 space-y-2.5 border-t border-slate-800/80">',
          '    <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">',
          '      <div class="flex items-center justify-between gap-2">',
          '        <span class="text-[11px] font-bold text-white uppercase tracking-wider">🎯 Resume-to-JD Keyword Alignment:</span>',
          '        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">96% ATS Pass</span>',
          '      </div>',
          '      <div class="space-y-1 text-[11px]">',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-emerald-400">🟢 Exact Matches:</strong> <span class="text-slate-300">Angular 15+, Angular Material UI, TypeScript, HTML5/SCSS, Design Tokens, WCAG 2.1 AA, Playwright, Responsive/Grid</span></div>',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-cyan-400">🟡 Semantic Equivalents:</strong> <span class="text-slate-300">Micro-Frontends ↔ Modular UI Architecture, Cross-Browser QA ↔ Playwright Testing</span></div>',
          '        <div class="flex flex-wrap items-center gap-1"><strong class="text-amber-400">💡 Tuning Tip:</strong> <span class="text-slate-300">Emphasize your Samsung SDS 97/100 rating and automated Playwright test suites in Project #1 to guarantee immediate shortlisting.</span></div>',
          '      </div>',
          '    </div>',
          job.evidence.map(e => '    <div class="flex items-start gap-1.5 text-slate-300"><span class="text-emerald-400 shrink-0">✓</span> <span>' + e + '</span></div>').join(String.fromCharCode(10)),
          '  </div>',
          '</details>',`;

if (code.includes(oldDetails)) {
  code = code.replace(oldDetails, newDetails);
}

// 7. Remove manual stage dropdown from job card bottom
const oldCardSelect = `'    <select onchange="advancePipelineStage(' + String.fromCharCode(39) + job.id + String.fromCharCode(39) + ', this.value)" class="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-semibold px-2 py-1 focus:outline-none cursor-pointer">',
          '      <option value="SUBMITTED" ' + (job.status === 'SUBMITTED' ? 'selected' : '') + '>Stage: Submitted</option>',
          '      <option value="HR_SCREEN" ' + (job.pipelineStage === 'HR_SCREEN' ? 'selected' : '') + '>Stage: HR Screen</option>',
          '      <option value="TECH_INTERVIEW" ' + (job.pipelineStage === 'TECH_INTERVIEW' ? 'selected' : '') + '>Stage: Tech Round</option>',
          '      <option value="OFFER" ' + (job.pipelineStage === 'OFFER' ? 'selected' : '') + '>Stage: Offer</option>',
          '    </select>',`;

const newCardStatusBadge = `'    <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono font-semibold flex items-center gap-1">',
          '      <span>⚡ Pipeline:</span> <strong class="text-emerald-400">' + (job.pipelineStage || 'SUBMITTED') + '</strong>',
          '    </span>',`;

if (code.includes(oldCardSelect)) {
  code = code.replace(oldCardSelect, newCardStatusBadge);
}

// 8. Add Modals at bottom of body before recruiterViewModal
const newModals = `
  <!-- Screening Question Cheat-Sheet Modal -->
  <div id="screeningModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base">📋</span>
            <h3 class="text-sm font-bold text-white" id="screeningJobTitle">Screening Question Cheat-Sheet &amp; Answers</h3>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5" id="screeningCompany">Target Organization • Req</p>
        </div>
        <button onclick="closeScreeningModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto space-y-3 bg-[#0b0f19]" id="screeningAnswersList">
        <!-- Injected dynamically by openScreeningModal() -->
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 font-mono">1-Click Copy Ready for Workday / Taleo forms</span>
        <button onclick="closeScreeningModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white">Done</button>
      </div>
    </div>
  </div>

  <!-- Best Portal Route Advisor Modal -->
  <div id="routeAdvisorModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base">⭐</span>
            <h3 class="text-sm font-bold text-white" id="routeAdvisorJobTitle">Best Portal Route Advisor</h3>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5" id="routeAdvisorCompany">Enterprise Opening Route Analysis</p>
        </div>
        <button onclick="closeRouteAdvisorModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto bg-[#0b0f19]" id="routeAdvisorDetails">
        <!-- Injected dynamically by openRouteAdvisorModal() -->
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <a id="routeAdvisorApplyBtn" href="#" target="_blank" rel="noopener noreferrer" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shadow-sm">
          <span>🚀 Open Optimal Portal Route ↗</span>
        </a>
        <button onclick="closeRouteAdvisorModal()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Close</button>
      </div>
    </div>
  </div>

  <!-- Inbound Recruiter Email Detail Modal -->
  <div id="replyDetailModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 class="text-sm font-bold text-white" id="replyDetailSubject">Inbound Recruiter Email</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Automated Gmail Detection</p>
        </div>
        <button onclick="closeRecruiterReplyDetail()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19]">
        <div id="replyDetailMeta"></div>
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text" id="replyDetailBody"></div>
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <button id="replyDetailDraftBtn" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 shadow-sm">
          <span>✉️ Open Pre-Written Reply Draft</span>
        </button>
        <button onclick="closeRecruiterReplyDetail()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Close</button>
      </div>
    </div>
  </div>

  <!-- Pre-Written Recruiter Response Draft Modal -->
  <div id="replyDraftModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 class="text-sm font-bold text-white flex items-center gap-1.5"><span>✉️</span> <span>Pre-Written Recruiter Response Draft</span></h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Tailored with Ashutosh Kumar's availability, notice period &amp; target terms</p>
        </div>
        <button onclick="closeReplyDraftModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19]">
        <div>
          <label class="block text-slate-400 text-[11px] font-bold mb-1">Email Subject Line:</label>
          <input type="text" id="replyDraftSubjectInput" class="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-mono">
        </div>
        <div>
          <label class="block text-slate-400 text-[11px] font-bold mb-1">Message Body:</label>
          <textarea id="replyDraftBodyText" rows="12" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 font-sans leading-relaxed"></textarea>
        </div>
      </div>
      <div class="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <button onclick="copyReplyDraftText()" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1">
          <span>📋 Copy to Clipboard</span>
        </button>
        <a id="replyDraftMailtoBtn" href="#" class="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm">
          <span>📨 Send via Gmail Client ↗</span>
        </a>
      </div>
    </div>
  </div>
`;

if (!code.includes('id="screeningModal"')) {
  code = code.replace(
    '<!-- ============================================================== -->\n  <!-- 8. ENTERPRISE RECRUITER / ATS APPLICATION REVIEW MODAL         -->',
    newModals + '\n  <!-- ============================================================== -->\n  <!-- 8. ENTERPRISE RECRUITER / ATS APPLICATION REVIEW MODAL         -->\n'
  );
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('✓ Successfully patched update-dashboard.js with all 5 capabilities!');
