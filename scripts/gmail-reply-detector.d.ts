export interface GmailConfig {
  userEmail: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  redirectUri: string;
  pollingIntervalMinutes: number;
  lastSyncTimestamp: string | null;
  connected: boolean;
  mode: string;
}

export interface InboundReply {
  messageId: string;
  from: string;
  recruiterName: string;
  company: string;
  role: string;
  jobId: string;
  confirmationId: string;
  subject: string;
  receivedDate: string;
  bodyText: string;
  intent: string;
  intentTitle: string;
  suggestedStage: string;
  badgeClass: string;
  requiresAction: boolean;
  actionText: string;
  correlationType: string;
  sourceMode: string;
  replyDraft?: {
    subject: string;
    body: string;
  } | null;
}

export function loadGmailConfig(): GmailConfig;
export function saveGmailConfig(updates: Partial<GmailConfig>): GmailConfig;
export function getGoogleOAuthUrl(clientId?: string, redirectUri?: string): string;
export function exchangeOAuthCode(code: string, clientId: string, clientSecret: string, redirectUri: string): Promise<any>;
export function refreshGoogleAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string>;
export function parseCsvLine(text: string): string[];
export function escapeCsvCell(cell: any): string;
export function getTrackedApplications(): any[];
export function advanceJobStageInCsv(jobId: string, newStage: string, note?: string): boolean;
export function correlateMessageWithJob(from: string, subject: string, body: string, trackedJobs: any[]): { job: any; matchType: string; confidence: number } | null;
export function classifyRecruiterIntent(subject: string, body: string): {
  intent: string;
  suggestedStage: string;
  badgeClass: string;
  title: string;
  requiresAction: boolean;
  actionText: string;
};
export function generateCandidateReplyDraft(reply: any): { subject: string; body: string };
export function recordInboundReply(replyData: InboundReply): InboundReply;
export function getAllInboundReplies(): InboundReply[];
export function ingestScenarioReply(scenarioKey?: string): InboundReply;
export function syncGmailInbox(options?: any): Promise<any>;
export const VERIFIED_RECRUITER_SCENARIOS: Record<string, any>;
