export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type ApplicationStatus =
  | 'DISCOVERED'
  | 'MATCHED'
  | 'TAILORED'
  | 'MANUAL_REVIEW_NEEDED'
  | 'READY_TO_SUBMIT'
  | 'SUBMITTED'
  | 'REJECTED_DISQUALIFIED'
  | 'EXPIRED'
  | 'MANUAL_ACTION_REQUIRED';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  officialUrl: string;
  source: string;
  postingDate: string; // ISO 8601 or YYYY-MM-DD
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryRaw?: string;
  currency?: string;
  employmentType?: string;
  description: string;
  requiredSkills: string[];
  requisitionId?: string;
  isExpired?: boolean;
}

export interface ScoreBreakdown {
  technicalSkills: number; // Max 30
  experienceSeniority: number; // Max 20
  uiDesignSystems: number; // Max 15
  locationWorkMode: number; // Max 15
  compensationStability: number; // Max 10
  careerGrowthCredibility: number; // Max 10
}

export interface MatchResult {
  jobId: string;
  score: number; // 0 to 100
  tier: 'Excellent' | 'Strong' | 'Manual Review' | 'Reject';
  breakdown: ScoreBreakdown;
  evidence: string[];
  missingRequirements: string[];
  disqualified: boolean;
  disqualificationReason?: string;
}

export interface ApplicationRecord {
  jobId: string;
  title: string;
  company: string;
  officialUrl: string;
  source: string;
  postingDate: string;
  location: string;
  workMode: WorkMode;
  salary: string;
  requiredSkills: string;
  matchScore: number;
  evidence: string;
  missingRequirements: string;
  applicationStatus: ApplicationStatus;
  nextAction: string;
  appliedDate?: string;
  confirmationId?: string;
  notes?: string;
}

export interface CandidateWorkExperience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface CandidateProfile {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  yearsOfExperience: number;
  skills: {
    frontendCore: string[];
    uiEngineering: string[];
    testingAutomation: string[];
    accessibilityAndSeo: string[];
    performance: string[];
    toolsAndAi: string[];
  };
  workHistory: CandidateWorkExperience[];
  projects: {
    enterprisePlatforms: string[];
    commercialWebsites: string[];
  };
  education: {
    degree: string;
    institution: string;
    years: string;
  }[];
  honors: string[];
  nonSpecializations: string[]; // e.g., 'React' is explicitly non-primary
  compensation?: {
    currentCtc: string;
    currentCtcLpa: number;
    expectedCtcRemoteAndLocal: string;
    expectedCtcRemoteAndLocalLpa: number;
    expectedCtcRelocation: string;
    expectedCtcRelocationLpa: number;
  };
}

export interface AdapterCapabilities {
  canDiscover: boolean;
  canFetchDetails: boolean;
  canVerifyEmployer: boolean;
  canUploadResume: boolean;
  canSubmit: boolean;
  canCheckStatus: boolean;
}

export interface JobSourceAdapter {
  name: string;
  capabilities: AdapterCapabilities;
  fetchJobs(): Promise<JobListing[]>;
}

export interface TailoredDocumentOutput {
  jobId: string;
  company: string;
  title: string;
  resumeMarkdown: string;
  coverLetterMarkdown: string;
  resumePath?: string;
  coverLetterPath?: string;
  resumePdfPath?: string;
  coverLetterPdfPath?: string;
  interviewPrepNotes: string[];
}
