import tls from 'tls';
import { loadGmailConfig, decodeMimeHeader } from './gmail-reply-detector.js';

async function searchInbox() {
  const config = loadGmailConfig();
  const socket = tls.connect(993, 'imap.gmail.com', { rejectUnauthorized: false });

  let stage = 0;
  let buffer = '';

  socket.on('data', data => {
    buffer += data.toString('utf8');

    if (stage === 0 && buffer.includes('* OK')) {
      stage = 1;
      buffer = '';
      socket.write(`A1 LOGIN "${config.userEmail}" "${config.appPassword}"\r\n`);
    } else if (stage === 1 && buffer.includes('A1 OK')) {
      stage = 2;
      buffer = '';
      socket.write('A2 SELECT INBOX\r\n');
    } else if (stage === 2 && buffer.includes('A2 OK')) {
      stage = 3;
      buffer = '';
      // Search for specific real recruiter inquiries, excluding automated daily digests
      const q = 'subject:("application received" OR "thank you for applying" OR "interview" OR "invitation" OR "assessment" OR "shortlisted" OR "application status" OR "regarding your application" OR "profile shortlisted")';
      socket.write(`A3 SEARCH X-GM-RAW "${q}"\r\n`);
    } else if (stage === 3 && buffer.includes('A3 OK')) {
      const match = buffer.match(/\* SEARCH ([\d ]+)/);
      const ids = match && match[1] ? match[1].trim().split(/\s+/).filter(Boolean) : [];
      console.log('Strict Application/Interview search matched IDs count:', ids.length);
      if (ids.length > 0) {
        const fetchIds = ids.slice(-15);
        stage = 4;
        buffer = '';
        socket.write(`A4 FETCH ${fetchIds.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])\r\n`);
      } else {
        socket.write('A9 LOGOUT\r\n');
        socket.end();
      }
    } else if (stage === 4 && buffer.includes('A4 OK')) {
      console.log('\n=== REAL APPLICATION & INTERVIEW EMAILS IN GMAIL ===');
      const blocks = buffer.split(/\* \d+ FETCH/g).filter(b => b.includes('BODY[HEADER.FIELDS'));
      blocks.forEach((b, idx) => {
        const fromRaw = (b.match(/From:\s*([^\r\n]+)/i) || [])[1] || '';
        const subjRaw = (b.match(/Subject:\s*([^\r\n]+)/i) || [])[1] || '';
        const dateRaw = (b.match(/Date:\s*([^\r\n]+)/i) || [])[1] || '';
        console.log(`${idx + 1}. [${dateRaw.trim()}]`);
        console.log(`   From:    ${decodeMimeHeader(fromRaw).trim()}`);
        console.log(`   Subject: ${decodeMimeHeader(subjRaw).trim()}\n`);
      });
      socket.write('A9 LOGOUT\r\n');
      socket.end();
    }
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });
}

searchInbox().catch(console.error);

