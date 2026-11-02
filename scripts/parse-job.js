import * as fs from 'fs';

const html = fs.readFileSync('scripts/job_raw.html', 'utf8');

// Title
const titleMatch = html.match(/<h2[^>]*class="[^"]*top-card-layout__title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i) ||
                   html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

// Company
const compMatch = html.match(/<a[^>]*class="[^"]*topcard__org-name-link[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
                  html.match(/<span[^>]*class="[^"]*topcard__flavor[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
const company = compMatch ? compMatch[1].replace(/<[^>]+>/g, '').trim() : '';

// Location
const locMatch = html.match(/<span[^>]*class="[^"]*topcard__flavor--bullet[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
const location = locMatch ? locMatch[1].replace(/<[^>]+>/g, '').trim() : '';

// Posted Time
const postedMatch = html.match(/<span[^>]*class="[^"]*posted-time-ago__text[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
const postedTime = postedMatch ? postedMatch[1].replace(/<[^>]+>/g, '').trim() : '';

// Description
const descMatch = html.match(/<div[^>]*class="[^"]*show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
const descriptionHtml = descMatch ? descMatch[1] : '';
const description = descriptionHtml.replace(/<br\s*\/?>/gi, '\n')
                                   .replace(/<\/p>/gi, '\n\n')
                                   .replace(/<li[^>]*>/gi, '• ')
                                   .replace(/<\/li>/gi, '\n')
                                   .replace(/<[^>]+>/g, '')
                                   .replace(/&nbsp;/g, ' ')
                                   .replace(/&amp;/g, '&')
                                   .replace(/\n\s*\n\s*\n/g, '\n\n')
                                   .trim();

// Criteria list (Seniority, Employment type, etc)
const criteriaMatches = [...html.matchAll(/<h3[^>]*class="[^"]*description__job-criteria-subheader[^"]*"[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<span[^>]*class="[^"]*description__job-criteria-text[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)];
const criteria = {};
for (const m of criteriaMatches) {
  const k = m[1].replace(/<[^>]+>/g, '').trim();
  const v = m[2].replace(/<[^>]+>/g, '').trim();
  criteria[k] = v;
}

console.log('=== JOB DETAILS ===');
console.log('Title:', title);
console.log('Company:', company);
console.log('Location:', location);
console.log('Posted Time:', postedTime);
console.log('Criteria:', JSON.stringify(criteria, null, 2));
console.log('\n=== FULL DESCRIPTION ===\n');
console.log(description);

fs.writeFileSync('scripts/job_parsed.json', JSON.stringify({
  jobId: '4478053400',
  title,
  company,
  location,
  postedTime,
  criteria,
  description
}, null, 2), 'utf8');

