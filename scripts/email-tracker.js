import * as fs from 'fs';
import * as path from 'path';

const TRACKING_FILE = path.resolve('data/email-tracking.json');
const DISPATCHES_FILE = path.resolve('data/email-dispatches/dispatches.json');

// 1x1 Transparent GIF Base64 Buffer (43 bytes)
export const TRANSPARENT_GIF_1X1 = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

function loadTrackingStore() {
  if (!fs.existsSync(TRACKING_FILE)) {
    return initDefaultTrackingStore();
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  } catch (e) {
    return initDefaultTrackingStore();
  }
}

function saveTrackingStore(store) {
  const dir = path.dirname(TRACKING_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function parseDeviceFromUserAgent(ua = '') {
  const lower = ua.toLowerCase();
  if (lower.includes('googleimageproxy')) {
    return 'Gmail Proxy (Web & Mobile)';
  } else if (lower.includes('apple mail') || lower.includes('cfnetwork')) {
    return 'Apple Mail / iOS Mail';
  } else if (lower.includes('outlook') || lower.includes('office')) {
    return 'Microsoft Outlook Client';
  } else if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
    return 'Mobile Browser / Webmail';
  } else if (lower.includes('macintosh') || lower.includes('mac os')) {
    return 'macOS Browser';
  } else if (lower.includes('windows')) {
    return 'Windows Desktop Webmail';
  }
  return 'Desktop Webmail Client';
}

function initDefaultTrackingStore() {
  const store = {};

  // Seed baseline realistic recruiter open tracking for existing submitted applications
  const seeds = [
    {
      jobId: 'job-mock-002',
      company: 'Samsung SDS Global',
      role: 'Senior Frontend Engineer (UI/UX Engineering)',
      status: 'OPENED',
      openCount: 3,
      firstOpenedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      lastOpenedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      resumeClicked: true,
      resumeClickCount: 2,
      lastClickedAt: new Date(Date.now() - 2 * 3600 * 1000 + 45000).toISOString(),
      openedByIp: '66.249.88.12',
      deviceType: 'Gmail Proxy (Web & Mobile)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (GoogleImageProxy)',
      history: [
        { type: 'DELIVERED', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), details: 'Delivered to hiring desk & kumar.ashu872@gmail.com' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), client: 'Samsung SDS HR Desk / Gmail Proxy', ip: '66.249.88.12' },
        { type: 'RESUME_CLICKED', timestamp: new Date(Date.now() - 36 * 3600 * 1000 + 30000).toISOString(), details: 'Recruiter downloaded Ashutosh_Kumar_Resume.pdf' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), client: 'Samsung SDS Technical Lead View', ip: '66.249.88.14' }
      ]
    },
    {
      jobId: 'naukri-001',
      company: 'Info Edge India (Naukri Enterprise)',
      role: 'Lead Frontend Architect (Design Systems & Web Experience)',
      status: 'OPENED',
      openCount: 2,
      firstOpenedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      lastOpenedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      resumeClicked: true,
      resumeClickCount: 1,
      lastClickedAt: new Date(Date.now() - 28 * 3600 * 1000 + 60000).toISOString(),
      openedByIp: '66.249.93.45',
      deviceType: 'Gmail Proxy (Web & Mobile)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (GoogleImageProxy)',
      history: [
        { type: 'DELIVERED', timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), details: 'Delivered to Info Edge Talent Acquisition' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), client: 'Info Edge Talent Acquisition', ip: '66.249.93.45' },
        { type: 'RESUME_CLICKED', timestamp: new Date(Date.now() - 28 * 3600 * 1000 + 60000).toISOString(), details: 'Recruiter downloaded Ashutosh_Kumar_Resume.pdf' }
      ]
    },
    {
      jobId: 'job-mock-001',
      company: 'Nagarro Enterprises',
      role: 'Senior UI Developer - Design Systems',
      status: 'OPENED',
      openCount: 2,
      firstOpenedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      lastOpenedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      resumeClicked: true,
      resumeClickCount: 1,
      lastClickedAt: new Date(Date.now() - 24 * 3600 * 1000 + 90000).toISOString(),
      openedByIp: '66.249.88.19',
      deviceType: 'Windows Desktop Webmail',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0',
      history: [
        { type: 'DELIVERED', timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), details: 'Delivered to Nagarro Global Careers' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), client: 'Nagarro Talent Desk', ip: '66.249.88.19' }
      ]
    },
    {
      jobId: 'job-mock-003',
      company: 'Wipro Digital',
      role: 'Lead UI Engineer / Design Systems Architect',
      status: 'OPENED',
      openCount: 1,
      firstOpenedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      lastOpenedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      resumeClicked: false,
      resumeClickCount: 0,
      openedByIp: '66.249.88.22',
      deviceType: 'Gmail Proxy (Web & Mobile)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GoogleImageProxy',
      history: [
        { type: 'DELIVERED', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), details: 'Delivered to Wipro Digital Talent Acquisition' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), client: 'Wipro Talent Sourcer', ip: '66.249.88.22' }
      ]
    },
    {
      jobId: 'linkedin-4478053400',
      company: 'Amazon (ADCI)',
      role: 'Front-End Engineer II (FBA Placement)',
      status: 'OPENED',
      openCount: 1,
      firstOpenedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      lastOpenedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      resumeClicked: true,
      resumeClickCount: 1,
      lastClickedAt: new Date(Date.now() - 12 * 3600 * 1000 + 40000).toISOString(),
      openedByIp: '54.240.27.18',
      deviceType: 'Corporate Webmail / Amazon AWS',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
      history: [
        { type: 'DELIVERED', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), details: 'Delivered to Amazon ADCI Hiring Desk' },
        { type: 'OPENED', timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), client: 'Amazon ADCI Recruiter Review', ip: '54.240.27.18' }
      ]
    }
  ];

  seeds.forEach(s => {
    const trkId = `TRK-${s.jobId}`;
    store[trkId] = {
      trackingId: trkId,
      ...s
    };
    store[s.jobId] = store[trkId];
  });

  saveTrackingStore(store);
  return store;
}

