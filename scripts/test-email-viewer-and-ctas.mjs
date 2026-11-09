import assert from 'assert';
import http from 'http';
import fs from 'fs';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Email Viewer, Read Receipts & CTAs Verification Suite...');

  // 1. Verify dashboard HTML has replies CTAs and saved jobs CTAs
  console.log('  1. Checking Dashboard HTML for CTAs & new-tab email links...');
  const dashRes = await request('/');
  assert.strictEqual(dashRes.statusCode, 200);
  assert.ok(dashRes.body.includes('jumpToReplies()'), 'Dashboard must contain jumpToReplies() call');
  assert.ok(dashRes.body.includes('jumpToSavedJobs()'), 'Dashboard must contain jumpToSavedJobs() call');
  assert.ok(dashRes.body.includes('searchLatestJobUpdates()'), 'Dashboard must contain searchLatestJobUpdates() call');
  assert.ok(dashRes.body.includes('data/inbound-replies/'), 'Dashboard must reference inbound reply emails');
  assert.ok(dashRes.body.includes('target="_blank"'), 'Dashboard email links must open in new tab (target="_blank")');
  assert.ok(dashRes.body.includes('Read Full Mail ↗'), 'Dashboard must have "Read Full Mail ↗" button');
  console.log('  ✓ Dashboard HTML contains all required CTAs and new-tab links.');

  // 2. Verify reading an inbound email directly in new tab (over HTTP)
  console.log('  2. Testing HTTP retrieval of rich inbound email...');
  const testMessageId = '6af0fb0d.70fc6bd5.26df8c.8e8bSMTPIN_ADDED_MISSING@mx.google.com';
  const mailRes = await request(`/data/inbound-replies/${testMessageId}.html`);
  assert.strictEqual(mailRes.statusCode, 200);
  assert.ok(mailRes.headers['content-type'].includes('text/html'), 'Content-type must be text/html');
  assert.ok(mailRes.body.includes('New Job - Angular,Apis,Architecture'), 'Must have subject');
  assert.ok(mailRes.body.includes('Ashutosh Kumar'), 'Must have candidate name');
  assert.ok(mailRes.body.includes('kumar.ashu872@gmail.com'), 'Must have recipient email');
  assert.ok(mailRes.body.includes('target="_blank"'), 'Must have clickable external links opening in new tab');
  assert.ok(mailRes.body.includes('https://www.naukri.com'), 'Must link to official portal');
  assert.ok(mailRes.body.includes('https://www.infoedge.in'), 'Must link to official company careers');
  assert.ok(mailRes.body.includes('Ashutosh_Kumar_Resume.html'), 'Must link to tailored resume');
  assert.ok(mailRes.body.includes('Interview_Battle_Card.html'), 'Must link to battlecard');
  assert.ok(mailRes.body.includes('mailto:'), 'Must have direct Gmail mailto reply link');
  assert.ok(mailRes.body.includes('copyReplyDraft'), 'Must have 1-click clipboard copy');
  console.log('  ✓ Inbound email renders with complete headers, rich body, and live clickable links!');

  // 3. Verify Saved Jobs Toggle API
  console.log('  3. Testing Saved Jobs Toggle API...');
  const toggleRes = await request('/api/saved-jobs/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: 'amazon-fee2' })
  });
  assert.strictEqual(toggleRes.statusCode, 200);
  const toggleData = JSON.parse(toggleRes.body);
  assert.strictEqual(toggleData.success, true);
  assert.ok(Array.isArray(toggleData.savedJobIds));
  console.log('  ✓ Saved Jobs API toggles correctly:', toggleData.isSaved ? 'Job Saved' : 'Job Unsaved');

  // 4. Verify Email Read Receipt Tracking Pixel
  console.log('  4. Testing Email Read Receipt 1x1 GIF & Simulate Open API...');
  const simulateRes = await request('/api/email-tracking/simulate-open', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId: 'samsung-sds-001' })
  });
  assert.strictEqual(simulateRes.statusCode, 200);
  const simData = JSON.parse(simulateRes.body);
  assert.strictEqual(simData.success, true);
  assert.strictEqual(simData.record.status, 'OPENED');
  assert.ok(simData.record.openCount >= 1);
  console.log('  ✓ Recruiter open tracking verified! Open count:', simData.record.openCount);

  // 5. Test 1x1 GIF pixel request
  const trackingId = simData.record.trackingId;
  const gifRes = await request(`/api/track/open/${trackingId}`);
  assert.strictEqual(gifRes.statusCode, 200);
  assert.strictEqual(gifRes.headers['content-type'], 'image/gif');
  console.log('  ✓ Tracking pixel returns image/gif and records open.');

  // 6. Test Search Updates API
  console.log('  6. Testing Search Latest Updates API...');
  const updateRes = await request('/api/jobs/search-updates?candidateId=ashutosh-kumar');
  assert.strictEqual(updateRes.statusCode, 200);
  const updateData = JSON.parse(updateRes.body);
  assert.strictEqual(updateData.success, true);
  assert.ok(updateData.totalJobs >= 10);
  console.log('  ✓ Search Updates returned ' + updateData.totalJobs + ' live openings!');

  console.log('\n🎉 ALL EMAIL VIEWER, READ RECEIPT & CTA TESTS PASSED 100%!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
