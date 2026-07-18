export type ScheduleStatus = 'upcoming' | 'completed' | 'cancelled';
export type AnnouncementType = 'Match' | 'Camp' | 'Holiday' | 'Schedule Change' | 'Academy Event' | 'General Notice';
export type AnnouncementAudience = 'my-category' | 'selected-categories' | 'all-players';
export type SessionAssignmentTarget = 'player' | 'players' | 'category';

export interface AcademySchedule {
  readonly id: string;
  readonly categoryId: string;
  readonly categoryName: string;
  readonly date: string;
  readonly dateLabel: string;
  readonly time: string;
  readonly pitch: string;
  readonly coachId: string;
  readonly coachName: string;
  readonly playerCount: number;
  readonly note?: string;
  readonly status: ScheduleStatus;
  readonly publishedAt: string;
  readonly notifiedAt?: string;
  readonly source: 'seed' | 'coach-created';
}

export interface CoachAnnouncement {
  readonly id: string;
  readonly type: AnnouncementType;
  readonly audience: AnnouncementAudience;
  readonly categoryIds: readonly string[];
  readonly title: string;
  readonly message: string;
  readonly creatorId: string;
  readonly creatorName: string;
  readonly priority: 'normal' | 'important';
  readonly publishedAt: string;
  readonly source: 'coach-created';
}

export interface AcademySessionAssignment {
  readonly id: string;
  readonly sessionId: string;
  readonly targetType: SessionAssignmentTarget;
  readonly targetIds: readonly string[];
  readonly assignedById: string;
  readonly assignedByName: string;
  readonly assignedAt: string;
  readonly message?: string;
  readonly dueDate?: string;
  readonly source: 'seed' | 'coach-created';
}

export interface AcademyOperationsPayload {
  readonly schedules: readonly AcademySchedule[];
  readonly announcements: readonly CoachAnnouncement[];
  readonly assignments: readonly AcademySessionAssignment[];
}

