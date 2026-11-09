import * as fs from 'fs';
import * as path from 'path';

const SAVED_JOBS_FILE = path.resolve('data/saved-jobs.json');

function loadSavedJobsData() {
  if (!fs.existsSync(SAVED_JOBS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(SAVED_JOBS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function persistSavedJobsData(list) {
  const dir = path.dirname(SAVED_JOBS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SAVED_JOBS_FILE, JSON.stringify(list, null, 2), 'utf8');
}

export function getSavedJobIds() {
  const list = loadSavedJobsData();
  return list.map(item => (typeof item === 'string' ? item : item.id)).filter(Boolean);
}

export function getAllSavedJobs() {
  return loadSavedJobsData();
}

export function isJobSaved(jobId) {
  const ids = getSavedJobIds();
  return ids.includes(jobId);
}

export function toggleSaveJob(jobId, jobMeta = {}) {
  if (!jobId) return { saved: false, savedJobIds: getSavedJobIds() };

  const list = loadSavedJobsData();
  const existingIdx = list.findIndex(item => (typeof item === 'string' ? item === jobId : item.id === jobId));

  let isSaved = false;
  if (existingIdx !== -1) {
    // Remove (unsave)
    list.splice(existingIdx, 1);
    isSaved = false;
    console.log(`[Saved Jobs] Removed job ${jobId} from saved list`);
  } else {
    // Add (save)
    list.unshift({
      id: jobId,
      company: jobMeta.company || 'Enterprise Company',
      title: jobMeta.title || 'Senior Frontend Engineer',
      location: jobMeta.location || 'Remote / Delhi NCR',
      salary: jobMeta.realSalary || '₹18,00,000 - ₹28,00,000 PA',
      savedAt: new Date().toISOString()
    });
    isSaved = true;
    console.log(`[Saved Jobs] Saved job ${jobId} for later review`);
  }

  persistSavedJobsData(list);
  const updatedIds = list.map(item => (typeof item === 'string' ? item : item.id));
  return {
    success: true,
    saved: isSaved,
    jobId,
    savedJobIds: updatedIds,
    count: updatedIds.length
  };
}
