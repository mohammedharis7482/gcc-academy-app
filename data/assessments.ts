import { getPlayerById, sharedAcademyData } from '@/data/academy';
import { getLessonById } from '@/data/learning';
import { latestAssessmentId } from '@/data/progress-details';
import { AssessmentDevelopmentGoal, AssessmentPeriod, AssessmentSkillKey, CoachAssessment, SkillRatingValue } from '@/types/assessment';
import { FeedbackDetail, PlayerAssessment, SkillRating } from '@/types/progress';

export const assessmentSkills: readonly { readonly key: AssessmentSkillKey; readonly label: string }[] = [
  { key: 'first-touch', label: 'First Touch' }, { key: 'passing', label: 'Passing' }, { key: 'dribbling', label: 'Dribbling' },
  { key: 'shooting', label: 'Shooting' }, { key: 'fitness', label: 'Fitness' }, { key: 'teamwork', label: 'Teamwork' }, { key: 'discipline', label: 'Discipline' },
];
export const coachAssessmentSkills = assessmentSkills.filter((skill) => skill.key !== 'discipline');
export const assessmentPeriods: readonly AssessmentPeriod[] = ['Today’s Session', 'Weekly Review', 'Monthly Review', 'Training Block'];
export const strengthOptions = ['Passing', 'First touch', 'Dribbling', 'Teamwork', 'Fitness', 'Discipline', 'Confidence', 'Decision making', 'Custom'] as const;
export const improvementOptions = ['Weak-foot passing', 'First touch', 'Shooting accuracy', 'Positioning', 'Stamina', 'Communication', 'Ball control', 'Defensive awareness', 'Custom'] as const;
export const commentSuggestions = ['Good improvement this week.', 'Keep practising with your weaker foot.', 'More confidence needed in match situations.', 'Strong teamwork and discipline.', 'Focus on first touch before the next session.'] as const;
export const goalPresets: readonly AssessmentDevelopmentGoal[] = [
  { title: 'Complete 100 weak-foot passes', target: '100 controlled passes', progressValue: 0, dueLabel: 'Before the next monthly review' },
  { title: 'Improve first touch under pressure', target: 'Three controlled sets', progressValue: 0, dueLabel: 'Within four weeks' },
  { title: 'Increase shooting accuracy', target: '7 of 10 shots on target', progressValue: 0, dueLabel: 'Within four weeks' },
  { title: 'Complete three fitness sessions', target: '3 sessions', progressValue: 0, dueLabel: 'This month' },
  { title: 'Improve defensive positioning', target: 'Maintain shape in small-sided games', progressValue: 0, dueLabel: 'Within four weeks' },
  { title: 'Communicate more during matches', target: 'Consistent calls and scanning', progressValue: 0, dueLabel: 'Next match review' },
];

export function getRecommendedGoal(improvementArea: string): AssessmentDevelopmentGoal {
  const normalized = improvementArea.toLowerCase();
  if (normalized.includes('weak-foot') || normalized.includes('passing')) return goalPresets[0];
  if (normalized.includes('first touch') || normalized.includes('ball control') || normalized.includes('dribbl')) return goalPresets[1];
  if (normalized.includes('shoot')) return goalPresets[2];
  if (normalized.includes('fitness') || normalized.includes('stamina')) return goalPresets[3];
  if (normalized.includes('position') || normalized.includes('defensive')) return goalPresets[4];
  return goalPresets[5];
}

export const ratingLabels: Readonly<Record<SkillRatingValue, string>> = { 1: 'Needs support', 2: 'Developing', 3: 'On track', 4: 'Strong', 5: 'Excellent' };

