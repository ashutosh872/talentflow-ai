import { JobListing } from '../types/index.js';

export class Deduplicator {
  private seenUrls: Set<string> = new Set();
  private seenSignatures: Set<string> = new Set();

  /**
   * Normalize a URL by stripping tracking parameters, normalizing protocol/slashes.
   */
  public normalizeUrl(url: string): string {
    if (!url) return '';
    try {
      const parsed = new URL(url.trim());
      // Tracking and referral parameters to strip
      const stripParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'ref',
        'source',
        'gh_src',
        'lever-source',
        'trk',
        'refId',
        'trackingId',
        'fbclid',
        'gclid'
      ];

      for (const p of stripParams) {
        parsed.searchParams.delete(p);
      }

      // Standardize scheme to lowercase https and remove trailing slash from pathname
      let pathname = parsed.pathname;
      if (pathname.length > 1 && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }

      const cleanSearch = parsed.searchParams.toString();
      return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${pathname}${cleanSearch ? `?${cleanSearch}` : ''}`;
    } catch {
      // Fallback for relative or malformed URLs
      return url.trim().toLowerCase().replace(/\/+$/, '');
    }
  }

  /**
   * Create a normalized signature for a job using company, title, location and reqId
   */
  public createJobSignature(job: Pick<JobListing, 'company' | 'title' | 'location' | 'requisitionId'>): string {
    const cleanCompany = (job.company || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();

    const cleanTitle = (job.title || '')
      .toLowerCase()
      .replace(/\b(sr|senior|lead|staff)\b/g, 'senior')
      .replace(/[^a-z0-9]/g, '')
      .trim();

    const cleanLocation = (job.location || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();

    const req = job.requisitionId ? job.requisitionId.trim().toLowerCase() : '';

    return req ? `${cleanCompany}:${cleanTitle}:${req}` : `${cleanCompany}:${cleanTitle}:${cleanLocation}`;
  }

  /**
   * Check if a job is a duplicate against already recorded listings.
   */
  public isDuplicate(job: JobListing): { isDup: boolean; reason?: string } {
    const normUrl = this.normalizeUrl(job.officialUrl);
    if (normUrl && this.seenUrls.has(normUrl)) {
      return {
        isDup: true,
        reason: `Duplicate detected: matching normalized URL (${normUrl})`
      };
    }

    const signature = this.createJobSignature(job);
    if (this.seenSignatures.has(signature)) {
      return {
        isDup: true,
        reason: `Duplicate detected: matching company/role/location signature (${signature})`
      };
    }

    return { isDup: false };
  }

  /**
   * Register a job as seen.
   */
  public register(job: JobListing): void {
    const normUrl = this.normalizeUrl(job.officialUrl);
    if (normUrl) {
      this.seenUrls.add(normUrl);
    }
    const signature = this.createJobSignature(job);
    this.seenSignatures.add(signature);
  }

  /**
   * Bulk register existing records (e.g., from CSV tracker).
   */
  public registerExisting(records: Array<{ officialUrl: string; company: string; title: string; location: string }>): void {
    for (const rec of records) {
      if (rec.officialUrl) {
        this.seenUrls.add(this.normalizeUrl(rec.officialUrl));
      }
      this.seenSignatures.add(this.createJobSignature(rec));
    }
  }

  public clear(): void {
    this.seenUrls.clear();
    this.seenSignatures.clear();
  }
}
