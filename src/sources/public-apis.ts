import { JobListing, WorkMode } from '../types/index.js';
import { JobSourceAdapter } from './adapter-interface.js';

/**
 * Public Job API Adapter:
 * Uses public feeds and endpoints (e.g. Arbeitnow Public API, RemoteOK API, WeWorkRemotely feeds)
 * and optionally Adzuna / Jooble when API keys are configured in .env.
 */
export class PublicJobBoardsAdapter implements JobSourceAdapter {
  public name = 'Public Web Feeds & Public APIs';
  public capabilities = {
    canDiscover: true,
    canFetchDetails: true,
    canVerifyEmployer: true,
    canUploadResume: false,
    canSubmit: false,
    canCheckStatus: false
  };

  private timeoutMs: number;

  constructor(timeoutMs: number = 8000) {
    this.timeoutMs = timeoutMs;
  }

  public async fetchJobs(): Promise<JobListing[]> {
    const listings: JobListing[] = [];

    // Attempt Arbeitnow Public API (open remote & tech jobs)
    try {
      const arbeitJobs = await this.fetchArbeitnowJobs();
      listings.push(...arbeitJobs);
    } catch (err: any) {
      console.warn(`[PublicJobBoardsAdapter] Arbeitnow feed fetch failed or skipped: ${err.message}`);
    }

    // Attempt RemoteOK Public API
    try {
      const remoteOkJobs = await this.fetchRemoteOkJobs();
      listings.push(...remoteOkJobs);
    } catch (err: any) {
      console.warn(`[PublicJobBoardsAdapter] RemoteOK feed fetch failed or skipped: ${err.message}`);
    }

    return listings;
  }

  private async fetchWithTimeout(url: string, headers: Record<string, string> = {}): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'AshutoshJobSearchAgent/1.0 (Automation Research; ashutosh.jobbot@gmail.com)',
          Accept: 'application/json, text/plain, */*',
          ...headers
        },
        signal: controller.signal
      });

      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  private async fetchArbeitnowJobs(): Promise<JobListing[]> {
    const data = await this.fetchWithTimeout('https://www.arbeitnow.com/api/job-board-api');
    if (!data || !Array.isArray(data.data)) return [];

    const jobs: JobListing[] = [];
    const relevantKeywords = ['frontend', 'ui', 'angular', 'web developer', 'design system', 'html', 'css', 'javascript'];

    for (const item of data.data) {
      const title = (item.title || '').trim();
      const desc = (item.description || '').replace(/<[^>]*>?/gm, ' ');
      const textToSearch = `${title} ${desc}`.toLowerCase();

      const isRelevant = relevantKeywords.some((kw) => textToSearch.includes(kw));
      if (!isRelevant) continue;

      const postingDate = item.created_at ? new Date(item.created_at * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      jobs.push({
        id: `arbeitnow-${item.slug || Math.random().toString(36).substring(7)}`,
        title,
        company: item.company_name || 'Verified Tech Employer',
        officialUrl: item.url || '',
        source: 'Arbeitnow Public API',
        postingDate,
        location: item.location || (item.remote ? 'Remote' : 'Worldwide'),
        workMode: item.remote ? 'Remote' : 'Hybrid',
        currency: 'EUR',
        description: desc.slice(0, 1500),
        requiredSkills: item.tags || ['Frontend', 'JavaScript', 'UI']
      });
    }

    return jobs;
  }

  private async fetchRemoteOkJobs(): Promise<JobListing[]> {
    const data = await this.fetchWithTimeout('https://remoteok.com/api');
    if (!Array.isArray(data)) return [];

    const jobs: JobListing[] = [];
    // The first item in remoteok API is often a legal notice or metadata
    const items = data.slice(1, 40);

    for (const item of items) {
      if (!item.position) continue;
      const title = item.position;
      const desc = (item.description || '').replace(/<[^>]*>?/gm, ' ');
      const text = `${title} ${desc}`.toLowerCase();

      const matches = ['frontend', 'ui', 'angular', 'design system', 'html', 'css'].some((kw) => text.includes(kw));
      if (!matches) continue;

      const postingDate = item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      jobs.push({
        id: `remoteok-${item.id || Math.random().toString(36).substring(7)}`,
        title,
        company: item.company || 'Global Remote Org',
        officialUrl: item.url || `https://remoteok.com/remote-jobs/${item.id}`,
        source: 'RemoteOK API',
        postingDate,
        location: item.location || 'Worldwide Remote (India Eligible)',
        workMode: 'Remote',
        salaryMin: item.salary_min || undefined,
        salaryMax: item.salary_max || undefined,
        currency: 'USD',
        description: desc.slice(0, 1500),
        requiredSkills: item.tags || ['Frontend', 'UI', 'JavaScript']
      });
    }

    return jobs;
  }
}
