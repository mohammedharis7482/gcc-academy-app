import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { SectionHeader } from '@/components/common/section-header';
import { CoachNoteCard, LearningObjectivesCard, LessonMetadata, LessonProgressCard, LessonVideoHero, PracticePointsCard } from '@/components/learn/lesson-detail';
import { LessonCard } from '@/components/learn/lesson-cards';
import { LearnSkeleton } from '@/components/learn/learn-skeleton';
import { ContentState } from '@/components/states/content-state';
import { useToast } from '@/components/states/success-toast';
import { useLearning } from '@/contexts/learning-context';
import { layout, spacing } from '@/design/tokens';

export default function SessionDetailScreen() {
  const router = useRouter(); const params = useLocalSearchParams<{ sessionId?: string | string[] }>(); const learning = useLearning(); const { showSuccess } = useToast(); const [ready, setReady] = useState(false); const [playing, setPlaying] = useState(false);
  const value = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId; const sessionId = value?.trim() || undefined; const session = sessionId ? learning.lessons.find((item) => item.id === sessionId) : undefined;
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/sessions');
  if (learning.loadState === 'loading') return <AppScreen><LearnSkeleton /></AppScreen>;
  if (learning.loadState === 'error') return <AppScreen><ContentState type="error" title="Session unavailable" message="This Academy Session could not be loaded." onRetry={learning.retry} /></AppScreen>;
  if (!session) return <AppScreen><ContentState type="error" title="Session not found" message="This Session ID is invalid or no longer available." actionLabel="Back to Sessions" onRetry={back} /></AppScreen>;
  const progress = learning.getProgress(session); const related = learning.lessons.filter((item) => item.id !== session.id && item.category === session.category).slice(0, 3);
  return <AppScreen><View style={styles.sections}><LessonVideoHero lesson={session} ready={ready} playing={playing} onBack={back} onPlay={() => { setReady(true); setPlaying((current) => !current); learning.advanceLesson(session.id); }} /><LessonMetadata lesson={session} /><LearningObjectivesCard objective={session.learningObjective} /><PracticePointsCard points={session.practicePoints} /><LessonProgressCard lesson={session} progress={progress} onContinue={() => { setReady(true); setPlaying(true); learning.advanceLesson(session.id); }} onComplete={() => { setPlaying(false); learning.markComplete(session.id); showSuccess('Session completed', `${session.title} was added to Completed Sessions.`); }} /><CoachNoteCard lesson={session} /><View><SectionHeader title="Related Sessions" /><View style={styles.related}>{related.map((item) => <LessonCard key={item.id} lesson={item} progress={learning.getProgress(item)} onPress={() => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId: item.id } })} />)}</View></View></View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { paddingTop: spacing.sm, gap: layout.sectionGap }, related: { gap: spacing.sm } });
