import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as tls from 'tls';

// Storage paths
const CONFIG_PATH = path.resolve('data/gmail-config.json');
const INBOUND_DIR = path.resolve('data/inbound-replies');
const REPLIES_INDEX_PATH = path.join(INBOUND_DIR, 'replies.json');
const CSV_PATH = path.resolve('data/applications.csv');

// Ensure storage directories exist
if (!fs.existsSync(INBOUND_DIR)) {
  fs.mkdirSync(INBOUND_DIR, { recursive: true });
}

/**
 * Load Gmail OAuth & poller configuration
 */
export function loadGmailConfig() {
  // Automatically hydrate SMTP_PASS from .env if not yet in process.env
  if (!process.env.SMTP_PASS && fs.existsSync(path.resolve('.env'))) {
    try {
      const envLines = fs.readFileSync(path.resolve('.env'), 'utf8').split('\n');
      for (const line of envLines) {
        const match = line.match(/^\s*SMTP_PASS\s*=\s*(.*)$/);
        if (match) {
          process.env.SMTP_PASS = match[1].replace(/['"\r]/g, '').trim();
          break;
        }
      }
    } catch (e) {}
  }

  const defaults = {
    userEmail: process.env.GMAIL_USER_EMAIL || process.env.SMTP_USER || 'kumar.ashu872@gmail.com',
    appPassword: process.env.SMTP_PASS || '',
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
    redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/api/gmail/oauth2callback',
    pollingIntervalMinutes: 15,
    lastSyncTimestamp: null,
    connected: false,
    mode: 'WAITING_FOR_CREDENTIALS'
  };

  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const saved = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      Object.assign(defaults, saved);
    } catch (e) {
      console.warn('[Gmail Detector] Error reading config:', e.message);
    }
  }

  // Check if live credentials exist
  if (defaults.clientId && defaults.clientSecret && defaults.refreshToken) {
    defaults.connected = true;
    defaults.mode = 'LIVE_GMAIL_API';
  } else if (process.env.SMTP_PASS || defaults.appPassword || defaults.mode === 'LIVE_GMAIL_APP_PASS') {
    defaults.connected = true;
    defaults.mode = 'LIVE_GMAIL_APP_PASS';
    defaults.appPassword = process.env.SMTP_PASS || defaults.appPassword;
  } else {
    defaults.connected = false;
    defaults.mode = 'WAITING_FOR_CREDENTIALS';
  }

  return defaults;
}

/**
 * Save Gmail configuration
 */
export function saveGmailConfig(updates) {
  const current = loadGmailConfig();
  const merged = { ...current, ...updates };
  
  if (merged.clientId && merged.clientSecret && merged.refreshToken) {
    merged.connected = true;
    merged.mode = 'LIVE_GMAIL_API';
  } else if (merged.mode === 'LIVE_GMAIL_APP_PASS') {
    merged.connected = true;
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), 'utf8');
  return merged;
}

/**
 * Generate Google OAuth 2.0 authorization URL
 */
export function getGoogleOAuthUrl(clientId, redirectUri) {
  const id = clientId || process.env.GMAIL_CLIENT_ID || 'CONFIGURE_CLIENT_ID';
  const uri = redirectUri || 'http://localhost:5000/api/gmail/oauth2callback';
  const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify');
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(id)}&redirect_uri=${encodeURIComponent(uri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
}

/**
 * Exchange Authorization Code for Refresh Token & Access Token
 */
export async function exchangeOAuthCode(code, clientId, clientSecret, redirectUri) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error_description || parsed.error));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Refresh Google Access Token
 */
export async function refreshGoogleAccessToken(clientId, clientSecret, refreshToken) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error_description || parsed.error));
          } else {
            resolve(parsed.access_token);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Execute authorized Gmail REST API request
 */
async function fetchGmailApi(endpoint, accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gmail.googleapis.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'Gmail API Error'));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Parse CSV line properly handling quoted entries
 */
export function parseCsvLine(text) {
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

export function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Get all active tracked jobs from applications.csv
 */
export function getTrackedApplications() {
  if (!fs.existsSync(CSV_PATH)) return [];
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = content.split('\n');
  const jobs = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const id = cells[0];
    const title = cells[1];
    const company = cells[2];
    const status = cells[13];
    const appliedDate = cells[15];
    const confirmationId = cells[16];

    jobs.push({
      id,
      title,
      company,
      status,
      appliedDate,
      confirmationId
    });
  }
  return jobs;
}

/**
 * Advance pipeline stage in applications.csv
 */
export function advanceJobStageInCsv(jobId, newStage, note) {
  if (!fs.existsSync(CSV_PATH)) return false;
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = content.split('\n');
  if (lines.length < 2) return false;

  const header = lines[0];
  let updated = false;
  const newLines = [header];
  const today = new Date().toISOString().split('T')[0];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith(jobId + ',') || line.startsWith('"' + jobId + '",')) {
      const cells = parseCsvLine(line);
      cells[13] = newStage;
      cells[14] = note || `Automated Gmail reply detection: Advanced to ${newStage} on ${today}`;
      cells[17] = `Gmail Reply Detected: ${newStage}`;
      newLines.push(cells.map(escapeCsvCell).join(','));
      updated = true;
    } else {
      newLines.push(line);
    }
  }

  if (updated) {
    fs.writeFileSync(CSV_PATH, newLines.join('\n'), 'utf8');
  }
  return updated;
}

/**
 * Correlation engine: Match inbound email to an active job application
 */
