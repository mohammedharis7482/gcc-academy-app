import { HomeDashboard } from '@/types/player';
import { demoConfig } from '@/config/demo';

export const homeDashboardMock: HomeDashboard = {
  player: { id: 'player-ayaan', name: demoConfig.player.name, category: demoConfig.player.category, jerseyNumber: demoConfig.player.jerseyNumber, academy: 'GCC Chalissery' },
  nextTraining: { id: 'training-1', relativeDay: 'Today', date: 'Friday, 11 July', time: '5:00 PM–6:30 PM', venue: 'GCC Ground', coachName: `Coach ${demoConfig.player.headCoach}`, countdown: 'Starts in 3 hours' },
  progress: { attendancePercent: demoConfig.player.attendancePercent, coachRating: demoConfig.player.coachRating, monthlyProgressPercent: 6 },
  latestFeedback: { id: 'feedback-jul', coachName: 'Sandeep', coachRole: 'Technical Coach', date: '8 July 2026', text: 'Good improvement in first touch and passing. Continue practising with your weaker foot.', focus: 'Weak-foot passing' },
  continueLearning: { id: 'ball-control-basics', title: 'Ball Control Basics', type: 'Technical', coachName: 'Ramshad', durationMinutes: 8, watchedMinutes: 4 },
  feeReminder: { id: 'fee-july', title: 'July academy fee pending', amount: demoConfig.player.feeAmount, dueDate: demoConfig.player.feeDueDateShort, status: 'pending' },
  latestUpdate: { id: 'weekend-training-time-updated', title: 'Weekend Training Time Updated', summary: 'Saturday’s U13 session starts at 4:30 PM', publishedAt: '2 hours ago' },
};
