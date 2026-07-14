import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { AcademyUpdateCard } from '@/components/home/academy-update-card';
import { CoachFeedbackCard } from '@/components/home/coach-feedback-card';
import { FeeReminderCard } from '@/components/home/fee-reminder-card';
import { LearningVideoCard } from '@/components/home/learning-video-card';
import { NextTrainingCard } from '@/components/home/next-training-card';
import { PlayerHeader } from '@/components/home/player-header';
import { ProgressSummaryCard } from '@/components/home/progress-summary-card';
import { ContentState } from '@/components/states/content-state';
import { useLearning } from '@/contexts/learning-context';
import { homeDashboardMock } from '@/data/home';
import { latestAssessmentId } from '@/data/progress-details';
import { layout } from '@/design/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const dashboard = homeDashboardMock;
  const { lessons, getProgress } = useLearning();
  const dashboardLesson = dashboard.continueLearning
    ? lessons.find((lesson) => lesson.id === dashboard.continueLearning?.id)
    : undefined;
  const dashboardLessonProgress = dashboardLesson ? getProgress(dashboardLesson) : undefined;
  const continueLearning = dashboard.continueLearning && dashboardLessonProgress?.status !== 'completed'
    ? { ...dashboard.continueLearning, watchedMinutes: dashboardLessonProgress?.watchedMinutes ?? dashboard.continueLearning.watchedMinutes }
    : null;

  return (
    <AppScreen>
      <View>
        <FadeInView translate={false}><PlayerHeader player={dashboard.player} onNotificationPress={() => router.push('/(tabs)/updates')} /></FadeInView>
        <View style={styles.sections}>
          <FadeInView delay={40}>{dashboard.nextTraining ? <NextTrainingCard training={dashboard.nextTraining} onPress={() => router.push('/training/schedule')} /> : <ContentState type="empty" title="No upcoming training" message="Your next scheduled session will appear here." />}</FadeInView>
          <FadeInView delay={80}><View><SectionHeader title="Your Progress" actionLabel="View full progress" actionTestID="home-view-progress" onAction={() => router.push('/(tabs)/progress')} /><ProgressSummaryCard progress={dashboard.progress} /></View></FadeInView>
          {dashboard.latestFeedback ? <View><SectionHeader title="Latest Coach Feedback" /><CoachFeedbackCard feedback={dashboard.latestFeedback} onPress={() => router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId: latestAssessmentId } })} /></View> : null}
          {continueLearning ? <View><SectionHeader title="Continue Learning" actionLabel="Browse library" onAction={() => router.push('/(tabs)/learn')} /><LearningVideoCard video={continueLearning} onPress={() => router.push({ pathname: '/learn/[lessonId]', params: { lessonId: continueLearning.id } })} /></View> : null}
          {dashboard.feeReminder ? <FeeReminderCard fee={dashboard.feeReminder} onPress={() => router.push('/profile/fees')} /> : null}
          {dashboard.latestUpdate ? <View><SectionHeader title="Latest Academy Update" actionLabel="See all" onAction={() => router.push('/(tabs)/updates')} /><AcademyUpdateCard update={dashboard.latestUpdate} onPress={() => router.push({ pathname: '/updates/[updateId]', params: { updateId: dashboard.latestUpdate?.id ?? 'weekend-training-time-updated' } })} /></View> : null}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({ sections: { gap: layout.sectionGap } });