export function correlateMessageWithJob(from, subject, body, trackedJobs) {
  const combinedText = `${from} ${subject} ${body}`.toLowerCase();

  // 1. Direct match by Confirmation ID
  for (const job of trackedJobs) {
    if (job.confirmationId && job.confirmationId.length > 5) {
      if (combinedText.includes(job.confirmationId.toLowerCase())) {
        return { job, matchType: 'CONFIRMATION_ID', confidence: 1.0 };
      }
    }
  }

  // 2. Match by Requisition / Job ID
  for (const job of trackedJobs) {
    if (job.id && combinedText.includes(job.id.toLowerCase())) {
      return { job, matchType: 'JOB_ID', confidence: 0.95 };
    }
  }

  // 3. Match by Exact Company Name
  for (const job of trackedJobs) {
    if (!job.company) continue;
    const companyClean = job.company.toLowerCase().trim();
    // Full exact company match in text
    if (companyClean.length >= 4 && combinedText.includes(companyClean)) {
      return { job, matchType: 'COMPANY_NAME', confidence: 0.92 };
    }
  }

  // 4. Domain matching from sender email address (high-confidence verified domain)
  const domainMap = [
    { domain: 'samsungsds.com', company: 'Samsung SDS Global' },
    { domain: 'naukri.com', company: 'Info Edge India (Naukri Enterprise)' },
    { domain: 'infoedge.in', company: 'Info Edge India (Naukri Enterprise)' },
    { domain: 'amazon.com', company: 'Amazon (ADCI)' },
    { domain: 'makemytrip.com', company: 'MakeMyTrip India' },
    { domain: 'nagarro.com', company: 'Nagarro Enterprises' },
    { domain: 'publicis.sapient', company: 'Publicis Sapient' },
    { domain: 'publicissapient.com', company: 'Publicis Sapient' },
    { domain: 'hcl.com', company: 'HCL Technologies' },
    { domain: 'techmahindra.com', company: 'Tech Mahindra' },
    { domain: 'epam.com', company: 'EPAM Systems' },
    { domain: 'commbank.com.au', company: 'Commonwealth Bank of Australia' },
    { domain: 'wipro.com', company: 'Wipro Digital' },
    { domain: 'zomato.com', company: 'Zomato / Blinkit' },
    { domain: 'blinkit.com', company: 'Zomato / Blinkit' }
  ];

  for (const entry of domainMap) {
    if (from.toLowerCase().includes(entry.domain)) {
      const matchedJob = trackedJobs.find(j => j.company.toLowerCase().includes(entry.company.toLowerCase().slice(0, 6)));
      if (matchedJob) {
        return { job: matchedJob, matchType: 'DOMAIN_MATCH', confidence: 0.90 };
      }
    }
  }

  // 5. Match distinguishing brand keyword with word boundary
  const GENERIC_COMPANY_WORDS = new Set([
    'technology', 'technologies', 'tech', 'software', 'systems', 'solutions',
    'global', 'digital', 'enterprises', 'partner', 'consulting', 'group', 'corp',
    'corporation', 'company', 'services', 'network', 'direct', 'health', 'labs',
    'park', 'bangalore', 'delhi', 'noida', 'gurgaon', 'india', 'international',
    'media', 'analytics', 'processing', 'developer', 'engineering', 'commerce'
  ]);

  for (const job of trackedJobs) {
    if (!job.company) continue;
    const companyClean = job.company.toLowerCase().trim();
    const parts = companyClean
      .replace(/[()]/g, ' ')
      .split(/[\s,.-]+/)
      .map(p => p.trim())
      .filter(p => p.length >= 4 && !GENERIC_COMPANY_WORDS.has(p));
    for (const part of parts) {
      const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const boundaryRegex = new RegExp(`\\b${escapedPart}\\b`, 'i');
      if (boundaryRegex.test(combinedText)) {
        return { job, matchType: 'COMPANY_BRAND', confidence: 0.88 };
      }
    }
  }

  return null;
}

/**
 * Intelligent Intent Classifier for inbound recruiter email
 */
export function classifyRecruiterIntent(subject, body, from = '') {
  const text = `${subject} ${body}`.toLowerCase();
  const fromClean = (from || '').toLowerCase();

  // 1. Technical assessment / test
  if (
    text.includes('hackerrank') ||
    text.includes('codility') ||
    text.includes('technical assessment') ||
    text.includes('coding challenge') ||
    text.includes('online test link') ||
    text.includes('take-home assignment')
  ) {
    return {
      intent: 'TECH_ASSESSMENT',
      suggestedStage: 'TECH_INTERVIEW',
      badgeClass: 'bg-purple-900/60 text-purple-300 border-purple-600',
      title: 'Coding Assessment / Technical Challenge',
      requiresAction: true,
      actionText: 'Complete Assessment',
      isAutomatedAlert: false,
      category: 'DIRECT'
    };
  }

  // 2. HR Screening / Interview invitation
  if (
    text.includes('schedule a call') ||
    text.includes('interview') ||
    text.includes('screening') ||
    text.includes('shortlisted') ||
    text.includes('discussion') ||
    text.includes('availability') ||
    text.includes('speak with you') ||
    text.includes('invitation to connect') ||
    text.includes('zoom link') ||
    text.includes('google meet') ||
    text.includes('teams meeting')
  ) {
    return {
      intent: 'HR_SCREEN_INVITE',
      suggestedStage: 'HR_SCREEN',
      badgeClass: 'bg-emerald-900/60 text-emerald-300 border-emerald-600',
      title: 'Interview / HR Screening Invitation',
      requiresAction: true,
      actionText: 'Reply with Availability',
      isAutomatedAlert: false,
      category: 'DIRECT'
    };
  }

  // 3. Formal Job Offer
  if (
    text.includes('offer letter') ||
    text.includes('letter of intent') ||
    text.includes('congratulations on your selection') ||
    text.includes('remuneration package')
  ) {
    return {
      intent: 'JOB_OFFER',
      suggestedStage: 'OFFER',
      badgeClass: 'bg-amber-900/60 text-amber-300 border-amber-600',
      title: 'Job Offer / Letter of Intent',
      requiresAction: true,
      actionText: 'Review Offer Details',
      isAutomatedAlert: false,
      category: 'DIRECT'
    };
  }

  // 4. Rejection / Position Closed
  if (
    text.includes('unfortunately') ||
    text.includes('other applicants') ||
    text.includes('not moving forward') ||
    text.includes('regret to inform') ||
    text.includes('decided to pursue other')
  ) {
    return {
      intent: 'REJECTION',
      suggestedStage: 'REJECTED',
      badgeClass: 'bg-red-900/60 text-red-300 border-red-600',
      title: 'Application Not Proceeding',
      requiresAction: false,
      actionText: 'Archive Record',
      isAutomatedAlert: false,
      category: 'DIRECT'
    };
  }

  // 5. Automated Application Confirmation Receipt (e.g. indeedapply@indeed.com)
  if (fromClean.includes('indeedapply') || text.includes('indeed application:')) {
    return {
      intent: 'APPLICATION_RECEIPT',
      suggestedStage: 'SUBMITTED',
      badgeClass: 'bg-blue-900/60 text-blue-300 border-blue-600',
      title: 'Application Sent (Indeed Receipt)',
      requiresAction: false,
      actionText: 'Receipt Confirmed',
      isAutomatedAlert: true,
      category: 'RECEIPT'
    };
  }

  // 6. Automated Job Board Alert / Daily Digest (LinkedIn, Indeed, Naukri alerts)
  if (
    fromClean.includes('jobalert') ||
    fromClean.includes('noreply@linkedin.com') ||
    fromClean.includes('donotreply@match.indeed.com') ||
    fromClean.includes('match.indeed.com') ||
    text.includes('is hiring') ||
    text.includes('more html') ||
    text.includes('more web design') ||
    text.includes('fit for')
  ) {
    return {
      intent: 'JOB_LEAD_ALERT',
      suggestedStage: 'LEAD',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      title: 'Job Recommendation Lead (Automated Alert)',
      requiresAction: false,
      actionText: 'Explore Opening',
      isAutomatedAlert: true,
      category: 'LEAD'
    };
  }

  // 7. General Confirmation / Acknowledgment
  return {
    intent: 'APPLICATION_ACK',
    suggestedStage: 'SUBMITTED',
    badgeClass: 'bg-blue-900/60 text-blue-300 border-blue-600',
    title: 'Submission Acknowledgment / In Review',
    requiresAction: false,
    actionText: 'Keep Monitoring',
    isAutomatedAlert: false,
    category: 'DIRECT'
  };
}

