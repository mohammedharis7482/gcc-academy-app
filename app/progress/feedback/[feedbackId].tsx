import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppScreen } from '@/components/common/app-screen';
import { FeedbackDetailCard } from '@/components/progress/progress-detail-content';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { getFeedbackById } from '@/data/progress-details';

function normalizeId(value: string | string[] | undefined): string | undefined { const first = Array.isArray(value) ? value[0] : value; return first?.trim() || undefined; }

export default function FeedbackDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ feedbackId?: string | string[] }>();
  const feedbackId = normalizeId(params.feedbackId);
  const feedback = feedbackId ? getFeedbackById(feedbackId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/progress'); };
  if (!feedback) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Feedback not found" message="This feedback ID is invalid or no longer available." actionLabel="Back to Progress" onRetry={back} /></AppScreen>;
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Feedback" subtitle={feedback.date} onBack={back} /><FeedbackDetailCard feedback={feedback} onAssessmentPress={() => router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId: feedback.assessmentId } })} onLessonPress={() => router.push({ pathname: '/learn/[lessonId]', params: { lessonId: feedback.recommendedLessonId } })} /></AppScreen>;
}
