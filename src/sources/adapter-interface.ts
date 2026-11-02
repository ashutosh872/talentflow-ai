import { AdapterCapabilities, JobListing } from '../types/index.js';

export interface JobSourceAdapter {
  name: string;
  capabilities: AdapterCapabilities;
  fetchJobs(): Promise<JobListing[]>;
}
