import { demoConfig } from '@/config/demo';
import { AcademyOperationsPayload } from '@/types/operations';

export const seedAcademyOperations: AcademyOperationsPayload = {
  schedules: [
    {
      id: 'training-1', categoryId: 'u13', categoryName: demoConfig.player.category,
      date: demoConfig.timeline.currentDateIso, dateLabel: demoConfig.timeline.currentDateLabel,
      time: demoConfig.timeline.currentSessionTime, pitch: demoConfig.academy.primaryTrainingGround,
      coachId: 'coach-sandeep', coachName: demoConfig.player.headCoach, playerCount: 20,
      note: 'First touch and passing focus.', status: 'upcoming', publishedAt: '10 July 2026, 6:00 PM', source: 'seed',
    },
    {
      id: 'schedule-u13-07-jul', categoryId: 'u13', categoryName: demoConfig.player.category,
      date: '2026-07-07', dateLabel: 'Tuesday, 7 July 2026', time: '5:00 PM–6:30 PM',
      pitch: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', coachName: demoConfig.player.headCoach,
      playerCount: 20, note: 'Receiving under pressure.', status: 'completed', publishedAt: '6 July 2026, 6:00 PM', source: 'seed',
    },
  ],
  announcements: [],
  assignments: [
    {
      id: 'assignment-ayaan-ball-control', sessionId: 'ball-control-basics', targetType: 'player', targetIds: ['player-ayaan'],
      assignedById: 'coach-ramshad', assignedByName: 'Ramshad', assignedAt: '2026-07-07T12:00:00.000Z',
      message: 'Review close control before the next technical session.', source: 'seed',
    },
    {
      id: 'assignment-u13-weak-foot', sessionId: 'weak-foot-passing-drill', targetType: 'category', targetIds: ['u13'],
      assignedById: 'coach-sandeep', assignedByName: 'Sandeep', assignedAt: '2026-07-10T12:00:00.000Z',
      message: 'Complete this Academy Session before the next technical review.', dueDate: '18 July 2026', source: 'seed',
    },
  ],
};

