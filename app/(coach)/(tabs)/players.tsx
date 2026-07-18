import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoachPageHeader } from '@/components/coach/coach-header';
import { CategoryFilters, PlayerSearch, RosterCategoryFilter, RosterStatusFilter, StatusFilters } from '@/components/coach/player-filters';
import { PlayerListCard } from '@/components/coach/player-list-card';
import { PlayerRosterSkeleton } from '@/components/coach/player-roster-states';
import { AppText } from '@/components/common/app-text';
import { ContentState } from '@/components/states/content-state';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { useAssessments } from '@/contexts/assessment-context';
import { searchPlayers } from '@/data/academy';
import { assessmentAverage } from '@/data/assessments';
import { coachLayout, coachTabBarMetrics, colors, layout, spacing } from '@/design/tokens';
import { AcademyPlayer } from '@/types/academy';

export default function CoachPlayersScreen() {
  const data = useAcademyData(); const attendance = useAttendanceData(); const assessmentState = useAssessments(); const router = useRouter(); const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(''); const [category, setCategory] = useState<RosterCategoryFilter>('U13'); const [status, setStatus] = useState<RosterStatusFilter>('all');
  const currentPlayers = useMemo(() => data.players.map((player) => { const summary = attendance.getPlayerSummary(player.id); const latest = assessmentState.getLatestAssessment(player.id); const latestFull = assessmentState.getLatestFullAssessment(player.id); const attendancePlayer = summary ? { ...player, attendance: { ...player.attendance, ...summary }, sessionStatus: summary.currentStatus } : player; return { ...attendancePlayer, latestRating: latestFull ? assessmentAverage(latestFull) ?? attendancePlayer.latestRating : attendancePlayer.latestRating, focus: latest?.developmentGoal?.title ?? latest?.improvementArea ?? attendancePlayer.focus }; }), [assessmentState, attendance, data.players]);
  const categoryPlayers = useMemo(() => category === 'All' ? currentPlayers : currentPlayers.filter((player) => player.category === category), [category, currentPlayers]);
  const filteredPlayers = useMemo(() => {
    const searched = searchPlayers(categoryPlayers, query);
    const statusFiltered = status === 'all' ? searched : searched.filter((player) => player.sessionStatus === status);
    return [...statusFiltered].sort((a, b) => a.jerseyNumber - b.jerseyNumber || a.name.localeCompare(b.name));
  }, [categoryPlayers, query, status]);
  const openPlayer = useCallback((player: AcademyPlayer) => { Keyboard.dismiss(); router.push({ pathname: '/(coach)/players/[playerId]', params: { playerId: player.id } }); }, [router]);
  const squad = category === 'All' ? null : data.squads.find((item) => item.ageCategory === category);

  const header = <View><CoachPageHeader title="Players" subtitle="Manage your assigned squads" /><View style={styles.controls}><PlayerSearch query={query} onChange={setQuery} /><View><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary} style={styles.filterLabel}>CATEGORY</AppText><CategoryFilters selected={category} onSelect={setCategory} /></View><View><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary} style={styles.filterLabel}>SESSION STATUS</AppText><StatusFilters selected={status} onSelect={setStatus} /></View><View style={styles.summary}><View style={styles.grow}><AppText variant="heading" weight="extraBold">{squad?.name ?? 'All Academy Squads'}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{status === 'all' ? `${categoryPlayers.length} players` : `${filteredPlayers.length} of ${categoryPlayers.length} players`}</AppText></View><AppText variant="caption" weight="bold" color={colors.brand.blue}>Jersey order</AppText></View><AppText variant="heading" weight="bold">Player Roster</AppText></View></View>;
  const emptyMessage = query ? `No players match “${query}” with the selected filters.` : status !== 'all' ? 'No players match the selected session status.' : 'No players are assigned to this category.';
  if (data.rosterStatus === 'loading') return <SafeAreaView style={styles.safe} edges={['top']}><PlayerRosterSkeleton /></SafeAreaView>;
  if (data.rosterStatus === 'error') return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.state}><ContentState type="error" title="Roster unavailable" message="The player roster could not be loaded." onRetry={data.retryRoster} /></View></SafeAreaView>;
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList data={filteredPlayers} keyExtractor={(player) => player.id} renderItem={({ item }) => <PlayerListCard player={item} onPress={openPlayer} />} ListHeaderComponent={header} ListEmptyComponent={<ContentState type="empty" title="No players found" message={emptyMessage} />} ItemSeparatorComponent={Separator} contentContainerStyle={[styles.content, { paddingBottom: coachTabBarMetrics.height + insets.bottom + coachTabBarMetrics.contentClearance }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" initialNumToRender={10} maxToRenderPerBatch={10} windowSize={7} /></SafeAreaView>;
}

function Separator() { return <View style={styles.separator} />; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral.background }, state: { padding: coachLayout.pageHorizontal, paddingTop: coachLayout.pageTop }, content: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', paddingHorizontal: coachLayout.pageHorizontal }, controls: { gap: spacing.sm, paddingBottom: spacing.sm }, filterLabel: { marginBottom: spacing.xs }, summary: { minHeight: 52, paddingHorizontal: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, grow: { flex: 1, minWidth: 0 }, separator: { height: coachLayout.cardGap } });
