import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AssessmentSummary } from '@/components/progress/progress-detail-content';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { getAssessmentById } from '@/data/progress-details';
import { SkillKey } from '@/types/progress';

function firstParam(value: string | string[] | undefined): string | undefined { const first = Array.isArray(value) ? value[0] : value; return first?.trim() || undefined; }
const skillKeys: readonly SkillKey[] = ['firstTouch', 'passing', 'dribbling', 'pace', 'gameAwareness'];
function normalizeSkill(value: string | string[] | undefined): SkillKey | undefined { const candidate = firstParam(value); return skillKeys.find((key) => key === candidate); }

export default function AssessmentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ assessmentId?: string | string[]; skillId?: string | string[] }>();
  const assessmentId = firstParam(params.assessmentId);
  const assessment = assessmentId ? getAssessmentById(assessmentId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/progress'); };
  if (!assessment) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Assessment not found" message="This assessment ID is invalid or no longer available." actionLabel="Back to Progress" onRetry={back} /></AppScreen>;
  const openLesson = () => router.push({ pathname: '/learn/[lessonId]', params: { lessonId: assessment.recommendedLessonId } });
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Player Assessment" subtitle={assessment.period} onBack={back} /><View><AssessmentSummary assessment={assessment} highlightedSkill={normalizeSkill(params.skillId)} onLessonPress={openLesson} /></View></AppScreen>;
}
