const fs = require('fs');

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

const content = fs.readFileSync('data/applications.csv', 'utf8');
const lines = content.split('\n');
const qualified = [];

for (let i = 1; i < lines.length; i++) {
  const l = lines[i];
  if (!l.trim()) continue;
  const cells = parseCsvLine(l);
  const status = cells[13] || '';
  const score = parseInt(cells[10] || '0', 10);

  if (status !== 'REJECTED_DISQUALIFIED') {
    qualified.push({
      id: cells[0],
      title: cells[1],
      company: cells[2],
      url: cells[3],
      source: cells[4],
      location: cells[6],
      salary: cells[8],
      score: score,
      status: status
    });
  }
}

console.log('Total non-disqualified in CSV:', qualified.length);
qualified.sort((a, b) => b.score - a.score);
qualified.forEach((q, idx) => {
  console.log(`${idx + 1}. [${q.score}/100] ${q.company} - ${q.title} (${q.source}) | Status: ${q.status}`);
});

