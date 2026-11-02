import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { BrowserAutofiller } from '../src/applications/browser-autofill.js';
import { VERIFIED_CANDIDATE_PROFILE } from '../src/profile/candidate-profile.js';

describe('BrowserAutofiller Automated Form Tests', () => {
  let server: http.Server;
  let serverUrl: string;

  const sampleFormHtml = `
    <!DOCTYPE html>
    <html>
    <head><title>Test Job Application Form</title></head>
    <body>
      <form id="job-apply-form">
        <label for="fname">First Name:</label>
        <input type="text" id="fname" name="first_name" />

        <label for="lname">Last Name:</label>
        <input type="text" id="lname" name="last_name" />

        <label for="email">Email Address:</label>
        <input type="email" id="email" name="candidate_email" />

        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" />

        <label for="linkedin">LinkedIn Profile URL:</label>
        <input type="url" id="linkedin" name="linkedin_url" />

        <label for="company">Current Employer:</label>
        <input type="text" id="company" name="current_company" />

        <label for="yoe">Years of Experience:</label>
        <input type="number" id="yoe" name="years_experience" />

        <label for="notice">Notice Period:</label>
        <input type="text" id="notice" name="notice_period" />

        <label for="cover">Cover Letter / Note:</label>
        <textarea id="cover" name="cover_letter"></textarea>

        <label for="resume">Attach Resume / CV:</label>
        <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" />

        <button type="submit" id="submit-btn">Submit Application</button>
      </form>
    </body>
    </html>
  `;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(sampleFormHtml);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const address = server.address() as any;
        serverUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('navigates to form, auto-detects fields, maps verified candidate profile, and populates inputs', async () => {
    const autofiller = new BrowserAutofiller();
    const dummyResumePath = path.resolve('data/test-resume.txt');
    fs.writeFileSync(dummyResumePath, 'Test Resume Content', 'utf-8');

    const result = await autofiller.autofill({
      url: serverUrl,
      headless: true,
      resumePath: dummyResumePath
    });

    if (fs.existsSync(dummyResumePath)) {
      fs.unlinkSync(dummyResumePath);
    }

    expect(result.success).toBe(true);
    expect(result.fieldsFilled.length).toBeGreaterThanOrEqual(7);
    expect(result.fieldsFilled).toContain('First Name');
    expect(result.fieldsFilled).toContain('Last Name');
    expect(result.fieldsFilled).toContain('Email');
    expect(result.fieldsFilled).toContain('Phone');
    expect(result.fieldsFilled).toContain('LinkedIn Profile');
    expect(result.fieldsFilled).toContain('Current Company');
    expect(result.fieldsFilled).toContain('Years of Experience');
    expect(result.resumeAttached).toBe(true);
  }, 30000);
});