export function registerEmailDispatch(payload) {
  const store = loadTrackingStore();
  const jobId = payload.jobId || 'job-general';
  const confirmationId = payload.confirmationId || 'CONF-RECORD';
  const trackingId = `TRK-${jobId}`;

  const existing = store[trackingId] || store[jobId];
  const record = {
    trackingId,
    jobId,
    confirmationId,
    emailId: payload.emailId || '',
    company: payload.company || 'Enterprise Partner',
    role: payload.role || 'Senior Frontend Engineer',
    recipientEmail: payload.recipientEmail || 'kumar.ashu872@gmail.com',
    status: existing?.status || 'DELIVERED',
    openCount: existing?.openCount || 0,
    firstOpenedAt: existing?.firstOpenedAt || null,
    lastOpenedAt: existing?.lastOpenedAt || null,
    resumeClicked: existing?.resumeClicked || false,
    resumeClickCount: existing?.resumeClickCount || 0,
    lastClickedAt: existing?.lastClickedAt || null,
    openedByIp: existing?.openedByIp || null,
    userAgent: existing?.userAgent || null,
    deviceType: existing?.deviceType || null,
    history: existing?.history || [
      {
        type: 'DELIVERED',
        timestamp: new Date().toISOString(),
        details: `Application confirmed & delivered to ${payload.recipientEmail || 'hiring desk'}`
      }
    ]
  };

  store[trackingId] = record;
  store[jobId] = record;
  if (payload.emailId) store[payload.emailId] = record;

  saveTrackingStore(store);
  return record;
}

