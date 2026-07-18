import { AgeCategory } from '@/types/academy';

export type AssessmentMode = 'quick-feedback' | 'full-assessment';
export type AssessmentSkillKey = 'first-touch' | 'passing' | 'dribbling' | 'shooting' | 'fitness' | 'teamwork' | 'discipline';
export type SkillRatingValue = 1 | 2 | 3 | 4 | 5;
export type AssessmentPeriod = 'Today’s Session' | 'Weekly Review' | 'Monthly Review' | 'Training Block';

export interface SkillAssessmentValue { readonly skill: AssessmentSkillKey; readonly rating: SkillRatingValue }
export interface AssessmentDevelopmentGoal { readonly title: string; readonly target?: string; readonly progressValue?: number; readonly dueLabel?: string }
export interface CoachAssessment {
  readonly id: string;
  readonly playerId: string;
  readonly coachId: string;
  readonly squadId: string;
  readonly mode: AssessmentMode;
  readonly periodLabel: AssessmentPeriod;
  readonly createdAt: string;
  readonly skillRatings: readonly SkillAssessmentValue[];
  readonly strength: string;
  readonly improvementArea: string;
  readonly comment: string;
  readonly developmentGoal?: AssessmentDevelopmentGoal;
  readonly recommendedLessonIds: readonly string[];
  readonly sessionId?: string;
  readonly status: 'published';
  readonly source: 'seed' | 'coach-created';
}

export interface AssessmentStoragePayload { readonly records: readonly CoachAssessment[] }
export type FeedbackHistoryFilter = 'all' | AssessmentMode | AgeCategory;

export interface AssessmentDraft {
  readonly playerId: string;
  readonly mode: AssessmentMode;
  readonly periodLabel: AssessmentPeriod;
  readonly skillRatings: Readonly<Partial<Record<AssessmentSkillKey, SkillRatingValue>>>;
  readonly strength: string;
  readonly improvementArea: string;
  readonly customStrength: string;
  readonly customImprovement: string;
  readonly comment: string;
  readonly developmentGoal?: AssessmentDevelopmentGoal;
  readonly recommendedLessonIds: readonly string[];
}