/**
 * Generate high-conversion tailored email response draft for Ashutosh
 */
export function generateCandidateReplyDraft(reply) {
  const recruiterName = reply.recruiterName || 'Hiring Team';
  const company = reply.company || 'Enterprise Partner';
  const role = reply.role || 'Senior Frontend Engineer';
  const confirmationId = reply.confirmationId || '';

  if (reply.intent === 'TECH_ASSESSMENT') {
    return {
      subject: `Re: ${reply.subject} - Confirmed Assessment Completion Timeline [${confirmationId}]`,
      body: `Dear ${recruiterName},

Thank you for reviewing my application for the ${role} position at ${company} and sharing the assessment details.

I am confirming receipt of the evaluation link. I will be completing the assessment within the specified window (planning completion by tomorrow evening, IST). 

As a reminder, my frontend engineering background encompasses 8+ years building enterprise Angular, Angular Material UI, and robust design system architectures with strict Playwright test automation and WCAG 2.1 AA accessibility (including previous enterprise implementations for Samsung SDS and Cisco BPA).

I will inform you as soon as my submission is complete. Looking forward to our subsequent technical discussion.

Best regards,

Ashutosh Kumar
Senior Frontend Engineer • Senior UI Developer
Phone: +91 9310681373
Email: kumar.ashu872@gmail.com
Current Organization: Frontend Developer at Wondrfly Inc. (Notice Period: Immediate to 15 Days)
Location: New Delhi, India`
    };
  }

  if (reply.intent === 'HR_SCREEN_INVITE') {
    return {
      subject: `Re: ${reply.subject} - Interview Availability [Ashutosh Kumar • ${confirmationId}]`,
      body: `Dear ${recruiterName},

Thank you very much for reaching out and considering my profile for the ${role} role at ${company}. I am excited about the opportunity to contribute to your engineering team.

I would be delighted to connect for the introductory screening. Here are my preferred availability windows over the next 2-3 business days:
• Tomorrow: 11:00 AM – 1:30 PM IST or 3:30 PM – 6:00 PM IST
• Day After Tomorrow: 10:30 AM – 1:00 PM IST or 2:30 PM – 5:30 PM IST

Key Profile Summary for Quick Reference:
• Experience: 8+ Years Enterprise Frontend / UI Development
• Core Stack: Angular, Angular Material UI, TypeScript, HTML5/SCSS, Design Systems, Playwright, WCAG 2.1 AA
• Current Status: Wondrfly Inc. (Notice Period: Immediate to 15 Days)
• Target Compensation Mandate: ₹12+ LPA (Remote/Delhi NCR) | ₹15+ LPA (Out of NCR)
• Contact: +91 9310681373 | kumar.ashu872@gmail.com

Please feel free to send a calendar invite for whichever slot aligns best with your schedule. Looking forward to our conversation.

Warm regards,

Ashutosh Kumar
Senior Frontend Engineer • Senior UI Developer
Portfolio & Profiles: LinkedIn & GitHub Verified`
    };
  }

  if (reply.intent === 'JOB_LEAD_ALERT' || reply.isAutomatedAlert) {
    return {
      subject: `Note: Automated Platform Alert from ${reply.recruiterName || 'Job Board'}`,
      body: `ℹ️ AUTOMATED JOB ALERT NOTICE:
This email was generated automatically by ${reply.recruiterName || reply.from} (sent via no-reply distribution).

• Opportunity Lead: ${role} at ${company}
• Received Date: ${reply.receivedDate}
• Context: Matches your senior frontend / UI developer search criteria in Gmail.

⚠️ ACTION NOTE: Direct email replies to "${reply.from}" cannot be delivered because it is a no-reply system address. To apply for this opening, click "Open Raw HTML Email ↗" to view the application link.`
    };
  }

  if (reply.intent === 'APPLICATION_RECEIPT') {
    return {
      subject: `Re: ${reply.subject} - Application Receipt Acknowledged`,
      body: `ℹ️ APPLICATION SUBMISSION RECEIPT:
This email confirms your application was successfully transmitted via Indeed/ATS.

• Role: ${role}
• Employer: ${company}
• Current Status: Submitted & in Recruiter Review Queue
• Next Action: Monitor inbox for direct screening invitation.`
    };
  }

  return {
    subject: `Re: ${reply.subject} - Thank You [${confirmationId}]`,
    body: `Dear ${recruiterName},

Thank you for the update regarding my application for the ${role} position at ${company}.

I remain very interested in contributing my 8+ years of enterprise UI engineering experience to your team. Please do let me know if any additional documentation, code samples, or architecture artifacts are required.

Best regards,

Ashutosh Kumar
Phone: +91 9310681373
Email: kumar.ashu872@gmail.com`
  };
}

/**
 * Persist an inbound reply record to disk
 */