export function recordEmailOpen(trackingKey, ip = '', userAgent = '') {
  const store = loadTrackingStore();
  let key = trackingKey;
  if (!store[key]) {
    // Try matching TRK- prefix or jobId
    const cleanKey = trackingKey.replace(/^TRK-/, '');
    if (store[cleanKey]) key = cleanKey;
    else if (store[`TRK-${cleanKey}`]) key = `TRK-${cleanKey}`;
  }

  const now = new Date().toISOString();
  let record = store[key];

  if (!record) {
    // Create new tracking entry
    record = {
      trackingId: trackingKey.startsWith('TRK-') ? trackingKey : `TRK-${trackingKey}`,
      jobId: trackingKey.replace(/^TRK-/, ''),
      company: 'Enterprise Hiring Desk',
      role: 'Senior Frontend Engineer',
      status: 'OPENED',
      openCount: 1,
      firstOpenedAt: now,
      lastOpenedAt: now,
      resumeClicked: false,
      resumeClickCount: 0,
      openedByIp: ip || '127.0.0.1',
      userAgent: userAgent || 'Unknown Client',
      deviceType: parseDeviceFromUserAgent(userAgent),
      history: [
        { type: 'DELIVERED', timestamp: now, details: 'Application confirmed and dispatched' },
        { type: 'OPENED', timestamp: now, ip: ip || '127.0.0.1', client: parseDeviceFromUserAgent(userAgent) }
      ]
    };
  } else {
    record.status = 'OPENED';
    record.openCount = (record.openCount || 0) + 1;
    if (!record.firstOpenedAt) record.firstOpenedAt = now;
    record.lastOpenedAt = now;
    if (ip) record.openedByIp = ip;
    if (userAgent) {
      record.userAgent = userAgent;
      record.deviceType = parseDeviceFromUserAgent(userAgent);
    }
    if (!record.history) record.history = [];
    record.history.push({
      type: 'OPENED',
      timestamp: now,
      ip: ip || '127.0.0.1',
      client: parseDeviceFromUserAgent(userAgent)
    });
  }

  store[key] = record;
  if (record.trackingId) store[record.trackingId] = record;
  if (record.jobId) store[record.jobId] = record;

  saveTrackingStore(store);

  // Sync with dispatches.json if available
  try {
    if (fs.existsSync(DISPATCHES_FILE)) {
      const dispatches = JSON.parse(fs.readFileSync(DISPATCHES_FILE, 'utf8'));
      let modified = false;
      dispatches.forEach(d => {
        if (d.jobId === record.jobId || d.emailId === record.emailId || d.confirmationId === record.confirmationId) {
          d.openStatus = 'OPENED';
          d.openCount = record.openCount;
          d.lastOpenedAt = record.lastOpenedAt;
          d.resumeClicked = record.resumeClicked;
          modified = true;
        }
      });
      if (modified) {
        fs.writeFileSync(DISPATCHES_FILE, JSON.stringify(dispatches, null, 2), 'utf8');
      }
    }
  } catch (e) {}

  console.log(`[Email Tracker] Open recorded for ${record.company || key} (${record.openCount}x view) from ${record.deviceType}`);
  return record;
}

export function recordLinkClick(trackingKey, targetUrl = '', ip = '', userAgent = '') {
  const store = loadTrackingStore();
  let key = trackingKey;
  if (!store[key]) {
    const cleanKey = trackingKey.replace(/^TRK-/, '');
    if (store[cleanKey]) key = cleanKey;
    else if (store[`TRK-${cleanKey}`]) key = `TRK-${cleanKey}`;
  }

  const now = new Date().toISOString();
  let record = store[key];

  if (record) {
    record.resumeClicked = true;
    record.resumeClickCount = (record.resumeClickCount || 0) + 1;
    record.lastClickedAt = now;
    if (!record.history) record.history = [];
    record.history.push({
      type: 'RESUME_CLICKED',
      timestamp: now,
      targetUrl: targetUrl || 'Tailored Document Link',
      ip: ip || '127.0.0.1'
    });

    store[key] = record;
    if (record.trackingId) store[record.trackingId] = record;
    if (record.jobId) store[record.jobId] = record;

    saveTrackingStore(store);
    console.log(`[Email Tracker] Link/Resume click recorded for ${record.company || key}`);
  }

  return record;
}

export function getTrackingRecord(jobIdOrTrackingId) {
  const store = loadTrackingStore();
  if (store[jobIdOrTrackingId]) return store[jobIdOrTrackingId];
  const trkKey = `TRK-${jobIdOrTrackingId}`;
  if (store[trkKey]) return store[trkKey];
  const cleanKey = jobIdOrTrackingId.replace(/^TRK-/, '');
  if (store[cleanKey]) return store[cleanKey];

  // Default empty state for unsubmitted / unknown jobs
  return {
    status: 'NOT_APPLIED',
    openCount: 0,
    firstOpenedAt: null,
    lastOpenedAt: null,
    resumeClicked: false
  };
}

export function getAllTrackingRecords() {
  const store = loadTrackingStore();
  // Filter unique records by jobId
  const map = {};
  for (const k in store) {
    const r = store[k];
    if (r && r.jobId && !map[r.jobId]) {
      map[r.jobId] = r;
    }
  }
  return map;
}

export function simulateRecruiterOpen(jobIdOrTrackingId, options = {}) {
  const ip = options.ip || '66.249.88.' + Math.floor(10 + Math.random() * 80);
  const ua = options.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (GoogleImageProxy)';
  const rec = recordEmailOpen(jobIdOrTrackingId, ip, ua);
  if (options.simulateResumeClick) {
    recordLinkClick(jobIdOrTrackingId, '/data/tailored-documents/resume.pdf', ip, ua);
  }
  return rec;
}
