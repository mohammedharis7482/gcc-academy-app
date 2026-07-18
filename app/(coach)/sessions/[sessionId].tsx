import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { LessonThumbnail } from '@/components/learn/lesson-thumbnail';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { getPlayerById } from '@/data/academy';
import { getLessonById, getSessionTopic } from '@/data/learning';
import { colors, layout, radius, spacing } from '@/design/tokens';

function normalize(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
export default function CoachSessionDetailScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[]; playerId?: string | string[] }>(); const router = useRouter(); const sessionId = normalize(params.sessionId); const playerId = normalize(params.playerId); const session = sessionId ? getLessonById(sessionId) : undefined; const player = playerId ? getPlayerById(playerId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/players'); };
  if (!session) return <AppScreen><SubpageHeader title="Academy Session" onBack={back} /><ContentState type="error" title="Session not found" message="This Session ID is missing or unavailable." onRetry={back} actionLabel="Go back" /></AppScreen>;
  return <AppScreen><SubpageHeader title="Assigned Session" subtitle={player ? `For ${player.name}` : getSessionTopic(session)} onBack={back} /><LessonThumbnail thumbnail={session.thumbnail} showPlay style={styles.hero} /><View style={styles.sections}><View><AppText variant="title" weight="extraBold">{session.title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>{getSessionTopic(session)} · {session.durationMinutes} min · Coach {session.coachName}</AppText></View><ProfileSection title="Session Objective"><View style={styles.card}><AppText>{session.learningObjective}</AppText></View></ProfileSection><ProfileSection title="Practice Points"><View style={styles.card}>{session.practicePoints.map((point) => <View key={point} style={styles.point}><MaterialCommunityIcons name="check-circle-outline" size={19} color={colors.status.success} /><AppText variant="bodySmall" style={styles.grow}>{point}</AppText></View>)}</View></ProfileSection><ProfileSection title="Coach Note"><View style={styles.note}><MaterialCommunityIcons name="whistle-outline" size={20} color={colors.brand.blue} /><AppText variant="bodySmall" style={styles.grow}>{session.coachNote}</AppText></View></ProfileSection></View></AppScreen>;
}
const styles = StyleSheet.create({ hero: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.hero }, sections: { marginTop: layout.sectionGap, gap: layout.sectionGap }, card: { padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.xs }, point: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, note: { padding: layout.cardPadding, borderRadius: radius.standard, backgroundColor: colors.brand.blueSoft, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, grow: { flex: 1, minWidth: 0 } });
