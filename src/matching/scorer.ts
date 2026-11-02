import { CandidateProfile, JobListing, MatchResult, ScoreBreakdown } from '../types/index.js';

export class JobScorer {
  private candidate: CandidateProfile;
  private minLpaBaseline: number;
  private maxAgeDays: number;

  constructor(
    candidate: CandidateProfile,
    minLpaBaseline: number = 10.0,
    maxAgeDays: number = 30
  ) {
    this.candidate = candidate;
    this.minLpaBaseline = minLpaBaseline;
    this.maxAgeDays = maxAgeDays;
  }

  public scoreJob(job: JobListing): MatchResult {
    const evidence: string[] = [];
    const missingRequirements: string[] = [];

    // --- Hard Disqualification Checks ---

    // 1. Expiration check
    if (job.isExpired) {
      return this.disqualify(job.id, 'Job posting is expired or marked inactive', ['Marked as expired/closed']);
    }

    const jobAgeDays = this.calculateJobAgeInDays(job.postingDate);
    if (jobAgeDays > this.maxAgeDays) {
      return this.disqualify(
        job.id,
        `Job posting age (${jobAgeDays} days) exceeds maximum threshold of ${this.maxAgeDays} days`,
        [`Posted date: ${job.postingDate} (${jobAgeDays} days ago)`]
      );
    }

    // 2. React-Mandatory Disqualification Check
    const reactHeavy = this.isReactMandatory(job);
    if (reactHeavy.isMandatory) {
      return this.disqualify(
        job.id,
        `React-heavy position where production React is mandatory (${reactHeavy.reason}). Ashutosh specializes in Angular/Vanilla/UI Systems, not React.`,
        [`React mandatory requirement detected: ${reactHeavy.reason}`]
      );
    }

    // 3. Location & Work Mode Disqualification Check
    const locationCheck = this.checkLocationEligibility(job);
    if (!locationCheck.eligible) {
      return this.disqualify(
        job.id,
        `Ineligible location/work mode: ${locationCheck.reason}`,
        [`Location: ${job.location}`, `Work Mode: ${job.workMode}`]
      );
    }

    // 4. Compensation Disqualification Check (If explicitly below baseline)
    const baseline = this.minLpaBaseline === 10.0 ? 10.0 : this.getExpectedBaselineForJob(job);
    if (job.salaryMax !== undefined && job.currency === 'INR') {
      const maxLpa = job.salaryMax / 100000;
      if (maxLpa < baseline) {
        return this.disqualify(
          job.id,
          this.minLpaBaseline === 10.0
            ? `Stated compensation maximum (₹${maxLpa.toFixed(1)} LPA) is strictly below the ₹10 LPA minimum baseline.`
            : `Stated compensation maximum (₹${maxLpa.toFixed(1)} LPA) is strictly below the ₹${baseline} LPA expected baseline (${this.getBaselineExplanation(job)}).`,
          [`Salary: ${job.salaryRaw || `₹${maxLpa} LPA`}`]
        );
      }
    }

    // --- Numerical Scoring (Out of 100) ---

    // 1. Technical Skills (30 points)
    const techScore = this.evaluateTechnicalSkills(job, evidence, missingRequirements);

    // 2. Relevant Experience & Seniority (20 points)
    const expScore = this.evaluateExperienceSeniority(job, evidence, missingRequirements);

    // 3. UI Implementation & Design Systems (15 points)
    const uiDesignScore = this.evaluateUiDesignSystems(job, evidence, missingRequirements);

    // 4. Location & Work Mode (15 points)
    const locScore = this.evaluateLocationWorkMode(job, evidence);

    // 5. Compensation & Stability (10 points)
    const compScore = this.evaluateCompensationStability(job, evidence);

    // 6. Career Growth & Employer Credibility (10 points)
    const credibilityScore = this.evaluateCredibility(job, evidence);

    const breakdown: ScoreBreakdown = {
      technicalSkills: Math.min(30, Math.round(techScore)),
      experienceSeniority: Math.min(20, Math.round(expScore)),
      uiDesignSystems: Math.min(15, Math.round(uiDesignScore)),
      locationWorkMode: Math.min(15, Math.round(locScore)),
      compensationStability: Math.min(10, Math.round(compScore)),
      careerGrowthCredibility: Math.min(10, Math.round(credibilityScore))
    };

    const totalScore =
      breakdown.technicalSkills +
      breakdown.experienceSeniority +
      breakdown.uiDesignSystems +
      breakdown.locationWorkMode +
      breakdown.compensationStability +
      breakdown.careerGrowthCredibility;

    let tier: MatchResult['tier'] = 'Reject';
    if (totalScore >= 85) tier = 'Excellent';
    else if (totalScore >= 75) tier = 'Strong';
    else if (totalScore >= 60) tier = 'Manual Review';

    return {
      jobId: job.id,
      score: totalScore,
      tier,
      breakdown,
      evidence,
      missingRequirements,
      disqualified: false
    };
  }

