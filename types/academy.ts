import { ImageSource } from 'expo-image';

export type AgeCategory = 'U10' | 'U13' | 'U15';
export type CoachTaskStatus = 'pending' | 'in-progress' | 'completed';
export type SessionStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
export type AttendanceMark = 'present' | 'absent' | 'late' | 'not-marked';
export type DominantFoot = 'Right' | 'Left' | 'Both';
export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Winger' | 'Forward';
export type PlayerSort = 'name' | 'jersey' | 'attendance' | 'rating';
export type CoachPlayerAction = 'attendance-history' | 'assessment' | 'feedback' | 'feedback-history' | 'progress' | 'assign-lesson';

export interface PlayerAttendanceSummary { readonly percentage: number; readonly present: number; readonly absent: number; readonly late: number; readonly currentStatus: AttendanceMark; readonly lastAttendanceDate: string }
export interface PlayerSkillRating { readonly key: string; readonly label: string; readonly rating: number }

export interface AcademyEntity { readonly id: string; readonly name: string; readonly shortName: string }
export interface AcademyPlayer {
  readonly id: string;
  readonly playerId: string;
  readonly name: string;
  readonly category: AgeCategory;
  readonly squadId: string;
  readonly jerseyNumber: number;
  readonly dateOfBirth: string;
  readonly age: number;
  readonly position: PlayerPosition;
  readonly dominantFoot: DominantFoot;
  readonly joiningDate: string;
  readonly avatar: ImageSource | null;
  readonly attendance: PlayerAttendanceSummary;
  readonly latestRating: number;
  readonly focus: string;
  readonly goalTarget: string;
  readonly goalProgress: number;
  readonly coachNote: string;
  readonly sessionStatus: AttendanceMark;
  readonly latestAssessmentId: string | null;
  readonly latestFeedbackId: string | null;
  readonly assignedLessonIds: readonly string[];
  readonly membershipStatus: 'active' | 'pending-renewal' | 'paused' | 'inactive';
  readonly skills: readonly PlayerSkillRating[];
}
export interface CoachProfile { readonly id: string; readonly name: string; readonly roleTitle: string; readonly academyId: string; readonly assignedSquadIds: readonly string[]; readonly phoneMasked?: string; readonly avatar?: ImageSource }
export interface SquadSummary { readonly id: string; readonly name: string; readonly ageCategory: AgeCategory; readonly playerCount: number; readonly batch: string; readonly trainingDays: readonly string[]; readonly headCoachId: string; readonly assistantCoachIds: readonly string[] }
export interface SharedTrainingSession { readonly id: string; readonly squadId: string; readonly date: string; readonly shortDate: string; readonly time: string; readonly ground: string; readonly coachId: string; readonly focus: string; readonly status: SessionStatus; readonly countdown: string }
export interface SharedAttendanceRecord { readonly playerId: string; readonly sessionId: string; readonly status: AttendanceMark }
export interface SharedSkillAssessment { readonly id: string; readonly playerId: string; readonly coachId: string; readonly rating: number; readonly focus: string; readonly period: string; readonly strength: string; readonly improvementArea: string; readonly updatedAt: string }
export interface SharedCoachFeedback { readonly id: string; readonly playerId: string; readonly playerName: string; readonly coachId: string; readonly focus: string; readonly updatedAt: string; readonly date: string; readonly comment: string }
export interface SharedLessonReference { readonly id: string; readonly title: string; readonly assignedPlayerIds: readonly string[] }
export interface SharedAcademyUpdate { readonly id: string; readonly title: string; readonly summary: string; readonly publishedAt: string }
export interface SharedFeeRecord { readonly id: string; readonly playerId: string; readonly amount: number; readonly status: 'pending' | 'paid' | 'overdue'; readonly dueDate: string }
export interface CoachDashboardTask { readonly id: string; readonly type: 'attendance' | 'assessment' | 'training-plan' | 'announcement'; readonly title: string; readonly supportingText: string; readonly status: CoachTaskStatus; readonly targetTab: 'players' | 'attendance' | 'training' }

export interface SharedAcademyData {
  readonly academy: AcademyEntity;
  readonly coach: CoachProfile;
  readonly squads: readonly SquadSummary[];
  readonly players: readonly AcademyPlayer[];
  readonly todaySession: SharedTrainingSession;
  readonly attendance: readonly SharedAttendanceRecord[];
  readonly assessments: readonly SharedSkillAssessment[];
  readonly recentFeedback: readonly SharedCoachFeedback[];
  readonly assignedLessons: readonly SharedLessonReference[];
  readonly latestUpdate: SharedAcademyUpdate;
  readonly feeRecords: readonly SharedFeeRecord[];
  readonly tasks: readonly CoachDashboardTask[];
}
