async function fetchLinkedInJob() {
  const jobId = '4478053400';
  const urls = [
    `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`,
    `https://www.linkedin.com/jobs/view/${jobId}/`
  ];

  for (const url of urls) {
    try {
      console.log('Fetching:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Length:', text.length);
      if (res.ok) {
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        console.log('Page Title:', titleMatch ? titleMatch[1].trim() : 'N/A');
        
        // save text to debug
        const fs = await import('fs');
        fs.writeFileSync('scripts/job_raw.html', text, 'utf8');
        console.log('Saved to scripts/job_raw.html');
        return;
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

fetchLinkedInJob();

