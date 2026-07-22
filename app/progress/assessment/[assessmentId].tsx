import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AssessmentSummary } from '@/components/progress/progress-detail-content';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { getAssessmentById } from '@/data/progress-details';
import { useAssessments } from '@/contexts/assessment-context';
import { toPlayerAssessment } from '@/data/assessments';
import { SkillKey } from '@/types/progress';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

function firstParam(value: string | string[] | undefined): string | undefined { const first = Array.isArray(value) ? value[0] : value; return first?.trim() || undefined; }
const skillKeys: readonly SkillKey[] = ['firstTouch', 'passing', 'dribbling', 'pace', 'gameAwareness'];
function normalizeSkill(value: string | string[] | undefined): SkillKey | undefined { const candidate = firstParam(value); return skillKeys.find((key) => key === candidate); }

export default function AssessmentDetailScreen() {
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const assessmentState = useAssessments();
  const params = useLocalSearchParams<{ assessmentId?: string | string[]; skillId?: string | string[] }>();
  const assessmentId = firstParam(params.assessmentId);
  const dynamicAssessment = assessmentId ? assessmentState.getAssessmentById(assessmentId) : undefined;
  const assessment = dynamicAssessment?.mode === 'full-assessment' ? toPlayerAssessment(dynamicAssessment) : assessmentId ? getAssessmentById(assessmentId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/progress'); };
  if (!assessment) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Assessment not found" message="This assessment ID is invalid or no longer available." actionLabel="Back to Progress" onRetry={back} /></AppScreen>;
  const openLesson = () => navigateOnce(() => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId: assessment.recommendedLessonId } }));
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Player Assessment" subtitle={assessment.period} onBack={back} /><View><AssessmentSummary assessment={assessment} highlightedSkill={normalizeSkill(params.skillId)} onLessonPress={openLesson} /></View></AppScreen>;
}
