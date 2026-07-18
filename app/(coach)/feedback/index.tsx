import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentPlayerSummary, CoachCommentField, compactImprovementOptions, compactStrengthOptions, GoalSelector, LessonRecommendations, PeriodSelector, SingleChoiceField, SkillRatings } from '@/components/coach/assessment-form';
import { StickyCoachAction, stickyCoachActionClearance } from '@/components/coach/sticky-coach-action';
import { CategoryFilters, PlayerSearch, RosterCategoryFilter } from '@/components/coach/player-filters';
import { PlayerListCard } from '@/components/coach/player-list-card';
import { PlayerRosterSkeleton } from '@/components/coach/player-roster-states';
import { AppButton } from '@/components/common/app-button';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState, ErrorState } from '@/components/states/content-state';
import { PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useToast } from '@/components/states/success-toast';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useAssessments } from '@/contexts/assessment-context';
import { getPlayerById, searchPlayers } from '@/data/academy';
import { coachAssessmentSkills, getRecommendedLessonIds } from '@/data/assessments';
import { coachLayout, colors, layout, spacing } from '@/design/tokens';
import { AcademyPlayer } from '@/types/academy';
import { AssessmentDraft, AssessmentMode, AssessmentSkillKey, SkillRatingValue } from '@/types/assessment';

function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }
function initialDraft(playerId: string): AssessmentDraft { return { playerId, mode: 'quick-feedback', periodLabel: 'Monthly Review', skillRatings: {}, strength: '', improvementArea: '', customStrength: '', customImprovement: '', comment: '', recommendedLessonIds: [] }; }
function draftError(draft: AssessmentDraft): string | undefined {
  const strength = draft.strength === 'Custom' ? draft.customStrength.trim() : draft.strength;
  const improvement = draft.improvementArea === 'Custom' ? draft.customImprovement.trim() : draft.improvementArea;
  if (!strength) return 'Select one player strength.';
  if (!improvement) return 'Select one improvement area.';
  if (!draft.comment.trim()) return 'Add a short coach comment.';
  if (draft.mode === 'full-assessment' && coachAssessmentSkills.some((skill) => !draft.skillRatings[skill.key])) return 'Rate all six skills before publishing.';
  return undefined;
}
type FeedbackConfirmation = 'discard' | 'change-player' | 'publish' | null;

export default function CoachFeedbackEntryScreen() {
  const params = useLocalSearchParams<{ playerId?: string | string[] }>(); const initialPlayerId = normalize(params.playerId);
  const initialPlayer = initialPlayerId ? getPlayerById(initialPlayerId) : undefined;
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(initialPlayer?.id ?? null);
  if (initialPlayerId && !initialPlayer) return <InvalidPlayer />;
  return selectedPlayerId ? <AssessmentForm playerId={selectedPlayerId} onChooseAnother={() => setSelectedPlayerId(null)} /> : <PlayerSelector onSelect={(player) => setSelectedPlayerId(player.id)} />;
}

function InvalidPlayer() { const router = useRouter(); return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Player not found" message="This player ID is missing or is not part of the academy roster." actionLabel="Choose a player" onRetry={() => router.replace('/(coach)/feedback')} /></AppScreen>; }

function PlayerSelector({ onSelect }: { readonly onSelect: (player: AcademyPlayer) => void }) {
  const data = useAcademyData(); const router = useRouter(); const insets = useSafeAreaInsets(); const [query, setQuery] = useState(''); const [category, setCategory] = useState<RosterCategoryFilter>('U13');
  const players = useMemo(() => searchPlayers(category === 'All' ? data.players : data.players.filter((player) => player.category === category), query), [category, data.players, query]);
  const recentIds = ['player-ayaan', 'player-u13-02', 'player-u13-06', 'player-u10-01'];
  const recent = recentIds.flatMap((id) => { const player = getPlayerById(id); return player ? [player] : []; });
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  const header = <View><SubpageHeader title="Add Feedback" subtitle="Select a player to begin" onBack={back} /><View style={styles.selectorControls}><View><AppText variant="heading" weight="extraBold">Recent Players</AppText><View style={styles.recent}>{recent.map((player) => <AppButton key={player.id} label={player.name} variant="secondary" onPress={() => onSelect(player)} style={styles.recentButton} accessibilityLabel={`Select ${player.name}`} />)}</View></View><PlayerSearch query={query} onChange={setQuery} /><View><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary} style={styles.filterLabel}>CATEGORY</AppText><CategoryFilters selected={category} onSelect={setCategory} /></View><AppText variant="heading" weight="extraBold">All Players</AppText></View></View>;
  if (data.rosterStatus === 'loading') return <SafeAreaView style={styles.safe} edges={['top']}><PlayerRosterSkeleton /></SafeAreaView>;
  if (data.rosterStatus === 'error') return <AppScreen><ContentState type="error" title="Players unavailable" message="The academy roster could not be loaded." onRetry={data.retryRoster} /></AppScreen>;
  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList data={players} keyExtractor={(item) => item.id} renderItem={({ item }) => <PlayerListCard player={item} onPress={onSelect} />} ListHeaderComponent={header} ListEmptyComponent={<ContentState type="empty" title="No players found" message="Try another name, ID, or category." />} ItemSeparatorComponent={Separator} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.selectorContent, { paddingBottom: insets.bottom + layout.tabClearance }]} /></SafeAreaView>;
}

