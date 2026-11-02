import fs from 'fs';
import path from 'path';
import { classifyRecruiterIntent, extractCompanyAndRoleFromEmail, generateCandidateReplyDraft } from './gmail-reply-detector.js';

const repliesPath = path.resolve('data/inbound-replies/replies.json');
const replies = JSON.parse(fs.readFileSync(repliesPath, 'utf8'));

console.log(`Re-classifying ${replies.length} replies...`);

const updated = replies.map(r => {
  const classification = classifyRecruiterIntent(r.subject, `${r.from} ${r.subject}`, r.from);
  const extracted = extractCompanyAndRoleFromEmail(r.from, r.subject);

  const updatedRecord = {
    ...r,
    company: extracted.company || r.company,
    role: extracted.role || r.role,
    intent: classification.intent,
    intentTitle: classification.title,
    suggestedStage: classification.suggestedStage,
    badgeClass: classification.badgeClass,
    requiresAction: classification.requiresAction,
    actionText: classification.actionText,
    isAutomatedAlert: classification.isAutomatedAlert || false,
    category: classification.category || 'DIRECT'
  };

  updatedRecord.replyDraft = generateCandidateReplyDraft(updatedRecord);
  return updatedRecord;
});

fs.writeFileSync(repliesPath, JSON.stringify(updated, null, 2), 'utf8');

console.log('Done! Updated classifications:');
updated.forEach((r, i) => {
  console.log(`${i+1}. [${r.intent}] [${r.category}] ${r.company} | ${r.role} -> ${r.subject}`);
});

