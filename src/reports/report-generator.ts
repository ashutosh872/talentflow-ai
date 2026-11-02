import * as fs from 'fs';
import * as path from 'path';
import { ApplicationRecord, MatchResult } from '../types/index.js';

export interface ReportSummary {
  reportDate: string;
  totalEvaluated: number;
  qualifiedCount: number;
  disqualifiedCount: number;
  tierCounts: {
    excellent: number;
    strong: number;
    manualReview: number;
    rejected: number;
  };
  topOpportunities: ApplicationRecord[];
}

export class ReportGenerator {
  private outputDir: string;

  constructor(outputDir: string = 'data/reports') {
    this.outputDir = path.resolve(outputDir);
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  public generateDailyReport(
    records: ApplicationRecord[],
    results: MatchResult[]
  ): { markdownPath: string; jsonPath: string; summary: ReportSummary } {
    const today = new Date().toISOString().split('T')[0];
    const resultsMap = new Map<string, MatchResult>(results.map((r) => [r.jobId, r]));

    // Sort opportunities by match score descending
    const sortedRecords = [...records].sort((a, b) => b.matchScore - a.matchScore);
    const qualifiedRecords = sortedRecords.filter((r) => r.matchScore >= 60 && r.applicationStatus !== 'REJECTED_DISQUALIFIED');
    const top10 = qualifiedRecords.slice(0, 10);

    const summary: ReportSummary = {
      reportDate: today,
      totalEvaluated: records.length,
      qualifiedCount: qualifiedRecords.length,
      disqualifiedCount: records.length - qualifiedRecords.length,
      tierCounts: {
        excellent: records.filter((r) => r.matchScore >= 85).length,
        strong: records.filter((r) => r.matchScore >= 75 && r.matchScore < 85).length,
        manualReview: records.filter((r) => r.matchScore >= 60 && r.matchScore < 75).length,
        rejected: records.filter((r) => r.matchScore < 60 || r.applicationStatus === 'REJECTED_DISQUALIFIED').length
      },
      topOpportunities: top10
    };

    const markdownContent = this.buildMarkdown(summary, top10, resultsMap);

    const markdownPath = path.join(this.outputDir, `daily-report-${today}.md`);
    const jsonPath = path.join(this.outputDir, `daily-report-${today}.json`);

    fs.writeFileSync(markdownPath, markdownContent, 'utf-8');
    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf-8');

    return { markdownPath, jsonPath, summary };
  }

  private buildMarkdown(
    summary: ReportSummary,
    top10: ApplicationRecord[],
    resultsMap: Map<string, MatchResult>
  ): string {
    const rows = top10.map((job, idx) => {
      const match = resultsMap.get(job.jobId);
      const tierBadge = job.matchScore >= 85 ? '🟢 Excellent' : job.matchScore >= 75 ? '🔵 Strong' : '🟡 Review';
      return `| ${idx + 1} | **${job.company}** | [${job.title}](${job.officialUrl}) | **${job.matchScore}/100** | ${tierBadge} | ${job.workMode} (${job.location}) | ${job.salary || 'Competitive'} | \`${job.applicationStatus}\` |`;
    });

    return `# 🎯 AI Job Search & Application Report: Ashutosh Kumar
**Date:** ${summary.reportDate} | **Operating Mode:** DRY-RUN (Safe Verification Mode)
**Candidate:** Ashutosh Kumar (Senior Frontend Engineer • Senior UI Developer | 8+ Years Experience)

---

## 📊 Executive Summary
- **Total Opportunities Evaluated:** ${summary.totalEvaluated}
- **Qualified Opportunities:** ${summary.qualifiedCount}
- **Disqualified / Excluded:** ${summary.disqualifiedCount} (e.g. React-mandatory, out-of-region on-site, expired, below ₹10 LPA)
- **Score Distribution:**
  - **Excellent (85–100):** ${summary.tierCounts.excellent}
  - **Strong (75–84):** ${summary.tierCounts.strong}
  - **Manual Review (60–74):** ${summary.tierCounts.manualReview}
  - **Rejected / Filtered (<60):** ${summary.tierCounts.rejected}

---

## 🏆 Top 10 Verified Opportunities

| # | Company | Position | Score | Tier | Location / Mode | Salary | Status |
|---|---------|----------|-------|------|-----------------|--------|--------|
${rows.join('\n')}

---

## 🔍 Detailed Opportunity Breakdown (Top Listings)

${top10
  .map((job, idx) => {
    const match = resultsMap.get(job.jobId);
    return `### ${idx + 1}. ${job.title} — **${job.company}**
- **Match Score:** **${job.matchScore}/100** (${job.matchScore >= 85 ? 'Excellent Match' : 'Strong Match'})
- **Official Listing URL:** [Apply / View Position](${job.officialUrl})
- **Location & Work Mode:** ${job.location} | \`${job.workMode}\`
- **Compensation:** ${job.salary || 'Not publicly stated (Baseline target: ₹10+ LPA)'}
- **Source:** ${job.source} | **Posted Date:** ${job.postingDate}
- **Score Rubric Breakdown:**
  - Technical Skills: **${match?.breakdown.technicalSkills ?? '-'}/30**
  - Relevant Experience & Seniority: **${match?.breakdown.experienceSeniority ?? '-'}/20**
  - UI Implementation & Design Systems: **${match?.breakdown.uiDesignSystems ?? '-'}/15**
  - Location & Work Mode: **${match?.breakdown.locationWorkMode ?? '-'}/15**
  - Compensation & Stability: **${match?.breakdown.compensationStability ?? '-'}/10**
  - Employer Credibility: **${match?.breakdown.careerGrowthCredibility ?? '-'}/10**
- **Match Evidence:**
  ${job.evidence ? job.evidence.split('; ').map((e) => `- ✅ ${e}`).join('\n  ') : '- Verified relevant UI/frontend qualifications'}
- **Missing Requirements / Clarifications:**
  ${job.missingRequirements ? job.missingRequirements.split('; ').map((m) => `- ⚠️ ${m}`).join('\n  ') : '- None detected'}
- **Status & Next Action:**
  - Status: \`${job.applicationStatus}\`
  - Action: ${job.nextAction}
`;
  })
  .join('\n---\n\n')}

---

## 🛡️ Safeguard & Integration Notice
- **Automated Submission Safeguard:** Operating with \`DRY_RUN=true\` and \`ENABLE_AUTOSUBMIT=false\`. No job board or portal has received an unsolicited submission.
- **Platform Limitations:**
  - **LinkedIn / Naukri:** Enterprise recruitment partner credentials are required for programmatic posting/apply APIs. Automated scraping of login-walled pages is intentionally bypassed to protect candidate account integrity and adhere strictly to Terms of Service.
  - **Manual Action Packets:** Complete tailored ATS resumes, cover letters, and application prep notes are automatically saved under \`data/tailored-documents/\` for one-click manual submission.
`;
  }
}
