import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${urlPath}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runLinkAndRouteAudit() {
  console.log('===============================================================');
  console.log('  COMPREHENSIVE LINK, ROUTE & HARDCODING AUDIT');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;
  const errors = [];

  function check(name, ok, msg = '') {
    if (ok) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name} ${msg ? '— ' + msg : ''}`);
      errors.push(`${name}: ${msg}`);
      failed++;
    }
  }

  // 1. Dashboard Root Route
  console.log('\n--- 1. Testing Core Dashboard & Auth ---');
  const dashRes = await request('/');
  check('GET / (Dashboard Root)', dashRes.statusCode === 200, `Got ${dashRes.statusCode}`);
  check('Dashboard contains candidate Ashutosh Kumar', dashRes.body.includes('Ashutosh Kumar'));
  check('Dashboard contains Opened via Recruiter chip', dashRes.body.includes('Opened via Recruiter'));
  check('Dashboard contains filter data-filter="recruiter-opened"', dashRes.body.includes('data-filter="recruiter-opened"'));

  // 2. Candidate Master Resume Files
  console.log('\n--- 2. Testing Candidate Resume Links & Documents ---');
  const masterPdfRes = await request('/data/resumes/Ashutosh%20Kumar%20Senior%20Frontend%20Engineer%20Resume.pdf');
  check('Master PDF Resume (200 OK)', masterPdfRes.statusCode === 200, `Got ${masterPdfRes.statusCode}`);
  check('Master PDF Resume has application/pdf header', (masterPdfRes.headers['content-type'] || '').includes('pdf'));

  const candidateDocRes = await request('/data/tailored-documents/naukri-001/Ashutosh_Kumar_Resume.html');
  check('Tailored Resume via jobId fallback (200 OK)', candidateDocRes.statusCode === 200, `Got ${candidateDocRes.statusCode}`);
  check('Tailored Resume HTML has Ashutosh Kumar content', candidateDocRes.body.includes('Ashutosh Kumar'));

  const battlecardRes = await request('/data/interview-battlecards/naukri-001/Interview_Battle_Card.html');
  check('Interview Battlecard via jobId fallback (200 OK)', battlecardRes.statusCode === 200, `Got ${battlecardRes.statusCode}`);

  // 3. Testing Local Mock Portals & 1-Click Apply Flow
  console.log('\n--- 3. Testing Mock Portals (Offline Verification) ---');
  const baselineJobs = JSON.parse(fs.readFileSync('data/baseline-jobs.json', 'utf8'));
  for (const job of baselineJobs.slice(0, 10)) {
    if (job.portalFile) {
      const portalRes = await request(`/data/mock-portal/${job.portalFile}`);
      check(`Portal ${job.portalFile} for ${job.company}`, portalRes.statusCode === 200, `Got ${portalRes.statusCode}`);
    }
  }

  // 4. Inbound Email Views
  console.log('\n--- 4. Testing Inbound Email HTML Views ---');
  const replies = JSON.parse(fs.readFileSync('data/inbound-replies/replies.json', 'utf8'));
  for (const reply of replies) {
    const emailRes = await request(`/data/inbound-replies/${reply.messageId}.html`);
    check(`Email view ${reply.company} (${reply.messageId.slice(0, 15)}...)`, emailRes.statusCode === 200, `Got ${emailRes.statusCode}`);
    check(`Email view has valid HTML & candidate info`, emailRes.body.includes('Ashutosh Kumar') && emailRes.body.includes('kumar.ashu872@gmail.com'));
  }

  // 5. API Endpoints
  console.log('\n--- 5. Testing Live API Endpoints ---');
  
  // Candidates API
  const candRes = await request('/api/candidates');
  check('GET /api/candidates (200 OK)', candRes.statusCode === 200);

  // Saved Jobs API
  const savedRes = await request('/api/saved-jobs');
  check('GET /api/saved-jobs (200 OK)', savedRes.statusCode === 200);

  const toggleRes = await request('/api/saved-jobs/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: 'job-mock-002' })
  });
  check('POST /api/saved-jobs/toggle (200 OK)', toggleRes.statusCode === 200);

  // Search Updates API
  const searchUpdatesRes = await request('/api/search-updates');
  check('GET /api/search-updates (200 OK)', searchUpdatesRes.statusCode === 200);

  // Email Tracking Pixel
  const pixelRes = await request('/api/recruiter-opens/track?id=TRK-job-mock-002');
  check('GET /api/recruiter-opens/track (200 OK)', pixelRes.statusCode === 200);
  check('Tracking pixel returns image/gif', (pixelRes.headers['content-type'] || '').includes('gif'));

  // Dispatches API
  const dispatchesRes = await request('/api/email-dispatches');
  check('GET /api/email-dispatches (200 OK)', dispatchesRes.statusCode === 200);

  console.log('\n===============================================================');
  console.log(`  AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    console.error('Failure details:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  }
}

runLinkAndRouteAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

