const fs = require('fs');
const path = require('path');

const updateDashboardPath = path.resolve('scripts/update-dashboard.js');
let code = fs.readFileSync(updateDashboardPath, 'utf8');

// 1. Add Candidate Selector container in Header
const oldHeaderRight = `<div class="flex items-center gap-2 shrink-0">
        <button id="privacyToggleBtn"`;

const newHeaderRight = `<div class="flex items-center gap-2 shrink-0">
        <!-- Multi-Candidate Profile Switcher -->
        <div id="candidateSelectorContainer"></div>

        <button id="privacyToggleBtn"`;

if (code.includes(oldHeaderRight)) {
  code = code.replace(oldHeaderRight, newHeaderRight);
  console.log('✓ Injected candidateSelectorContainer into Header');
}

// 2. Add #addCandidateModal before toastContainer
const addCandidateModalHtml = `
  <!-- Add New Candidate Profile Modal Wizard -->
  <div id="addCandidateModal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="bg-[#111827] border border-blue-500/40 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div class="flex items-center gap-2">
          <span class="text-xl">👤</span>
          <div>
            <h3 class="text-sm font-bold text-white">Add New Candidate Profile</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Create an isolated job search workspace for another candidate</p>
          </div>
        </div>
        <button onclick="closeAddCandidateModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <form onsubmit="handleAddCandidateSubmit(event)" class="p-4 space-y-3 overflow-y-auto bg-[#0b0f19] text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Candidate Full Name *</label>
            <input type="text" id="newCandName" required placeholder="e.g. Neha Sharma" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Avatar Emoji</label>
            <input type="text" id="newCandAvatar" placeholder="👩‍💻, 👨‍💼, 👤" value="👩‍💻" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Target Professional Role / Title *</label>
          <input type="text" id="newCandTitle" required placeholder="e.g. Lead Full-Stack Engineer (React &amp; Node.js)" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Experience (Years)</label>
            <input type="number" id="newCandExp" step="0.5" placeholder="8.0" value="8" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Notice Period</label>
            <input type="text" id="newCandNotice" placeholder="30 Days / Immediate" value="30 Days" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Current CTC (in LPA)</label>
            <input type="number" id="newCandCurrentCtc" step="0.5" placeholder="14" value="14" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Target Minimum CTC (in LPA)</label>
            <input type="number" id="newCandTargetCtc" step="0.5" placeholder="26" value="26" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
          </div>
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Contact Email Address</label>
          <input type="email" id="newCandEmail" placeholder="candidate@example.com" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">Primary Tech Stack Skills (comma-separated)</label>
          <input type="text" id="newCandSkills" placeholder="React, Node.js, TypeScript, PostgreSQL, AWS, Docker" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5">
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button type="button" onclick="closeAddCandidateModal()" class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm">
            ✓ Create Candidate Workspace
          </button>
        </div>
      </form>
    </div>
  </div>
`;

if (!code.includes('id="addCandidateModal"')) {
  code = code.replace('<div id="toastContainer"', addCandidateModalHtml + '\n  <div id="toastContainer"');
  console.log('✓ Injected addCandidateModal before toastContainer');
}

fs.writeFileSync(updateDashboardPath, code, 'utf8');

// Ensure dashboard-features.js triggers initCandidateManager on DOMContentLoaded
const featuresPath = path.resolve('scripts/dashboard-features.js');
let featCode = fs.readFileSync(featuresPath, 'utf8');

if (!featCode.includes('initCandidateManager();')) {
  featCode += `\n\nif (typeof window !== 'undefined') {\n  window.addEventListener('DOMContentLoaded', () => initCandidateManager());\n  setTimeout(() => initCandidateManager(), 200);\n}\n`;
  fs.writeFileSync(featuresPath, featCode, 'utf8');
  console.log('✓ Injected auto-boot for initCandidateManager');
}
