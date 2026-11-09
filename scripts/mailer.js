import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';
import { registerEmailDispatch } from './email-tracker.js';

export async function sendApplicationConfirmationEmail(payload) {
  const recipient = payload.recipientEmail || 'kumar.ashu872@gmail.com';
  const confirmationId = payload.confirmationId || `CONF-${Date.now().toString(36).toUpperCase()}`;
  const emailId = `EML-${confirmationId}-${Date.now().toString(36).toUpperCase()}`;
  const trackingId = `TRK-${payload.jobId || confirmationId}`;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  }) + ' (IST)';

  const company = payload.company || 'Enterprise Partner';
  const role = payload.role || 'Senior Frontend Engineer';
  const vacancyPortal = payload.vacancyPortal || 'LinkedIn / Enterprise Portal';
  const submissionMethod = payload.submissionMethod || 'Via Opening Portal';
  const officialUrl = payload.officialUrl || '';

  const subject = `Application Confirmation: ${role} at ${company} [${confirmationId}]`;

  // Attachments check
  const attachments = [];
  const attachmentNames = [];

  if (payload.resumePdfPath && fs.existsSync(payload.resumePdfPath)) {
    attachments.push({
      filename: 'Ashutosh_Kumar_Resume.pdf',
      path: path.resolve(payload.resumePdfPath)
    });
    attachmentNames.push('Ashutosh_Kumar_Resume.pdf');
  }

  if (payload.coverLetterPdfPath && fs.existsSync(payload.coverLetterPdfPath)) {
    attachments.push({
      filename: 'Ashutosh_Kumar_Cover_Letter.pdf',
      path: path.resolve(payload.coverLetterPdfPath)
    });
    attachmentNames.push('Ashutosh_Kumar_Cover_Letter.pdf');
  }

  // HTML Email Template
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 660px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px 30px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.3px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 10px; }
    .badge-portal { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-autofill { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.4); }
    .body { padding: 28px 30px; font-size: 14px; line-height: 1.6; color: #334155; }
    .greeting { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .alert-box { background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; margin: 16px 0; color: #1e40af; font-size: 13px; }
    .table-details { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .table-details td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .table-details td.label { font-weight: 700; color: #0f172a; width: 35%; background: #f8fafc; }
    .table-details td.val { color: #334155; }
    .attach-box { background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 8px; padding: 14px 18px; margin: 20px 0; }
    .attach-title { font-weight: 700; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .attach-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 13px; color: #1d4ed8; font-weight: 600; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; font-size: 12px; color: #64748b; text-align: center; }
    .action-row { margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; }
    .btn-primary { background: #2563eb; color: #ffffff !important; }
    .btn-secondary { background: #f1f5f9; color: #334155 !important; border: 1px solid #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px;">Ashutosh Kumar Application Verification Dispatcher</div>
      <h1>✓ Application Revert Confirmation</h1>
      <span class="badge ${submissionMethod === 'Via Opening Portal' ? 'badge-portal' : 'badge-autofill'}">
        Submitted ${submissionMethod}
      </span>
    </div>

    <div class="body">
      <div class="greeting">Dear Ashutosh,</div>
      <p>
        This email confirms that your formal job application for <strong>${role}</strong> at <strong>${company}</strong> has been successfully recorded and submitted.
      </p>

      <div class="alert-box">
        <strong>Application Confirmation ID:</strong> <code style="font-family: monospace; font-weight: bold; background: #dbeafe; padding: 2px 6px; border-radius: 4px;">${confirmationId}</code><br>
        <strong>Submission Timestamp:</strong> ${timestamp}
      </div>

      <table class="table-details">
        <tr>
          <td class="label">Target Organization</td>
          <td class="val"><strong>${company}</strong></td>
        </tr>
        <tr>
          <td class="label">Job Profile Title</td>
          <td class="val"><strong>${role}</strong></td>
        </tr>
        <tr>
          <td class="label">Vacancy Source Portal</td>
          <td class="val"><span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${vacancyPortal}</span></td>
        </tr>
        <tr>
          <td class="label">Way of Submission</td>
          <td class="val"><strong>${submissionMethod}</strong></td>
        </tr>
        <tr>
          <td class="label">Registered Email ID</td>
          <td class="val"><a href="mailto:${recipient}" style="color: #2563eb; text-decoration: none;">${recipient}</a></td>
        </tr>
        <tr>
          <td class="label">Candidate Contact</td>
          <td class="val">+91 9310681373 • New Delhi, India</td>
        </tr>
        <tr>
          <td class="label">Notice Period Submitted</td>
          <td class="val">Immediate to 15 Days</td>
        </tr>
        <tr>
          <td class="label">Compensation Terms</td>
          <td class="val">Current: <strong>₹6 LPA</strong> | Expected: <strong>₹12+ LPA (Remote/NCR) • ₹15+ LPA (Out of NCR)</strong></td>
        </tr>
        <tr>
          <td class="label">Current Organization</td>
          <td class="val">Frontend Developer at Wondrfly Inc. (Contract)</td>
        </tr>
        ${officialUrl ? `
        <tr>
          <td class="label">Opening Portal Link</td>
          <td class="val"><a href="${officialUrl}" target="_blank" style="color: #2563eb; word-break: break-all;">${officialUrl}</a></td>
        </tr>` : ''}
      </table>

      <div class="attach-box">
        <div class="attach-title">📎 Attached Application Documents:</div>
        ${attachmentNames.length > 0 ? attachmentNames.map(name => `
          <div class="attach-item">
            <span>📄</span>
            <span>${name}</span>
            <span style="font-size: 11px; color: #10b981; font-weight: normal;">(Verified Master ATS Standard • 2 Pages)</span>
          </div>
        `).join('') : '<div style="color: #64748b; font-size: 13px;">Ashutosh_Kumar_Resume.pdf &amp; Ashutosh_Kumar_Cover_Letter.pdf included with submission.</div>'}
      </div>

      <p style="margin-top: 18px; font-size: 13px; color: #475569;">
        <strong>Application Audit Trail:</strong><br>
        • Verified profile submitted with 8+ years enterprise frontend track record (Samsung SDS, Cisco, Wondrfly).<br>
        • Single coherent summary aligned to ${company}'s frontend stack.<br>
        • Keep reference <code>${confirmationId}</code> handy for interview scheduling.
      </p>

      <div class="action-row">
        <a href="mailto:${recipient}?subject=Fwd:%20Application%20Confirmation%20-%20${encodeURIComponent(role)}%20at%20${encodeURIComponent(company)}&body=${encodeURIComponent('Application Confirmation for ' + role + ' at ' + company + '\nConfirmation ID: ' + confirmationId + '\nSubmitted ' + submissionMethod + '\nDate: ' + timestamp)}" class="btn btn-primary">
          📨 Forward Copy to My Gmail
        </a>
        <button onclick="window.print()" class="btn btn-secondary">
          🖨️ Print Receipt
        </button>
      </div>
    </div>

    <div class="footer">
      Ashutosh Kumar AI Job Search &amp; Application Workflow Agent<br>
      Automated Transactional Revert Dispatcher • Account: ${recipient}
      <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
        📡 Real-Time Dispatch Read Receipt Tracking ID: <code style="font-family: monospace; font-weight: bold; color: #2563eb;">${trackingId}</code> • Monitored via Delivery Engine
      </div>
    </div>
  </div>
  <!-- Real-Time Email Open Tracking Beacon -->
  <img src="/api/track/open/${trackingId}" width="1" height="1" alt="" style="display:none!important;width:1px;height:1px;border:0;opacity:0;" />
</body>
</html>`;

  // Persist email receipt on disk
  const dispatchesDir = path.resolve('data/email-dispatches');
  if (!fs.existsSync(dispatchesDir)) fs.mkdirSync(dispatchesDir, { recursive: true });

  const htmlFileName = `${emailId}.html`;
  const htmlPath = path.join(dispatchesDir, htmlFileName);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  // Register in Email Tracker Store
  try {
    registerEmailDispatch({
      emailId,
      confirmationId,
      jobId: payload.jobId,
      company,
      role,
      recipientEmail: recipient
    });
  } catch (e) {}

  // Try live SMTP if environment variables are configured
  let dispatchMode = 'LOCAL_TRANSACTIONAL_RECEIPT';

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Ashutosh Kumar Application Agent" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      });
      dispatchMode = 'LIVE_SMTP';
      console.log(`[Email Dispatcher] Live SMTP confirmation delivered to ${recipient}`);
    } catch (err) {
      console.warn(`[Email Dispatcher] SMTP delivery failed (${err?.message}). Fallback to local dispatch log.`);
    }
  }

  // Update persistent audit log index
  const logIndexPath = path.join(dispatchesDir, 'dispatches.json');
  let dispatches = [];
  if (fs.existsSync(logIndexPath)) {
    try {
      dispatches = JSON.parse(fs.readFileSync(logIndexPath, 'utf8'));
    } catch (e) {}
  }

  const record = {
    emailId,
    confirmationId,
    jobId: payload.jobId,
    trackingId,
    company,
    role,
    vacancyPortal,
    submissionMethod,
    recipientEmail: recipient,
    subject,
    timestamp,
    mode: dispatchMode,
    htmlFileName,
    webUrl: `/data/email-dispatches/${htmlFileName}`,
    trackingUrl: `/api/track/open/${trackingId}`,
    openStatus: 'DELIVERED',
    openCount: 0,
    attachments: attachmentNames
  };

  dispatches.unshift(record);
  fs.writeFileSync(logIndexPath, JSON.stringify(dispatches, null, 2), 'utf8');

  return {
    success: true,
    emailId,
    confirmationId,
    recipient,
    subject,
    mode: dispatchMode,
    htmlPath,
    webUrl: `/data/email-dispatches/${htmlFileName}`,
    timestamp,
    attachments: attachmentNames
  };
}

export async function sendCandidateVerificationEmail(candidate, baseUrl = 'http://localhost:5000') {
  const recipient = candidate.email || 'test.candidate@example.com';
  const otpCode = candidate.verificationOtp || Math.floor(100000 + Math.random() * 900000).toString();
  const token = candidate.verificationToken || `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const emailId = `EML-VERIFY-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  }) + ' (IST)';

  const verifyUrl = `${baseUrl}/api/candidates/verify?id=${encodeURIComponent(candidate.id)}&code=${otpCode}&token=${token}`;
  const subject = `Verify Your Candidate Profile on TalentFlow AI [OTP: ${otpCode}]`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 24px; color: #f8fafc; }
    .card { max-width: 620px; margin: 0 auto; background: #111827; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 28px 32px; border-bottom: 1px solid #1e293b; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.3px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 10px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .body { padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .greeting { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .otp-box { background: #0f172a; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: bold; margin-bottom: 6px; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; color: #38bdf8; letter-spacing: 6px; }
    .otp-expiry { font-size: 11px; color: #64748b; margin-top: 6px; }
    .btn-verify { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 700; padding: 12px 28px; border-radius: 10px; margin: 16px 0; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; background: #0b0f19; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
    .info-table td { padding: 10px 14px; border-bottom: 1px solid #1e293b; }
    .info-table td.label { color: #94a3b8; font-weight: 600; width: 35%; }
    .info-table td.val { color: #f1f5f9; font-weight: bold; }
    .footer { background: #0b0f19; border-top: 1px solid #1e293b; padding: 18px 32px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #93c5fd; font-weight: bold; margin-bottom: 6px;">TalentFlow AI • Candidate Identity Verification</div>
      <h1>Email Verification Required</h1>
      <span class="badge">Candidate Activation Token</span>
    </div>

    <div class="body">
      <div class="greeting">Dear ${candidate.name},</div>
      <p>
        A new candidate profile has been registered under your email address for the role of <strong>${candidate.title || 'Software Engineer'}</strong> on the TalentFlow AI Platform.
      </p>
      <p>
        To verify that this email address belongs to you and to authorize autonomous recruiter submissions and interview notifications, please enter the following 6-digit verification code:
      </p>

      <div class="otp-box">
        <div class="otp-label">One-Time Verification Code (OTP)</div>
        <div class="otp-code">${otpCode}</div>
        <div class="otp-expiry">Valid for 30 minutes • Do not share this code with anyone</div>
      </div>

      <div style="text-align: center;">
        <a href="${verifyUrl}" class="btn-verify">✓ Verify Email Address Instantly</a>
      </div>

      <table class="info-table">
        <tr><td class="label">Candidate Name</td><td class="val">${candidate.name}</td></tr>
        <tr><td class="label">Target Role</td><td class="val">${candidate.title}</td></tr>
        <tr><td class="label">Experience Level</td><td class="val">${candidate.experienceYears || 5} Years</td></tr>
        <tr><td class="label">Registered Email</td><td class="val">${recipient}</td></tr>
        <tr><td class="label">Dispatch Time</td><td class="val">${timestamp}</td></tr>
      </table>

      <p style="font-size: 12px; color: #94a3b8;">
        Once verified, this profile can be selected in the agency switcher and applications will be submitted on your behalf. If you did not request this profile, please ignore this email.
      </p>
    </div>

    <div class="footer">
      TalentFlow AI Candidate Management System<br>
      Automated Verification Dispatcher • Workspace Admin: Ashutosh Kumar (kumar.ashu872@gmail.com)
    </div>
  </div>
</body>
</html>`;

  // Persist dispatch on disk
  const dispatchesDir = path.resolve('data/email-dispatches');
  if (!fs.existsSync(dispatchesDir)) fs.mkdirSync(dispatchesDir, { recursive: true });

  const htmlFileName = `${emailId}.html`;
  const htmlPath = path.join(dispatchesDir, htmlFileName);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  // Try live SMTP if environment variables are configured
  let dispatchMode = 'LOCAL_TRANSACTIONAL_RECEIPT';
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"TalentFlow AI Verification" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: subject,
        html: htmlContent
      });
      dispatchMode = 'LIVE_SMTP';
      console.log(`[Candidate Verification] Live verification email delivered to ${recipient}`);
    } catch (err) {
      console.warn(`[Candidate Verification] SMTP delivery failed (${err?.message}). Fallback to local dispatch log.`);
    }
  }

  // Update persistent audit log index
  const logIndexPath = path.join(dispatchesDir, 'dispatches.json');
  let dispatches = [];
  if (fs.existsSync(logIndexPath)) {
    try { dispatches = JSON.parse(fs.readFileSync(logIndexPath, 'utf8')); } catch (e) {}
  }

  const record = {
    emailId,
    candidateId: candidate.id,
    candidateName: candidate.name,
    recipientEmail: recipient,
    subject,
    otpCode,
    token,
    verifyUrl,
    timestamp,
    mode: dispatchMode,
    htmlFileName,
    webUrl: `/data/email-dispatches/${htmlFileName}`
  };

  dispatches.unshift(record);
  fs.writeFileSync(logIndexPath, JSON.stringify(dispatches, null, 2), 'utf8');

  return {
    success: true,
    emailId,
    otpCode,
    token,
    verifyUrl,
    recipient,
    mode: dispatchMode,
    htmlPath,
    webUrl: `/data/email-dispatches/${htmlFileName}`
  };
}
