import { LearningCategory, LearningLesson, LessonRecommendation } from '@/types/learning';
import { demoConfig } from '@/config/demo';

export const learningCategories: readonly LearningCategory[] = ['All', 'Technical', 'Tactical', 'Fitness', 'Recovery', 'Nutrition', 'Coach Talks'];
export const learningPlayer = { name: demoConfig.player.name, category: 'U13', currentGoal: demoConfig.player.currentGoal } as const;
export const learningRecommendations: readonly LessonRecommendation[] = [
  { lessonId: 'weak-foot-passing-drill', goal: learningPlayer.currentGoal },
  { lessonId: 'passing-under-pressure', goal: learningPlayer.currentGoal },
];

export const learningLessons: readonly LearningLesson[] = [
  { id: 'ball-control-basics', title: 'Ball Control Basics', description: 'Build confident close control and a cleaner first touch while moving.', category: 'Technical', coachName: 'Ramshad', coachRole: 'Technical Coach', durationMinutes: 8, initialWatchedMinutes: 4, thumbnail: 'ball-control', suitableCategories: ['U10', 'U13'], learningObjective: 'Improve close control, balance, and first touch while moving with the ball.', practicePoints: ['Inside-foot touches', 'Outside-foot touches', 'Direction changes', 'Controlled movement'], coachNote: 'Repeat this drill for 10 minutes before your next training session.', isRecommended: false, initialStatus: 'in-progress', publishedDate: '7 July 2026' },
  { id: 'weak-foot-passing-drill', title: 'Weak-foot Passing Drill', description: 'Develop confidence, accuracy, and rhythm with your weaker foot.', category: 'Technical', coachName: 'Sandeep', coachRole: 'Technical Coach', durationMinutes: 6, initialWatchedMinutes: 0, thumbnail: 'passing', suitableCategories: ['U13', 'U15'], learningObjective: 'Improve passing accuracy and confidence with your weaker foot under controlled movement.', practicePoints: ['Open your body', 'Lock the ankle', 'Pass through the centre', 'Follow through to target'], coachNote: 'Complete three sets of 20 passes with your weaker foot before your next training session.', isRecommended: true, initialStatus: 'not-started', publishedDate: '10 July 2026' },
  { id: 'passing-under-pressure', title: 'Passing Under Pressure', description: 'Recognise space and release the ball quickly when an opponent closes in.', category: 'Tactical', coachName: 'Sandeep', coachRole: 'Technical Coach', durationMinutes: 9, initialWatchedMinutes: 0, thumbnail: 'training', suitableCategories: ['U13', 'U15'], learningObjective: 'Make quicker passing decisions while protecting the ball under pressure.', practicePoints: ['Scan before receiving', 'First touch away', 'Use your body', 'Release early'], coachNote: 'Focus on scanning before every first touch in the next rondo.', isRecommended: true, initialStatus: 'not-started', publishedDate: '9 July 2026' },
  { id: 'dynamic-warm-up-routine', title: 'Dynamic Warm-up Routine', description: 'Prepare your body safely for an intense football session.', category: 'Fitness', coachName: 'Niyas', coachRole: 'Fitness Coach', durationMinutes: 7, initialWatchedMinutes: 7, thumbnail: 'training', suitableCategories: ['U10', 'U13', 'U15'], learningObjective: 'Increase mobility, temperature, and readiness before training.', practicePoints: ['Light movement', 'Hip mobility', 'Dynamic stretches', 'Short accelerations'], coachNote: 'Use this routine before every individual practice session.', isRecommended: false, initialStatus: 'completed', publishedDate: '2 July 2026', completedDate: '9 July' },
  { id: 'recovery-after-training', title: 'Recovery After Training', description: 'Use simple recovery habits to arrive fresher for your next session.', category: 'Recovery', coachName: 'Niyas', coachRole: 'Fitness Coach', durationMinutes: 5, initialWatchedMinutes: 0, thumbnail: 'recovery', suitableCategories: ['U13', 'U15'], learningObjective: 'Understand hydration, cool-down, and rest habits after training.', practicePoints: ['Cool down gradually', 'Rehydrate', 'Refuel well', 'Prioritise sleep'], coachNote: 'Pack water and a simple recovery snack before leaving for training.', isRecommended: false, initialStatus: 'not-started', publishedDate: '8 July 2026' },
  { id: 'understanding-player-positioning', title: 'Understanding Player Positioning', description: 'Learn how your position changes as the ball moves around the pitch.', category: 'Tactical', coachName: 'Sandeep', coachRole: 'Technical Coach', durationMinutes: 11, initialWatchedMinutes: 0, thumbnail: 'positioning', suitableCategories: ['U13', 'U15'], learningObjective: 'Recognise useful supporting positions in and out of possession.', practicePoints: ['Create passing angles', 'Check your shoulder', 'Move after passing', 'Stay connected'], coachNote: 'Watch one academy match and notice how midfielders create angles.', isRecommended: false, initialStatus: 'not-started', publishedDate: '6 July 2026' },
  { id: 'nutrition-before-training', title: 'Nutrition Before Training', description: 'Choose simple food and hydration options that support performance.', category: 'Nutrition', coachName: 'Niyas', coachRole: 'Fitness Coach', durationMinutes: 6, initialWatchedMinutes: 0, thumbnail: 'recovery', suitableCategories: ['U10', 'U13', 'U15'], learningObjective: 'Plan a balanced pre-training meal and arrive properly hydrated.', practicePoints: ['Eat early enough', 'Choose easy energy', 'Drink water', 'Avoid heavy foods'], coachNote: 'Ask a parent to help plan your pre-training snack this week.', isRecommended: false, initialStatus: 'not-started', publishedDate: '5 July 2026' },
  { id: 'discipline-and-teamwork', title: 'Coach Talk: Discipline and Teamwork', description: 'Understand the daily habits that help the whole squad improve.', category: 'Coach Talks', coachName: 'Sandeep', coachRole: 'Technical Coach', durationMinutes: 8, initialWatchedMinutes: 0, thumbnail: 'positioning', suitableCategories: ['U10', 'U13', 'U15'], learningObjective: 'Connect personal discipline with trust, teamwork, and squad progress.', practicePoints: ['Arrive prepared', 'Listen actively', 'Encourage teammates', 'Respond positively'], coachNote: 'Choose one team-first action to demonstrate at the next session.', isRecommended: false, initialStatus: 'not-started', publishedDate: '3 July 2026' },
] as const;

export function getLessonById(id: string): LearningLesson | undefined {
  return learningLessons.find((lesson) => lesson.id === id);
}

export function getSessionTopic(lesson: LearningLesson): string {
  const topics: Readonly<Record<LearningLesson['category'], string>> = { Technical: 'Football Skills', Tactical: 'Match Analysis', Fitness: 'Fitness', Recovery: 'Fitness', Nutrition: 'Nutrition', 'Coach Talks': 'Motivation' };
  return topics[lesson.category];
}

export function getRecommendedLessons(lessons: readonly LearningLesson[]): readonly LearningLesson[] {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  return learningRecommendations.flatMap(({ lessonId }) => {
    const lesson = byId.get(lessonId);
    return lesson ? [lesson] : [];
  });
}
