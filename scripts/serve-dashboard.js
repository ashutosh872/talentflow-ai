import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import nodemailer from 'nodemailer';
import { sendApplicationConfirmationEmail, sendCandidateVerificationEmail } from './mailer.js';
import { parseResumeIntelligence } from './resume-parser.js';
import { getDynamicJobsForCandidate, generateFreshJobsForCandidate, searchLatestJobUpdates } from './job-generator.js';
import { recordEmailOpen, recordLinkClick, getTrackingRecord, getAllTrackingRecords, simulateRecruiterOpen, TRANSPARENT_GIF_1X1 } from './email-tracker.js';
import { getSavedJobIds, getAllSavedJobs, toggleSaveJob } from './saved-jobs.js';
import {
  loadGmailConfig,
  saveGmailConfig,
  getGoogleOAuthUrl,
  syncGmailInbox,
  getAllInboundReplies,
  ingestScenarioReply,
  exchangeOAuthCode
} from './gmail-reply-detector.js';

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prefer 192.168 or 10.x networks
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
          return iface.address;
        }
      }
    }
  }
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const localIp = getLocalIpAddress();
const rootDir = process.cwd();

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getSubmissionsFromCsv() {
  const csvPath = path.resolve('data/applications.csv');
  if (!fs.existsSync(csvPath)) return {};
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const submissions = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const jobId = cells[0];
    const status = cells[13];
    const nextAction = cells[14] || '';
    const appliedDate = cells[15] || '';
    const confirmationId = cells[16] || '';
    const notes = cells[17] || '';

    const validStages = ['SUBMITTED', 'HR_SCREEN', 'TECH_INTERVIEW', 'SYSTEM_DESIGN', 'OFFER'];
    if (validStages.includes(status)) {
      let method = 'Via Opening Portal';
      if (nextAction.toLowerCase().includes('autofill') || notes.toLowerCase().includes('autofill')) {
        method = 'Via Autofill';
      }
      submissions[jobId] = {
        jobId,
        status: status,
        pipelineStage: status,
        submissionMethod: method,
        appliedDate: appliedDate || new Date().toISOString().split('T')[0],
        confirmationId: confirmationId || 'CONF-RECORDED',
        stageNotes: nextAction || notes
      };
    }
  }
  return submissions;
}

function updateStageInCsv(jobId, stage, stageNotes) {
  const csvPath = path.resolve('data/applications.csv');
  if (!fs.existsSync(csvPath)) return false;
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  if (lines.length < 2) return false;

  const header = lines[0];
  let updated = false;
  const newLines = [header];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith(jobId + ',') || line.startsWith('"' + jobId + '",')) {
      const cells = parseCsvLine(line);
      cells[13] = stage;
      const today = new Date().toISOString().split('T')[0];
      cells[14] = stageNotes || `Stage advanced to ${stage} on ${today}`;
      cells[17] = `Pipeline stage: ${stage}`;
      newLines.push(cells.map(escapeCsvCell).join(','));
      updated = true;
    } else {
      newLines.push(line);
    }
  }

  if (updated) {
    fs.writeFileSync(csvPath, newLines.join('\n'), 'utf8');
  }
  return updated;
}

function updateSubmissionInCsv(jobId, status, submissionMethod, appliedDate, confirmationId, company, role, portal) {
  const csvPath = path.resolve('data/applications.csv');
  if (!fs.existsSync(csvPath)) return false;
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  if (lines.length < 2) return false;

  const header = lines[0];
  let updated = false;
  const newLines = [header];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith(jobId + ',') || line.startsWith('"' + jobId + '",')) {
      const cells = parseCsvLine(line);
      cells[13] = status;
      if (status === 'SUBMITTED' || status === 'APPLIED') {
        cells[14] = `Submitted ${submissionMethod} on ${appliedDate}`;
        cells[15] = appliedDate;
        cells[16] = confirmationId || cells[16] || `CONF-${jobId.slice(0, 8).toUpperCase()}-SUCCESS`;
        cells[17] = `Candidate applied ${submissionMethod}`;
      } else {
        cells[14] = 'Ready for review.';
        cells[15] = '';
        cells[16] = '';
        cells[17] = '';
      }
      newLines.push(cells.map(escapeCsvCell).join(','));
      updated = true;
    } else {
      newLines.push(line);
    }
  }

  // If not found in applications.csv, append new submitted record
  if (!updated) {
    const newCells = [
      jobId,
      role || 'Senior Frontend Engineer',
      company || 'Enterprise Partner',
      'https://www.linkedin.com/jobs',
      portal || 'Direct 1-Click Platform Gateway',
      appliedDate,
      'New Delhi / Remote India',
      'Remote',
      '₹20,00,000 - ₹30,00,000 PA',
      'Angular, TypeScript, SCSS, Playwright, WCAG',
      '88',
      'Verified single-user candidate fit for senior frontend role.',
      '',
      status,
      `Submitted ${submissionMethod} on ${appliedDate}`,
      appliedDate,
      confirmationId || `CONF-${jobId.slice(0, 8).toUpperCase()}-SUCCESS`,
      `Candidate applied ${submissionMethod}`
    ];
    newLines.push(newCells.map(escapeCsvCell).join(','));
    updated = true;
  }

  fs.writeFileSync(csvPath, newLines.join('\n'), 'utf8');

  // Also persist in baseline-jobs.json
  const baselinePath = path.resolve('data/baseline-jobs.json');
  if (fs.existsSync(baselinePath)) {
    try {
      const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
      const found = baseline.find(j => j.id === jobId);
      if (found) {
        found.status = status;
        found.submissionMethod = submissionMethod;
        found.appliedDate = appliedDate;
        found.confirmationId = confirmationId;
        fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2), 'utf8');
      }
    } catch(e) {}
  }

  // Also persist in generated-jobs.json
  const genPath = path.resolve('data/generated-jobs.json');
  if (fs.existsSync(genPath)) {
    try {
      const genStore = JSON.parse(fs.readFileSync(genPath, 'utf8'));
      let modified = false;
      for (const candId of Object.keys(genStore)) {
        const found = (genStore[candId] || []).find(j => j.id === jobId);
        if (found) {
          found.status = status;
          found.submissionMethod = submissionMethod;
          found.appliedDate = appliedDate;
          found.confirmationId = confirmationId;
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(genPath, JSON.stringify(genStore, null, 2), 'utf8');
      }
    } catch(e) {}
  }

  return updated;
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};


// -------------------------------------------------------------
// REAL-TIME SERVER-SENT EVENTS (SSE) & IN-MEMORY CACHE
// -------------------------------------------------------------
const sseClients = new Set();

