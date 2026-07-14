import { PlayerTrainingSchedule } from '@/types/training';
import { demoConfig } from '@/config/demo';

export const playerTrainingSchedule: PlayerTrainingSchedule = {
  category: demoConfig.player.category,
  weeklySchedule: [
    { id: 'tuesday', day: 'Tuesday', time: '5:00 PM–6:30 PM', ground: 'GCC Football Ground' },
    { id: 'thursday', day: 'Thursday', time: '5:00 PM–6:30 PM', ground: 'GCC Football Ground' },
    { id: 'saturday', day: 'Saturday', time: '4:30 PM–6:00 PM', ground: 'GCC Football Ground' },
  ],
  upcomingSessions: [
    { id: 'special-11-jul', date: 'Friday, 11 July', time: '5:00 PM–6:30 PM', ground: 'GCC Ground', coachName: 'Sandeep', status: 'upcoming', focus: 'First touch and weak-foot passing' },
    { id: 'session-12-jul', date: 'Saturday, 12 July', time: '4:30 PM–6:00 PM', ground: 'GCC Ground', coachName: 'Sandeep', status: 'time changed', focus: 'Small-sided games' },
    { id: 'session-15-jul', date: 'Tuesday, 15 July', time: '5:00 PM–6:30 PM', ground: 'Chalissery School Ground', coachName: 'Sandeep', status: 'ground changed', focus: 'Passing under pressure' },
  ],
};
