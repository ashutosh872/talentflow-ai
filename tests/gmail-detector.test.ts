import { describe, it, expect } from 'vitest';
import {
  classifyRecruiterIntent,
  correlateMessageWithJob,
  generateCandidateReplyDraft,
  getGoogleOAuthUrl
} from '../scripts/gmail-reply-detector.js';

describe('Gmail Automated Reply Detection & Intelligence Engine', () => {
  const sampleTrackedJobs = [
    {
      id: 'job-mock-002',
      title: 'Senior Frontend Engineer (UI/UX Engineering)',
      company: 'Samsung SDS Global',
      status: 'SUBMITTED',
      confirmationId: 'CONF-SSDS-2026-8821-SUCCESS'
    },
    {
      id: 'naukri-001',
      title: 'Senior UI / Angular Developer (8+ Yrs Experience)',
      company: 'Info Edge India (Naukri Enterprise)',
      status: 'SUBMITTED',
      confirmationId: 'CONF-NAUKRI-IE-8812-SUCCESS'
    },
    {
      id: 'linkedin-4478053400',
      title: 'Front-End Engineer II (FBA Placement)',
      company: 'Amazon (ADCI)',
      status: 'SUBMITTED',
      confirmationId: 'CONF-AMAZON-LIVE-VERIFY'
    }
  ];

  it('generates a valid Google OAuth 2.0 authorization URL with required scopes', () => {
    const url = getGoogleOAuthUrl('test-client-id', 'http://localhost:5000/api/gmail/oauth2callback');
    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url).toContain('client_id=test-client-id');
    expect(url).toContain('gmail.readonly');
    expect(url).toContain('response_type=code');
  });

  it('classifies interview / HR screening invitation emails correctly', () => {
    const subject = 'Interview Invitation: Senior Frontend Engineer at Samsung SDS Global [CONF-SSDS-2026-8821-SUCCESS]';
    const body = 'We are pleased to inform you that your profile has been shortlisted for an initial 30-minute introductory and technical alignment video call.';
    const result = classifyRecruiterIntent(subject, body);

    expect(result.intent).toBe('HR_SCREEN_INVITE');
    expect(result.suggestedStage).toBe('HR_SCREEN');
    expect(result.requiresAction).toBe(true);
  });

  it('classifies technical coding assessment invitations correctly', () => {
    const subject = 'Online Technical Challenge: Senior UI Developer at Info Edge (Naukri)';
    const body = 'Please complete our Senior UI Online Assessment on HackerRank within 48 hours.';
    const result = classifyRecruiterIntent(subject, body);

    expect(result.intent).toBe('TECH_ASSESSMENT');
    expect(result.suggestedStage).toBe('TECH_INTERVIEW');
    expect(result.requiresAction).toBe(true);
  });

  it('correlates incoming email by Confirmation ID', () => {
    const from = 'Priya Sharma <priya.sharma@samsungsds.com>';
    const subject = 'Update regarding CONF-SSDS-2026-8821-SUCCESS';
    const body = 'We would like to speak with you regarding your application.';
    const match = correlateMessageWithJob(from, subject, body, sampleTrackedJobs);

    expect(match).not.toBeNull();
    expect(match?.job.id).toBe('job-mock-002');
    expect(match?.matchType).toBe('CONFIRMATION_ID');
    expect(match?.confidence).toBe(1.0);
  });

  it('correlates incoming email by employer domain or company name when confirmation ID is omitted', () => {
    const from = 'talent-acquisition@amazon.com';
    const subject = 'Front-End Engineer Role Discussion';
    const body = 'Following up on your interest in our Bangalore engineering team.';
    const match = correlateMessageWithJob(from, subject, body, sampleTrackedJobs);

    expect(match).not.toBeNull();
    expect(match?.job.company).toBe('Amazon (ADCI)');
    expect(['COMPANY_NAME', 'DOMAIN_MATCH']).toContain(match?.matchType);
  });

  it('generates high-conversion response draft tailored for Ashutosh Kumar', () => {
    const replyRecord = {
      messageId: 'TEST-123',
      recruiterName: 'Priya Sharma',
      company: 'Samsung SDS Global',
      role: 'Senior Frontend Engineer',
      confirmationId: 'CONF-SSDS-2026-8821-SUCCESS',
      subject: 'Interview Availability Request',
      intent: 'HR_SCREEN_INVITE'
    };

    const draft = generateCandidateReplyDraft(replyRecord);
    expect(draft.subject).toContain('Interview Availability');
    expect(draft.body).toContain('Dear Priya Sharma');
    expect(draft.body).toContain('Immediate to 15 Days');
    expect(draft.body).toContain('+91 9310681373');
    expect(draft.body).toContain('Angular');
    expect(draft.body).toContain('₹12+ LPA');
  });
});
