import { HomeDashboard } from '@/types/player';
import { demoConfig } from '@/config/demo';

export const homeDashboardMock: HomeDashboard = {
  player: { id: 'player-ayaan', name: demoConfig.player.name, category: demoConfig.player.category, jerseyNumber: demoConfig.player.jerseyNumber, academy: 'GCC Chalissery' },
  nextTraining: { id: 'training-1', relativeDay: 'Today', date: demoConfig.timeline.currentDateShort, time: demoConfig.timeline.currentSessionTime, venue: demoConfig.academy.primaryTrainingGround, coachName: `Coach ${demoConfig.player.headCoach}`, countdown: demoConfig.timeline.currentSessionCountdown },
  progress: { attendancePercent: demoConfig.player.attendancePercent, coachRating: demoConfig.player.coachRating, monthlyProgressPercent: 6 },
  latestFeedback: { id: 'feedback-jul', coachName: 'Sandeep', coachRole: 'Technical Coach', date: demoConfig.timeline.latestAssessmentDate, text: 'Good improvement in first touch and passing. Continue practising with your weaker foot.', focus: 'Weak-foot passing' },
  continueLearning: { id: 'ball-control-basics', title: 'Ball Control Basics', type: 'Technical', coachName: 'Ramshad', durationMinutes: 8, watchedMinutes: 4 },
  feeReminder: { id: 'fee-july-2026', title: 'July academy payment pending', amount: demoConfig.player.feeAmount, dueDate: demoConfig.player.feeDueDateShort, status: 'pending' },
  latestUpdate: { id: 'weekend-training-time-updated', title: 'Weekend Training Time Updated', summary: 'Saturday’s U13 session starts at 4:30 PM', publishedAt: '2 hours ago' },
};
