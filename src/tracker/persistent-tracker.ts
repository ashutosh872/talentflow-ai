import * as fs from 'fs';
import * as path from 'path';
import { ApplicationRecord, ApplicationStatus } from '../types/index.js';

export class PersistentTracker {
  private filePath: string;
  private records: Map<string, ApplicationRecord> = new Map();

  private readonly headers = [
    'Job ID',
    'Title',
    'Company',
    'Official URL',
    'Source',
    'Posting Date',
    'Location',
    'Work Mode',
    'Salary',
    'Required Skills',
    'Match Score',
    'Evidence',
    'Missing Requirements',
    'Application Status',
    'Next Action',
    'Applied Date',
    'Confirmation ID',
    'Notes'
  ];

  constructor(filePath: string = 'data/applications.csv') {
    this.filePath = path.resolve(filePath);
    this.ensureDirectoryExists();
    this.load();
  }

  private ensureDirectoryExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public load(): void {
    this.records.clear();
    if (!fs.existsSync(this.filePath)) {
      this.save(); // Initialize empty CSV with headers
      return;
    }

    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      const lines = this.parseCsvLines(content);
      if (lines.length <= 1) return; // Only header or empty

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row.length < 5) continue;

        const rec: ApplicationRecord = {
          jobId: row[0] || '',
          title: row[1] || '',
          company: row[2] || '',
          officialUrl: row[3] || '',
          source: row[4] || '',
          postingDate: row[5] || '',
          location: row[6] || '',
          workMode: (row[7] as any) || 'Remote',
          salary: row[8] || '',
          requiredSkills: row[9] || '',
          matchScore: parseInt(row[10], 10) || 0,
          evidence: row[11] || '',
          missingRequirements: row[12] || '',
          applicationStatus: (row[13] as ApplicationStatus) || 'DISCOVERED',
          nextAction: row[14] || '',
          appliedDate: row[15] || undefined,
          confirmationId: row[16] || undefined,
          notes: row[17] || undefined
        };

        if (rec.jobId) {
          this.records.set(rec.jobId, rec);
        }
      }
    } catch (err) {
      console.error(`Warning: Failed to parse tracker file at ${this.filePath}:`, err);
    }
  }

  public save(): void {
    this.ensureDirectoryExists();
    const rows: string[][] = [this.headers];

    for (const rec of this.records.values()) {
      rows.push([
        rec.jobId,
        rec.title,
        rec.company,
        rec.officialUrl,
        rec.source,
        rec.postingDate,
        rec.location,
        rec.workMode,
        rec.salary,
        rec.requiredSkills,
        rec.matchScore.toString(),
        rec.evidence,
        rec.missingRequirements,
        rec.applicationStatus,
        rec.nextAction,
        rec.appliedDate || '',
        rec.confirmationId || '',
        rec.notes || ''
      ]);
    }

    const csvContent = rows.map((r) => r.map(this.escapeCsvCell).join(',')).join('\n');
    fs.writeFileSync(this.filePath, csvContent, 'utf-8');
  }

  public upsert(record: ApplicationRecord): void {
    this.records.set(record.jobId, record);
    this.save();
  }

  public get(jobId: string): ApplicationRecord | undefined {
    return this.records.get(jobId);
  }

  public getAll(): ApplicationRecord[] {
    return Array.from(this.records.values());
  }

  public updateStatus(
    jobId: string,
    status: ApplicationStatus,
    nextAction: string,
    notes?: string,
    confirmationId?: string
  ): boolean {
    const existing = this.records.get(jobId);
    if (!existing) return false;

    existing.applicationStatus = status;
    existing.nextAction = nextAction;
    if (notes) existing.notes = notes;
    if (confirmationId) existing.confirmationId = confirmationId;
    if (status === 'SUBMITTED' && !existing.appliedDate) {
      existing.appliedDate = new Date().toISOString().split('T')[0];
    }

    this.save();
    return true;
  }

  private escapeCsvCell(cell: string): string {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private parseCsvLines(csv: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentCell = '';

    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentCell.trim());
        if (row.some((c) => c.length > 0)) {
          result.push(row);
        }
        row = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || row.length > 0) {
      row.push(currentCell.trim());
      if (row.some((c) => c.length > 0)) {
        result.push(row);
      }
    }

    return result;
  }
}
