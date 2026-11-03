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
  'paytm.html': { jobId: 'linkedin-003', aliasId: 'paytm-001', reqId: 'PYTM-FE-3319', company: 'Paytm Payments Bank' },
  'infoedge.html': { jobId: 'naukri-001', aliasId: 'infoedge-001', reqId: 'IE-UI-8812', company: 'Info Edge India (Naukri Enterprise)' },
  'makemytrip.html': { jobId: 'linkedin-002', aliasId: 'makemytrip-001', reqId: 'MMT-UI-7714', company: 'MakeMyTrip (MMT India)' },
  'cba.html': { jobId: 'linkedin-001', reqId: 'CBA-FE-2201', company: 'Commonwealth Bank of Australia' },
  'epam.html': { jobId: 'indeed-002', reqId: 'EPAM-FE-6612', company: 'EPAM Systems India' },
  'hcl.html': { jobId: 'naukri-003', reqId: 'HCL-FE-9901', company: 'HCL Technologies' },
  'incedo.html': { jobId: 'job-mock-010', reqId: 'INC-UI-5521', company: 'Incedo Inc.' },
  'publicis-sapient.html': { jobId: 'naukri-002', reqId: 'PUB-UI-4419', company: 'Publicis Sapient India' },
  'tech-mahindra.html': { jobId: 'indeed-001', reqId: 'TM-FE-3312', company: 'Tech Mahindra' },
  'zomato.html': { jobId: 'indeed-003', aliasId: 'zomato-001', reqId: 'ZOM-FE-7741', company: 'Zomato Media' },
  'acme-global.html': { jobId: 'job-mock-007', aliasId: 'agc-rem-1094', reqId: 'AGC-REM-1094', company: 'Acme Global Cloud' },
  'cognitive-labs.html': { jobId: 'job-mock-009', aliasId: 'cog-ui-4412', reqId: 'COG-UI-4412', company: 'Cognitive Web Labs' },
  'experience-commerce.html': { jobId: 'job-mock-005', aliasId: 'exp-com-8812', reqId: 'EXP-COM-8812', company: 'Experience Commerce (Cheil Group)' },
  'gitlab.html': { jobId: 'job-mock-004', aliasId: 'gtlb-fe-5512', reqId: 'GTLB-FE-5512', company: 'GitLab Partner Ecosystem' },
  'mindrops.html': { jobId: 'job-mock-008', aliasId: 'min-ui-2219', reqId: 'MIN-UI-2219', company: 'Mindrops Digital Studio' }
};

// 1. Gather all submitted job IDs from baseline-jobs.json AND applications.csv
const submittedJobIds = new Set();
const confirmationMap = {};

const baselineJobsPath = path.resolve('data/baseline-jobs.json');
if (fs.existsSync(baselineJobsPath)) {
  try {
    const baseline = JSON.parse(fs.readFileSync(baselineJobsPath, 'utf8'));
    baseline.forEach(j => {
      if (j.status === 'SUBMITTED' || j.status === 'APPLIED') {
        submittedJobIds.add(j.id);
        if (j.confirmationId) confirmationMap[j.id] = j.confirmationId;
      }
    });
  } catch (e) {}
}

const csvPath = path.resolve('data/applications.csv');
if (fs.existsSync(csvPath)) {
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const parts = line.split(',');
      const jId = parts[0];
      const st = parts[13];
      if (['SUBMITTED', 'APPLIED', 'HR_SCREEN', 'TECH_INTERVIEW', 'OFFER'].includes(st)) {
        submittedJobIds.add(jId);
        if (parts[16]) confirmationMap[jId] = parts[16];
      }
    }
  } catch (e) {}
}

