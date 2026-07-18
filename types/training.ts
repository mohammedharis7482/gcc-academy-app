export type TrainingSessionStatus = 'upcoming' | 'in-progress' | 'time changed' | 'ground changed' | 'completed' | 'cancelled';

export type CoachTrainingStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
export interface TrainingDrillBlock { readonly id: string; readonly name: string; readonly durationMinutes: number; readonly description: string; readonly completed: boolean }
export interface TrainingObjective { readonly id: string; readonly label: string; readonly completed: boolean }
export interface CoachTrainingPlan {
  readonly sessionId: string;
  readonly squadId: string;
  readonly squadName: string;
  readonly coachId: string;
  readonly coachName: string;
  readonly date: string;
  readonly dateLabel: string;
  readonly time: string;
  readonly ground: string;
  readonly playerCount: number;
  readonly focusAreaIds: readonly string[];
  readonly drills: readonly TrainingDrillBlock[];
  readonly objectives: readonly TrainingObjective[];
  readonly assignedLessonIds: readonly string[];
  readonly notes: string;
  readonly status: CoachTrainingStatus;
  readonly savedAt?: string;
  readonly completedAt?: string;
  readonly source: 'seed' | 'coach-saved';
}
export interface TrainingPlanStoragePayload { readonly plans: readonly CoachTrainingPlan[] }

export interface WeeklyTrainingSlot {
  readonly id: string;
  readonly day: string;
  readonly time: string;
  readonly ground: string;
}

export interface ScheduledTrainingSession {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly ground: string;
  readonly coachName: string;
  readonly status: TrainingSessionStatus;
  readonly focus?: string;
}

export interface PlayerTrainingSchedule {
  readonly category: string;
  readonly weeklySchedule: readonly WeeklyTrainingSlot[];
  readonly upcomingSessions: readonly ScheduledTrainingSession[];
}
