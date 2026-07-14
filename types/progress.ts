export type SkillKey = 'firstTouch' | 'passing' | 'dribbling' | 'pace' | 'gameAwareness';

export interface DevelopmentScore {
  score: number;
  changePercent: number;
  label: string;
  summary: string;
}

export interface AttendanceDetail {
  percentage: number;
  attendedSessions: number;
  totalSessions: number;
  currentStreak: number;
}

export interface SkillRating {
  key: SkillKey;
  label: string;
  rating: number;
  change: number;
}

export interface MonthlyDevelopmentPoint {
  month: string;
  score: number;
}

export interface ProgressFeedback {
  id: string;
  date: string;
  coachName: string;
  message: string;
  focus: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: 'shield-star' | 'calendar-check' | 'foot-print';
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  dueDate: string;
}

export interface RecommendedLesson {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  reason: string;
}

export interface ProgressDashboard {
  playerName: string;
  updatedAt: string;
  overall: DevelopmentScore;
  attendance: AttendanceDetail;
  skillRatings: SkillRating[];
  monthlyDevelopment: MonthlyDevelopmentPoint[];
  feedback: ProgressFeedback[];
  achievements: Achievement[];
  currentGoal: DevelopmentGoal;
  recommendedLesson: RecommendedLesson;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceSession {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly coachName: string;
  readonly status: AttendanceStatus;
  readonly note?: string;
}

export interface AttendanceRecord {
  readonly month: string;
  readonly percentage: number;
  readonly presentCount: number;
  readonly absentCount: number;
  readonly lateCount: number;
  readonly sessions: readonly AttendanceSession[];
}

export interface PlayerAssessment {
  readonly id: string;
  readonly period: string;
  readonly coachName: string;
  readonly coachRole: string;
  readonly overallRating: number;
  readonly skillScores: readonly SkillRating[];
  readonly strengths: readonly string[];
  readonly improvementAreas: readonly string[];
  readonly currentGoal: string;
  readonly comment: string;
  readonly recommendedLessonId: string;
}

export interface FeedbackDetail extends ProgressFeedback {
  readonly coachRole: string;
  readonly assessmentId: string;
  readonly recommendedLessonId: string;
}
