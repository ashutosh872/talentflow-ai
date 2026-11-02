import { chromium } from 'playwright';
import * as fs from 'fs';

async function makePdf() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; font-size: 10pt; line-height: 1.4; }
    h1 { font-size: 18pt; margin: 0 0 4px 0; color: #0f172a; text-transform: uppercase; font-weight: 800; }
    .sub { font-size: 11pt; font-weight: 600; color: #2563eb; margin-bottom: 6px; }
    .contact { font-size: 8.5pt; color: #475569; margin-bottom: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
    h2 { font-size: 10.5pt; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin: 14px 0 6px 0; color: #0f172a; font-weight: 700; }
    p { margin: 0 0 6px 0; }
    ul { margin: 4px 0 8px 0; padding-left: 18px; }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>
  <h1>Ashutosh Kumar</h1>
  <div class="sub">Senior Frontend Engineer • Senior UI Developer</div>
  <div class="contact">New Delhi, India | Phone: +91 9310681373 | Email: kumar.ashu872@gmail.com | LinkedIn: linkedin.com/in/kumarashu872</div>
  <h2>Professional Summary</h2>
  <p>Senior Frontend/UI Engineer with 8+ years of experience delivering responsive, accessible, and high-performance web interfaces for enterprise clients and scaling businesses including Samsung SDS, Cisco, and Wondrfly.</p>
</body>
</html>`;
  await page.setContent(html);
  await page.pdf({ path: 'scripts/test_resume.pdf', format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF written successfully. Size:', fs.statSync('scripts/test_resume.pdf').size);
}
makePdf();
