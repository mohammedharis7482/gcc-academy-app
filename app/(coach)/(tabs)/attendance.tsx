import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AttendanceNoteDialog } from '@/components/coach/attendance-note-dialog';
import { AttendanceQuickActions, AttendanceRow, AttendanceSearchAndFilter, AttendanceSessionCard, AttendanceSessionSelector, AttendanceSummaryBar } from '@/components/coach/attendance-workflow';
import { CoachPageHeader } from '@/components/coach/coach-header';
import { AttendanceRosterSkeleton } from '@/components/coach/attendance-roster-skeleton';
import { AppText } from '@/components/common/app-text';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { ContentState, ErrorState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { StickyCoachAction } from '@/components/coach/sticky-coach-action';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useAttendanceData, useAttendanceDraft } from '@/contexts/attendance-context';
import { getAttendanceSession, getDefaultAttendanceSessionForSquad, summarizeAttendance } from '@/data/attendance';
import { getPlayerById, getPlayersBySquad } from '@/data/academy';
import { coachLayout, coachTabBarMetrics, colors, layout, radius, spacing } from '@/design/tokens';
import { AcademyPlayer } from '@/types/academy';
import { AttendanceFilter, AttendanceStatus, PlayerAttendanceEntry } from '@/types/attendance';

function normalize(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
interface NoteTarget { readonly entry: PlayerAttendanceEntry; readonly player: AcademyPlayer }
type AttendanceConfirmation = 'leave' | 'mark-all' | 'reset' | 'incomplete' | null;

export default function CoachAttendanceScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[]; playerId?: string | string[] }>();
  const requestedSessionId = normalize(params.sessionId); const requestedPlayerId = normalize(params.playerId);
  const router = useRouter(); const listRef = useRef<FlatList<AcademyPlayer>>(null); const appliedRouteRef = useRef('');
  const academy = useAcademyData(); const attendance = useAttendanceData(); const draft = useAttendanceDraft();
  const { showSuccess } = useToast();
  const updateStatus = draft.setStatus;
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState<AttendanceFilter>('all'); const [noteTarget, setNoteTarget] = useState<NoteTarget | null>(null);
  const [editingSubmitted, setEditingSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<AttendanceConfirmation>(null); const leaveActionRef = useRef<(() => void) | null>(null);
  const requestedPlayer = requestedPlayerId ? getPlayerById(requestedPlayerId) : undefined; const focusedSessionId = requestedSessionId ?? (requestedPlayer ? getDefaultAttendanceSessionForSquad(requestedPlayer.squadId)?.id : undefined);
  const selectedSession = getAttendanceSession(draft.selectedSessionId); const requestedSessionValid = !focusedSessionId || Boolean(getAttendanceSession(focusedSessionId)); const requestedPlayerValid = !requestedPlayerId || Boolean(requestedPlayer);
  const focusedPlayer = requestedPlayer?.squadId === selectedSession?.squadId ? requestedPlayer : undefined;
  const squad = selectedSession ? academy.squads.find((item) => item.id === selectedSession.squadId) : undefined;
  const entriesByPlayer = useMemo(() => new Map(draft.draftEntries.map((entry) => [entry.playerId, entry])), [draft.draftEntries]);
  const roster = useMemo(() => selectedSession ? getPlayersBySquad(selectedSession.squadId) : [], [selectedSession]);
  const visiblePlayers = useMemo(() => roster.filter((player) => {
    const normalized = query.trim().toLowerCase(); const entry = entriesByPlayer.get(player.id);
    const matchesSearch = !normalized || player.name.toLowerCase().includes(normalized) || player.playerId.toLowerCase().includes(normalized) || String(player.jerseyNumber) === normalized;
    return matchesSearch && (filter === 'all' || entry?.status === filter);
  }), [entriesByPlayer, filter, query, roster]);
  const submittedIds = useMemo(() => new Set(attendance.records.map((record) => record.sessionId)), [attendance.records]);
  const sessionSubmitted = selectedSession ? submittedIds.has(selectedSession.id) : false;

  useEffect(() => { const routeKey = `${focusedSessionId ?? ''}:${requestedPlayerId ?? ''}`; if (routeKey === appliedRouteRef.current || !focusedSessionId || !requestedSessionValid || draft.hasUnsavedChanges) return; appliedRouteRef.current = routeKey; if (focusedSessionId !== draft.selectedSessionId) draft.selectSession(focusedSessionId); }, [draft, focusedSessionId, requestedPlayerId, requestedSessionValid]);
  useEffect(() => { if (requestedPlayerId) { setFilter('all'); setQuery(''); setEditingSubmitted(true); } }, [requestedPlayerId]);

  const save = useCallback(async (afterSave?: () => void) => {
    const record = await draft.saveDraft();
    if (!record) return;
    setEditingSubmitted(false);
    const summary = summarizeAttendance(record.entries);
    showSuccess(sessionSubmitted ? 'Attendance updated' : 'Attendance saved', `${summary.present} present · ${summary.absent} absent · ${summary.late} late · ${summary.notMarked} not marked`);
    setFilter('all'); setQuery(''); listRef.current?.scrollToOffset({ offset: 0, animated: true }); afterSave?.();
  }, [draft, sessionSubmitted, showSuccess]);
  const requestLeave = useCallback((proceed: () => void) => {
    if (!draft.hasUnsavedChanges) { proceed(); return; }
    leaveActionRef.current = proceed; setConfirmation('leave');
  }, [draft.hasUnsavedChanges]);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!draft.hasUnsavedChanges) return false;
      requestLeave(() => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); });
      return true;
    });
    return () => subscription.remove();
  }, [draft.hasUnsavedChanges, requestLeave, router]));

  const chooseSession = useCallback((sessionId: string) => {
    if (sessionId === draft.selectedSessionId) return;
    requestLeave(() => { draft.selectSession(sessionId); setFilter('all'); setQuery(''); setEditingSubmitted(false); });
  }, [draft, requestLeave]);
  const markAll = useCallback(() => {
    const replace = () => draft.markAllPresent();
    const hasMeaningfulMarks = draft.summary.absent > 0 || draft.summary.late > 0;
    if (hasMeaningfulMarks) setConfirmation('mark-all');
    else replace();
  }, [draft]);
  const reset = useCallback(() => setConfirmation('reset'), []);
  const attemptSave = useCallback(() => {
    if (draft.summary.notMarked > 0) {
      setConfirmation('incomplete');
    } else void save();
  }, [draft.summary.notMarked, save]);
  const setStatus = useCallback((playerId: string, status: AttendanceStatus) => { const current = entriesByPlayer.get(playerId)?.status; updateStatus(playerId, current === status ? 'not-marked' : status); }, [entriesByPlayer, updateStatus]);
  const openNote = useCallback((entry: PlayerAttendanceEntry, player: AcademyPlayer) => setNoteTarget({ entry, player }), []);
  const rosterEditable = !sessionSubmitted || editingSubmitted || draft.hasUnsavedChanges;
  const renderPlayer = useCallback(({ item }: { readonly item: AcademyPlayer }) => { const entry = entriesByPlayer.get(item.id); return entry ? <AttendanceRow player={item} entry={entry} focused={focusedPlayer?.id === item.id} disabled={!rosterEditable} onStatus={setStatus} onNote={openNote} /> : null; }, [entriesByPlayer, focusedPlayer?.id, openNote, rosterEditable, setStatus]);

  if (attendance.loadStatus === 'loading') return <SafeAreaView style={styles.safe} edges={['top']}><AttendanceRosterSkeleton /></SafeAreaView>;
  if (!requestedSessionValid) return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.state}><CoachPageHeader title="Attendance" subtitle="Mark today’s squad attendance" /><ContentState type="error" title="Session not found" message="This training session ID is invalid or no longer assigned." actionLabel="Open current session" onRetry={() => { draft.selectSession('training-1'); router.replace('/(coach)/(tabs)/attendance'); }} /></View></SafeAreaView>;
  if (!requestedPlayerValid) return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.state}><CoachPageHeader title="Attendance" subtitle="Mark today’s squad attendance" /><ContentState type="error" title="Player not found" message="This focused player ID is invalid or is not part of the academy roster." actionLabel="Open squad attendance" onRetry={() => router.replace({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: draft.selectedSessionId } })} /></View></SafeAreaView>;
  if (!selectedSession || !squad) return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.state}><CoachPageHeader title="Attendance" subtitle="Mark today’s squad attendance" /><ContentState type="empty" title="No assigned sessions" message="Assigned training sessions will appear here." /></View></SafeAreaView>;

  const header = <View><CoachPageHeader title="Attendance" subtitle="Mark today’s squad attendance" actionLabel="History" onAction={() => router.push('/(coach)/attendance/history')} /><View style={styles.headerSections}>{attendance.loadError ? <InlineInfoBanner tone="error" title="Unable to restore saved attendance" message="The current roster remains available." actionLabel="Retry" onAction={draft.retryLoad} /> : null}<AttendanceSessionSelector sessions={attendance.sessions} selectedId={selectedSession.id} submittedIds={submittedIds} onSelect={chooseSession} />{focusedPlayer ? <View style={styles.focused}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>PLAYER FOCUS</AppText><AppText variant="bodySmall" weight="bold">{focusedPlayer.name} · {focusedPlayer.playerId}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Highlighted below; the full {squad.name} roster remains available.</AppText></View> : null}<AttendanceSessionCard session={selectedSession} squadName={squad.name} submitted={sessionSubmitted} />{sessionSubmitted && !editingSubmitted && !draft.hasUnsavedChanges ? <InlineInfoBanner tone="info" title="Attendance has already been submitted" message="Choose Edit Attendance below if a correction is required." /> : null}<AttendanceSummaryBar summary={draft.summary} />{rosterEditable ? <AttendanceQuickActions onMarkAll={markAll} onReset={reset} /> : null}<AttendanceSearchAndFilter query={query} onQueryChange={setQuery} selected={filter} onSelect={setFilter} />{draft.saveError ? <ErrorState compact title="Unable to save attendance" message="Your selections are still available. Please retry." onRetry={attemptSave} retryLabel="Retry save" /> : null}<View style={styles.rosterTitle}><AppText variant="heading" weight="extraBold">Squad Roster</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{visiblePlayers.length} shown</AppText></View></View></View>;
  const empty = <ContentState type="empty" title="No players found" message={query ? `No players match “${query}” and this filter.` : 'No players match this attendance filter.'} />;
  const stickyStatus = draft.isSaving ? 'Saving attendance…' : draft.hasUnsavedChanges ? 'Unsaved changes' : sessionSubmitted ? editingSubmitted ? 'Editing submitted attendance' : 'Attendance submitted' : 'Attendance in progress';
  const stickyActionLabel = draft.isSaving ? 'Saving…' : draft.hasUnsavedChanges ? sessionSubmitted ? 'Update Attendance' : 'Save Attendance' : sessionSubmitted ? editingSubmitted ? 'Done' : 'Edit Attendance' : 'Save Attendance';
  const stickyAction = () => { if (sessionSubmitted && !draft.hasUnsavedChanges) { setEditingSubmitted((current) => !current); return; } attemptSave(); };
  const attendanceBottomClearance = coachTabBarMetrics.attendanceStickyActionHeight + coachTabBarMetrics.bottomInset + coachTabBarMetrics.stickyContentClearance;
  const closeConfirmation = () => { if (!draft.isSaving) { setConfirmation(null); leaveActionRef.current = null; } };
  const confirmLeave = () => { const proceed = leaveActionRef.current; draft.discardDraft(); setConfirmation(null); leaveActionRef.current = null; proceed?.(); };
  const saveBeforeLeave = () => { const proceed = leaveActionRef.current; setConfirmation(null); leaveActionRef.current = null; void save(proceed ?? undefined); };
  const incompleteDescription = `${draft.summary.notMarked} ${draft.summary.notMarked === 1 ? 'player is' : 'players are'} not marked. You can save now or continue marking.`;
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList ref={listRef} data={visiblePlayers} keyExtractor={(player) => player.id} renderItem={renderPlayer} ListHeaderComponent={header} ListEmptyComponent={empty} ItemSeparatorComponent={Separator} contentContainerStyle={[styles.content, { paddingBottom: attendanceBottomClearance }]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss} showsVerticalScrollIndicator={false} initialNumToRender={10} maxToRenderPerBatch={10} windowSize={7} /><StickyCoachAction status={stickyStatus} detail={`${draft.summary.marked} of ${draft.summary.total} marked`} actionLabel={stickyActionLabel} accessibilityLabel={`${stickyStatus}. ${draft.summary.marked} of ${draft.summary.total} marked. ${stickyActionLabel}`} disabled={draft.summary.total === 0} loading={draft.isSaving} bottom={coachTabBarMetrics.bottomInset} minHeight={coachTabBarMetrics.attendanceStickyActionHeight} onPress={stickyAction} testID="attendance-save" /><AttendanceNoteDialog visible={Boolean(noteTarget)} playerName={noteTarget?.player.name ?? ''} initialNote={noteTarget?.entry.note ?? ''} onCancel={() => setNoteTarget(null)} onSave={(note) => { if (noteTarget) draft.setNote(noteTarget.player.id, note); setNoteTarget(null); }} /><AppConfirmationDialog visible={confirmation === 'leave'} icon="content-save-alert-outline" title="Unsaved attendance" description="You have attendance changes that have not been saved." cancelLabel="Continue Editing" confirmLabel="Discard Changes" alternateLabel="Save Attendance" destructive loading={draft.isSaving} onCancel={closeConfirmation} onConfirm={confirmLeave} onAlternate={saveBeforeLeave} /><AppConfirmationDialog visible={confirmation === 'mark-all'} icon="account-check-outline" title="Mark everyone present?" description="This replaces existing Absent, Late, and Not Marked selections. You can still change individual players afterward." cancelLabel="Keep Current Marks" confirmLabel="Mark All Present" onCancel={closeConfirmation} onConfirm={() => { draft.markAllPresent(); setConfirmation(null); }} /><AppConfirmationDialog visible={confirmation === 'reset'} icon="restore" title="Reset attendance?" description="Every player will return to Not Marked. This change is not saved automatically." cancelLabel="Keep Attendance" confirmLabel="Reset Attendance" destructive onCancel={closeConfirmation} onConfirm={() => { draft.resetDraft(); setConfirmation(null); }} /><AppConfirmationDialog visible={confirmation === 'incomplete'} icon="account-question-outline" title="Incomplete attendance" description={incompleteDescription} cancelLabel="Continue Marking" confirmLabel="Save Anyway" loading={draft.isSaving} onCancel={closeConfirmation} onConfirm={() => { setConfirmation(null); void save(); }} /></SafeAreaView>;
}

function Separator() { return <View style={styles.separator} />; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral.background }, state: { paddingHorizontal: coachLayout.pageHorizontal, paddingTop: coachLayout.pageTop, gap: coachLayout.sectionGap }, content: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', paddingHorizontal: coachLayout.pageHorizontal }, headerSections: { gap: spacing.sm, paddingBottom: spacing.sm }, focused: { padding: coachLayout.cardPadding, borderWidth: 1, borderColor: colors.brand.blue, borderRadius: radius.standard, backgroundColor: colors.brand.blueSoft, gap: 3 }, rosterTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, separator: { height: coachLayout.cardGap } });
