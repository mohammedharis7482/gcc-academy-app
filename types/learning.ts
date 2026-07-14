export type LearningCategory = 'All' | 'Technical' | 'Tactical' | 'Fitness' | 'Recovery' | 'Nutrition' | 'Coach Talks';
export type LessonCategory = Exclude<LearningCategory, 'All'>;
export type LessonStatus = 'not-started' | 'in-progress' | 'completed';
export type LessonThumbnail = 'ball-control' | 'passing' | 'positioning' | 'recovery' | 'training';

export interface LearningLesson {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: LessonCategory;
  readonly coachName: string;
  readonly coachRole: string;
  readonly durationMinutes: number;
  readonly initialWatchedMinutes: number;
  readonly thumbnail: LessonThumbnail;
  readonly suitableCategories: readonly string[];
  readonly learningObjective: string;
  readonly practicePoints: readonly string[];
  readonly coachNote: string;
  readonly isRecommended: boolean;
  readonly initialStatus: LessonStatus;
  readonly publishedDate: string;
  readonly completedDate?: string;
}

export interface LessonProgress {
  readonly watchedMinutes: number;
  readonly status: LessonStatus;
  readonly completedDate?: string;
}

export interface LessonRecommendation {
  readonly lessonId: string;
  readonly goal: string;
}
