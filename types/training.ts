export type TrainingSessionStatus = 'upcoming' | 'time changed' | 'ground changed';

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