// 2. Gather email dispatches map
const emailMap = {};
const dispatchesPath = path.resolve('data/email-dispatches/dispatches.json');
if (fs.existsSync(dispatchesPath)) {
  try {
    const dispatches = JSON.parse(fs.readFileSync(dispatchesPath, 'utf8'));
    dispatches.forEach(d => {
      if (d.jobId && !emailMap[d.jobId]) {
        emailMap[d.jobId] = d.webUrl;
      }
    });
  } catch (e) {}
}

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

  const isPreSubmitted = submittedJobIds.has(meta.jobId) || (meta.aliasId && submittedJobIds.has(meta.aliasId)) || meta.jobId === 'job-mock-002';
  const confId = confirmationMap[meta.jobId] || (meta.aliasId && confirmationMap[meta.aliasId]) || `CONF-${meta.jobId.slice(0, 8).toUpperCase()}-SUCCESS`;
  const emailReceiptUrl = emailMap[meta.jobId] || (meta.aliasId && emailMap[meta.aliasId]) || '/api/email-dispatches';

  // Anti-flicker synchronous head script
  const antiFlickerScript = `
  <script id="head-anti-flicker">
    (function() {
      try {
        var id = '${meta.jobId}';
        var aliasId = '${meta.aliasId || ''}';
        var comp = '${meta.company.toLowerCase()}';
        var local = JSON.parse(localStorage.getItem('job_submissions') || '{}');
        var isSub = ${isPreSubmitted} ||
          (local[id] && (local[id].status === 'SUBMITTED' || local[id].status === 'APPLIED')) ||
          (aliasId && local[aliasId] && (local[aliasId].status === 'SUBMITTED' || local[aliasId].status === 'APPLIED'));
        
        if (!isSub) {
          for (var k in local) {
            if (local[k] && local[k].company && local[k].company.toLowerCase().indexOf(comp.slice(0, 6)) !== -1) {
              isSub = true;
              break;
            }
          }
        }
        if (isSub) {
          document.write('<style>#apply-form{display:none!important}#confirmation-card{display:block!important}</style>');
        }
      } catch(e) {}
    })();
  </script>`;

  // Clean prior anti-flicker scripts
  content = content.replace(/<script id="head-anti-flicker">[\s\S]*?<\/script>/g, '');
  if (content.includes('</head>')) {
    content = content.replace('</head>', antiFlickerScript + '\n</head>');
  }

  // If statically pre-submitted, hide apply-form and show confirmation-card by default in raw HTML
  if (isPreSubmitted) {
    content = content.replace(/id="apply-form" class="space-y-6(?:\s+hidden)?"(?:\s+style="[^"]*")?/g, 'id="apply-form" class="space-y-6 hidden" style="display:none!important;"');
    content = content.replace(/id="confirmation-card" class="(?:\s*hidden)?\s*py-12 px-6 text-center"(?:\s+style="[^"]*")?/g, 'id="confirmation-card" class="py-12 px-6 text-center" style="display:block!important;"');
    content = content.replace(/href="#apply-form" class="([^"]*)"/g, 'href="#confirmation-card" class="$1"');
    content = content.replace(/↓ Jump to Application Form/g, '✓ Application Confirmed &amp; Duplicate Locked');
  } else {
    content = content.replace(/id="apply-form" class="space-y-6 hidden" style="display:none!important;"/g, 'id="apply-form" class="space-y-6"');
    content = content.replace(/id="confirmation-card" class="py-12 px-6 text-center" style="display:block!important;"/g, 'id="confirmation-card" class="hidden py-12 px-6 text-center" style="display:none;"');
  }

  // Ensure email receipt button exists inside confirmation-card
  if (!content.includes('id="emailReceiptBtn"')) {
    content = content.replace(
      '<!-- Return to Dashboard Link -->',
      `<!-- Revert Email Receipt Link -->
      <div class="mt-4 mb-2">
        <a id="emailReceiptBtn" href="${emailReceiptUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition">
          <span>📨 View Official Confirmation Receipt Email</span> <span>↗</span>
        </a>
      </div>
      <!-- Return to Dashboard Link -->`
    );
  }

  // Remove existing safeguard if present
  content = content.replace(/<!-- UNIVERSAL PORTAL DUPLICATE APPLICATION SAFEGUARD -->[\s\S]*?<\/script>/g, '');
  content = content.replace(/<script id="portal-duplicate-safeguard">[\s\S]*?<\/script>/g, '');

  const safeguardScript = `
  <!-- UNIVERSAL PORTAL DUPLICATE APPLICATION SAFEGUARD -->
  <script id="portal-duplicate-safeguard">
    (async function initPortalSafeguard() {
      const currentJobId = '${meta.jobId}';
      const aliasJobId = '${meta.aliasId || ''}';
      const currentReqId = '${meta.reqId}';
      const currentCompany = '${meta.company}';
      let existing = null;

      // 1. Check local storage
      try {
        const local = JSON.parse(localStorage.getItem('job_submissions') || '{}');
        if (local[currentJobId]) existing = local[currentJobId];
        else if (aliasJobId && local[aliasJobId]) existing = local[aliasJobId];
        else {
          for (const k in local) {
            if (local[k] && local[k].company && local[k].company.toLowerCase().includes(currentCompany.toLowerCase().slice(0, 6))) {
              existing = local[k];
              break;
            }
          }
        }
      } catch (e) {}

      // 2. Check server API for verified active submission in CSV
      try {
        const res = await fetch('/api/submissions');
        if (res.ok) {
          const remote = await res.json();
          if (remote[currentJobId]) existing = remote[currentJobId];
          else if (aliasJobId && remote[aliasJobId]) existing = remote[aliasJobId];
          else if (currentReqId && remote[currentReqId]) existing = remote[currentReqId];
          else {
            for (const k in remote) {
              if (remote[k] && remote[k].company && remote[k].company.toLowerCase().includes(currentCompany.toLowerCase().slice(0, 6))) {
                existing = remote[k];
                break;
              }
            }
          }
        }
      } catch (e) {}

      const isActive = ${isPreSubmitted} || (existing && (
        existing.status === 'SUBMITTED' || 
        existing.status === 'APPLIED' || 
        existing.status === 'HR_SCREEN' || 
        existing.status === 'TECH_INTERVIEW' || 
        existing.status === 'OFFER'
      ));

      const form = document.getElementById('apply-form');
      const card = document.getElementById('confirmation-card');

      if (isActive) {
        // Save to localStorage so subsequent reloads are instantaneous
        try {
          const local = JSON.parse(localStorage.getItem('job_submissions') || '{}');
          const dataToSave = {
            jobId: currentJobId,
            company: currentCompany,
            status: 'SUBMITTED',
            confirmationId: (existing && existing.confirmationId) || '${confId}',
            appliedDate: (existing && existing.appliedDate) || '2026-10-29',
            submissionMethod: (existing && existing.submissionMethod) || 'Via Opening Portal'
          };
          local[currentJobId] = dataToSave;
          if (aliasJobId) local[aliasJobId] = dataToSave;
          localStorage.setItem('job_submissions', JSON.stringify(local));
        } catch(e) {}

        // HIDE APPLICATION FORM COMPLETELY
        if (form) {
          form.classList.add('hidden');
          form.style.display = 'none';
        }

        // SHOW CONFIRMED APPLICATION RECEIPT CARD IMMEDIATELY
        if (card) {
          card.classList.remove('hidden');
          card.style.display = 'block';

          const wayEl = document.getElementById('submissionWayDisplay');
          if (wayEl) wayEl.textContent = (existing && existing.submissionMethod) || 'Via Opening Portal';

          let banner = document.getElementById('already-confirmed-banner');
          if (!banner) {
            banner = document.createElement('div');
            banner.id = 'already-confirmed-banner';
            banner.className = 'max-w-lg mx-auto mb-5 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs text-left shadow-xl space-y-1';
            banner.innerHTML = '<div class="flex items-center gap-2 font-bold text-emerald-300 text-sm"><span>🛡️</span> <span>Application Already Submitted &amp; Duplicate Locked</span></div>' +
              '<div>Your application for <strong class="text-white">' + currentCompany + '</strong> was successfully submitted on <span class="font-mono text-white font-bold">' + ((existing && existing.appliedDate) || '2026-10-29') + '</span> with confirmation reference <code class="px-1.5 py-0.5 rounded bg-emerald-900 border border-emerald-500/40 font-mono font-bold text-emerald-300">' + ((existing && existing.confirmationId) || '${confId}') + '</code>. Re-applying is locked until company responds.</div>';
            card.prepend(banner);
          }
        }
      } else {
        if (form) {
          form.classList.remove('hidden');
          form.style.display = 'block';
        }
        if (card) {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      }

      // Hard intercept against any double submit
      if (form) {
        form.addEventListener('submit', function(e) {
          if (isActive) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert('Duplicate application prevented: You have already applied for this opening at ' + currentCompany + '. Status: SUBMITTED. Re-applying is locked until the company cancels or updates your application.');
            return false;
          }
        }, true);
      }
    })();
  </script>
`;

  // Insert before </body>
  if (content.includes('</body>')) {
    content = content.replace('</body>', safeguardScript + '\n</body>');
  } else {
    content += safeguardScript;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} with form-hiding duplicate safeguard (JobId: ${meta.jobId})`);
}

// Create company.html and compony.html as universal company portals
const templateContent = fs.readFileSync(path.join(dir, 'samsung-sds.html'), 'utf8');
fs.writeFileSync(path.join(dir, 'company.html'), templateContent, 'utf8');
fs.writeFileSync(path.join(dir, 'compony.html'), templateContent, 'utf8');
console.log('Created data/mock-portal/company.html and data/mock-portal/compony.html');