const seedPlayers = {
  ayaan: getPlayerById('player-ayaan'), arjun: getPlayerById('player-u13-06'), joel: getPlayerById('player-u10-09'), farhan: getPlayerById('player-u13-02'), nived: getPlayerById('player-u13-08'),
};
const allRatings = (values: readonly SkillRatingValue[]) => assessmentSkills.map((skill, index) => ({ skill: skill.key, rating: values[index] ?? 3 }));
function seeded(playerId: string | undefined, input: Omit<CoachAssessment, 'playerId' | 'squadId' | 'coachId' | 'status' | 'source'>): CoachAssessment | null {
  const player = playerId ? getPlayerById(playerId) : undefined;
  if (!player) return null;
  return { ...input, playerId: player.id, squadId: player.squadId, coachId: 'coach-sandeep', status: 'published', source: 'seed' };
}

const featuredSeedAssessments: readonly CoachAssessment[] = [
  seeded(seedPlayers.ayaan?.id, { id: latestAssessmentId, mode: 'full-assessment', periodLabel: 'Monthly Review', createdAt: '2026-07-07T12:30:00.000Z', skillRatings: allRatings([4, 4, 4, 4, 4, 5, 5]), strength: 'Passing', improvementArea: 'Weak-foot passing', comment: 'Good improvement in first touch and passing. Continue practising with your weaker foot.', developmentGoal: { title: 'Complete 100 weak-foot passes', target: '100 controlled passes', progressValue: 64, dueLabel: '25 July' }, recommendedLessonIds: ['weak-foot-passing-drill', 'passing-under-pressure'], sessionId: 'training-1' }),
  seeded(seedPlayers.arjun?.id, { id: 'assessment-seed-arjun', mode: 'quick-feedback', periodLabel: 'Weekly Review', createdAt: '2026-07-07T12:00:00.000Z', skillRatings: [], strength: 'Teamwork', improvementArea: 'Positioning', comment: 'Strong support for teammates. Keep checking your position before the ball moves.', recommendedLessonIds: ['understanding-player-positioning'] }),
  seeded(seedPlayers.joel?.id, { id: 'assessment-seed-joel', mode: 'full-assessment', periodLabel: 'Monthly Review', createdAt: '2026-07-06T12:00:00.000Z', skillRatings: allRatings([3, 3, 3, 2, 4, 4, 4]), strength: 'Fitness', improvementArea: 'Shooting accuracy', comment: 'Excellent energy throughout the session. Slow down the final action when shooting.', recommendedLessonIds: ['dynamic-warm-up-routine'] }),
  seeded(seedPlayers.farhan?.id, { id: 'assessment-seed-farhan', mode: 'quick-feedback', periodLabel: 'Today’s Session', createdAt: '2026-07-05T12:00:00.000Z', skillRatings: [], strength: 'First touch', improvementArea: 'Communication', comment: 'First touch was composed today. Call earlier when offering a passing option.', recommendedLessonIds: ['ball-control-basics'] }),
  seeded(seedPlayers.nived?.id, { id: 'assessment-seed-nived', mode: 'quick-feedback', periodLabel: 'Weekly Review', createdAt: '2026-07-04T12:00:00.000Z', skillRatings: [], strength: 'Discipline', improvementArea: 'Dribbling', comment: 'Very focused throughout training. Use more changes of direction when dribbling.', recommendedLessonIds: ['ball-control-basics'] }),
].filter((item): item is CoachAssessment => item !== null);