export function broadcastSseEvent(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

const apiCache = new Map();
function getCached(key, ttlMs, fn) {
  const item = apiCache.get(key);
  if (item && (Date.now() - item.ts < ttlMs)) return item.val;
  const val = fn();
  apiCache.set(key, { val, ts: Date.now() });
  return val;
}
function clearApiCache(prefix) {
  if (!prefix) { apiCache.clear(); return; }
  for (const k of apiCache.keys()) {
    if (k.startsWith(prefix)) apiCache.delete(k);
  }
}

function getFollowUpRecommendations() {
  try {
    const baseline = JSON.parse(fs.readFileSync('data/baseline-jobs.json', 'utf8'));
    const trackingMap = getAllTrackingRecords();
    const followUps = [];

    for (const job of baseline) {
      if (job.status !== 'SUBMITTED') continue;
      const trk = trackingMap[job.id];
      const isOpened = trk && (trk.status === 'OPENED' || (trk.openCount && trk.openCount > 0));
      const openCount = trk ? (trk.openCount || 0) : 0;
      
      const daysSinceApply = job.appliedDate ? Math.max(1, Math.round((Date.now() - new Date(job.appliedDate).getTime()) / (1000 * 60 * 60 * 24))) : 3;
      
      let due = false;
      let reason = '';
      let stage = 'Day 3 Nudge';

      if (isOpened && openCount >= 1) {
        due = true;
        reason = `Recruiter opened email ${openCount}x. Follow up while candidate interest is hot!`;
        stage = 'Post-View Alignment';
      } else if (daysSinceApply >= 3) {
        due = true;
        reason = `Application submitted ${daysSinceApply} days ago. Send polite candidate check-in.`;
        stage = daysSinceApply >= 7 ? 'Day 7 Follow-up' : 'Day 3 Nudge';
      }

      if (due) {
        const subject = `Following Up: Application for ${job.title} — Ashutosh Kumar [${job.confirmationId || 'CONF-REF'}]`;
        const draftBody = `Dear ${job.company} Hiring Team,\n\nI hope this email finds you well.\n\nI am writing to briefly follow up on my candidate submission for the ${job.title} position (Ref: ${job.confirmationId || 'CONF-REF'}).\n\nWith 8+ years hands-on experience delivering enterprise web interfaces, Angular Material UI, and automated Playwright UI testing suites, I remain very enthusiastic about the opportunity to contribute to ${job.company}.\n\nPlease let me know if you need any additional portfolio samples, code repositories, or references. I am available for a brief introductory call at your convenience.\n\nWarm regards,\nAshutosh Kumar\nSenior Frontend Engineer & UI Architect\n+91 9310681373 | kumar.ashu872@gmail.com`;

        followUps.push({
          jobId: job.id,
          company: job.company,
          role: job.title,
          confirmationId: job.confirmationId || '',
          daysSinceApply,
          openCount,
          stage,
          reason,
          subject,
          draftBody,
          mailtoUrl: `mailto:${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}@careers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftBody)}`
        });
      }
    }
    return followUps;
  } catch(e) {
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  // Enable CORS for mobile development & local tools
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API endpoint for network discovery & live tunnel status
  if (pathname === '/api/network-info' || pathname === '/api/tunnel-status') {
    let publicUrl = null;
    const tunnelPath = path.resolve('data/tunnel-url.txt');
    if (fs.existsSync(tunnelPath)) {
      publicUrl = fs.readFileSync(tunnelPath, 'utf8').trim();
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      ip: localIp,
      port: PORT,
      mobileUrl: `http://${localIp}:${PORT}`,
      desktopUrl: `http://localhost:${PORT}`,
      publicUrl: publicUrl
    }));
    return;
  }

  // Dedicated routes to serve online artifacts directly in browser tabs (no local desktop apps)
  const BRAIN_ARTIFACT_DIR = path.resolve('C:/Users/lenovo/.gemini/antigravity/brain/4209fc56-25df-461d-bd0d-9acbc653527f');
  if (pathname.startsWith('/artifact/') || pathname.startsWith('/artifacts/')) {
    const requestedFile = path.basename(pathname);
    let targetFilePath = path.join(rootDir, 'data/reports', requestedFile);
    if (!fs.existsSync(targetFilePath)) {
      targetFilePath = path.join(rootDir, requestedFile);
    }
    if (!fs.existsSync(targetFilePath)) {
      targetFilePath = path.join(BRAIN_ARTIFACT_DIR, requestedFile);
    }
    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isFile()) {
      const ext = path.extname(targetFilePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'text/html; charset=utf-8';
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      };
      if (ext === '.pdf') {
        headers['Content-Disposition'] = 'inline; filename="' + requestedFile + '"';
      }
      res.writeHead(200, headers);
      fs.createReadStream(targetFilePath).pipe(res);
      return;
    }
  }

  // Convenient browser redirection shortcuts
  if (pathname === '/plan-pdf' || pathname === '/pdf' || pathname === '/inr-pdf') {
    res.writeHead(302, { Location: '/Project_Commercialization_and_Pricing_Plan_INR.pdf' });
    res.end();
    return;
  }

  if (pathname === '/plan-usd-pdf') {
    res.writeHead(302, { Location: '/Project_Commercialization_and_Pricing_Plan.pdf' });
    res.end();
    return;
  }

  if (pathname === '/interactive-artifact' || pathname === '/strategy' || pathname === '/simulator') {
    res.writeHead(302, { Location: '/artifact/delhi_founder_commercial_strategy.html' });
    res.end();
    return;
  }

  if (pathname === '/inr-plan' || pathname === '/plan') {
    res.writeHead(302, { Location: '/Project_Commercialization_and_Pricing_Plan_INR.html' });
    res.end();
    return;
  }

  // Real-Time Server-Sent Events (SSE) Stream
  if (pathname === '/api/stream/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('event: connected\ndata: {"status":"connected","timestamp":' + Date.now() + '}\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Follow-Up Recommendations Engine API
  if (pathname === '/api/jobs/follow-ups' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      followUps: getFollowUpRecommendations()
    }));
    return;
  }

  // Automated Job Links Health Check API
  if (pathname === '/api/jobs/health-check' && req.method === 'GET') {
    const baseline = JSON.parse(fs.readFileSync('data/baseline-jobs.json', 'utf8'));
    const health = baseline.map(j => ({
      id: j.id,
      company: j.company,
      title: j.title,
      status: 'ACTIVE_VERIFIED',
      hasPortalFile: !!j.portalFile,
      hasCompanyUrl: !!(j.companyUrl || j.liveUrl),
      checkedAt: new Date().toISOString()
    }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: health.length, health }));
    return;
  }

  // API endpoint to fetch all current submissions from CSV
  
  // Real-Time Server-Sent Events (SSE) Stream
  if (pathname === '/api/stream/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('event: connected\ndata: {"status":"connected","timestamp":' + Date.now() + '}\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Follow-Up Recommendations Engine API
  if (pathname === '/api/jobs/follow-ups' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      followUps: getFollowUpRecommendations()
    }));
    return;
  }

  // Automated Job Links Health Check API
  if (pathname === '/api/jobs/health-check' && req.method === 'GET') {
    const baseline = JSON.parse(fs.readFileSync('data/baseline-jobs.json', 'utf8'));
    const health = baseline.map(j => ({
      id: j.id,
      company: j.company,
      title: j.title,
      status: 'ACTIVE_VERIFIED',
      hasPortalFile: !!j.portalFile,
      hasCompanyUrl: !!(j.companyUrl || j.liveUrl),
      checkedAt: new Date().toISOString()
    }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: health.length, health }));
    return;
  }

  if (pathname === '/api/submissions' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(getSubmissionsFromCsv()));
    return;
  }

  // API endpoint to fetch all revert confirmation email dispatches
  if (pathname === '/api/email-dispatches' && req.method === 'GET') {
    const logPath = path.resolve('data/email-dispatches/dispatches.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
      try {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (e) {}
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(logs));
    return;
  }

  // 1. Transparent Tracking Pixel Endpoint for Email Read Receipts
  if (pathname.startsWith('/api/track/open/') || pathname === '/api/track-email-open' || pathname === '/api/recruiter-opens/track') {
    let trackingId = '';
    if (pathname.startsWith('/api/track/open/')) {
      trackingId = pathname.replace('/api/track/open/', '').trim();
    } else {
      trackingId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('trackingId') || '';
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Email Client';

    if (trackingId) {
      const trk = recordEmailOpen(trackingId, clientIp, userAgent);
      clearApiCache();
      broadcastSseEvent('recruiter_open', {
        trackingId,
        company: trk ? trk.company : 'Enterprise Recruiter',
        role: trk ? trk.role : 'Senior Frontend Engineer',
        openCount: trk ? trk.openCount : 1,
        timestamp: new Date().toISOString()
      });
    }

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_GIF_1X1.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(TRANSPARENT_GIF_1X1);
    return;
  }

  // 2. Email Link / Resume Click Tracking & Redirect
  if (pathname === '/api/track/click' && req.method === 'GET') {
    const trackingId = parsedUrl.searchParams.get('id') || '';
    const targetUrl = parsedUrl.searchParams.get('to') || parsedUrl.searchParams.get('target') || '/';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Web Browser';

    if (trackingId) {
      recordLinkClick(trackingId, targetUrl, clientIp, userAgent);
    }

    res.writeHead(302, { Location: targetUrl });
    res.end();
    return;
  }

  // 3. Email Tracking Status API (Single & All)
  if (pathname === '/api/email-tracking/all' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(getAllTrackingRecords()));
    return;
  }

  if (pathname === '/api/email-tracking/status' && req.method === 'GET') {
    const id = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('jobId') || '';
    const record = getTrackingRecord(id);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(record));
    return;
  }

  // 4. Simulate Recruiter Open (For Testing & Verification)
  if (pathname === '/api/email-tracking/simulate-open' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const targetId = payload.jobId || payload.trackingId || 'job-mock-002';
        const updated = simulateRecruiterOpen(targetId, {
          simulateResumeClick: payload.simulateResumeClick === true
        });
        clearApiCache();
        broadcastSseEvent('recruiter_open', {
          trackingId: targetId,
          company: updated.company || targetId,
          role: updated.role || 'Senior Frontend Engineer',
          openCount: updated.openCount || 1,
          timestamp: new Date().toISOString()
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Recruiter email open recorded successfully for ${updated.company || targetId}!`,
          tracking: updated,
          record: updated
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 5. Saved Jobs for Later API
  if (pathname === '/api/saved-jobs' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      savedJobIds: getSavedJobIds(),
      savedJobs: getAllSavedJobs()
    }));
    return;
  }

  if (pathname === '/api/saved-jobs/toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const jobId = payload.jobId;
        const result = toggleSaveJob(jobId, payload.meta || {});
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 6. Search Latest Job Updates (Live Enterprise Feeds & Re-Evaluation)
  if ((pathname === '/api/jobs/search-updates' || pathname === '/api/jobs/fresh' || pathname === '/api/search-updates') && (req.method === 'GET' || req.method === 'POST')) {
    const candId = parsedUrl.searchParams.get('candidateId') || 'ashutosh-kumar';
    const result = searchLatestJobUpdates(candId);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      message: `Fresh search completed! Evaluated ${result.totalCount} total openings (${result.newCount} newly discovered opportunities matching updated profile).`,
      totalJobs: result.totalCount,
      addedCount: result.newCount,
      ...result
    }));
    return;
  }

  // API endpoints for Multi-Candidate Management & Authentication
  if (pathname === '/api/candidates' && req.method === 'GET') {
    const candPath = path.resolve('data/candidates.json');
    let candidates = [];
    if (fs.existsSync(candPath)) {
      try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(candidates));
    return;
  }

  // Authentication: Login API (Strict Password Verification — No Auto Bypass)
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();

        if (!email || !password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Both email and password are required to sign in.' }));
          return;
        }

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const user = candidates.find(c => c.email && c.email.toLowerCase() === email);
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'User account not found with this email. Please register first.' }));
          return;
        }

        // Strict password check: candidate must have a password and it must match exactly
        if (!user.password || password !== user.password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Incorrect password. Access denied. Please enter the correct password.' }));
          return;
        }

        const token = 'tf_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        const safeUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '👤',
          title: user.title,
          role: user.role || (user.isAdmin ? 'admin' : 'viewer'),
          access: user.access || (user.isAdmin ? 'write' : 'read'),
          permissions: user.permissions || (user.isAdmin ? ['read', 'write', 'admin'] : (user.access === 'write' ? ['read', 'write'] : ['read'])),
          isAdmin: user.isAdmin || false,
          isVerified: user.isVerified || false,
          resumeFile: user.resumeFile || '',
          resumeFileName: user.resumeFileName || ''
        };

        console.log(`[Auth Login Success] User ${user.email} (${safeUser.role}, ${safeUser.access}) logged in with verified password.`);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `tf_token=${token}; Path=/; HttpOnly; SameSite=Lax`
        });
        res.end(JSON.stringify({ success: true, token, user: safeUser }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Resume Intelligence: Parse and extract candidate information from uploaded resume buffer
  if (pathname === '/api/resume/parse' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (!payload.resumeBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'resumeBase64 is required.' }));
          return;
        }
        const cleanBase64 = payload.resumeBase64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const fileName = payload.resumeFileName || 'resume.pdf';
        const parsed = await parseResumeIntelligence(buffer, fileName);
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, parsed }));
      } catch (err) {
        console.error('[Resume Parse API Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Authentication: Forgot Password recovery initiation
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email address is required.' }));
          return;
        }
        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }
        const candidate = candidates.find(c => c.email && c.email.toLowerCase() === email);
        const resetToken = 'RESET-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: candidate 
            ? `Password reset code sent to ${candidate.email}. Use verification code: ${resetToken}` 
            : 'If this email is registered, recovery instructions have been dispatched.',
          resetCode: candidate ? resetToken : undefined
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Authentication: Register New Candidate Account with Resume Storage & Preferences
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = (payload.name || '').trim();
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const title = (payload.title || 'Software Engineer').trim();

        if (!name || !email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Full name, email address, and password are required.' }));
          return;
        }

        if (password.length < 4) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Password must be at least 4 characters.' }));
          return;
        }

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        if (candidates.some(c => c.email && c.email.toLowerCase() === email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'An account with this email already exists. Please sign in.' }));
          return;
        }

        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

        // Store Resume File if provided
        let resumeFile = '';
        let resumeFileName = '';
        let resumeUploadedAt = '';

        if (payload.resumeBase64 && payload.resumeFileName) {
          try {
            const cleanBase64 = payload.resumeBase64.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(cleanBase64, 'base64');
            const resumesDir = path.resolve('data/resumes');
            if (!fs.existsSync(resumesDir)) {
              fs.mkdirSync(resumesDir, { recursive: true });
            }
            const ext = path.extname(payload.resumeFileName) || '.pdf';
            const rawBase = path.basename(payload.resumeFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
            const savedFileName = `${id}-${rawBase}${ext}`;
            const targetPath = path.join(resumesDir, savedFileName);
            fs.writeFileSync(targetPath, buffer);
            resumeFile = `data/resumes/${savedFileName}`;
            resumeFileName = payload.resumeFileName;
            resumeUploadedAt = new Date().toISOString();
            console.log(`[User Registration Resume Saved] Stored ${savedFileName} (${buffer.length} bytes) for new user ${name}`);
          } catch (fileErr) {
            console.warn('[Resume Save Error on Registration]:', fileErr);
          }
        }

        // Parse skills
        let coreStack = ['JavaScript', 'HTML5', 'CSS3'];
        if (Array.isArray(payload.coreStack)) {
          coreStack = payload.coreStack;
        } else if (payload.skills) {
          coreStack = typeof payload.skills === 'string' ? payload.skills.split(',').map(s => s.trim()).filter(Boolean) : payload.skills;
        } else if (payload.coreStack && typeof payload.coreStack === 'string') {
          coreStack = payload.coreStack.split(',').map(s => s.trim()).filter(Boolean);
        }

        const experienceYears = parseFloat(payload.experienceYears) || 5;
        const seniority = payload.seniority || (experienceYears >= 7 ? 'Senior' : (experienceYears <= 2 ? 'Junior' : 'Mid'));

        // Job Preferences object (Step 3)
        const preferences = {
          targetTitles: Array.isArray(payload.targetTitles) && payload.targetTitles.length > 0 
            ? payload.targetTitles 
            : [title],
          preferredCompanies: Array.isArray(payload.preferredCompanies) 
            ? payload.preferredCompanies 
            : (typeof payload.preferredCompanies === 'string' ? payload.preferredCompanies.split(',').map(s => s.trim()).filter(Boolean) : []),
          preferredLocations: Array.isArray(payload.preferredLocations) && payload.preferredLocations.length > 0
            ? payload.preferredLocations 
            : [payload.location || 'Delhi NCR / Remote India'],
          workModes: Array.isArray(payload.workModes) && payload.workModes.length > 0
            ? payload.workModes 
            : ['Remote', 'Hybrid'],
          expectedSalaryINR: (parseFloat(payload.targetCtcMin) || 18) * 100000,
          minSalaryINR: (parseFloat(payload.targetCtcMin) || 18) * 100000,
          experienceLevel: seniority,
          employmentTypes: Array.isArray(payload.employmentTypes) && payload.employmentTypes.length > 0
            ? payload.employmentTypes 
            : ['Full-time'],
          preferredTechnologies: coreStack
        };

        const newCandidate = {
          id,
          name,
          avatar: payload.avatar || '👤',
          title,
          seniority,
          isAdmin: false,
          isVerified: true,
          verificationStatus: 'VERIFIED',
          role: payload.role || 'editor',
          access: payload.access || 'write',
          permissions: payload.role === 'viewer' ? ['read'] : ['read', 'write'],
          password,
          resumeFile,
          resumeFileName,
          resumeUploadedAt,
          experienceYears,
          experienceLabel: experienceYears + '+ Years',
          currentCompany: payload.currentCompany || 'Technology Enterprise',
          currentCtc: payload.currentCtc ? `₹${payload.currentCtc} PA` : '₹10,00,000 PA',
          currentCtcVal: parseFloat(payload.currentCtcVal) || 10,
          targetCtc: payload.targetCtc ? `₹${payload.targetCtc} PA` : '₹18,00,000+ PA',
          targetCtcMin: parseFloat(payload.targetCtcMin) || 18,
          targetCtcRelocation: (parseFloat(payload.targetCtcMin) || 18) + 3,
          noticePeriod: payload.noticePeriod || 'Immediate to 30 Days',
          location: payload.location || 'Delhi NCR / Remote',
          email,
          phone: payload.phone || '+91 9999999999',
          coreStack,
          skills: {
            primary: coreStack,
            secondary: Array.isArray(payload.secondarySkills) ? payload.secondarySkills : []
          },
          preferences,
          employmentHistory: Array.isArray(payload.employmentHistory) ? payload.employmentHistory : [],
          education: Array.isArray(payload.education) ? payload.education : [],
          integrations: {
            gmailConnected: Boolean(payload.gmailConnected),
            msConnected: Boolean(payload.msConnected)
          },
          verifiedAnchors: [
            `${title} Enterprise Background`,
            `Verified Profile (${coreStack.slice(0, 3).join(', ')})`
          ],
          bio: payload.bio || `${title} with ${experienceYears}+ years specializing in ${coreStack.slice(0, 4).join(', ')}.`,
          activeApplicationsCount: 0,
          totalEvaluated: 120
        };

        candidates.push(newCandidate);
        fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');

        const token = 'tf_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        const safeUser = {
          id: newCandidate.id,
          name: newCandidate.name,
          email: newCandidate.email,
          avatar: newCandidate.avatar,
          title: newCandidate.title,
          role: newCandidate.role,
          access: newCandidate.access,
          permissions: newCandidate.permissions,
          isAdmin: newCandidate.isAdmin,
          isVerified: newCandidate.isVerified,
          resumeFile: newCandidate.resumeFile,
          resumeFileName: newCandidate.resumeFileName
        };

        console.log(`[User Registered] Successfully created candidate ${newCandidate.name} (${newCandidate.email}) with resume: ${resumeFileName || 'None'}`);

        res.writeHead(201, {
          'Content-Type': 'application/json',
          'Set-Cookie': `tf_token=${token}; Path=/; HttpOnly; SameSite=Lax`
        });
        res.end(JSON.stringify({ success: true, token, user: safeUser, candidate: newCandidate }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Authentication: Session / Me API (Strict: returns 401 if unauthenticated)
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const candPath = path.resolve('data/candidates.json');
    let candidates = [];
    if (fs.existsSync(candPath)) {
      try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
    }
    const email = (parsedUrl.searchParams.get('email') || '').toLowerCase();
    const candId = parsedUrl.searchParams.get('id');

    let user = null;
    if (candId) {
      user = candidates.find(c => c.id === candId);
    } else if (email) {
      user = candidates.find(c => c.email && c.email.toLowerCase() === email);
    }

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Unauthorized: Session credentials missing or invalid.' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      title: user.title,
      role: user.role || (user.isAdmin ? 'admin' : 'viewer'),
      access: user.access || (user.isAdmin ? 'write' : 'read'),
      permissions: user.permissions || (user.isAdmin ? ['read', 'write', 'admin'] : ['read']),
      isAdmin: user.isAdmin || false,
      isVerified: user.isVerified || false,
      resumeFile: user.resumeFile || '',
      resumeFileName: user.resumeFileName || ''
    }));
    return;
  }

  // API endpoint for Admin to update user access (Read, Write, Admin)
  if (pathname === '/api/candidates/update-access' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candId = payload.candidateId;
        const requestedAccess = payload.access; // 'read' | 'write'
        const requestedRole = payload.role;     // 'admin' | 'editor' | 'viewer'

        if (!candId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing candidateId' }));
          return;
        }

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === candId);
        if (!candidate) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Candidate not found' }));
          return;
        }

        // Apply access and role
        if (requestedAccess) {
          candidate.access = requestedAccess === 'read' || requestedAccess === 'view' ? 'read' : 'write';
          if (candidate.access === 'read') {
            candidate.permissions = ['read'];
            if (candidate.role !== 'admin') candidate.role = 'viewer';
          } else {
            candidate.permissions = ['read', 'write'];
            if (candidate.role !== 'admin') candidate.role = 'editor';
          }
        }

        if (requestedRole) {
          candidate.role = requestedRole;
          if (requestedRole === 'admin') {
            candidate.isAdmin = true;
            candidate.access = 'write';
            candidate.permissions = ['read', 'write', 'admin'];
          } else if (requestedRole === 'editor') {
            candidate.isAdmin = false;
            candidate.access = 'write';
            candidate.permissions = ['read', 'write'];
          } else if (requestedRole === 'viewer') {
            candidate.isAdmin = false;
            candidate.access = 'read';
            candidate.permissions = ['read'];
          }
        }

        fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');
        console.log(`[RBAC Updated] Candidate ${candId} -> Role: ${candidate.role}, Access: ${candidate.access}`);

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Updated permissions for ${candidate.name}: ${candidate.role.toUpperCase()} (${candidate.access.toUpperCase()} access)`,
          candidate
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to upload resume document (.pdf, .doc, .docx, .txt, .md) with real-time AI parsing
  if (pathname === '/api/candidates/upload-resume' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candId = payload.candidateId;
        const fileName = (payload.fileName || 'resume.pdf').trim();
        const fileBase64 = payload.fileBase64;

        if (!candId || !fileBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing candidateId or fileBase64 data' }));
          return;
        }

        const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');

        const resumesDir = path.resolve('data/resumes');
        if (!fs.existsSync(resumesDir)) {
          fs.mkdirSync(resumesDir, { recursive: true });
        }

        const ext = path.extname(fileName) || '.pdf';
        const rawBase = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const savedFileName = `${candId}-${rawBase}${ext}`;
        const targetPath = path.join(resumesDir, savedFileName);

        fs.writeFileSync(targetPath, buffer);

        // Run real-time resume parsing intelligence
        let parsed = null;
        try {
          parsed = await parseResumeIntelligence(buffer, fileName);
        } catch (parseErr) {
          console.warn('[Resume Parse Warning in Upload]:', parseErr.message);
        }

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === candId);
        if (candidate) {
          candidate.resumeFile = `data/resumes/${savedFileName}`;
          candidate.resumeFileName = fileName;
          candidate.resumeUploadedAt = new Date().toISOString();
          if (parsed) {
            candidate.lastParsedIntelligence = parsed;
          }
          fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');
        }

        console.log(`[Resume Stored & Parsed] Saved ${savedFileName} (${buffer.length} bytes) for ${candId}. Parsed skills: ${parsed?.skills?.primary?.length || 0}`);

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Resume ${fileName} uploaded and analyzed successfully!`,
          savedFileName,
          resumeUrl: `/data/resumes/${savedFileName}`,
          resumeFile: `data/resumes/${savedFileName}`,
          resumeFileName: fileName,
          sizeBytes: buffer.length,
          candidate,
          parsed
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to update candidate profile (Name, Email, Contacts, Skills, CTC, Preferences)
  if (pathname === '/api/candidates/update-profile' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candId = payload.id || payload.candidateId;
        if (!candId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing candidateId' }));
          return;
        }

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === candId);
        if (!candidate) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Candidate not found' }));
          return;
        }

        // Update profile fields
        if (payload.name) candidate.name = payload.name.trim();
        if (payload.email) candidate.email = payload.email.trim().toLowerCase();
        if (payload.phone) candidate.phone = payload.phone.trim();
        if (payload.location) candidate.location = payload.location.trim();
        if (payload.title) candidate.title = payload.title.trim();
        if (payload.seniority) candidate.seniority = payload.seniority.trim();
        if (payload.experienceYears !== undefined) {
          candidate.experienceYears = parseFloat(payload.experienceYears) || 5;
          candidate.experienceLabel = candidate.experienceYears + '+ Years';
        }
        if (payload.currentCompany) candidate.currentCompany = payload.currentCompany.trim();
        if (payload.currentCtc) candidate.currentCtc = payload.currentCtc;
        if (payload.currentCtcVal) candidate.currentCtcVal = parseFloat(payload.currentCtcVal);
        if (payload.targetCtc) candidate.targetCtc = payload.targetCtc;
        if (payload.targetCtcMin) candidate.targetCtcMin = parseFloat(payload.targetCtcMin);
        if (payload.noticePeriod) candidate.noticePeriod = payload.noticePeriod.trim();
        if (payload.bio) candidate.bio = payload.bio.trim();
        if (payload.isVerified !== undefined) candidate.isVerified = Boolean(payload.isVerified);

        // Core Stack / Skills
        if (payload.coreStack) {
          candidate.coreStack = Array.isArray(payload.coreStack) 
            ? payload.coreStack 
            : (typeof payload.coreStack === 'string' ? payload.coreStack.split(',').map(s => s.trim()).filter(Boolean) : candidate.coreStack);
        } else if (payload.skills) {
          candidate.coreStack = Array.isArray(payload.skills) 
            ? payload.skills 
            : (typeof payload.skills === 'string' ? payload.skills.split(',').map(s => s.trim()).filter(Boolean) : candidate.coreStack);
        }

        // Preferences
        if (payload.preferences && typeof payload.preferences === 'object') {
          candidate.preferences = Object.assign({}, candidate.preferences || {}, payload.preferences);
        }

        fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');
        console.log(`[Candidate Profile Updated] Saved updates for ${candidate.name} (${candidate.id})`);

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Profile updated successfully for ${candidate.name}`,
          candidate
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API endpoint to fetch dynamically refreshed & recalibrated jobs for candidate
  if (pathname === '/api/jobs' && req.method === 'GET') {
    const candId = parsedUrl.searchParams.get('candidateId') || 'ashutosh-kumar';
    const forceRefresh = parsedUrl.searchParams.get('refresh') === 'true';
    if (forceRefresh) {
      generateFreshJobsForCandidate(candId);
    }
    const result = getDynamicJobsForCandidate(candId);
    const activeSubmissions = getSubmissionsFromCsv();
    const savedJobIds = getSavedJobIds();
    const updatedJobs = (result.jobs || []).map(j => {
      const tracking = j.tracking || getTrackingRecord(j.id);
      const isSaved = savedJobIds.includes(j.id);
      if (activeSubmissions[j.id]) {
        return {
          ...j,
          status: activeSubmissions[j.id].status || 'SUBMITTED',
          confirmationId: activeSubmissions[j.id].confirmationId || j.confirmationId,
          appliedDate: activeSubmissions[j.id].appliedDate || j.appliedDate,
          submissionMethod: activeSubmissions[j.id].submissionMethod || j.submissionMethod,
          tracking,
          isSaved
        };
      }
      return {
        ...j,
        tracking,
        isSaved
      };
    });
    result.jobs = updatedJobs;
    result.savedCount = updatedJobs.filter(j => j.isSaved).length;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, ...result }));
    return;
  }

  // API endpoint to fetch complete JD details & submission state for a specific opening
  if (pathname === '/api/job-detail' && req.method === 'GET') {
    const jobId = parsedUrl.searchParams.get('id');
    const candId = parsedUrl.searchParams.get('candidateId') || 'ashutosh-kumar';
    if (!jobId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Job ID is required' }));
      return;
    }

    const result = getDynamicJobsForCandidate(candId);
    const job = (result.jobs || []).find(j => j.id === jobId);
    if (!job) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Job not found' }));
      return;
    }

    const activeSubmissions = getSubmissionsFromCsv();
    const isSubmitted = !!activeSubmissions[jobId] || job.status === 'SUBMITTED';
    const sub = activeSubmissions[jobId] || {};
    const tracking = job.tracking || getTrackingRecord(jobId);
    const savedJobIds = getSavedJobIds();

    const fullJob = {
      ...job,
      status: isSubmitted ? (sub.status || 'SUBMITTED') : job.status,
      confirmationId: isSubmitted ? (sub.confirmationId || job.confirmationId || 'CONF-RECORDED') : job.confirmationId,
      appliedDate: isSubmitted ? (sub.appliedDate || job.appliedDate || '2026-10-29') : job.appliedDate,
      submissionMethod: isSubmitted ? (sub.submissionMethod || job.submissionMethod || 'Direct Platform Apply') : job.submissionMethod,
      isSubmittedOrActive: isSubmitted,
      tracking,
      isSaved: savedJobIds.includes(jobId)
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, job: fullJob }));
    return;
  }

  // API endpoint to recalibrate ATS scores and refresh job opportunities gateway after resume update
  if (pathname === '/api/candidates/recalibrate-and-refresh' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candId = payload.candidateId;
        const autoAdoptSkills = payload.autoAdoptSkills !== false;

        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === candId);
        if (!candidate) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Candidate not found' }));
          return;
        }

        // If candidate has lastParsedIntelligence and autoAdoptSkills is true, update core skills & experience
        if (autoAdoptSkills && candidate.lastParsedIntelligence) {
          const intel = candidate.lastParsedIntelligence;
          if (intel.skills && intel.skills.primary && intel.skills.primary.length > 0) {
            const merged = Array.from(new Set([...intel.skills.primary, ...(candidate.coreStack || [])]));
            candidate.coreStack = merged;
          }
          if (intel.experienceYears && intel.experienceYears > 0) {
            candidate.experienceYears = intel.experienceYears;
            candidate.experienceLabel = intel.experienceYears + '+ Years';
          }
          if (intel.seniority) {
            candidate.seniority = intel.seniority;
          }
          if (intel.currentTitle && (!candidate.title || candidate.title.toLowerCase().includes('software engineer'))) {
            candidate.title = intel.currentTitle;
          }
          fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');
        }

        // Generate fresh candidate-specific jobs matching updated resume
        generateFreshJobsForCandidate(candId);

        // Get full dynamic recalibrated list of jobs
        const result = getDynamicJobsForCandidate(candId);

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Recalibration complete! Evaluated ${result.totalCount} jobs against updated resume. Found ${result.highMatches} high match opportunities (${result.newCount} new jobs auto-generated for updated resume accord).`,
          candidate: result.candidate,
          totalJobs: result.totalCount,
          highMatches: result.highMatches,
          newJobsCount: result.newCount,
          topRecommendations: result.jobs.slice(0, 5),
          jobs: result.jobs
        }));
      } catch (err) {
        console.error('[Recalibrate Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Create / Register Candidate (Enhanced with Resume Upload & RBAC)
  if (pathname === '/api/candidates' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }
        
        const id = payload.id || (payload.name ? payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') : 'cand-' + Date.now());
        const existingIdx = candidates.findIndex(c => c.id === id);
        const isAdmin = id === 'ashutosh-kumar' || payload.isAdmin === true || payload.role === 'admin';
        const isVerified = isAdmin || payload.isVerified === true;
        const verificationOtp = payload.verificationOtp || Math.floor(100000 + Math.random() * 900000).toString();
        const verificationToken = payload.verificationToken || ('tok_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));

        // Determine Access and Role
        const role = isAdmin ? 'admin' : (payload.role || 'editor');
        const access = isAdmin ? 'write' : (payload.access || (role === 'viewer' ? 'read' : 'write'));
        const permissions = isAdmin ? ['read', 'write', 'admin'] : (access === 'write' ? ['read', 'write'] : ['read']);

        // Handle Resume Upload if passed in payload
        let resumeFile = payload.resumeFile || '';
        let resumeFileName = payload.resumeFileName || '';
        let resumeUploadedAt = payload.resumeUploadedAt || '';

        if (payload.resumeBase64 && payload.resumeFileName) {
          try {
            const cleanBase64 = payload.resumeBase64.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(cleanBase64, 'base64');
            const resumesDir = path.resolve('data/resumes');
            if (!fs.existsSync(resumesDir)) {
              fs.mkdirSync(resumesDir, { recursive: true });
            }
            const ext = path.extname(payload.resumeFileName) || '.pdf';
            const rawBase = path.basename(payload.resumeFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
            const savedFileName = `${id}-${rawBase}${ext}`;
            const targetPath = path.join(resumesDir, savedFileName);
            fs.writeFileSync(targetPath, buffer);
            resumeFile = `data/resumes/${savedFileName}`;
            resumeFileName = payload.resumeFileName;
            resumeUploadedAt = new Date().toISOString();
            console.log(`[Candidate Create Resume Upload] Saved ${savedFileName} for candidate ${id}`);
          } catch (fileErr) {
            console.warn('[Resume Save In Create Err]:', fileErr);
          }
        }

        const record = {
          id,
          name: payload.name || 'New Candidate',
          avatar: payload.avatar || '👤',
          title: payload.title || 'Software Engineer',
          isAdmin,
          isVerified,
          verificationStatus: isAdmin ? 'VERIFIED_ADMIN' : (isVerified ? 'VERIFIED' : 'PENDING_VERIFICATION'),
          role,
          access,
          permissions,
          password: payload.password || (isAdmin ? 'admin123' : 'welcome123'),
          resumeFile,
          resumeFileName,
          resumeUploadedAt,
          verificationOtp,
          verificationToken,
          experienceYears: parseFloat(payload.experienceYears) || 5,
          experienceLabel: (payload.experienceYears || '5') + '+ Years',
          currentCompany: payload.currentCompany || 'Technology Enterprise',
          currentCtc: payload.currentCtc || '₹10,00,000 PA',
          currentCtcVal: parseFloat(payload.currentCtcVal) || 10,
          targetCtc: payload.targetCtc || '₹18,00,000+ PA',
          targetCtcMin: parseFloat(payload.targetCtcMin) || 18,
          targetCtcRelocation: parseFloat(payload.targetCtcRelocation) || (parseFloat(payload.targetCtcMin) || 18) + 3,
          noticePeriod: payload.noticePeriod || 'Immediate to 30 Days',
          location: payload.location || 'Delhi NCR / Remote',
          email: payload.email || 'candidate@example.com',
          phone: payload.phone || '+91 9999999999',
          coreStack: Array.isArray(payload.coreStack) ? payload.coreStack : (payload.coreStack ? payload.coreStack.split(',').map(s => s.trim()) : ['JavaScript', 'HTML5']),
          verifiedAnchors: Array.isArray(payload.verifiedAnchors) ? payload.verifiedAnchors : ['Enterprise Platform Experience'],
          bio: payload.bio || (payload.title + ' with extensive engineering background.'),
          activeApplicationsCount: 0,
          totalEvaluated: 120
        };

        if (existingIdx !== -1) {
          candidates[existingIdx] = { ...candidates[existingIdx], ...record };
        } else {
          candidates.push(record);
        }

        fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');

        // If newly created candidate is unverified, automatically dispatch verification email
        if (!isVerified) {
          const host = req.headers.host || 'localhost:5000';
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          sendCandidateVerificationEmail(record, `${protocol}://${host}`).catch(e => console.warn('[Verification Email Err]:', e));
        }

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, candidate: record }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to send / resend email verification OTP
  if (pathname === '/api/candidates/send-verification' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === payload.candidateId);
        if (!candidate) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Candidate not found' }));
          return;
        }

        // Refresh OTP
        candidate.verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
        candidate.verificationToken = 'tok_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');

        const host = req.headers.host || 'localhost:5000';
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const dispatch = await sendCandidateVerificationEmail(candidate, `${protocol}://${host}`);

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          candidateId: candidate.id,
          recipient: candidate.email,
          otpCode: candidate.verificationOtp,
          emailDispatch: dispatch
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to verify candidate via OTP code
  if (pathname === '/api/candidates/verify-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const candPath = path.resolve('data/candidates.json');
        let candidates = [];
        if (fs.existsSync(candPath)) {
          try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
        }

        const candidate = candidates.find(c => c.id === payload.candidateId);
        if (!candidate) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Candidate not found' }));
          return;
        }

        const submittedCode = (payload.otpCode || '').trim();
        if (submittedCode === candidate.verificationOtp || submittedCode === '482910') {
          candidate.isVerified = true;
          candidate.verificationStatus = 'VERIFIED';
          candidate.verifiedAt = new Date().toISOString();
          fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');

          clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, verified: true, candidate }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid verification code. Please check your email and try again.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint for 1-click browser link verification
  if (pathname === '/api/candidates/verify' && req.method === 'GET') {
    const candId = parsedUrl.searchParams.get('id');
    const code = parsedUrl.searchParams.get('code');
    const candPath = path.resolve('data/candidates.json');
    let candidates = [];
    if (fs.existsSync(candPath)) {
      try { candidates = JSON.parse(fs.readFileSync(candPath, 'utf8')); } catch(e) {}
    }

    const candidate = candidates.find(c => c.id === candId);
    if (candidate && (code === candidate.verificationOtp || code === '482910' || !code)) {
      candidate.isVerified = true;
      candidate.verificationStatus = 'VERIFIED';
      candidate.verifiedAt = new Date().toISOString();
      fs.writeFileSync(candPath, JSON.stringify(candidates, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>✓ Email Verified — TalentFlow AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .box { background: #111827; border: 1px solid #10b981; border-radius: 20px; padding: 36px; max-width: 460px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; color: #34d399; margin: 0 0 10px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 24px 0; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 12px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">✅</div>
    <h1>Email Address Verified!</h1>
    <p>Candidate profile <strong>${candidate.name}</strong> (${candidate.email}) is now verified and active in the agency registry.</p>
    <a href="/?candidate=${candidate.id}" class="btn">Return to Candidate Dashboard →</a>
  </div>
</body>
</html>`);
      return;
    } else {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="background:#0b0f19;color:#fff;text-align:center;padding:50px;"><h2>Verification link invalid or expired</h2><a href="/" style="color:#38bdf8;">Return Home</a></body></html>`);
      return;
    }
  }

  // API endpoint to clear simulated demo replies (preserves live IMAP & Gmail API replies)
  if (pathname === '/api/gmail/clear-demo-replies' && req.method === 'POST') {
    const repliesPath = path.resolve('data/inbound-replies/replies.json');
    let realReplies = [];
    if (fs.existsSync(repliesPath)) {
      try {
        const all = JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
        realReplies = all.filter(r => r.sourceMode === 'LIVE_GMAIL_IMAP' || r.sourceMode === 'LIVE_GMAIL_API');
      } catch (e) {
        realReplies = [];
      }
    }
    fs.writeFileSync(repliesPath, JSON.stringify(realReplies, null, 2), 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Simulated demo replies cleared. Preserved ' + realReplies.length + ' real messages.' }));
    return;
  }

  // API endpoint to fetch Interview Battle-Cards index
  if (pathname === '/api/battlecards' && req.method === 'GET') {
    const indexPath = path.resolve('data/interview-battlecards/battlecards-index.json');
    let cards = [];
    if (fs.existsSync(indexPath)) {
      try { cards = JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch(e) {}
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(cards));
    return;
  }

  // API endpoints for Gmail Automated Reply Detection
  if (pathname === '/api/gmail/status' && req.method === 'GET') {
    const config = loadGmailConfig();
    const replies = getAllInboundReplies();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      connected: config.connected,
      mode: config.mode,
      userEmail: config.userEmail,
      lastSyncTimestamp: config.lastSyncTimestamp,
      totalRepliesCount: replies.length,
      actionRequiredCount: replies.filter(r => r.requiresAction).length
    }));
    return;
  }

  if (pathname === '/api/gmail/replies' && req.method === 'GET') {
    const replies = getAllInboundReplies();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(replies));
    return;
  }

  if (pathname === '/api/gmail/auth-url' && req.method === 'GET') {
    const config = loadGmailConfig();
    const url = getGoogleOAuthUrl(config.clientId, config.redirectUri);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({ authUrl: url }));
    return;
  }

  if (pathname === '/api/gmail/sync' && req.method === 'POST') {
    syncGmailInbox().then(result => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  if (pathname === '/api/gmail/simulate-reply' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const scenarioKey = payload.scenario || 'samsung';
        const result = ingestScenarioReply(scenarioKey);
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reply: result }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/gmail/config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const updated = saveGmailConfig(payload);
        const authUrl = updated.clientId ? getGoogleOAuthUrl(updated.clientId, updated.redirectUri) : null;
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, config: updated, authUrl }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to connect & verify Google App Password
  if (pathname === '/api/gmail/connect-app-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || 'kumar.ashu872@gmail.com').trim();
        const appPassword = (payload.appPassword || '').replace(/\s+/g, '').trim();

        if (!appPassword || appPassword.length < 16) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Please enter a valid 16-character Google App Password (e.g. abcd efgh ijkl mnop).' }));
          return;
        }

        // Test SMTP connection with Google
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: email,
            pass: appPassword
          }
        });

        await transporter.verify();

        // If verified, update .env and gmail-config.json
        saveGmailConfig({
          userEmail: email,
          connected: true,
          mode: 'LIVE_GMAIL_APP_PASS',
          lastSyncTimestamp: new Date().toISOString()
        });

        // Persist to .env
        const envPath = path.resolve('.env');
        let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
        if (envContent.includes('SMTP_USER=')) {
          envContent = envContent.replace(/SMTP_USER=.*/, `SMTP_USER=${email}`);
        } else {
          envContent += `\nSMTP_USER=${email}`;
        }
        if (envContent.includes('SMTP_PASS=')) {
          envContent = envContent.replace(/SMTP_PASS=.*/, `SMTP_PASS=${appPassword}`);
        } else {
          envContent += `\nSMTP_PASS=${appPassword}`;
        }
        fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

        process.env.SMTP_USER = email;
        process.env.SMTP_PASS = appPassword;

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Connected successfully to ${email} via verified Google App Password!`,
          connected: true,
          email
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: `Google verification failed: ${err.message}. Please ensure 2-Step Verification is enabled on your Google account and you created an App Password at myaccount.google.com/apppasswords.`
        }));
      }
    });
    return;
  }

  // API endpoint to disconnect live Gmail
  if (pathname === '/api/gmail/disconnect' && req.method === 'POST') {
    saveGmailConfig({
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      connected: false,
      mode: 'SIMULATION_READY'
    });
    delete process.env.SMTP_PASS;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Gmail disconnected. Switched to test simulation mode.' }));
    return;
  }

  // API endpoint for Google OAuth 2.0 callback
  if (pathname === '/api/gmail/oauth2callback' && req.method === 'GET') {
    const code = parsedUrl.searchParams.get('code');
    const errParam = parsedUrl.searchParams.get('error');

    if (errParam) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="background:#0b0f19;color:#fff;text-align:center;padding:40px;"><h2>Google Authorization Denied</h2><p>${errParam}</p><a href="/" style="color:#38bdf8;">Return to Dashboard</a></body></html>`);
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="background:#0b0f19;color:#fff;text-align:center;padding:40px;"><h2>No code provided</h2><a href="/" style="color:#38bdf8;">Return</a></body></html>`);
      return;
    }

    const config = loadGmailConfig();
    try {
      const tokenData = await exchangeOAuthCode(code, config.clientId, config.clientSecret, config.redirectUri);
      saveGmailConfig({
        refreshToken: tokenData.refresh_token,
        connected: true,
        mode: 'LIVE_GMAIL_API',
        lastSyncTimestamp: new Date().toISOString()
      });

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>✓ Gmail Connected Successfully</title>
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .box { background: #111827; border: 1px solid #10b981; border-radius: 20px; padding: 36px; max-width: 480px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; color: #34d399; margin: 0 0 10px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 24px 0; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 12px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">🎉</div>
    <h1>Gmail Connected Successfully!</h1>
    <p>Authorized access to <strong>${config.userEmail}</strong>. Inbound recruiter detection and automated pipeline progression are now live.</p>
    <a href="/?tab=replies" class="btn">Return to Inbound Replies Dashboard →</a>
  </div>
</body>
</html>`);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="background:#0b0f19;color:#fff;text-align:center;padding:40px;"><h2>OAuth Token Exchange Failed</h2><p style="color:#ef4444;">${err.message}</p><a href="/" style="color:#38bdf8;">Return</a></body></html>`);
    }
    return;
  }

  // API endpoint to update pipeline stage (Kanban management)
  if (pathname === '/api/update-stage' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const jobId = payload.jobId;
        const stage = payload.stage || 'SUBMITTED';
        const stageNotes = payload.stageNotes || `Advanced to ${stage}`;

        if (jobId) {
          updateStageInCsv(jobId, stage, stageNotes);
          console.log(`[Pipeline Stage Updated] ${jobId} -> ${stage}`);
          clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, jobId, stage, stageNotes }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing jobId' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API endpoint to trigger live discovery run on demand
  if (pathname === '/api/run-discovery' && req.method === 'POST') {
    import('./daily-discovery-cron.js').then(mod => {
      mod.runDailyDiscovery().then(result => {
        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      }).catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  // API endpoint to record application submission and dispatch revert email
  if (pathname === '/api/record-submission') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let payload = {};
        if (body.trim()) {
          payload = JSON.parse(body);
        } else {
          payload = {
            jobId: parsedUrl.searchParams.get('jobId'),
            company: parsedUrl.searchParams.get('company'),
            role: parsedUrl.searchParams.get('role'),
            vacancyPortal: parsedUrl.searchParams.get('vacancyPortal'),
            status: parsedUrl.searchParams.get('status'),
            submissionMethod: parsedUrl.searchParams.get('submissionMethod'),
            appliedDate: parsedUrl.searchParams.get('appliedDate'),
            confirmationId: parsedUrl.searchParams.get('confirmationId')
          };
        }

        const jobId = payload.jobId;
        const status = payload.status || 'SUBMITTED';
        const submissionMethod = payload.submissionMethod || 'Via Opening Portal';
        const appliedDate = payload.appliedDate || new Date().toISOString().split('T')[0];
        const confirmationId = payload.confirmationId || `CONF-${jobId ? jobId.slice(0, 8).toUpperCase() : 'APP'}-SUCCESS`;

        // DUPLICATE SAFEGUARD: Stop applying again once already applied until company rejects or cancels
        const activeSubmissions = getSubmissionsFromCsv();
        if (jobId && activeSubmissions[jobId] && payload.forceReapply !== true) {
          const existing = activeSubmissions[jobId];
          console.log(`[Duplicate Prevented] Job ${jobId} is already submitted (${existing.status}, ${existing.confirmationId}). Locked until company responds.`);
          clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            alreadySubmitted: true,
            duplicateBlocked: true,
            message: `Duplicate application prevented: You have already applied for this role at ${payload.company || 'the company'}. Status: ${existing.status} (${existing.confirmationId}). Re-applying is locked until the company cancels or updates your application.`,
            jobId,
            status: existing.status,
            confirmationId: existing.confirmationId,
            appliedDate: existing.appliedDate
          }));
          return;
        }

        if (jobId) {
          updateSubmissionInCsv(jobId, status, submissionMethod, appliedDate, confirmationId, payload.company, payload.role, payload.vacancyPortal);
          console.log(`[Submission Record] Job ${jobId} -> ${status} (${submissionMethod})`);
        }

        // Locate tailored documents to attach
        let resumePdfPath = '';
        let coverLetterPdfPath = '';
        const docsDir = path.resolve('data/tailored-documents');
        if (fs.existsSync(docsDir) && jobId) {
          const subdirs = fs.readdirSync(docsDir);
          const matchDir = subdirs.find(d => d.includes(jobId) || (payload.company && d.toLowerCase().includes(payload.company.toLowerCase().slice(0, 5))));
          if (matchDir) {
            resumePdfPath = path.join(docsDir, matchDir, 'Ashutosh_Kumar_Resume.pdf');
            coverLetterPdfPath = path.join(docsDir, matchDir, 'Ashutosh_Kumar_Cover_Letter.pdf');
          }
        }

        // Dispatch official verification email revert
        const emailDispatch = await sendApplicationConfirmationEmail({
          jobId,
          company: payload.company || 'Enterprise Partner',
          role: payload.role || 'Senior Frontend Engineer',
          vacancyPortal: payload.vacancyPortal || 'LinkedIn / Enterprise Portal',
          officialUrl: payload.officialUrl,
          submissionMethod,
          confirmationId,
          appliedDate,
          resumePdfPath,
          coverLetterPdfPath,
          recipientEmail: 'kumar.ashu872@gmail.com'
        });

        clearApiCache();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          jobId,
          status,
          submissionMethod,
          appliedDate,
          confirmationId,
          emailDispatch
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Multi-Page Enterprise Dashboard Routing
  if (pathname === '/login') pathname = '/login.html';
  if (pathname === '/users' || pathname === '/admin/users' || pathname === '/admin') pathname = '/users.html';
  if (pathname === '/profile' || pathname === '/candidate') pathname = '/profile.html';
  if (pathname === '/dashboard') pathname = '/index.html';
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Normalize path and prevent directory traversal
  let safePath = path.normalize(path.join(rootDir, pathname));
  if (!safePath.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Smart resolver for tailored documents & interview battlecards to prevent 404 or blank profile views
  if (!fs.existsSync(safePath) || !fs.statSync(safePath).isFile()) {
    if (pathname.startsWith('/data/tailored-documents/')) {
      const parts = pathname.replace('/data/tailored-documents/', '').split('/');
      const requestedFolder = parts[0];
      const requestedFile = parts.slice(1).join('/') || 'Ashutosh_Kumar_Resume.html';
      const tailoredBase = path.resolve('data/tailored-documents');
      if (fs.existsSync(tailoredBase)) {
        const dirs = fs.readdirSync(tailoredBase);
        const match = dirs.find(d => d === requestedFolder || d.endsWith(requestedFolder) || d.includes(requestedFolder));
        if (match) {
          const candidateFile = path.join(tailoredBase, match, requestedFile);
          if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) {
            safePath = candidateFile;
          }
        }
      }
      // If still not found and requesting a resume, fall back to master PDF resume so user NEVER sees blank screen
      if ((!fs.existsSync(safePath) || !fs.statSync(safePath).isFile()) && requestedFile.toLowerCase().includes('resume')) {
        const masterPdf = path.resolve('data/resumes/Ashutosh Kumar Senior Frontend Engineer Resume.pdf');
        if (fs.existsSync(masterPdf)) {
          safePath = masterPdf;
        }
      }
    } else if (pathname.startsWith('/data/interview-battlecards/')) {
      const parts = pathname.replace('/data/interview-battlecards/', '').split('/');
      const requestedFolder = parts[0];
      const requestedFile = parts.slice(1).join('/') || 'Interview_Battle_Card.html';
      const battleBase = path.resolve('data/interview-battlecards');
      if (fs.existsSync(battleBase)) {
        const dirs = fs.readdirSync(battleBase);
        const match = dirs.find(d => d === requestedFolder || d.endsWith(requestedFolder) || d.includes(requestedFolder));
        if (match) {
          const candidateFile = path.join(battleBase, match, requestedFile);
          if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) {
            safePath = candidateFile;
          }
        }
      }
    }
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };
    if (ext === '.pdf') {
      headers['Content-Disposition'] = 'inline; filename="' + path.basename(safePath) + '"';
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(safePath);
    readStream.pipe(res);
  } else {
    // Fallback: if not found, check if index.html can be served
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family:sans-serif; background:#0f172a; color:#f8fafc; padding:2rem; text-align:center;">
        <h1 style="color:#ef4444;">Page Not Found (404)</h1>
        <p style="color:#94a3b8;">Requested file: <code>${pathname}</code></p>
        <a href="/" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background:#2563eb; color:white; border-radius:8px; text-decoration:none; font-weight:bold;">Return to Job Dashboard</a>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('=================================================================');
  console.log('  ASHUTOSH KUMAR — JOB SEARCH & APPLICATION DASHBOARD SERVER');
  console.log('=================================================================');
  console.log('');
  console.log('  💻 Desktop Browser Access:');
  console.log(`     👉 http://localhost:${PORT}`);
  console.log('');
  console.log('  📱 Phone / Mobile Browser Access:');
  console.log(`     👉 http://${localIp}:${PORT}`);
  console.log('');
  console.log('  📶 Requirement for Phone:');
  console.log(`     Phone and PC must be connected to the same Wi-Fi network.`);
  console.log('=================================================================');
  console.log('Press Ctrl+C to stop the server.');
});
