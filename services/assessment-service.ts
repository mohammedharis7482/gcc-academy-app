import { getPlayerById } from '@/data/academy';
import { assessmentPeriods, assessmentSkills, seedCoachAssessments, validLessonIds } from '@/data/assessments';
import { AssessmentDevelopmentGoal, AssessmentMode, AssessmentPeriod, AssessmentStoragePayload, CoachAssessment, SkillAssessmentValue, SkillRatingValue } from '@/types/assessment';
import { readStoredValueResult, storageKeys, writeStoredValue } from '@/utils/app-storage';

const modes: readonly AssessmentMode[] = ['quick-feedback', 'full-assessment'];
const ratings: readonly SkillRatingValue[] = [1, 2, 3, 4, 5];
function isGoal(value: unknown): value is AssessmentDevelopmentGoal { return typeof value === 'object' && value !== null && 'title' in value && typeof value.title === 'string' && (!('target' in value) || value.target === undefined || typeof value.target === 'string') && (!('progressValue' in value) || value.progressValue === undefined || typeof value.progressValue === 'number') && (!('dueLabel' in value) || value.dueLabel === undefined || typeof value.dueLabel === 'string'); }
function isSkill(value: unknown): value is SkillAssessmentValue { return typeof value === 'object' && value !== null && 'skill' in value && assessmentSkills.some((item) => item.key === value.skill) && 'rating' in value && ratings.includes(value.rating as SkillRatingValue); }
function isRecord(value: unknown): value is CoachAssessment {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Partial<CoachAssessment>;
  const skillsValid = Array.isArray(item.skillRatings) && item.skillRatings.every(isSkill) && new Set(item.skillRatings.map((skill) => skill.skill)).size === item.skillRatings.length && (item.mode === 'full-assessment' ? item.skillRatings.length === assessmentSkills.length : item.skillRatings.length === 0);
  const lessonsValid = Array.isArray(item.recommendedLessonIds) && item.recommendedLessonIds.length <= 2 && item.recommendedLessonIds.every((id) => typeof id === 'string');
  return typeof item.id === 'string' && typeof item.playerId === 'string' && Boolean(getPlayerById(item.playerId)) && typeof item.coachId === 'string' && typeof item.squadId === 'string' && modes.includes(item.mode as AssessmentMode) && assessmentPeriods.includes(item.periodLabel as AssessmentPeriod) && typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt)) && skillsValid && typeof item.strength === 'string' && Boolean(item.strength.trim()) && typeof item.improvementArea === 'string' && Boolean(item.improvementArea.trim()) && typeof item.comment === 'string' && Boolean(item.comment.trim()) && item.comment.length <= 240 && (item.developmentGoal === undefined || isGoal(item.developmentGoal)) && lessonsValid && item.status === 'published' && (item.source === 'seed' || item.source === 'coach-created');
}
function isPayload(value: unknown): value is AssessmentStoragePayload { return typeof value === 'object' && value !== null && 'records' in value && Array.isArray(value.records) && value.records.every(isRecord); }
function mergeWithSeeds(records: readonly CoachAssessment[]): readonly CoachAssessment[] { const storedIds = new Set(records.map((item) => item.id)); return [...records.map((item) => ({ ...item, recommendedLessonIds: validLessonIds(item.recommendedLessonIds) })), ...seedCoachAssessments.filter((item) => !storedIds.has(item.id))].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)); }

export const assessmentService = {
  async load() { const result = await readStoredValueResult(storageKeys.assessmentRecords, isPayload); return { records: mergeWithSeeds(result.value?.records ?? []), failed: result.failed }; },
  async save(records: readonly CoachAssessment[]) { return writeStoredValue(storageKeys.assessmentRecords, { records } satisfies AssessmentStoragePayload); },
};
