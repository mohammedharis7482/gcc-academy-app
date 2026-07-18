import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { AppScreen } from '@/components/common/app-screen';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { getPlayerById } from '@/data/academy';
import { useAssessments } from '@/contexts/assessment-context';
import { CoachPlayerAction } from '@/types/academy';

const actions: Readonly<Record<CoachPlayerAction, string>> = {
  'attendance-history': 'Attendance History', assessment: 'Full Assessment', feedback: 'Add Feedback',
  'feedback-history': 'Feedback History', progress: 'Player Progress', 'assign-lesson': 'Assign Session',
};
function normalize(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function isAction(value: string | undefined): value is CoachPlayerAction { return Boolean(value && value in actions); }

export default function CoachPlayerActionScreen() {
  const params = useLocalSearchParams<{ playerId?: string | string[]; action?: string | string[] }>(); const router = useRouter(); const assessmentState = useAssessments(); const playerId = normalize(params.playerId); const actionParam = normalize(params.action); const player = playerId ? getPlayerById(playerId) : undefined; const action = isAction(actionParam) ? actions[actionParam] : undefined; const dynamicAssessment = player ? assessmentState.getLatestFullAssessment(player.id) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/players'); };
  if (!player || !action) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Action" onBack={back} /><ContentState type="error" title="Action unavailable" message="The player or requested Coach action could not be found." onRetry={back} actionLabel="Go back" /></AppScreen>;
  if (actionParam === 'attendance-history') return <Redirect href={{ pathname: '/(coach)/(tabs)/attendance', params: { playerId: player.id } }} />;
  if (actionParam === 'feedback') return <Redirect href={{ pathname: '/(coach)/feedback', params: { playerId: player.id } }} />;
  if (actionParam === 'feedback-history') return <Redirect href={{ pathname: '/(coach)/feedback/history', params: { playerId: player.id } }} />;
  if (actionParam === 'assign-lesson') return <Redirect href={{ pathname: '/(coach)/session-assignment/new', params: { playerId: player.id } }} />;
  if ((actionParam === 'assessment' || actionParam === 'progress') && dynamicAssessment) return <Redirect href={{ pathname: '/(coach)/feedback/[assessmentId]', params: { assessmentId: dynamicAssessment.id } }} />;
  return <AppScreen withTabBarClearance={false}><SubpageHeader title={action} subtitle={player.name} onBack={back} /><ContentState type="empty" title="No assessment yet" message="Publish the first assessment to create this player’s progress view." actionLabel="Add feedback" onRetry={() => router.replace({ pathname: '/(coach)/feedback', params: { playerId: player.id } })} /></AppScreen>;
}
