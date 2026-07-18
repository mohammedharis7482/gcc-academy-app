import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChoiceChips } from '@/components/coach/assessment-form';
import { AssessmentHistoryRow } from '@/components/coach/assessment-history';
import { AppText } from '@/components/common/app-text';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useAssessments } from '@/contexts/assessment-context';
import { getPlayerById } from '@/data/academy';
import { colors, layout, spacing } from '@/design/tokens';
import { FeedbackHistoryFilter } from '@/types/assessment';

const filters: readonly FeedbackHistoryFilter[] = ['all', 'quick-feedback', 'full-assessment', 'U10', 'U13', 'U15'];
export default function CoachFeedbackHistoryScreen() {
  const params = useLocalSearchParams<{ playerId?: string | string[] }>(); const requestedPlayerId = Array.isArray(params.playerId) ? params.playerId[0] : params.playerId; const selectedPlayer = requestedPlayerId ? getPlayerById(requestedPlayerId) : undefined;
  const router = useRouter(); const insets = useSafeAreaInsets(); const { records, status, retry } = useAssessments(); const [filter, setFilter] = useState<FeedbackHistoryFilter>('all');
  const filtered = useMemo(() => records.filter((record) => (!selectedPlayer || record.playerId === selectedPlayer.id) && (filter === 'all' || filter === record.mode || getPlayerById(record.playerId)?.category === filter)), [filter, records, selectedPlayer]);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  const header = <View><SubpageHeader title="Feedback History" subtitle={selectedPlayer?.name ?? 'Published player development notes'} onBack={back} /><View style={styles.filters}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>FILTER</AppText><ChoiceChips values={filters} selected={filter} onSelect={setFilter} labelPrefix="Feedback history" /></View></View>;
  if (status === 'loading') return <SafeAreaView style={styles.safe} edges={['top']}><ContentState type="loading" title="Loading feedback" message="Restoring coach assessment history." /></SafeAreaView>;
  if (status === 'error' && !records.length) return <SafeAreaView style={styles.safe} edges={['top']}><ContentState type="error" title="History unavailable" message="Stored feedback could not be restored." onRetry={retry} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList data={filtered} keyExtractor={(item) => item.id} renderItem={({ item }) => <AssessmentHistoryRow assessment={item} onPress={() => router.push({ pathname: '/(coach)/feedback/[assessmentId]', params: { assessmentId: item.id } })} />} ItemSeparatorComponent={Separator} ListHeaderComponent={header} ListEmptyComponent={<ContentState type="empty" title="No feedback found" message="Published feedback matching this filter will appear here." />} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + layout.tabClearance }]} showsVerticalScrollIndicator={false} initialNumToRender={12} /></SafeAreaView>;
}
function Separator() { return <View style={styles.separator} />; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral.background }, content: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', paddingHorizontal: layout.pageHorizontal }, filters: { gap: spacing.xs, paddingBottom: spacing.sm }, separator: { height: layout.cardGap } });