function genericRatings(playerId: string): readonly { readonly skill: AssessmentSkillKey; readonly rating: SkillRatingValue }[] {
  const player = getPlayerById(playerId); if (!player) return [];
  const valueFor = (label: string) => player.skills.find((skill) => skill.label.toLowerCase().includes(label))?.rating ?? player.latestRating;
  const safe = (value: number): SkillRatingValue => Math.min(5, Math.max(1, Math.round(value))) as SkillRatingValue;
  return [{ skill: 'first-touch', rating: safe(valueFor('first touch')) }, { skill: 'passing', rating: safe(valueFor('passing')) }, { skill: 'dribbling', rating: safe(valueFor('dribbling')) }, { skill: 'shooting', rating: safe(player.latestRating - 0.3) }, { skill: 'fitness', rating: safe(valueFor('pace')) }, { skill: 'teamwork', rating: safe(valueFor('teamwork')) }, { skill: 'discipline', rating: safe(player.latestRating + 0.2) }];
}
const featuredPlayerIds = new Set(featuredSeedAssessments.map((item) => item.playerId));
const genericSeedAssessments: readonly CoachAssessment[] = sharedAcademyData.assessments.filter((item) => !featuredPlayerIds.has(item.playerId)).map((item) => ({ id: item.id, playerId: item.playerId, coachId: item.coachId, squadId: getPlayerById(item.playerId)?.squadId ?? 'u13', mode: 'full-assessment', periodLabel: 'Monthly Review', createdAt: '2026-07-03T12:00:00.000Z', skillRatings: genericRatings(item.playerId), strength: item.strength, improvementArea: item.improvementArea, comment: `Good effort in training. Keep working on ${item.improvementArea.toLowerCase()} with control and confidence.`, developmentGoal: { title: item.focus, progressValue: getPlayerById(item.playerId)?.goalProgress ?? 0, dueLabel: 'Next monthly review' }, recommendedLessonIds: getPlayerById(item.playerId)?.assignedLessonIds ?? [], status: 'published', source: 'seed' }));
export const seedCoachAssessments: readonly CoachAssessment[] = [...featuredSeedAssessments, ...genericSeedAssessments];

export function getRecommendedLessonIds(improvementArea: string): readonly string[] {
  const normalized = improvementArea.toLowerCase();
  if (normalized.includes('weak-foot') || normalized.includes('passing')) return ['weak-foot-passing-drill', 'passing-under-pressure'];
  if (normalized.includes('first touch') || normalized.includes('ball control') || normalized.includes('dribbl')) return ['ball-control-basics', 'passing-under-pressure'];
  if (normalized.includes('fitness') || normalized.includes('stamina')) return ['dynamic-warm-up-routine', 'recovery-after-training'];
  if (normalized.includes('position') || normalized.includes('defensive')) return ['understanding-player-positioning', 'passing-under-pressure'];
  if (normalized.includes('discipline') || normalized.includes('communication')) return ['discipline-and-teamwork', 'understanding-player-positioning'];
  return [];
}

export function assessmentAverage(record: CoachAssessment): number | undefined {
  if (!record.skillRatings.length) return undefined;
  return Number((record.skillRatings.reduce((sum, value) => sum + value.rating, 0) / record.skillRatings.length).toFixed(1));
}

const progressSkillMap: Readonly<Partial<Record<AssessmentSkillKey, SkillRating['key']>>> = { 'first-touch': 'firstTouch', passing: 'passing', dribbling: 'dribbling', fitness: 'pace', teamwork: 'gameAwareness' };
export function toPlayerAssessment(record: CoachAssessment): PlayerAssessment {
  const skills = record.skillRatings.flatMap((value) => {
    const key = progressSkillMap[value.skill]; const label = assessmentSkills.find((item) => item.key === value.skill)?.label;
    return key && label ? [{ key, label, rating: value.rating, change: 0 }] : [];
  });
  return { id: record.id, period: record.periodLabel, coachName: 'Sandeep', coachRole: 'Technical Coach', overallRating: assessmentAverage(record) ?? 0, skillScores: skills, strengths: [record.strength], improvementAreas: [record.improvementArea], currentGoal: record.developmentGoal?.title ?? record.improvementArea, comment: record.comment, recommendedLessonId: record.recommendedLessonIds[0] ?? getRecommendedLessonIds(record.improvementArea)[0] ?? 'ball-control-basics' };
}

export function toFeedbackDetail(record: CoachAssessment): FeedbackDetail {
  const date = new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return { id: record.id, date, coachName: 'Sandeep', coachRole: 'Technical Coach', message: record.comment, focus: record.improvementArea, assessmentId: record.id, recommendedLessonId: record.recommendedLessonIds[0] ?? getRecommendedLessonIds(record.improvementArea)[0] ?? 'ball-control-basics' };
}

export function validLessonIds(ids: readonly string[]): readonly string[] { return ids.filter((id) => Boolean(getLessonById(id))).slice(0, 2); }