  private evaluateTechnicalSkills(
    job: JobListing,
    evidence: string[],
    missing: string[]
  ): number {
    let score = 0;
    const text = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();

    // Core Frontend & Languages
    const coreMatches: string[] = [];
    if (/html5?/i.test(text)) { score += 4; coreMatches.push('HTML5'); }
    if (/css3?|scss|sass/i.test(text)) { score += 4; coreMatches.push('CSS3/SCSS'); }
    if (/javascript|es6|ecmascript/i.test(text)) { score += 5; coreMatches.push('JavaScript (ES6)'); }
    if (/responsive|mobile-first|flexbox|css grid/i.test(text)) { score += 4; coreMatches.push('Responsive/Grid/Flexbox'); }
    if (/bootstrap|jquery/i.test(text)) { score += 2; coreMatches.push('Bootstrap/jQuery'); }

    // Angular / UI Framework match
    if (/angular|angular material/i.test(text)) {
      score += 7;
      coreMatches.push('Angular / Angular Material');
    }

    // Testing & Automation match (Playwright)
    if (/playwright|automation|e2e|test/i.test(text)) {
      score += 4;
      coreMatches.push('Playwright / UI Testing');
    }

    if (coreMatches.length > 0) {
      evidence.push(`Technical match: ${coreMatches.join(', ')}`);
    }

    // Check for missing items
    if (/typescript/i.test(text) && !/typescript/i.test(this.candidate.summary)) {
      // Ashutosh has TypeScript exposure via Angular
      score += 2;
    }

    return Math.min(30, score);
  }

  private evaluateExperienceSeniority(
    job: JobListing,
    evidence: string[],
    missing: string[]
  ): number {
    let score = 10; // Baseline for relevant senior profile
    const text = `${job.title} ${job.description}`.toLowerCase();

    // Role seniority alignment
    if (/senior|lead|principal|staff|architect/i.test(job.title)) {
      score += 6;
      evidence.push('Direct match on Senior/Lead seniority level');
    } else if (/ui developer|frontend developer|frontend engineer/i.test(job.title)) {
      score += 4;
      evidence.push('Direct match on Frontend/UI Engineer title');
    }

    // Years of experience alignment (Ashutosh has 8+ years)
    if (/(\b[5-8]\+?\s*(?:to\s*\d+\s*)?years)/i.test(text)) {
      score += 4;
      evidence.push('Experience bracket (5-8+ years) directly matches Ashutosh (8+ years)');
    } else if (/(\b[3-5]\+?\s*years)/i.test(text)) {
      score += 3;
      evidence.push('Experience requirement (3-5 years) comfortably met by 8+ years tenure');
    } else if (/(\b1[2-9]\+?\s*years)/i.test(text)) {
      missing.push('High years-of-experience requirement (12+ years)');
      score -= 3;
    }

    return Math.min(20, Math.max(0, score));
  }

