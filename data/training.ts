import { PlayerTrainingSchedule } from '@/types/training';
import { demoConfig } from '@/config/demo';

export const playerTrainingSchedule: PlayerTrainingSchedule = {
  category: demoConfig.player.category,
  weeklySchedule: [
    { id: 'tuesday', day: 'Tuesday', time: '5:00 PM–6:30 PM', ground: demoConfig.academy.primaryTrainingGround },
    { id: 'thursday', day: 'Thursday', time: '5:00 PM–6:30 PM', ground: demoConfig.academy.primaryTrainingGround },
    { id: 'saturday', day: 'Saturday', time: '4:30 PM–6:00 PM', ground: demoConfig.academy.primaryTrainingGround },
  ],
  upcomingSessions: [
    { id: 'special-11-jul', date: demoConfig.timeline.currentDateShort, time: demoConfig.timeline.currentSessionTime, ground: demoConfig.academy.primaryTrainingGround, coachName: demoConfig.player.headCoach, status: 'time changed', focus: 'First touch and weak-foot passing' },
    { id: 'session-14-jul', date: 'Tuesday, 14 July', time: '5:00 PM–6:30 PM', ground: 'Chalissery School Ground', coachName: demoConfig.player.headCoach, status: 'ground changed', focus: 'Passing under pressure' },
    { id: 'session-16-jul', date: 'Thursday, 16 July', time: '5:00 PM–6:30 PM', ground: demoConfig.academy.primaryTrainingGround, coachName: demoConfig.player.headCoach, status: 'upcoming', focus: 'Positioning and support angles' },
  ],
};
