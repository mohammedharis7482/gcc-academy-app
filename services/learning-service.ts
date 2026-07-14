import { getLessonById, learningLessons } from '@/data/learning';
import { LearningLesson } from '@/types/learning';

export const learningService = {
  async getLessons(): Promise<readonly LearningLesson[]> { return learningLessons; },
  async getLesson(id: string): Promise<LearningLesson | undefined> { return getLessonById(id); },
};