export function recordInboundReply(replyData) {
  let replies = [];
  if (fs.existsSync(REPLIES_INDEX_PATH)) {
    try {
      replies = JSON.parse(fs.readFileSync(REPLIES_INDEX_PATH, 'utf8'));
    } catch (e) {
      replies = [];
    }
  }

  // Deduplicate by messageId
  const existingIdx = replies.findIndex(r => r.messageId === replyData.messageId);
  if (existingIdx !== -1) {
    replies[existingIdx] = { ...replies[existingIdx], ...replyData };
  } else {
    replies.unshift(replyData);
  }

  fs.writeFileSync(REPLIES_INDEX_PATH, JSON.stringify(replies, null, 2), 'utf8');

  // Also write full HTML view
  const htmlFileName = `${replyData.messageId}.html`;
  const htmlFilePath = path.join(INBOUND_DIR, htmlFileName);

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Inbound Recruiter Email: ${replyData.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 720px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .badge-interview { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
    .badge-test { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid #a855f7; }
    .meta-row { display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 16px; font-size: 13px; color: #94a3b8; }
    .email-body { font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap; background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
    .reply-box { margin-top: 24px; background: #1e3a8a/30; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; }
    .reply-title { font-weight: bold; color: #60a5fa; font-size: 13px; text-transform: uppercase; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
      <div>
        <span class="badge ${replyData.intent === 'TECH_ASSESSMENT' ? 'badge-test' : 'badge-interview'}">${replyData.intentTitle}</span>
        <h2 style="margin: 8px 0 4px 0; color:#ffffff; font-size: 20px;">${replyData.subject}</h2>
        <div style="color:#38bdf8; font-size:13px; font-weight:600;">${replyData.company} • ${replyData.role}</div>
      </div>
      <div style="text-align:right; font-size:12px; color:#94a3b8;">
        <div>${replyData.receivedDate}</div>
        <div style="margin-top:4px;"><code style="color:#10b981;">${replyData.confirmationId}</code></div>
      </div>
    </div>

    <div class="meta-row">
      <div><strong>From:</strong> ${replyData.from}</div>
      <div><strong>Correlated Job:</strong> ${replyData.jobId}</div>
    </div>

    <div class="email-body">${replyData.bodyText}</div>

    ${replyData.replyDraft ? `
    <div class="reply-box">
      <div class="reply-title">✉️ AI-Crafted Response Draft for Ashutosh</div>
      <div style="font-size:13px; color:#cbd5e1; white-space:pre-wrap;">${replyData.replyDraft.body}</div>
    </div>` : ''}
  </div>
</body>
</html>`;

  fs.writeFileSync(htmlFilePath, htmlDoc, 'utf8');
  return replyData;
}

/**
 * Get all logged inbound replies (filters out test simulations unless explicitly requested)
 */
export function getAllInboundReplies(includeSimulated = false) {
  if (!fs.existsSync(REPLIES_INDEX_PATH)) return [];
  try {
    const list = JSON.parse(fs.readFileSync(REPLIES_INDEX_PATH, 'utf8'));
    if (!Array.isArray(list)) return [];
    
    // Strict filter: Only real job responses, strictly excluding automated platform recommendation alerts
    return list.filter(r => {
      if (!includeSimulated && r.sourceMode !== 'LIVE_GMAIL_API' && r.sourceMode !== 'LIVE_GMAIL_IMAP') {
        return false;
      }
      // Exclude automated recommendation emails & platform job alerts
      if (r.isAutomatedAlert || r.intent === 'JOB_LEAD_ALERT' || r.category === 'LEAD') {
        return false;
      }
      const fromLower = (r.from || '').toLowerCase();
      if (fromLower.includes('jobalert') || fromLower.includes('jobalerts') || fromLower.includes('match.indeed')) {
        return false;
      }
      return true;
    });
  } catch (e) {
    return [];
  }
}

/**
 * Built-in high-fidelity scenarios for testing & demonstration
 */
export const VERIFIED_RECRUITER_SCENARIOS = {
  samsung: {
    messageId: 'MSG-GMAIL-SSDS-8821-SCREEN',
    from: 'Priya Sharma <priya.sharma@samsungsds.com>',
    recruiterName: 'Priya Sharma (Lead Technical Recruiter, Samsung SDS Global)',
    company: 'Samsung SDS Global',
    role: 'Senior Frontend Engineer (UI/UX Engineering)',
    jobId: 'job-mock-002',
    confirmationId: 'CONF-SSDS-2026-8821-SUCCESS',
    subject: 'Interview Invitation: Senior Frontend Engineer at Samsung SDS Global [CONF-SSDS-2026-8821-SUCCESS]',
    receivedDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
    bodyText: `Dear Ashutosh,

Thank you for your formal application for the Senior Frontend Engineer (UI/UX Engineering) role at Samsung SDS Global.

Our engineering leadership reviewed your resume and verified portfolio highlights—in particular, your extensive 8+ years hands-on track record building enterprise Angular / Angular Material design systems and prior architecture experience for Samsung SDS and Cisco BPA.

We are pleased to inform you that your profile has been shortlisted for an initial 30-minute introductory and technical alignment video call with our Frontend Practice Lead.

Could you please share your availability for a Microsoft Teams call over the next two days between 11:00 AM and 5:00 PM IST?

We look forward to connecting with you.

Best regards,

Priya Sharma
Lead Talent Acquisition Partner — Enterprise Engineering
Samsung SDS Global
priya.sharma@samsungsds.com`
  },

  naukri: {
    messageId: 'MSG-GMAIL-IE-8812-ASSESS',
    from: 'Info Edge Tech Hiring <hiring.tech@infoedge.in>',
    recruiterName: 'Rohan Verma (Tech Recruiting, Info Edge India)',
    company: 'Info Edge India (Naukri Enterprise)',
    role: 'Senior UI / Angular Developer (8+ Yrs Experience)',
    jobId: 'naukri-001',
    confirmationId: 'CONF-NAUKRI-IE-8812-SUCCESS',
    subject: 'Online Technical Challenge: Senior UI Developer at Info Edge (Naukri) [CONF-NAUKRI-IE-8812-SUCCESS]',
    receivedDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
    bodyText: `Dear Ashutosh Kumar,

Thank you for applying to the Senior UI / Angular Developer position at Info Edge India (Naukri Enterprise).

As the first step in our engineering selection process, we invite you to complete our Senior UI Online Assessment on HackerRank:
• Challenge: Enterprise Angular & UI Performance Optimization
• Duration: 90 Minutes
• Access Link: https://hackerrank.com/tests/infoedge-ui-sr-2026-8812
• Deadline: 48 Hours from receipt of this email

Please review your setup (camera, microphone, stable browser) before commencing.

Best regards,

Engineering Recruitment Team
Info Edge India Ltd. (Naukri.com)
Noida Sector 132, Delhi NCR`
  },

  amazon: {
    messageId: 'MSG-GMAIL-AMAZON-LIVE-VERIFY',
    from: 'Amazon Recruiting <adci-frontend-hiring@amazon.com>',
    recruiterName: 'Aakash Mehta (Amazon ADCI Recruiting)',
    company: 'Amazon (ADCI)',
    role: 'Front-End Engineer II (FBA Placement)',
    jobId: 'linkedin-4478053400',
    confirmationId: 'CONF-AMAZON-LIVE-VERIFY',
    subject: 'Amazon Application Update: Front-End Engineer II (ADCI) [CONF-AMAZON-LIVE-VERIFY]',
    receivedDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
    bodyText: `Hello Ashutosh,

Thank you for taking the time to speak with our talent acquisition team and submitting your application for the Front-End Engineer II role at Amazon Development Center India (ADCI).

We have received your updated application documents and verified your enterprise experience. The hiring manager was impressed with your demonstrated expertise in large-scale modular frontend architectures, sub-second latency optimization, and strict WCAG 2.1 accessibility.

We would like to coordinate a 45-minute preliminary technical screening call with one of our Senior Front-End Engineers focusing on JavaScript fundamentals, DOM performance, and component hierarchy design.

Please reply with 2-3 time slots that work best for you this week.

Sincerely,

Aakash Mehta
Technical Recruiter — Amazon Web Services & ADCI
Amazon Development Centre India`
  },

  makemytrip: {
    messageId: 'MSG-GMAIL-MMT-4412-SCREEN',
    from: 'MakeMyTrip Careers <talent.connect@makemytrip.com>',
    recruiterName: 'Kavita Chawla (Hiring Team, MakeMyTrip)',
    company: 'MakeMyTrip India',
    role: 'Lead Frontend UI Developer',
    jobId: 'linkedin-002',
    confirmationId: 'CONF-MMT-GUR-4412-SUCCESS',
    subject: 'Application Shortlisted: Lead Frontend UI Developer at MakeMyTrip [CONF-MMT-GUR-4412-SUCCESS]',
    receivedDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
    bodyText: `Hi Ashutosh,

Great news! Your profile has been shortlisted for the Lead Frontend UI Developer role at our Gurugram headquarters.

We were specifically impressed with your extensive experience crafting high-throughput, pixel-perfect user interfaces, Core Web Vitals optimization, and micro-interaction responsiveness.

We would like to schedule an initial discussion with our Engineering Director for the Flights & Hotels UI platform. Please let us know if you can make time for a 30-minute virtual chat tomorrow between 3 PM and 6 PM IST.

Regards,

Kavita Chawla
Talent Acquisition — Core Technology
MakeMyTrip India Pvt Ltd`
  }
};

/**
 * Ingest and process a specific scenario
 */
export function ingestScenarioReply(scenarioKey = 'samsung') {
  const scenario = VERIFIED_RECRUITER_SCENARIOS[scenarioKey] || VERIFIED_RECRUITER_SCENARIOS.samsung;
  const classification = classifyRecruiterIntent(scenario.subject, scenario.bodyText);
  const trackedJobs = getTrackedApplications();
  const correlation = correlateMessageWithJob(scenario.from, scenario.subject, scenario.bodyText, trackedJobs);

  const matchedJob = correlation ? correlation.job : { id: scenario.jobId, company: scenario.company, title: scenario.role };
  const confirmationId = scenario.confirmationId || (matchedJob ? matchedJob.confirmationId : '');

  const replyRecord = {
    messageId: scenario.messageId,
    from: scenario.from,
    recruiterName: scenario.recruiterName,
    company: scenario.company,
    role: scenario.role,
    jobId: matchedJob ? matchedJob.id : scenario.jobId,
    confirmationId: confirmationId,
    subject: scenario.subject,
    receivedDate: scenario.receivedDate,
    bodyText: scenario.bodyText,
    intent: classification.intent,
    intentTitle: classification.title,
    suggestedStage: classification.suggestedStage,
    badgeClass: classification.badgeClass,
    requiresAction: classification.requiresAction,
    actionText: classification.actionText,
    correlationType: correlation ? correlation.matchType : 'MANUAL_SCENARIO',
    sourceMode: 'TEST_SIMULATION_ACTIVE',
    replyDraft: null
  };

  // Generate reply draft
  replyRecord.replyDraft = generateCandidateReplyDraft(replyRecord);

  // Advance stage in applications.csv
  if (matchedJob && matchedJob.id && classification.suggestedStage) {
    const note = `Inbound recruiter reply from ${scenario.company}: ${classification.title}`;
    advanceJobStageInCsv(matchedJob.id, classification.suggestedStage, note);
    console.log(`[Gmail Detector] Pipeline stage updated for ${matchedJob.id}: ${classification.suggestedStage}`);
  }

  // Persist
  recordInboundReply(replyRecord);

  return replyRecord;
}

/**
 * Decode RFC 2047 MIME encoded headers (e.g. =?UTF-8?B?...?= or =?UTF-8?Q?...?=)
 */
export function decodeMimeHeader(headerStr) {
  if (!headerStr) return '';
  // Collapse whitespace between consecutive RFC 2047 encoded-words
  let clean = headerStr.replace(/\?=\s+=\?/g, '?==?');
  clean = clean.replace(/=\?([^?]+)\?([QBqb])\?([^?]+)\?=/gi, (_, charset, encoding, text) => {
    try {
      const enc = encoding.toUpperCase();
      const isLatin1 = charset && charset.toLowerCase().includes('8859-1');
      if (enc === 'B') {
        return Buffer.from(text, 'base64').toString(isLatin1 ? 'latin1' : 'utf8');
      } else if (enc === 'Q') {
        const bytes = [];
        for (let i = 0; i < text.length; i++) {
          if (text[i] === '=') {
            const hex = text.substr(i + 1, 2);
            bytes.push(parseInt(hex, 16));
            i += 2;
          } else if (text[i] === '_') {
            bytes.push(0x20);
          } else {
            bytes.push(text.charCodeAt(i));
          }
        }
        return Buffer.from(bytes).toString(isLatin1 ? 'latin1' : 'utf8');
      }
    } catch (e) {}
    return text;
  });
  return clean.replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
}

/**
 * Intelligent company & role extractor from raw email subject & sender
 */
export function extractCompanyAndRoleFromEmail(from, subject) {
  const fromClean = decodeMimeHeader(from);
  let subjClean = decodeMimeHeader(subject).replace(/\s+/g, ' ').trim();

  let company = '';
  let role = '';

  // 1. "Role at/at Company" or "Role @ Company"
  const atMatch = subjClean.match(/^(?:Job\s*[:|]\s*)?(.+?)\s+(?:at|@)\s+([A-Za-z0-9&.\- ]+?)(?:\.|\s*[-–(]|\s+\d+\s+more|$)/i);
  if (atMatch) {
    role = atMatch[1].trim();
    company = atMatch[2].trim();
  }

  // 2. "Company is hiring [: a an] Role"
  if (!company) {
    const hiringMatch = subjClean.match(/^([A-Za-z0-9&.\- ]+?)\s+is hiring(?:\s*:\s*|\s+a\s+|\s+an\s+|\s+)(.+)$/i);
    if (hiringMatch) {
      company = hiringMatch[1].trim();
      role = hiringMatch[2].trim();
    }
  }

  // 3. "fit for Company's Role"
  if (!company) {
    const fitMatch = subjClean.match(/fit for\s+([A-Za-z0-9&.\- ]+?)['’]s?\s+(.+)$/i);
    if (fitMatch) {
      company = fitMatch[1].trim();
      role = fitMatch[2].trim();
    }
  }

  // 4. "Indeed Application: HTML Developer"
  if (!company && subjClean.toLowerCase().includes('application:')) {
    const appMatch = subjClean.match(/application:\s*(.+)$/i);
    if (appMatch) {
      role = appMatch[1].trim();
      company = 'Indeed Employer Direct';
    }
  }

  // 5. "Job | Qa Automation Testing"
  if (!company && subjClean.toLowerCase().includes('job |')) {
    const jobMatch = subjClean.match(/job\s*\|\s*(.+)$/i);
    if (jobMatch) {
      role = jobMatch[1].trim();
      company = extractSenderDisplayName(fromClean) || 'Recruiter Direct';
    }
  }

  if (!company) company = extractCompanyFromSender(fromClean, subjClean);
  if (!role) role = extractRoleFromSubject(subjClean);

  company = company.replace(/[,;:\-]+$/, '').trim();
  role = role.replace(/[,;:\-]+$/, '').trim();

  return { company, role };
}

export function extractSenderDisplayName(from) {
  if (!from) return 'Recruiter';
  let name = from.split('<')[0].replace(/"/g, '').trim();
  if (name.includes('=?')) name = decodeMimeHeader(name);
  return name || 'Recruiter';
}

export function extractCompanyFromSender(from, subject) {
  const text = (from + ' ' + subject).toLowerCase();
  if (text.includes('naukri')) return 'Naukri Recruiter Network';
  if (text.includes('linkedin')) return 'LinkedIn Talent Network';
  if (text.includes('indeed')) return 'Indeed Employer Direct';
  if (text.includes('infoedge')) return 'Info Edge India';
  if (text.includes('amazon')) return 'Amazon (ADCI)';
  if (text.includes('samsungsds') || text.includes('samsung sds')) return 'Samsung SDS Global';
  if (text.includes('nagarro')) return 'Nagarro Enterprises';
  if (text.includes('epam')) return 'EPAM Systems';
  if (text.includes('wipro')) return 'Wipro Digital';
  if (text.includes('cisco')) return 'Cisco Systems Partner Network';
  if (text.includes('cheil') || text.includes('experience commerce')) return 'Experience Commerce (Cheil Group)';
  if (text.includes('tech mahindra') || text.includes('techmahindra')) return 'Tech Mahindra';
  if (text.includes('zomato')) return 'Zomato Engineering';
  if (text.includes('makemytrip')) return 'MakeMyTrip India';
  if (text.includes('incedo')) return 'Incedo Inc.';
  if (text.includes('paytm')) return 'Paytm Payments Bank';
  if (text.includes('gitlab')) return 'GitLab Partner Ecosystem';

  const match = from.match(/@([a-zA-Z0-9.-]+)/);
  if (match && match[1] && !match[1].includes('gmail') && !match[1].includes('yahoo') && !match[1].includes('outlook')) {
    const domainName = match[1].split('.')[0];
    return domainName.charAt(0).toUpperCase() + domainName.slice(1);
  }
  return 'Verified Recruiter';
}

export function extractRoleFromSubject(subject) {
  if (!subject) return 'Senior Frontend Engineer';
  const clean = decodeMimeHeader(subject);
  const patterns = [
    /for (?:the )?(?:role of |position of )?([^(\n,]+)/i,
    /hiring (?:a )?([^(\n,]+)/i,
    /application:?\s*([^(\n,]+)/i,
    /job\s*\|\s*([^(\n,]+)/i,
    /opening for\s*([^(\n,]+)/i,
    /([A-Z][a-zA-Z0-9 /+-]+(?:Engineer|Developer|Architect|Lead|Specialist|Manager))/
  ];
  for (const p of patterns) {
    const match = clean.match(p);
    if (match && match[1] && match[1].trim().length > 3) {
      return match[1].trim().replace(/^[|:\-\s]+|[|:\-\s]+$/g, '');
    }
  }
  return 'Senior Frontend Developer';
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Live IMAP Inbox Poller using Google App Password (TLS to imap.gmail.com:993)
 */
export async function syncGmailViaImap(config, trackedJobs = []) {
  const user = config.userEmail || process.env.SMTP_USER || 'kumar.ashu872@gmail.com';
  const pass = config.appPassword || process.env.SMTP_PASS || '';

  const results = {
    connected: true,
    mode: 'LIVE_GMAIL_IMAP',
    timestamp: new Date().toISOString(),
    scannedCount: 0,
    newRepliesDetected: 0,
    replies: []
  };

  if (!pass) {
    results.connected = false;
    results.error = 'No Google App Password configured';
    return results;
  }

  return new Promise((resolve) => {
    const socket = tls.connect(993, 'imap.gmail.com', { rejectUnauthorized: false });
    let buffer = '';
    let stage = 0;
    const timeout = setTimeout(() => {
      console.warn('[IMAP Sync] Socket timeout after 15s');
      try { socket.end(); } catch(e) {}
      results.replies = getAllInboundReplies();
      resolve(results);
    }, 15000);

    socket.on('data', async (chunk) => {
      buffer += chunk.toString();

      // Stage 0: Initial greeting -> send LOGIN
      if (stage === 0 && buffer.includes('* OK')) {
        stage = 1;
        buffer = '';
        socket.write(`A1 LOGIN "${user}" "${pass}"\r\n`);
      }
      // Stage 1: Authenticated -> select INBOX
      else if (stage === 1 && buffer.includes('A1 OK')) {
        stage = 2;
        buffer = '';
        socket.write('A2 SELECT INBOX\r\n');
      }
      // Stage 2: INBOX selected -> Search for recruiter emails
      else if (stage === 2 && buffer.includes('A2 OK')) {
        stage = 3;
        buffer = '';
        const query = 'from:(naukri.com OR infoedge.in OR linkedin.com OR indeed.com OR samsungsds.com OR amazon.com OR nagarro.com OR epam.com OR wipro.com OR zomato.com OR cheil.com OR incedoinc.com OR recruiter OR talent OR careers) OR subject:(interview OR assessment OR shortlisted OR application OR revert OR candidate)';
        socket.write(`A3 SEARCH X-GM-RAW "${query}"\r\n`);
      }
      // Stage 3: Search results -> fetch last 15 matching messages
      else if (stage === 3 && buffer.includes('A3 OK')) {
        const searchMatch = buffer.match(/\* SEARCH ([\d ]+)/);
        const ids = searchMatch && searchMatch[1] ? searchMatch[1].trim().split(/\s+/).filter(Boolean) : [];
        results.scannedCount = ids.length;

        if (ids.length === 0) {
          clearTimeout(timeout);
          socket.write('A9 LOGOUT\r\n');
          socket.end();
          results.replies = getAllInboundReplies();
          resolve(results);
          return;
        }

        // Fetch up to 15 most recent messages
        const recentIds = ids.slice(-15);
        stage = 4;
        buffer = '';
        socket.write(`A4 FETCH ${recentIds.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)])\r\n`);
      }
      // Stage 4: Headers received -> parse each message
      else if (stage === 4 && buffer.includes('A4 OK')) {
        clearTimeout(timeout);
        try {
          const fetchBlocks = buffer.split(/\* \d+ FETCH/g).filter(b => b.includes('BODY[HEADER.FIELDS'));
          
          for (const block of fetchBlocks) {
            const fromRaw = (block.match(/From:\s*([^\r\n]+)/i) || [])[1] || '';
            const subjectRaw = (block.match(/Subject:\s*([^\r\n]+)/i) || [])[1] || '';
            const dateRaw = (block.match(/Date:\s*([^\r\n]+)/i) || [])[1] || new Date().toISOString();
            const msgIdRaw = (block.match(/Message-ID:\s*([^\r\n]+)/i) || [])[1] || `MSG-IMAP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

            const from = decodeMimeHeader(fromRaw).trim();
            const subject = decodeMimeHeader(subjectRaw).trim();
            const messageId = msgIdRaw.replace(/[<>]/g, '').trim();

            if (!subject && !from) continue;

            const correlation = correlateMessageWithJob(from, subject, subject, trackedJobs);
            const classification = classifyRecruiterIntent(subject, `${from} ${subject}`, from);

            // Exclude automated recommendation emails / job alerts per user directive
            if (classification.isAutomatedAlert || classification.intent === 'JOB_LEAD_ALERT' || classification.category === 'LEAD') {
              continue;
            }
            const fromLower = from.toLowerCase();
            if (fromLower.includes('jobalert') || fromLower.includes('jobalerts') || fromLower.includes('match.indeed')) {
              continue;
            }

            const isRelevant = correlation || classification.intent !== 'GENERAL_INQUIRY';

            if (isRelevant) {
              const extracted = extractCompanyAndRoleFromEmail(from, subject);
              const company = correlation ? correlation.job.company : (extracted.company || extractCompanyFromSender(from, subject) || 'Recruiter Outreaches');
              const role = correlation ? correlation.job.title : (extracted.role || extractRoleFromSubject(subject) || 'Frontend Engineering Role');
              const jobId = correlation ? correlation.job.id : null;
              const confirmationId = correlation ? correlation.job.confirmationId : null;

              const replyRecord = {
                messageId,
                from,
                recruiterName: extractSenderDisplayName(from),
                company,
                role,
                jobId,
                confirmationId,
                subject,
                receivedDate: formatDateDisplay(dateRaw),
                bodyText: `Real incoming recruiter email from ${from}.\nSubject: ${subject}\nReceived: ${dateRaw}`,
                intent: classification.intent,
                intentTitle: classification.title,
                suggestedStage: classification.suggestedStage,
                badgeClass: classification.badgeClass,
                requiresAction: classification.requiresAction,
                actionText: classification.actionText,
                isAutomatedAlert: classification.isAutomatedAlert || false,
                category: classification.category || 'DIRECT',
                correlationType: correlation ? correlation.matchType : 'RECRUITER_DOMAIN_MATCH',
                sourceMode: 'LIVE_GMAIL_IMAP'
              };

              replyRecord.replyDraft = generateCandidateReplyDraft(replyRecord);

              if (jobId && classification.suggestedStage && classification.suggestedStage !== 'SUBMITTED') {
                advanceJobStageInCsv(jobId, classification.suggestedStage, `Live IMAP: ${classification.title}`);
              }

              recordInboundReply(replyRecord);
              results.replies.push(replyRecord);
              results.newRepliesDetected++;
            }
          }
        } catch (parseErr) {
          console.warn('[IMAP Parse Error]:', parseErr.message);
        }

        try {
          if (!socket.destroyed && socket.writable) {
            socket.write('A9 LOGOUT\r\n');
            socket.end();
          }
        } catch (e) {}
        results.replies = getAllInboundReplies();
        resolve(results);
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      console.warn('[IMAP Socket Error]:', err.message);
      results.error = err.message;
      results.replies = getAllInboundReplies();
      resolve(results);
    });
  });
}