  private evaluateUiDesignSystems(
    job: JobListing,
    evidence: string[],
    missing: string[]
  ): number {
    let score = 0;
    const text = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();

    const matches: string[] = [];
    if (/design systems?|design tokens?|pattern library|component library/i.test(text)) {
      score += 5;
      matches.push('Design Systems / Tokens');
    }
    if (/figma|zeplin|design-to-code|pixel-perfect|psd/i.test(text)) {
      score += 4;
      matches.push('Figma-to-Code / Pixel-Perfect UI');
    }
    if (/wcag|accessibility|a11y|section 508|semantic html/i.test(text)) {
      score += 3;
      matches.push('WCAG / Web Accessibility');
    }
    if (/core web vitals|performance|optimization|cross-browser/i.test(text)) {
      score += 3;
      matches.push('Performance / Cross-Browser Compatibility');
    }

    if (matches.length > 0) {
      evidence.push(`UI/Design System strengths: ${matches.join(', ')}`);
    }

    return Math.min(15, score);
  }

  private evaluateLocationWorkMode(job: JobListing, evidence: string[]): number {
    const locLower = job.location.toLowerCase();

    // Delhi NCR match (Remote, Hybrid or Onsite)
    const isDelhiNcr = /(delhi|noida|gurgaon|gurugram|faridabad|ghaziabad|ncr)/i.test(locLower);
    if (job.workMode === 'Remote') {
      evidence.push(`Location optimal: ${job.workMode} role accessible in India`);
      return 15;
    }

    if (isDelhiNcr) {
      evidence.push(`Location optimal: Delhi NCR locality (${job.location})`);
      return job.workMode === 'Hybrid' ? 14 : 13;
    }

    // International remote explicitly open to India
    if (/india|worldwide|global|anywhere/i.test(locLower)) {
      evidence.push(`Remote opportunity open to India`);
      return 15;
    }

    return 5;
  }

  public getExpectedBaselineForJob(job: JobListing): number {
    if (job.workMode === 'Remote') return Math.max(this.minLpaBaseline, 12.0);
    const loc = (job.location || '').toLowerCase();
    const isDelhiNcr = /delhi|ncr|noida|gurugram|gurgaon|faridabad|ghaziabad/i.test(loc);
    if (isDelhiNcr) return Math.max(this.minLpaBaseline, 12.0);
    return Math.max(this.minLpaBaseline, 15.0); // Out of Delhi, Gurugram, and Noida requires 15+ LPA
  }

  private getBaselineExplanation(job: JobListing): string {
    if (job.workMode === 'Remote') return 'Remote target: ₹12+ LPA';
    const loc = (job.location || '').toLowerCase();
    const isDelhiNcr = /delhi|ncr|noida|gurugram|gurgaon|faridabad|ghaziabad/i.test(loc);
    if (isDelhiNcr) return 'Local Delhi NCR target: ₹12+ LPA';
    return 'Outside Delhi NCR relocation target: ₹15+ LPA';
  }

  private evaluateCompensationStability(job: JobListing, evidence: string[]): number {
    const baseline = this.getExpectedBaselineForJob(job);

    if (job.salaryMin !== undefined || job.salaryMax !== undefined) {
      const maxLpa = job.salaryMax ? job.salaryMax / 100000 : 0;
      const minLpa = job.salaryMin ? job.salaryMin / 100000 : 0;

      if (maxLpa >= 22 || minLpa >= 20) {
        evidence.push(`Top-tier compensation (₹${minLpa}-${maxLpa} LPA, well above ₹${baseline}L baseline)`);
        return 10;
      }
      if (maxLpa >= baseline + 3 || minLpa >= baseline) {
        evidence.push(`Compensation exceeds target baseline (₹${minLpa}-${maxLpa} LPA vs ₹${baseline}L expected)`);
        return 9;
      }
      if (maxLpa >= baseline) {
        evidence.push(`Compensation aligns with target range (₹${minLpa}-${maxLpa} LPA vs ₹${baseline}L expected)`);
        return 8;
      }
    }

    // If USD salary (international remote)
    if (job.currency === 'USD' && job.salaryMin && job.salaryMin >= 40000) {
      evidence.push(`Competitive USD compensation ($${job.salaryMin}+)`);
      return 10;
    }

    // Default market competitive / unstated
    return 7;
  }

