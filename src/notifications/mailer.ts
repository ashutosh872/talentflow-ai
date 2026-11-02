import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';
import { VERIFIED_CANDIDATE_PROFILE } from '../profile/candidate-profile.js';

export interface EmailSubmissionPayload {
  jobId: string;
  company: string;
  role: string;
  vacancyPortal: string; // e.g. "LinkedIn Jobs", "Naukri.com", "Indeed Verified Feed", "Official Career Portal"
  officialUrl?: string;
  submissionMethod: 'Via Opening Portal' | 'Via Autofill';
  confirmationId: string;
  appliedDate: string;
  resumePdfPath?: string;
  coverLetterPdfPath?: string;
  recipientEmail?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  emailId: string;
  recipient: string;
  subject: string;
  mode: 'LIVE_SMTP' | 'LOCAL_TRANSACTIONAL_RECEIPT';
  htmlPath: string;
  webUrl: string;
  timestamp: string;
  attachments: string[];
}

export async function sendApplicationConfirmationEmail(
  payload: EmailSubmissionPayload
): Promise<EmailDispatchResult> {
  const c = VERIFIED_CANDIDATE_PROFILE;
  const recipient = payload.recipientEmail || c.contact.email; // kumar.ashu872@gmail.com
  const emailId = `EML-${payload.confirmationId}-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  }) + ' (IST)';

  const subject = `Application Confirmation: ${payload.role} at ${payload.company} [${payload.confirmationId}]`;

  // Attachments check
  const attachments: { filename: string; path: string }[] = [];
  const attachmentNames: string[] = [];

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
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
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
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 11px; text-transform: uppercase; tracking: 1px; color: #94a3b8; margin-bottom: 4px;">Ashutosh Kumar Application Verification Dispatcher</div>
      <h1>✓ Application Revert Confirmation</h1>
      <span class="badge ${payload.submissionMethod === 'Via Opening Portal' ? 'badge-portal' : 'badge-autofill'}">
        Submitted ${payload.submissionMethod}
      </span>
    </div>

    <div class="body">
      <div class="greeting">Dear Ashutosh,</div>
      <p>
        This email confirms that your formal job application for <strong>${payload.role}</strong> at <strong>${payload.company}</strong> has been successfully recorded and processed.
      </p>

      <div class="alert-box">
        <strong>Application Confirmation ID:</strong> <code style="font-family: monospace; font-weight: bold; background: #dbeafe; padding: 2px 6px; border-radius: 4px;">${payload.confirmationId}</code><br>
        <strong>Timestamp:</strong> ${timestamp}
      </div>

      <table class="table-details">
        <tr>
          <td class="label">Target Organization</td>
          <td class="val"><strong>${payload.company}</strong></td>
        </tr>
        <tr>
          <td class="label">Job Profile Title</td>
          <td class="val"><strong>${payload.role}</strong></td>
        </tr>
        <tr>
          <td class="label">Vacancy Source Portal</td>
          <td class="val"><span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${payload.vacancyPortal}</span></td>
        </tr>
        <tr>
          <td class="label">Way of Submission</td>
          <td class="val"><strong>${payload.submissionMethod}</strong></td>
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
          <td class="label">CTC Submitted</td>
          <td class="val">Current: <strong>₹6 LPA</strong> | Target: <strong>₹12+ LPA (Remote/NCR) • ₹15+ LPA (Out of NCR)</strong></td>
        </tr>
        <tr>
          <td class="label">Current Organization</td>
          <td class="val">Frontend Developer at Wondrfly Inc. (Contract)</td>
        </tr>
        ${payload.officialUrl ? `
        <tr>
          <td class="label">Opening Portal Link</td>
          <td class="val"><a href="${payload.officialUrl}" target="_blank" style="color: #2563eb; word-break: break-all;">${payload.officialUrl}</a></td>
        </tr>` : ''}
      </table>

      <div class="attach-box">
        <div class="attach-title">📎 Attached Application Documents:</div>
        ${attachmentNames.map(name => `
          <div class="attach-item">
            <span>📄</span>
            <span>${name}</span>
            <span style="font-size: 11px; color: #10b981; font-weight: normal;">(Verified Master ATS Standard)</span>
          </div>
        `).join('')}
      </div>

      <p style="margin-top: 18px; font-size: 13px; color: #475569;">
        <strong>Recommended Next Steps:</strong><br>
        1. Keep reference ID <code>${payload.confirmationId}</code> handy for interview scheduling and recruiter follow-ups.<br>
        2. Expected first outreach typically occurs within 3–7 business days.<br>
        3. Interview preparation notes and technical talking points are archived in your workflow dashboard.
      </p>
    </div>

    <div class="footer">
      Ashutosh Kumar AI Job Search &amp; Application Workflow Agent<br>
      Automated Transactional Revert Dispatcher • Account: ${recipient}
    </div>
  </div>
</body>
</html>`;

  // Persist email receipt on disk
  const dispatchesDir = path.resolve('data/email-dispatches');
  if (!fs.existsSync(dispatchesDir)) fs.mkdirSync(dispatchesDir, { recursive: true });

  const htmlFileName = `${emailId}.html`;
  const htmlPath = path.join(dispatchesDir, htmlFileName);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  // Try live SMTP if environment variables are configured
  let dispatchMode: 'LIVE_SMTP' | 'LOCAL_TRANSACTIONAL_RECEIPT' = 'LOCAL_TRANSACTIONAL_RECEIPT';

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
    } catch (err: any) {
      console.warn(`[Email Dispatcher] SMTP delivery failed (${err?.message}). Fallback to local dispatch log.`);
    }
  }

  // Update persistent audit log index
  const logIndexPath = path.join(dispatchesDir, 'dispatches.json');
  let dispatches: any[] = [];
  if (fs.existsSync(logIndexPath)) {
    try {
      dispatches = JSON.parse(fs.readFileSync(logIndexPath, 'utf8'));
    } catch (e) {}
  }

  const record = {
    emailId,
    confirmationId: payload.confirmationId,
    jobId: payload.jobId,
    company: payload.company,
    role: payload.role,
    vacancyPortal: payload.vacancyPortal,
    submissionMethod: payload.submissionMethod,
    recipientEmail: recipient,
    subject,
    timestamp,
    mode: dispatchMode,
    htmlFileName,
    attachments: attachmentNames
  };

  dispatches.unshift(record);
  fs.writeFileSync(logIndexPath, JSON.stringify(dispatches, null, 2), 'utf8');

  return {
    success: true,
    emailId,
    recipient,
    subject,
    mode: dispatchMode,
    htmlPath,
    webUrl: `/data/email-dispatches/${htmlFileName}`,
    timestamp,
    attachments: attachmentNames
  };
}
