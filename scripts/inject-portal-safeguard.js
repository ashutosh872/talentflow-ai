import * as fs from 'fs';
import * as path from 'path';

const dir = path.resolve('data/mock-portal');
const files = fs.readdirSync(dir);

const jobMappings = {
  'amazon-fee2.html': { jobId: 'linkedin-4478053400', reqId: 'A10575321', company: 'Amazon (ADCI)' },
  'samsung-sds.html': { jobId: 'job-mock-002', reqId: 'SSDS-2026-8821', company: 'Samsung SDS Global' },
  'nagarro.html': { jobId: 'job-mock-001', reqId: 'NAG-UI-4912', company: 'Nagarro Enterprises' },
  'wipro.html': { jobId: 'job-mock-003', reqId: 'WIP-DS-9912', company: 'Wipro Digital' },
  'cisco.html': { jobId: 'job-mock-006', reqId: 'CSCO-FE-8841', company: 'Cisco Systems Partner Network' },
  'paytm.html': { jobId: 'linkedin-003', reqId: 'PYTM-FE-3319', company: 'Paytm Payments Bank' },
  'infoedge.html': { jobId: 'naukri-001', reqId: 'IE-UI-8812', company: 'Info Edge India (Naukri Enterprise)' },
  'makemytrip.html': { jobId: 'linkedin-002', reqId: 'MMT-UI-7714', company: 'MakeMyTrip (MMT India)' },
  'cba.html': { jobId: 'linkedin-001', reqId: 'CBA-FE-2201', company: 'Commonwealth Bank of Australia (CBA India)' },
  'epam.html': { jobId: 'indeed-002', reqId: 'EPAM-FE-6612', company: 'EPAM Systems India' },
  'hcl.html': { jobId: 'naukri-003', reqId: 'HCL-FE-9901', company: 'HCL Technologies' },
  'incedo.html': { jobId: 'job-mock-010', reqId: 'INC-UI-5521', company: 'Incedo Inc.' },
  'publicis-sapient.html': { jobId: 'naukri-002', reqId: 'PUB-UI-4419', company: 'Publicis Sapient India' },
  'tech-mahindra.html': { jobId: 'indeed-001', reqId: 'TM-FE-3312', company: 'Tech Mahindra' },
  'zomato.html': { jobId: 'indeed-003', reqId: 'ZOM-FE-7741', company: 'Zomato Media' },
  'acme-global.html': { jobId: 'agc-rem-1094', reqId: 'AGC-REM-1094', company: 'Acme Global Cloud' },
  'cognitive-labs.html': { jobId: 'cog-ui-4412', reqId: 'COG-UI-4412', company: 'Cognitive Labs' },
  'experience-commerce.html': { jobId: 'exp-com-8812', reqId: 'EXP-COM-8812', company: 'Experience Commerce' },
  'gitlab.html': { jobId: 'job-mock-009', reqId: 'GTLB-FE-5512', company: 'GitLab Partner Network' },
  'mindrops.html': { jobId: 'min-ui-2219', reqId: 'MIN-UI-2219', company: 'Mindrops Studio' }
};

