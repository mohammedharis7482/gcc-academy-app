import { CoachTrainingPlan } from '@/types/training';
import { demoConfig } from '@/config/demo';

export const trainingFocusAreas = [
  { id: 'passing', label: 'Passing' }, { id: 'first-touch', label: 'First touch' }, { id: 'weak-foot', label: 'Weak foot' },
  { id: 'communication', label: 'Communication' }, { id: 'decision-making', label: 'Decision making' }, { id: 'positioning', label: 'Positioning' },
] as const;

export const trainingNoteSuggestions = ['Good energy and focus today.', 'Passing improved during the session.', 'More communication needed next time.'] as const;

const lessonRecommendationsByFocus = {
  passing: ['weak-foot-passing-drill', 'passing-under-pressure', 'ball-control-basics'],
  'first-touch': ['ball-control-basics', 'passing-under-pressure'],
  'weak-foot': ['weak-foot-passing-drill', 'passing-under-pressure'],
  communication: ['discipline-and-teamwork', 'passing-under-pressure'],
  'decision-making': ['passing-under-pressure', 'understanding-player-positioning'],
  positioning: ['understanding-player-positioning', 'passing-under-pressure'],
} as const;

export function getTrainingLessonChoices(focusAreaIds: readonly string[]): readonly string[] {
  return [...new Set(focusAreaIds.flatMap((id) => lessonRecommendationsByFocus[id as keyof typeof lessonRecommendationsByFocus] ?? []))].slice(0, 3);
}

export const seedTrainingPlan: CoachTrainingPlan = {
  sessionId: 'training-1', squadId: 'u13', squadName: demoConfig.player.category, coachId: 'coach-sandeep', coachName: demoConfig.player.headCoach, date: demoConfig.timeline.currentDateIso, dateLabel: demoConfig.timeline.currentDateLabel, time: demoConfig.timeline.currentSessionTime, ground: demoConfig.academy.primaryTrainingGround, playerCount: 20,
  focusAreaIds: ['passing', 'first-touch', 'weak-foot'],
  drills: [
    { id: 'warm-up', name: 'Warm-up', durationMinutes: 10, description: 'Dynamic mobility and ball activation', completed: false },
    { id: 'first-touch', name: 'First Touch', durationMinutes: 15, description: 'Receiving and controlling under pressure', completed: false },
    { id: 'passing', name: 'Passing', durationMinutes: 20, description: 'Short passing and weak-foot combinations', completed: false },
    { id: 'small-sided-game', name: 'Small-sided Game', durationMinutes: 30, description: 'Decision making and communication', completed: false },
    { id: 'cool-down', name: 'Cool Down', durationMinutes: 10, description: 'Light recovery and stretching', completed: false },
  ],
  objectives: [
    { id: 'passing-accuracy', label: 'Improve passing accuracy', completed: false },
    { id: 'weak-foot', label: 'Improve weak foot', completed: false },
    { id: 'communication', label: 'Improve communication', completed: false },
    { id: 'positioning', label: 'Improve positioning', completed: false },
  ],
  assignedLessonIds: ['weak-foot-passing-drill', 'passing-under-pressure'], notes: '', status: 'upcoming', source: 'seed',
};

export function getTrainingFocusLabel(id: string): string | undefined { return trainingFocusAreas.find((item) => item.id === id)?.label; }