  private evaluateCredibility(job: JobListing, evidence: string[]): number {
    const company = job.company.toLowerCase();
    const enterpriseList = ['samsung', 'cisco', 'google', 'microsoft', 'wipro', 'tcs', 'infosys', 'accenture', 'adobe', 'cognizant', 'nagarro', 'hcl'];

    for (const ent of enterpriseList) {
      if (company.includes(ent)) {
        evidence.push(`High credibility tier enterprise employer: ${job.company}`);
        return 10;
      }
    }

    if (job.officialUrl && !job.officialUrl.includes('bit.ly') && !job.officialUrl.includes('t.co')) {
      evidence.push(`Verified official listing URL from ${job.company}`);
      return 8;
    }

    return 6;
  }

  private isReactMandatory(job: JobListing): { isMandatory: boolean; reason?: string } {
    const text = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();

    // Check if title demands React (e.g., "Senior React Developer", "React Architect")
    if (/(senior\s+)?react(?:\.js)?\s+(?:developer|engineer|lead|architect)/i.test(job.title)) {
      return {
        isMandatory: true,
        reason: `Role title explicitly mandates React: "${job.title}"`
      };
    }

    // Check if description has strong React mandate and NO Angular/general UI alternative
    const reactMandatoryPhrases = [
      /must have (?:at least )?\d+\+?\s*years? (?:of )?production react/i,
      /mandatory:?\s*react(?:\.js)?/i,
      /expert in react(?:\.js)? and redux/i,
      /strong hands-on experience in react is required/i,
      /react is non-negotiable/i
    ];

    for (const phrase of reactMandatoryPhrases) {
      if (phrase.test(text)) {
        // If Angular is also accepted as an alternative ("React or Angular"), then NOT strictly disqualified
        if (!/(?:react\s+or\s+angular|angular\s+or\s+react)/i.test(text)) {
          return {
            isMandatory: true,
            reason: 'Mandatory React production experience required without Angular alternative'
          };
        }
      }
    }

    return { isMandatory: false };
  }

  private checkLocationEligibility(job: JobListing): { eligible: boolean; reason?: string } {
    const locLower = job.location.toLowerCase();

    if (job.workMode === 'Remote') {
      // Remote roles: check if US-only or restricted to non-India
      if (/(us only|usa only|must reside in the us|eu only|uk only|canada only|strictly us)/i.test(locLower)) {
        return {
          eligible: false,
          reason: `Remote restriction: role restricted to candidates residing in ${job.location}`
        };
      }
      return { eligible: true };
    }

    // On-site or Hybrid: MUST be in Delhi NCR
    const isDelhiNcr = /(delhi|noida|gurgaon|gurugram|faridabad|ghaziabad|ncr)/i.test(locLower);
    if (isDelhiNcr) {
      return { eligible: true };
    }

    // Check if on-site outside Delhi NCR
    if (job.workMode === 'On-site' || job.workMode === 'Hybrid') {
      return {
        eligible: false,
        reason: `${job.workMode} position located in ${job.location} (outside candidate's base Delhi NCR)`
      };
    }

    return { eligible: true };
  }

  private calculateJobAgeInDays(postingDateStr: string): number {
    try {
      const postDate = new Date(postingDateStr);
      const now = new Date();
      const diffMs = now.getTime() - postDate.getTime();
      return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } catch {
      return 0; // Default if date parsing is ambiguous
    }
  }

  private disqualify(jobId: string, reason: string, evidence: string[]): MatchResult {
    return {
      jobId,
      score: 0,
      tier: 'Reject',
      breakdown: {
        technicalSkills: 0,
        experienceSeniority: 0,
        uiDesignSystems: 0,
        locationWorkMode: 0,
        compensationStability: 0,
        careerGrowthCredibility: 0
      },
      evidence,
      missingRequirements: [reason],
      disqualified: true,
      disqualificationReason: reason
    };
  }
}
