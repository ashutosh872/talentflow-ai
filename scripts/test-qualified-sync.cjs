const fs = require('fs');
const path = require('path');

function parseCsvLine(text) {
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

const csvPath = path.resolve('data/applications.csv');
const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
console.log('Total lines in applications.csv:', lines.length);

const qualifiedJobs = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  const cells = parseCsvLine(line);
  const status = cells[13] || '';
  if (status === 'REJECTED_DISQUALIFIED') continue;

  const jobId = cells[0];
  const title = cells[1];
  const company = cells[2];
  const url = cells[3];
  const source = cells[4];
  const location = cells[6];
  const workMode = cells[7] || (location.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid');
  const salary = cells[8] || 'Best in Industry';
  const skillsStr = cells[9] || '';
  const score = parseInt(cells[10] || '75', 10);
  const evidenceStr = cells[11] || '';
  const appliedDate = cells[15] || '';
  const confirmationId = cells[16] || '';
  const notes = cells[17] || '';

  qualifiedJobs.push({
    id: jobId,
    title,
    company,
    url,
    source,
    location,
    workMode,
    salary,
    score,
    status,
    appliedDate,
    confirmationId,
    skills: skillsStr ? skillsStr.split(',').map(s => s.trim()) : ['HTML5', 'SCSS', 'Angular', 'JavaScript']
  });
}

console.log(`Successfully parsed ${qualifiedJobs.length} qualified opportunities from CSV across all linked portals!`);
qualifiedJobs.forEach((j, i) => console.log(`${i+1}. [${j.score}] ${j.company} - ${j.title} (${j.source}) | ${j.status}`));