/**
 * Main synchronizer: Scan Gmail inbox for matching recruiter replies
 */
export async function syncGmailInbox(options = {}) {
  const config = loadGmailConfig();
  const trackedJobs = getTrackedApplications();
  const results = {
    connected: config.connected,
    mode: config.mode,
    timestamp: new Date().toISOString(),
    scannedCount: 0,
    newRepliesDetected: 0,
    replies: []
  };

  // 1. If live Gmail OAuth credentials are provided, perform live REST API scan
  if (config.connected && config.mode === 'LIVE_GMAIL_API' && config.clientId && config.clientSecret && config.refreshToken) {
    try {
      console.log(`[Gmail Detector] Refreshing OAuth access token for ${config.userEmail}...`);
      const accessToken = await refreshGoogleAccessToken(config.clientId, config.clientSecret, config.refreshToken);
      
      const query = 'from:(samsungsds.com OR naukri.com OR infoedge.in OR amazon.com OR makemytrip.com OR nagarro.com OR publicissapient.com OR hcl.com OR techmahindra.com OR epam.com OR commbank.com.au OR wipro.com OR zomato.com OR cheil.com OR incedoinc.com OR linkedin.com OR indeed.com) OR subject:(interview OR assessment OR shortlisted OR application OR revert OR "Ashutosh")';
      const searchRes = await fetchGmailApi(`/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`, accessToken);
      const messages = searchRes.messages || [];
      results.scannedCount = messages.length;

      for (const msg of messages) {
        const fullMsg = await fetchGmailApi(`/gmail/v1/users/me/messages/${msg.id}?format=full`, accessToken);
        
        const headers = fullMsg.payload?.headers || [];
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
        const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '';
        const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || new Date().toISOString();
        
        let bodyText = fullMsg.snippet || '';
        if (fullMsg.payload?.parts) {
          const textPart = fullMsg.payload.parts.find(p => p.mimeType === 'text/plain');
          if (textPart && textPart.body?.data) {
            bodyText = Buffer.from(textPart.body.data, 'base64url').toString('utf8');
          }
        } else if (fullMsg.payload?.body?.data) {
          bodyText = Buffer.from(fullMsg.payload.body.data, 'base64url').toString('utf8');
        }

        const correlation = correlateMessageWithJob(fromHeader, subjectHeader, bodyText, trackedJobs);
        const classification = classifyRecruiterIntent(subjectHeader, bodyText, fromHeader);

        // Exclude automated recommendation emails / job alerts per user directive
        if (classification.isAutomatedAlert || classification.intent === 'JOB_LEAD_ALERT' || classification.category === 'LEAD') {
          continue;
        }
        const fromLower = fromHeader.toLowerCase();
        if (fromLower.includes('jobalert') || fromLower.includes('jobalerts') || fromLower.includes('match.indeed')) {
          continue;
        }

        const isRelevant = correlation || classification.intent !== 'GENERAL_INQUIRY' ||
          /naukri|linkedin|indeed|application|interview|hiring|recruiter|assessment|shortlist/i.test(fromHeader + ' ' + subjectHeader);

        if (isRelevant) {
          const replyRecord = {
            messageId: msg.id,
            from: fromHeader,
            recruiterName: extractSenderDisplayName(fromHeader),
            company: correlation ? correlation.job.company : (extractCompanyFromSender(fromHeader, subjectHeader) || 'Recruiter Outreaches'),
            role: correlation ? correlation.job.title : (extractRoleFromSubject(subjectHeader) || 'Frontend Engineering Role'),
            jobId: correlation ? correlation.job.id : null,
            confirmationId: correlation ? correlation.job.confirmationId : null,
            subject: subjectHeader,
            receivedDate: formatDateDisplay(dateHeader),
            bodyText: bodyText,
            intent: classification.intent,
            intentTitle: classification.title,
            suggestedStage: classification.suggestedStage,
            badgeClass: classification.badgeClass,
            requiresAction: classification.requiresAction,
            actionText: classification.actionText,
            correlationType: correlation ? correlation.matchType : 'RECRUITER_DOMAIN_MATCH',
            sourceMode: 'LIVE_GMAIL_API'
          };

          replyRecord.replyDraft = generateCandidateReplyDraft(replyRecord);

          if (correlation && classification.suggestedStage && classification.suggestedStage !== 'SUBMITTED') {
            advanceJobStageInCsv(correlation.job.id, classification.suggestedStage, `Live Gmail reply: ${classification.title}`);
          }

          recordInboundReply(replyRecord);
          results.replies.push(replyRecord);
          results.newRepliesDetected++;
        }
      }

      saveGmailConfig({ lastSyncTimestamp: results.timestamp });
      results.replies = getAllInboundReplies();
      return results;
    } catch (err) {
      console.warn(`[Gmail Detector] Live Gmail sync encountered error: ${err.message}`);
      results.error = err.message;
    }
  }

  // 2. If Google App Password is provided, perform live IMAP scan on real Gmail inbox
  const appPass = config.appPassword || process.env.SMTP_PASS;
  if (appPass) {
    try {
      console.log(`[Gmail Detector] Scanning real inbox for ${config.userEmail} via live Google IMAP...`);
      const imapResults = await syncGmailViaImap(config, trackedJobs);
      saveGmailConfig({ lastSyncTimestamp: imapResults.timestamp, connected: true, mode: 'LIVE_GMAIL_APP_PASS' });
      return imapResults;
    } catch (imapErr) {
      console.warn(`[Gmail Detector] IMAP scan error: ${imapErr.message}`);
      results.error = imapErr.message;
    }
  }

  // 3. Fallback when explicit demo requested (strictly during automated tests)
  if (options.forceScenario) {
    const s1 = ingestScenarioReply('samsung');
    const s2 = ingestScenarioReply('naukri');
    results.replies = [s1, s2];
    results.newRepliesDetected = 2;
    return results;
  }

  // 4. If not connected, return zero messages — NEVER auto-inject fake demos
  results.connected = false;
  results.mode = 'WAITING_FOR_CREDENTIALS';
  results.replies = getAllInboundReplies();
  results.message = 'Gmail not connected. Please connect via [⚙️ Gmail Setup] to receive real recruiter messages.';
  return results;
}

// CLI Execution support
if (process.argv[1] && process.argv[1].endsWith('gmail-reply-detector.js')) {
  console.log('[Gmail Detector CLI] Initializing scan...');
  syncGmailInbox().then(res => {
    console.log('[Gmail Detector CLI] Scan completed successfully:');
    console.log(JSON.stringify(res, null, 2));
  }).catch(e => {
    console.error('[Gmail Detector CLI] Error:', e);
  });
}
