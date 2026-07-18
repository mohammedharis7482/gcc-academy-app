export interface Player {
  id: string;
  name: string;
  category: string;
  jerseyNumber: number;
  academy: string;
}

export interface TrainingSession {
  id: string;
  relativeDay: string;
  date: string;
  time: string;
  venue: string;
  coachName: string;
  category?: string;
  countdown: string;
  focus?: string;
  status?: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
}

export interface ProgressSummary {
  attendancePercent: number;
  coachRating: number;
  monthlyProgressPercent: number;
}

export interface CoachFeedback {
  id: string;
  coachName: string;
  coachRole: string;
  date: string;
  text: string;
  focus: string;
}

export interface LearningVideo {
  id: string;
  title: string;
  type: string;
  coachName: string;
  durationMinutes: number;
  watchedMinutes: number;
}

export interface FeeReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
}

export interface AcademyUpdate {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface HomeDashboard {
  player: Player;
  nextTraining: TrainingSession | null;
  progress: ProgressSummary;
  latestFeedback: CoachFeedback | null;
  continueLearning: LearningVideo | null;
  feeReminder: FeeReminder | null;
  latestUpdate: AcademyUpdate | null;
}
