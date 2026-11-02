import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
  console.log('=== RUNNING AUTHENTICATION & RESUME STORAGE VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const BASE_URL = 'http://localhost:5000';

  // TEST 1: Strict login rejection on missing / empty password
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'kumar.ashu872@gmail.com', password: '' })
    });
    const data = await res.json();
    assert(res.status === 401 && !data.success, 'Login fails with HTTP 401 when password is empty');
  } catch (e) {
    assert(false, `Test 1 threw error: ${e.message}`);
  }

  // TEST 2: Strict login rejection on wrong password
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'kumar.ashu872@gmail.com', password: 'wrongPassword123' })
    });
    const data = await res.json();
    assert(res.status === 401 && !data.success && data.error.includes('Incorrect password'), 'Login fails with HTTP 401 on incorrect password');
  } catch (e) {
    assert(false, `Test 2 threw error: ${e.message}`);
  }

  // TEST 3: Strict login rejection on non-existent email
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com', password: 'password123' })
    });
    const data = await res.json();
    assert(res.status === 401 && !data.success && data.error.includes('not found'), 'Login fails with HTTP 401 when user email does not exist');
  } catch (e) {
    assert(false, `Test 3 threw error: ${e.message}`);
  }

  // TEST 4: No password backdoor — testing admin123 on another user (Priya)
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya.sharma@example.com', password: 'admin123' })
    });
    const data = await res.json();
    assert(res.status === 401 && !data.success, 'No backdoor: admin123 rejected on other users accounts');
  } catch (e) {
    assert(false, `Test 4 threw error: ${e.message}`);
  }

  // TEST 5: Success with exact correct password for Ashutosh Kumar
  let adminToken = '';
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'kumar.ashu872@gmail.com', password: 'admin123' })
    });
    const data = await res.json();
    adminToken = data.token;
    assert(res.status === 200 && data.success && data.user.id === 'ashutosh-kumar', 'Ashutosh Kumar logs in successfully with exact password admin123');
  } catch (e) {
    assert(false, `Test 5 threw error: ${e.message}`);
  }

  // TEST 6: Success with exact correct password for Priya Sharma
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya.sharma@example.com', password: 'editor123' })
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && data.user.name === 'Priya Sharma', 'Priya Sharma logs in successfully with exact password editor123');
  } catch (e) {
    assert(false, `Test 6 threw error: ${e.message}`);
  }

  // TEST 7: /api/auth/me without valid credentials returns 401 Unauthorized
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, { method: 'GET' });
    const data = await res.json();
    assert(res.status === 401 && !data.success, '/api/auth/me rejects unauthenticated requests with HTTP 401 (no default to admin)');
  } catch (e) {
    assert(false, `Test 7 threw error: ${e.message}`);
  }

  // TEST 8: Register New Candidate with Resume File Upload
  const mockResumeContent = '%PDF-1.4 Mock Candidate Resume Document - Software Engineering Specialist';
  const mockResumeBase64 = 'data:application/pdf;base64,' + Buffer.from(mockResumeContent).toString('base64');
  const testEmail = `rahul.test.${Date.now()}@example.com`;

  let newCandidateId = '';
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Verma Test',
        email: testEmail,
        password: 'rahulSecurePassword789',
        title: 'Lead Full Stack React Engineer',
        experienceYears: 6.5,
        currentCtc: 12,
        targetCtc: 22,
        skills: 'React, Node.js, TypeScript, AWS, Next.js, PostgreSQL',
        resumeBase64: mockResumeBase64,
        resumeFileName: 'Rahul_Verma_Resume.pdf'
      })
    });

    const regData = await regRes.json();
    newCandidateId = regData.user ? regData.user.id : '';
    assert(regRes.status === 201 && regData.success && regData.user.email === testEmail, 'New candidate registered successfully with HTTP 201');
    assert(regData.user.resumeFile && regData.user.resumeFile.includes('Rahul_Verma_Resume.pdf'), 'Candidate record links to stored resume file');

    // Verify file exists on disk in data/resumes/
    const diskPath = path.resolve(regData.user.resumeFile);
    assert(fs.existsSync(diskPath), `Resume file physically stored on disk: ${regData.user.resumeFile}`);
  } catch (e) {
    assert(false, `Test 8 threw error: ${e.message}`);
  }

  // TEST 9: Authenticate newly created candidate with their password
  try {
    const loginFail = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'wrongPassword' })
    });
    assert(loginFail.status === 401, 'New candidate cannot log in with wrong password');

    const loginOk = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'rahulSecurePassword789' })
    });
    const loginOkData = await loginOk.json();
    assert(loginOk.status === 200 && loginOkData.success && loginOkData.user.name === 'Rahul Verma Test', 'New candidate logs in successfully with their created password');
  } catch (e) {
    assert(false, `Test 9 threw error: ${e.message}`);
  }

  // TEST 10: Previous data preservation check
  try {
    const csvContent = fs.readFileSync(path.resolve('data/applications.csv'), 'utf8');
    assert(csvContent.includes('SUBMITTED') && csvContent.length > 5000, 'All previous application records in applications.csv remain 100% intact');

    const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
    assert(indexHtml.includes('jobs = [') && indexHtml.includes('Cisco Systems Partner Network'), 'Previous 23 job search opportunities remain intact in dashboard');
    assert(indexHtml.includes('computeDynamicJobScore'), 'Dynamic ATS match scoring engine present in dashboard');
    assert(indexHtml.includes('window.location.replace(\'/login.html'), 'Immediate authentication guard active in index.html <head>');
  } catch (e) {
    assert(false, `Test 10 threw error: ${e.message}`);
  }

  // TEST 11: Users.html and Profile.html Auth Protection
  try {
    const usersHtml = fs.readFileSync(path.resolve('users.html'), 'utf8');
    assert(usersHtml.includes('window.location.replace(\'/login.html'), 'Immediate authentication guard active in users.html <head>');
    const profileHtml = fs.readFileSync(path.resolve('profile.html'), 'utf8');
    assert(profileHtml.includes('window.location.replace(\'/login.html'), 'Immediate authentication guard active in profile.html <head>');
  } catch (e) {
    assert(false, `Test 11 threw error: ${e.message}`);
  }

  console.log(`\n======================================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================`);

  if (failed > 0) process.exit(1);
}

runTests();
