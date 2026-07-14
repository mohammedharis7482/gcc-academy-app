import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { LearnHeader } from '@/components/learn/learn-header';
import { LearningCategoryTabs } from '@/components/learn/learning-category-tabs';
import { CompletedLessonCard, ContinueWatchingCard, LessonCard, RecommendedLessonCard } from '@/components/learn/lesson-cards';
import { LearnSkeleton } from '@/components/learn/learn-skeleton';
import { ContentState } from '@/components/states/content-state';
import { useLearning } from '@/contexts/learning-context';
import { getRecommendedLessons, learningCategories, learningPlayer } from '@/data/learning';
import { colors, layout, spacing } from '@/design/tokens';
import { LearningCategory } from '@/types/learning';

export default function LearnScreen() {
  const router = useRouter();
  const { lessons, loadState, getProgress, retry } = useLearning();
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory>('All');
  const openLesson = (lessonId: string) => router.push({ pathname: '/learn/[lessonId]', params: { lessonId } });
  const unfinished = lessons.find((lesson) => getProgress(lesson).status === 'in-progress');
  const recommended = getRecommendedLessons(lessons).slice(0, 2);
  const filtered = useMemo(() => lessons.filter((lesson) => selectedCategory === 'All' || lesson.category === selectedCategory), [lessons, selectedCategory]);
  const completed = lessons.filter((lesson) => getProgress(lesson).status === 'completed').slice(0, 2);

  return <AppScreen testID="learn-screen"><LearnHeader />{loadState === 'loading' ? <LearnSkeleton /> : loadState === 'error' ? <ContentState type="error" title="Lessons are unavailable" message="Your academy learning library could not be loaded." onRetry={retry} /> : <View style={styles.sections}>{unfinished && <FadeInView translate={false}><View><SectionHeader title="Continue Watching" /><ContinueWatchingCard lesson={unfinished} progress={getProgress(unfinished)} onPress={() => openLesson(unfinished.id)} /></View></FadeInView>}<FadeInView delay={40} translate={false}><View><SectionHeader title="Recommended for Your Goal" /><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.goal}>Improve {learningPlayer.currentGoal}</AppText>{recommended.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>{recommended.map((lesson) => <RecommendedLessonCard key={lesson.id} lesson={lesson} onPress={() => openLesson(lesson.id)} />)}</ScrollView> : <ContentState type="empty" title="No recommended lessons yet" message="Your coach's recommendations will appear here." />}</View></FadeInView><View><SectionHeader title="Browse by Category" /><LearningCategoryTabs categories={learningCategories} selected={selectedCategory} onSelect={setSelectedCategory} /></View><View><SectionHeader title="Latest Lessons" />{filtered.length ? <View style={styles.list}>{filtered.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} progress={getProgress(lesson)} onPress={() => openLesson(lesson.id)} />)}</View> : <ContentState type="empty" title={`No ${selectedCategory} lessons yet`} message="New academy-approved lessons will appear here." />}</View><View><SectionHeader title="Recently Completed" />{completed.length ? <View style={styles.list}>{completed.map((lesson) => <CompletedLessonCard key={lesson.id} lesson={lesson} progress={getProgress(lesson)} onPress={() => openLesson(lesson.id)} />)}</View> : <ContentState type="empty" title="No completed lessons yet" message="Lessons you finish will be kept here for quick review." />}</View></View>}</AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, goal: { marginTop: -spacing.xs, marginBottom: layout.cardGap }, horizontal: { gap: layout.cardGap, paddingRight: spacing.md }, list: { gap: layout.cardGap } });
