import * as fs from 'fs';

export function createSimplePdf(lines) {
  const contentStream = 'BT\n/F1 10 Tf\n50 780 Td\n14 TL\n' +
    lines.map(line => {
      const sanitized = String(line)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
      return '(' + sanitized + ') Tj\nT*';
    }).join('\n') +
    '\nET';

  const streamLen = Buffer.byteLength(contentStream);
  
  let out = '%PDF-1.4\n';
  const offsets = [];

  offsets.push(out.length);
  out += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  offsets.push(out.length);
  out += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

  offsets.push(out.length);
  out += '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';

  offsets.push(out.length);
  out += '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  offsets.push(out.length);
  out += '5 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + contentStream + '\nendstream\nendobj\n';

  const startxref = out.length;
  out += 'xref\n0 6\n0000000000 65535 f \n';
  for (const off of offsets) {
    out += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  out += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';
  return Buffer.from(out, 'utf-8');
}

const pdf = createSimplePdf(['ASHUTOSH KUMAR', 'Senior Frontend Engineer', 'Phone: +91 9310681373', 'Email: kumar.ashu872@gmail.com']);
fs.writeFileSync('scripts/pure_test.pdf', pdf);
console.log('Pure JS PDF generated successfully. Size:', pdf.length);
