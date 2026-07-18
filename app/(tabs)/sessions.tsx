import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachPageHeader } from '@/components/coach/coach-header';
import { OperationsChoiceChips } from '@/components/coach/operations-controls';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { SectionHeader } from '@/components/common/section-header';
import { LessonCard } from '@/components/learn/lesson-cards';
import { LearnSkeleton } from '@/components/learn/learn-skeleton';
import { ContentState } from '@/components/states/content-state';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { useAssessments } from '@/contexts/assessment-context';
import { useLearning } from '@/contexts/learning-context';
import { useTrainingPlans } from '@/contexts/training-plan-context';
import { getSessionTopic } from '@/data/learning';
import { colors, layout, spacing } from '@/design/tokens';

type SessionsFilter = 'Assigned' | 'All Sessions' | 'Completed';

export default function SessionsScreen() {
  const router = useRouter(); const learning = useLearning(); const operations = useAcademyOperations(); const assessments = useAssessments(); const trainingPlans = useTrainingPlans(); const [filter, setFilter] = useState<SessionsFilter>('Assigned');
  const assignments = operations.getAssignmentsForPlayer('player-ayaan', 'u13');
  const assignedBySession = useMemo(() => new Map(assignments.map((assignment) => [assignment.sessionId, assignment])), [assignments]);
  const assignedIds = useMemo(() => new Set([...assignedBySession.keys(), ...assessments.getRecommendedLessonIds('player-ayaan'), ...trainingPlans.getAssignedLessonIds('u13')]), [assessments, assignedBySession, trainingPlans]);
  const sessions = useMemo(() => filter === 'Assigned' ? learning.lessons.filter((session) => assignedIds.has(session.id)) : filter === 'Completed' ? learning.lessons.filter((session) => learning.getProgress(session).status === 'completed') : learning.lessons.filter((session) => session.suitableCategories.includes('U13')), [assignedIds, filter, learning]);
  const openSession = (sessionId: string) => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId } });
  const empty = filter === 'Assigned' ? { title: 'No assigned sessions yet', message: "Your Coach's assigned Academy Sessions will appear here." } : filter === 'Completed' ? { title: 'No completed sessions yet', message: 'Sessions you complete will appear here for quick review.' } : { title: 'No Academy Sessions available', message: 'Academy-uploaded Session Videos for U13 will appear here.' };
  return <AppScreen testID="sessions-screen"><CoachPageHeader title="Sessions" subtitle="Academy videos for your development" />{learning.loadState === 'loading' || operations.status === 'loading' ? <LearnSkeleton /> : learning.loadState === 'error' ? <ContentState type="error" title="Sessions are unavailable" message="Academy Sessions could not be loaded." onRetry={learning.retry} /> : <View style={styles.sections}><OperationsChoiceChips values={['Assigned', 'All Sessions', 'Completed'] as const} selected={filter} onSelect={setFilter} label="Sessions filter" />{filter === 'All Sessions' ? <View><SectionHeader title="Session Topics" /><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Football Skills · Match Analysis · Fitness · Nutrition · Academy Classes · Motivation · Rules and Awareness</AppText></View> : null}{sessions.length ? <View style={styles.list}>{sessions.map((session) => { const assignment = assignedBySession.get(session.id); return <View key={session.id} style={styles.item}>{assignment ? <AppText variant="caption" weight="bold" color={colors.brand.blue}>ASSIGNED BY COACH {assignment.assignedByName.toUpperCase()}{assignment.dueDate ? ` · DUE ${assignment.dueDate.toUpperCase()}` : ''}</AppText> : <AppText variant="caption" weight="bold" color={colors.brand.blue}>{filter === 'Assigned' ? 'ASSIGNED BY COACH SANDEEP' : getSessionTopic(session).toUpperCase()}</AppText>}<LessonCard lesson={session} progress={learning.getProgress(session)} onPress={() => openSession(session.id)} /></View>; })}</View> : <ContentState type="empty" icon="play-box-multiple-outline" title={empty.title} message={empty.message} />}</View>}</AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, list: { gap: layout.cardGap }, item: { gap: spacing.xs } });