for (const file of files) {
  if (!file.endsWith('.html')) continue;
  if (file === 'company.html' || file === 'compony.html') continue;

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const meta = jobMappings[file] || {
    jobId: file.replace('.html', ''),
    reqId: file.replace('.html', '').toUpperCase(),
    company: file.replace('.html', '').replace(/-/g, ' ').toUpperCase()
  };

  // Remove existing safeguard if present
  content = content.replace(/<script id="portal-duplicate-safeguard">[\s\S]*?<\/script>/g, '');

  const safeguardScript = `
  <!-- UNIVERSAL PORTAL DUPLICATE APPLICATION SAFEGUARD -->
  <script id="portal-duplicate-safeguard">
    (async function initPortalSafeguard() {
      const currentJobId = '${meta.jobId}';
      const currentReqId = '${meta.reqId}';
      const currentCompany = '${meta.company}';
      let existing = null;

      // 1. Check local storage
      try {
        const local = JSON.parse(localStorage.getItem('job_submissions') || '{}');
        if (local[currentJobId]) existing = local[currentJobId];
      } catch (e) {}

      // 2. Check server API for verified active submission in CSV
      try {
        const res = await fetch('/api/submissions');
        if (res.ok) {
          const remote = await res.json();
          if (remote[currentJobId]) existing = remote[currentJobId];
          else if (currentReqId && remote[currentReqId]) existing = remote[currentReqId];
        }
      } catch (e) {}

      const isActive = existing && (
        existing.status === 'SUBMITTED' || 
        existing.status === 'APPLIED' || 
        existing.status === 'HR_SCREEN' || 
        existing.status === 'TECH_INTERVIEW' || 
        existing.status === 'OFFER'
      );

      if (isActive) {
        console.log('[Portal Safeguard] Job ' + currentJobId + ' is already submitted (' + existing.status + '). Locking submit button.');
        const btn = document.getElementById('submit-application-btn');
        if (btn) {
          btn.disabled = true;
          btn.setAttribute('disabled', 'disabled');
          btn.className = 'bg-emerald-950/80 text-emerald-300 font-bold text-sm px-6 py-3 rounded-lg border border-emerald-500/50 cursor-not-allowed flex items-center gap-2 opacity-95 shadow-inner';
          btn.innerHTML = '<span>🔒 Application Already Submitted • Active (' + (existing.confirmationId || 'SUBMITTED') + ')</span>';
          btn.title = 'You have already applied for this opening. Re-applying is locked until the company updates your application.';
        }

        // Prepend prominent warning banner
        const form = document.getElementById('apply-form');
        if (form) {
          let notice = document.getElementById('portal-already-applied-banner');
          if (!notice) {
            notice = document.createElement('div');
            notice.id = 'portal-already-applied-banner';
            notice.className = 'p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 text-emerald-200 text-xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg';
            notice.innerHTML = '<div class="space-y-1">' +
              '<div class="flex items-center gap-2 font-bold text-emerald-300 text-sm"><span>🛡️</span> <span>Application Active &amp; Duplicate Locked</span></div>' +
              '<div>You have already applied for this opening on <span class="font-mono text-white font-bold">' + (existing.appliedDate || '2026-10-29') + '</span> with confirmation reference <code class="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 font-mono font-bold text-emerald-300">' + (existing.confirmationId || 'CONF-ACTIVE') + '</code>. Re-applying is disabled until the company cancels or updates your application.</div>' +
              '</div>' +
              '<button type="button" onclick="showConfirmationCardView()" class="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition shadow-sm cursor-pointer">View Confirmed Receipt →</button>';
            form.prepend(notice);
          }
        }
      }

      // Intercept form submission if already submitted
      const formEl = document.getElementById('apply-form');
      if (formEl) {
        formEl.addEventListener('submit', function(e) {
          if (isActive) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert('Duplicate application prevented: You have already applied for this role at ' + currentCompany + '. Status: ' + (existing.status || 'SUBMITTED') + ' (' + (existing.confirmationId || '') + '). Re-applying is locked until the company cancels or updates your application.');
            return false;
          }
        }, true);
      }
    })();

    function showConfirmationCardView() {
      const form = document.getElementById('apply-form');
      const card = document.getElementById('confirmation-card');
      if (form) form.classList.add('hidden');
      if (card) card.classList.remove('hidden');
    }
  </script>
`;

  // Insert before </body>
  if (content.includes('</body>')) {
    content = content.replace('</body>', safeguardScript + '\n</body>');
  } else {
    content += safeguardScript;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} with duplicate safeguard (JobId: ${meta.jobId})`);
}

// Create company.html and compony.html as universal company portals
const templateContent = fs.readFileSync(path.join(dir, 'samsung-sds.html'), 'utf8');
fs.writeFileSync(path.join(dir, 'company.html'), templateContent, 'utf8');
fs.writeFileSync(path.join(dir, 'compony.html'), templateContent, 'utf8');
console.log('Created data/mock-portal/company.html and data/mock-portal/compony.html');
