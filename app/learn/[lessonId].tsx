import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { SectionHeader } from '@/components/common/section-header';
import { CoachNoteCard, LearningObjectivesCard, LessonMetadata, LessonProgressCard, LessonVideoHero, PracticePointsCard } from '@/components/learn/lesson-detail';
import { LessonCard } from '@/components/learn/lesson-cards';
import { LearnSkeleton } from '@/components/learn/learn-skeleton';
import { ContentState } from '@/components/states/content-state';
import { useLearning } from '@/contexts/learning-context';
import { layout, spacing } from '@/design/tokens';

function normalizeLessonId(value: string | string[] | undefined): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate?.trim();
  return normalized ? normalized : undefined;
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string | string[] }>();
  const { lessons, loadState, getProgress, markComplete, advanceLesson, retry } = useLearning();
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const lessonId = normalizeLessonId(params.lessonId);
  const lesson = lessonId ? lessons.find((item) => item.id === lessonId) : undefined;

  const returnToLearn = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/learn');
  };

  if (loadState === 'loading') return <AppScreen withTabBarClearance={false}><View style={styles.loading}><LearnSkeleton /></View></AppScreen>;
  if (loadState === 'error') return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Lesson unavailable" message="The academy lesson could not be loaded." onRetry={retry} /></AppScreen>;
  if (!lesson) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Lesson not found" message="This lesson ID is invalid or the lesson is no longer available." actionLabel="Back to Learn" onRetry={returnToLearn} /></AppScreen>;

  const progress = getProgress(lesson);
  const related = lessons.filter((item) => item.id !== lesson.id && (item.category === lesson.category || item.isRecommended)).slice(0, 3);
  const startLesson = () => {
    setVideoReady(true);
    setPlaying(true);
    advanceLesson(lesson.id);
  };
  const togglePlayback = () => {
    if (!playing) advanceLesson(lesson.id);
    setVideoReady(true);
    setPlaying((current) => !current);
  };

  return <AppScreen><View style={styles.sections}><LessonVideoHero lesson={lesson} ready={videoReady} playing={playing} onBack={returnToLearn} onPlay={togglePlayback} /><LessonMetadata lesson={lesson} /><LearningObjectivesCard objective={lesson.learningObjective} /><PracticePointsCard points={lesson.practicePoints} /><LessonProgressCard lesson={lesson} progress={progress} onContinue={startLesson} onComplete={() => { setPlaying(false); markComplete(lesson.id); }} /><CoachNoteCard lesson={lesson} /><View><SectionHeader title="Related Lessons" /><View style={styles.related}>{related.map((item) => <LessonCard key={item.id} lesson={item} progress={getProgress(item)} onPress={() => router.push({ pathname: '/learn/[lessonId]', params: { lessonId: item.id } })} />)}</View></View></View></AppScreen>;
}

const styles = StyleSheet.create({ sections: { paddingTop: spacing.sm, gap: layout.sectionGap }, loading: { paddingTop: spacing.xl }, related: { gap: spacing.sm } });
