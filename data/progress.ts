import { ProgressDashboard } from '@/types/progress';
import { demoConfig } from '@/config/demo';

export const progressDashboardMock: ProgressDashboard = {
  playerName: demoConfig.player.name,
  updatedAt: `Updated ${demoConfig.timeline.latestAssessmentDate}`,
  overall: {
    score: 78,
    changePercent: 6,
    label: 'Developing well',
    summary: 'Your technical confidence and decision-making have improved this month.',
  },
  attendance: { percentage: demoConfig.player.attendancePercent, attendedSessions: 16, totalSessions: 17, currentStreak: 7 },
  skillRatings: [
    { key: 'firstTouch', label: 'First touch', rating: 4.4, change: 0.3 },
    { key: 'passing', label: 'Passing', rating: 4.2, change: 0.2 },
    { key: 'dribbling', label: 'Dribbling', rating: 3.9, change: 0.1 },
    { key: 'pace', label: 'Pace', rating: 4.1, change: 0.2 },
    { key: 'gameAwareness', label: 'Game awareness', rating: 3.8, change: 0.3 },
  ],
  monthlyDevelopment: [
    { month: 'Jan', score: 58 }, { month: 'Feb', score: 62 }, { month: 'Mar', score: 64 },
    { month: 'Apr', score: 69 }, { month: 'May', score: 71 }, { month: 'Jun', score: 74 }, { month: 'Jul', score: 78 },
  ],
  feedback: [
    { id: 'feedback-jul', date: '7 July', coachName: 'Sandeep', message: 'Much calmer receiving under pressure. Your first touch is helping you find the next pass earlier.', focus: 'Weak-foot passing' },
    { id: 'feedback-jun', date: '24 June', coachName: 'Ramshad', message: 'Good energy in transition. Keep scanning before the ball arrives.', focus: 'Awareness before receiving' },
    { id: 'feedback-jun-2', date: '10 June', coachName: 'Sandeep', message: 'Strong improvement in close control during small-sided games.', focus: 'Protecting the ball' },
  ],
  achievements: [
    { id: 'consistent-month', title: 'Consistent Month', description: 'Attended every June session', earnedDate: '30 June', icon: 'calendar-check' },
    { id: 'touch-builder', title: 'Touch Builder', description: 'First-touch rating reached 4+', earnedDate: '7 July', icon: 'foot-print' },
    { id: 'coach-choice', title: 'Coach’s Choice', description: 'Excellent training attitude', earnedDate: '21 June', icon: 'shield-star' },
  ],
  currentGoal: { id: 'weak-foot-100', title: '100 weak-foot passes', description: 'Complete controlled wall passes before the next technical review.', current: 64, target: 100, dueDate: '25 July' },
  recommendedLesson: { id: 'weak-foot-passing-drill', title: 'Weak-foot Passing Drill', category: 'Technical', durationMinutes: 6, reason: 'Recommended from your latest coach review' },
};
