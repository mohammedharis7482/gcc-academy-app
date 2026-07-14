import { AttendanceRecord, FeedbackDetail, PlayerAssessment } from '@/types/progress';
import { demoConfig } from '@/config/demo';

export const latestAssessmentId = 'assessment-july-2026';

const currentSkillScores: PlayerAssessment['skillScores'] = [
  { key: 'firstTouch', label: 'First touch', rating: 4.4, change: 0.3 },
  { key: 'passing', label: 'Passing', rating: 4.2, change: 0.2 },
  { key: 'dribbling', label: 'Dribbling', rating: 3.9, change: 0.1 },
  { key: 'pace', label: 'Pace', rating: 4.1, change: 0.2 },
  { key: 'gameAwareness', label: 'Game awareness', rating: 3.8, change: 0.3 },
];

export const playerAssessments: readonly PlayerAssessment[] = [
  {
    id: latestAssessmentId,
    period: 'July 2026',
    coachName: demoConfig.player.headCoach,
    coachRole: 'Technical Coach',
    overallRating: demoConfig.player.coachRating,
    skillScores: currentSkillScores,
    strengths: ['First touch while moving', 'Passing composure', 'Positive training attitude'],
    improvementAreas: ['Weak-foot passing', 'Scanning before receiving'],
    currentGoal: demoConfig.player.currentGoal,
    comment: 'Good improvement in first touch and passing. Continue practising with your weaker foot.',
    recommendedLessonId: 'weak-foot-passing-drill',
  },
  {
    id: 'assessment-june-2026',
    period: 'June 2026',
    coachName: 'Sandeep',
    coachRole: 'Technical Coach',
    overallRating: 4.1,
    skillScores: currentSkillScores.map((skill) => ({ ...skill, rating: Math.max(1, Number((skill.rating - skill.change).toFixed(1))), change: 0 })),
    strengths: ['Close control', 'Energy in transition'],
    improvementAreas: ['Game awareness', 'Weak-foot passing'],
    currentGoal: demoConfig.player.currentGoal,
    comment: 'Ayaan is building confidence on the ball. The next step is scanning earlier and using both feet consistently.',
    recommendedLessonId: 'weak-foot-passing-drill',
  },
];

export const progressFeedbackDetails: readonly FeedbackDetail[] = [
  { id: 'feedback-jul', date: '8 July 2026', coachName: 'Sandeep', coachRole: 'Technical Coach', message: 'Good improvement in first touch and passing. Continue practising with your weaker foot.', focus: 'Weak-foot passing', assessmentId: latestAssessmentId, recommendedLessonId: 'weak-foot-passing-drill' },
  { id: 'feedback-jun', date: '24 June 2026', coachName: 'Ramshad', coachRole: 'Technical Coach', message: 'Good energy in transition. Keep scanning before the ball arrives.', focus: 'Awareness before receiving', assessmentId: 'assessment-june-2026', recommendedLessonId: 'passing-under-pressure' },
  { id: 'feedback-jun-2', date: '10 June 2026', coachName: 'Sandeep', coachRole: 'Technical Coach', message: 'Strong improvement in close control during small-sided games.', focus: 'Protecting the ball', assessmentId: 'assessment-june-2026', recommendedLessonId: 'ball-control-basics' },
];

export const julyAttendance: AttendanceRecord = {
  month: 'July 2026', percentage: demoConfig.player.attendancePercent, presentCount: 15, absentCount: 1, lateCount: 1,
  sessions: [
    { id: 'attendance-08-jul', date: '8 July 2026', time: '5:00 PM–6:30 PM', coachName: 'Sandeep', status: 'present' },
    { id: 'attendance-05-jul', date: '5 July 2026', time: '4:30 PM–6:00 PM', coachName: 'Sandeep', status: 'late', note: 'Arrived 8 minutes late.' },
    { id: 'attendance-03-jul', date: '3 July 2026', time: '5:00 PM–6:30 PM', coachName: 'Sandeep', status: 'present' },
    { id: 'attendance-01-jul', date: '1 July 2026', time: '5:00 PM–6:30 PM', coachName: 'Ramshad', status: 'present' },
    { id: 'attendance-28-jun', date: '28 June 2026', time: '4:30 PM–6:00 PM', coachName: 'Sandeep', status: 'absent', note: 'Guardian informed the academy.' },
  ],
};

export function getAssessmentById(id: string): PlayerAssessment | undefined { return playerAssessments.find((item) => item.id === id); }
export function getFeedbackById(id: string): FeedbackDetail | undefined { return progressFeedbackDetails.find((item) => item.id === id); }