function AssessmentForm({ playerId, onChooseAnother }: { readonly playerId: string; readonly onChooseAnother: () => void }) {
  const player = getPlayerById(playerId); const router = useRouter(); const navigation = useNavigation(); const assessments = useAssessments();
  const { showSuccess } = useToast();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(() => initialDraft(playerId)); const [dirty, setDirty] = useState(false); const [allowExit, setAllowExit] = useState(false); const [submitError, setSubmitError] = useState<string | null>(null); const [confirmation, setConfirmation] = useState<FeedbackConfirmation>(null); const pendingExitRef = useRef<(() => void) | null>(null);
  const previous = assessments.getLatestFullAssessment(playerId);
  const previousRatings = useMemo(() => previous ? Object.fromEntries(previous.skillRatings.map((item) => [item.skill, item.rating])) : undefined, [previous]);
  const improvement = draft.improvementArea === 'Custom' ? draft.customImprovement : draft.improvementArea;
  const lessonIds = getRecommendedLessonIds(improvement);
  const updateDraft = (change: Partial<AssessmentDraft>) => { setDraft((current) => ({ ...current, ...change })); setDirty(true); setSubmitError(null); };
  usePreventRemove(dirty && !allowExit, ({ data }) => {
    pendingExitRef.current = () => navigation.dispatch(data.action); setConfirmation('discard');
  });
  if (!player) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Player not found" message="This player is not part of the current academy roster." actionLabel="Choose a player" onRetry={onChooseAnother} /></AppScreen>;
  if (assessments.status === 'loading') return <AppScreen withTabBarClearance={false}><View style={styles.loading}><PageHeaderSkeleton /><SummaryCardSkeleton /><SummaryCardSkeleton /></View></AppScreen>;
  const navigateBack = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  const back = () => { if (dirty) { pendingExitRef.current = navigateBack; setConfirmation('discard'); } else navigateBack(); };
  const changePlayer = () => { if (!dirty) return onChooseAnother(); setConfirmation('change-player'); };
  const changeMode = (mode: AssessmentMode) => updateDraft({ mode });
  const setRating = (skill: AssessmentSkillKey, rating: SkillRatingValue) => updateDraft({ skillRatings: { ...draft.skillRatings, [skill]: rating } });
  const setAll = () => updateDraft({ skillRatings: Object.fromEntries(coachAssessmentSkills.map((skill) => [skill.key, 3])) });
  const copyPrevious = () => { if (previousRatings) updateDraft({ skillRatings: previousRatings }); };
  const toggleLesson = (lessonId: string) => updateDraft({ recommendedLessonIds: draft.recommendedLessonIds.includes(lessonId) ? draft.recommendedLessonIds.filter((id) => id !== lessonId) : [...draft.recommendedLessonIds, lessonId].slice(0, 2) });
  const publishFeedback = async () => {
    const publishDraft: AssessmentDraft = draft.mode === 'full-assessment' ? { ...draft, skillRatings: { discipline: draft.skillRatings.discipline ?? previousRatings?.discipline ?? 3, ...draft.skillRatings } } : draft;
    const result = await assessments.publish(publishDraft); if (!result.record) { setSubmitError(result.error ?? 'Please try again.'); return; }
    setSubmitError(null);
    setDirty(false); setAllowExit(true);
    const title = draft.mode === 'full-assessment' ? 'Assessment published' : 'Feedback saved';
    const successMessage = `${player.name} · Focus: ${result.record.improvementArea}`;
    showSuccess(title, result.error ? `${successMessage}. ${result.error}` : successMessage);
    router.replace({ pathname: '/(coach)/players/[playerId]', params: { playerId: player.id } });
  };
  const requestSave = () => { const validation = draftError(draft); if (validation) { setSubmitError(validation); void AccessibilityInfo.announceForAccessibility(validation); return; } if (draft.mode === 'full-assessment') setConfirmation('publish'); else void publishFeedback(); };
  const discardAndExit = () => { const action = pendingExitRef.current; pendingExitRef.current = null; setConfirmation(null); setAllowExit(true); setDirty(false); requestAnimationFrame(() => action?.()); };
  const selectImprovement = (value: string) => updateDraft({ improvementArea: value, customImprovement: value === 'Custom' ? draft.customImprovement : '', recommendedLessonIds: [] });
  const full = draft.mode === 'full-assessment';
  const actionLabel = assessments.isSaving ? 'Saving…' : full ? 'Publish Assessment' : 'Save Feedback';
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><AppScreen withTabBarClearance={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: stickyCoachActionClearance + insets.bottom }}><SubpageHeader title={full ? 'Full Assessment' : 'Quick Feedback'} subtitle="Fast, useful player development notes" onBack={back} actionLabel={full ? 'Quick Feedback' : 'Full Assessment'} actionAccessibilityLabel={full ? 'Switch to Quick Feedback' : 'Switch to Full Assessment'} onAction={() => changeMode(full ? 'quick-feedback' : 'full-assessment')} /><View style={styles.formSections}>{submitError ? <ErrorState compact title={draftError(draft) ? 'Complete required fields' : 'Unable to save assessment'} message={submitError} onRetry={draftError(draft) ? undefined : () => { void publishFeedback(); }} retryLabel="Retry save" /> : null}<AssessmentPlayerSummary player={player} onChange={changePlayer} />{full ? <><ProfileSection title="Assessment Period"><PeriodSelector value={draft.periodLabel} onChange={(periodLabel) => updateDraft({ periodLabel })} /></ProfileSection><ProfileSection title="Skill Ratings"><SkillRatings values={draft.skillRatings} previous={previousRatings} errorMessage={submitError === 'Rate all six skills before publishing.' ? submitError : undefined} onChange={setRating} onSetAll={setAll} onCopyPrevious={copyPrevious} /></ProfileSection></> : null}<ProfileSection title="Player Development"><View style={styles.fieldGroup}><SingleChoiceField title="Strength" values={compactStrengthOptions} errorMessage={submitError === 'Select one player strength.' ? submitError : undefined} selected={draft.strength} customValue={draft.customStrength} onSelect={(strength) => updateDraft({ strength, customStrength: strength === 'Custom' ? draft.customStrength : '' })} onCustomChange={(customStrength) => updateDraft({ customStrength })} /><SingleChoiceField title="Improvement area" values={compactImprovementOptions} errorMessage={submitError === 'Select one improvement area.' ? submitError : undefined} selected={draft.improvementArea} customValue={draft.customImprovement} onSelect={selectImprovement} onCustomChange={(customImprovement) => updateDraft({ customImprovement, recommendedLessonIds: [] })} /></View></ProfileSection><ProfileSection title="Coach Comment"><CoachCommentField value={draft.comment} errorMessage={submitError === 'Add a short coach comment.' ? submitError : undefined} onChange={(comment) => updateDraft({ comment })} /></ProfileSection>{full && improvement ? <ProfileSection title="Recommended Goal"><GoalSelector selected={draft.developmentGoal} improvementArea={improvement} onSelect={(developmentGoal) => updateDraft({ developmentGoal })} /></ProfileSection> : null}{improvement ? <ProfileSection title="Recommended Academy Sessions"><LessonRecommendations lessonIds={lessonIds} selectedIds={draft.recommendedLessonIds} onToggle={toggleLesson} /></ProfileSection> : null}</View></AppScreen><StickyCoachAction status={full ? 'Full assessment' : 'Quick feedback'} actionLabel={actionLabel} accessibilityLabel={actionLabel} loading={assessments.isSaving} bottom={insets.bottom} onPress={requestSave} testID="coach-assessment-save" /><AppConfirmationDialog visible={confirmation === 'discard'} icon="file-document-remove-outline" title="Discard unsaved feedback?" description="Your feedback changes have not been saved." cancelLabel="Continue Editing" confirmLabel="Discard Feedback" destructive onCancel={() => { setConfirmation(null); pendingExitRef.current = null; }} onConfirm={discardAndExit} /><AppConfirmationDialog visible={confirmation === 'change-player'} icon="account-switch-outline" title="Change selected player?" description="Current feedback changes will be discarded before choosing another player." cancelLabel="Keep Editing" confirmLabel="Discard and Change" destructive onCancel={() => setConfirmation(null)} onConfirm={() => { setConfirmation(null); setDirty(false); onChooseAnother(); }} /><AppConfirmationDialog visible={confirmation === 'publish'} icon="file-check-outline" title="Publish this assessment?" description={`${player.name} will see the new ratings, focus area, goal, and Session recommendations.`} cancelLabel="Review Assessment" confirmLabel="Publish Assessment" loading={assessments.isSaving} onCancel={() => setConfirmation(null)} onConfirm={() => { setConfirmation(null); void publishFeedback(); }} /></KeyboardAvoidingView>;
}

function Separator() { return <View style={styles.separator} />; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral.background }, flex: { flex: 1 }, selectorContent: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', paddingHorizontal: coachLayout.pageHorizontal }, selectorControls: { gap: spacing.sm, paddingBottom: spacing.sm }, recent: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs }, recentButton: { minHeight: 40, paddingHorizontal: spacing.sm }, filterLabel: { marginBottom: spacing.xs }, separator: { height: coachLayout.cardGap }, formSections: { gap: coachLayout.sectionGap }, fieldGroup: { gap: spacing.md }, loading: { gap: coachLayout.cardGap } });
