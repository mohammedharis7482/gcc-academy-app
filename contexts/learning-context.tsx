import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getLessonById, learningLessons } from '@/data/learning';
import { learningService } from '@/services/learning-service';
import { LearningLesson, LessonProgress } from '@/types/learning';
import { readStoredValue, storageKeys, writeStoredValue } from '@/utils/app-storage';

type LearningLoadState = 'ready' | 'loading' | 'error';
interface LearningContextValue {
  readonly lessons: readonly LearningLesson[];
  readonly loadState: LearningLoadState;
  getProgress: (lesson: LearningLesson) => LessonProgress;
  markComplete: (lessonId: string) => void;
  advanceLesson: (lessonId: string) => void;
  resetProgress: () => void;
  retry: () => void;
}

const initialProgress = Object.fromEntries(learningLessons.map((lesson) => [lesson.id, { watchedMinutes: lesson.initialWatchedMinutes, status: lesson.initialStatus, completedDate: lesson.completedDate }])) as Record<string, LessonProgress>;
const LearningContext = createContext<LearningContextValue | undefined>(undefined);

function isStoredProgress(value: unknown): value is Record<string, LessonProgress> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((item) => typeof item === 'object' && item !== null && 'watchedMinutes' in item && 'status' in item && typeof item.watchedMinutes === 'number' && ['not-started', 'in-progress', 'completed'].includes(String(item.status)) && (!('completedDate' in item) || item.completedDate === undefined || typeof item.completedDate === 'string'));
}

function sanitizeProgress(stored: Record<string, LessonProgress> | null): Record<string, LessonProgress> {
  if (!stored) return initialProgress;
  const safe = { ...initialProgress };
  learningLessons.forEach((lesson) => {
    const item = stored[lesson.id];
    if (!item) return;
    const watchedMinutes = Math.max(0, Math.min(item.watchedMinutes, lesson.durationMinutes));
    safe[lesson.id] = { watchedMinutes, status: watchedMinutes >= lesson.durationMinutes ? 'completed' : item.status === 'completed' ? 'in-progress' : item.status, completedDate: watchedMinutes >= lesson.durationMinutes ? item.completedDate ?? 'Completed' : undefined };
  });
  return safe;
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<readonly LearningLesson[]>([]);
  const [progress, setProgress] = useState(initialProgress);
  const [loadState, setLoadState] = useState<LearningLoadState>('loading');
  const loadLessons = useCallback(async () => {
    setLoadState('loading');
    try {
      const [loadedLessons, storedProgress] = await Promise.all([learningService.getLessons(), readStoredValue(storageKeys.learnProgress, isStoredProgress)]);
      setLessons(loadedLessons);
      setProgress(sanitizeProgress(storedProgress));
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);
  useEffect(() => { void loadLessons(); }, [loadLessons]);
  const getProgress = useCallback((lesson: LearningLesson) => progress[lesson.id] ?? { watchedMinutes: lesson.initialWatchedMinutes, status: lesson.initialStatus }, [progress]);
  const markComplete = useCallback((lessonId: string) => setProgress((current) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return current;
    const next = { ...current, [lessonId]: { watchedMinutes: lesson.durationMinutes, status: 'completed' as const, completedDate: 'Today' } };
    void writeStoredValue(storageKeys.learnProgress, next);
    return next;
  }), []);
  const advanceLesson = useCallback((lessonId: string) => setProgress((current) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return current;
    const previous = current[lessonId] ?? { watchedMinutes: 0, status: 'not-started' as const };
    const watchedMinutes = Math.min(previous.watchedMinutes + 1, lesson.durationMinutes);
    const next = { ...current, [lessonId]: { watchedMinutes, status: watchedMinutes === lesson.durationMinutes ? 'completed' as const : 'in-progress' as const, completedDate: watchedMinutes === lesson.durationMinutes ? 'Today' : undefined } };
    void writeStoredValue(storageKeys.learnProgress, next);
    return next;
  }), []);
  const resetProgress = useCallback(() => { setProgress(initialProgress); void writeStoredValue(storageKeys.learnProgress, initialProgress); }, []);
  const retry = useCallback(() => { void loadLessons(); }, [loadLessons]);
  const value = useMemo(() => ({ lessons, loadState, getProgress, markComplete, advanceLesson, resetProgress, retry }), [advanceLesson, getProgress, lessons, loadState, markComplete, resetProgress, retry]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used inside LearningProvider');
  return context;
}
