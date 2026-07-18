import { useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { CoachPageHeader } from '@/components/coach/coach-header';
import { StickyCoachAction } from '@/components/coach/sticky-coach-action';
import { CoachSessionNotes, FocusAreaChips, SessionPlanCard, TodaySessionCard, TrainingLessonSelector } from '@/components/coach/training-session-editor';
import { AppScreen } from '@/components/common/app-screen';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppText } from '@/components/common/app-text';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { ContentState, ErrorState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { HeroCardSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useToast } from '@/components/states/success-toast';
import { useAssessments } from '@/contexts/assessment-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { useTrainingPlans } from '@/contexts/training-plan-context';
import { getTrainingLessonChoices } from '@/data/coach-training';
import { coachLayout, coachTabBarMetrics, colors, spacing } from '@/design/tokens';
import { CoachTrainingPlan } from '@/types/training';

const sessionId = 'training-1';
type TrainingConfirmation = 'complete' | 'edit-completed' | null;

function planSignature(plan: CoachTrainingPlan | undefined | null) {
  if (!plan) return '';
  return JSON.stringify({ status: plan.status, focusAreaIds: plan.focusAreaIds, activities: plan.drills, assignedLessonIds: plan.assignedLessonIds, notes: plan.notes, completedAt: plan.completedAt });
}

export default function CoachTrainingScreen() {
  const { getPlan, isSaving, retry, savePlan, status, storageWarning } = useTrainingPlans();
  const attendance = useAttendanceData();
  const assessmentState = useAssessments();
  const { showSuccess } = useToast();
  const plan = getPlan(sessionId);
  const [draft, setDraft] = useState<CoachTrainingPlan | null>(plan ?? null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null); const [confirmation, setConfirmation] = useState<TrainingConfirmation>(null);

  useEffect(() => { if (plan) setDraft(plan); }, [plan]);

  const feedbackPending = useMemo(() => {
    const completedPlayerIds = new Set(assessmentState.records.filter((record) => record.source === 'coach-created').map((record) => record.playerId));
    return Math.max(0, 4 - completedPlayerIds.size);
  }, [assessmentState.records]);
  const hasChanges = planSignature(draft) !== planSignature(plan);
  const isEditable = draft?.status === 'in-progress';
  const lessonIds = useMemo(() => draft ? [...new Set([...draft.assignedLessonIds, ...getTrainingLessonChoices(draft.focusAreaIds)])] : [], [draft]);

  const updateDraft = (update: (current: CoachTrainingPlan) => CoachTrainingPlan) => setDraft((current) => current ? update(current) : current);
  const toggleDrill = (id: string) => updateDraft((current) => ({ ...current, drills: current.drills.map((drill) => drill.id === id ? { ...drill, completed: !drill.completed } : drill) }));
  const toggleFocus = (id: string) => updateDraft((current) => {
    if (current.focusAreaIds.includes(id)) return { ...current, focusAreaIds: current.focusAreaIds.filter((item) => item !== id) };
    if (current.focusAreaIds.length >= 3) {
      setInteractionMessage('Remove a focus area before choosing another one.');
      return current;
    }
    return { ...current, focusAreaIds: [...current.focusAreaIds, id] };
  });
  const toggleLesson = (id: string) => updateDraft((current) => {
    if (current.assignedLessonIds.includes(id)) return { ...current, assignedLessonIds: current.assignedLessonIds.filter((item) => item !== id) };
    if (current.assignedLessonIds.length >= 2) {
      setInteractionMessage('Remove a Session before assigning another one.');
      return current;
    }
    return { ...current, assignedLessonIds: [...current.assignedLessonIds, id] };
  });

  const persist = async (next: CoachTrainingPlan, successMessage?: string) => {
    if (isSaving) return false;
    const result = await savePlan(next);
    if (result.error || !result.plan) {
      setSaveError(result.error ?? 'The session could not be saved.');
      return false;
    }
    setSaveError(null);
    setDraft(result.plan);
    if (successMessage) showSuccess(successMessage, `${next.drills.filter((drill) => drill.completed).length} of ${next.drills.length} activities complete · ${next.assignedLessonIds.length} Sessions assigned`);
    return true;
  };
  const startSession = async () => {
    if (!draft) return;
    const started = { ...draft, status: 'in-progress' as const, completedAt: undefined };
    await persist(started, 'Session in progress');
  };
  const saveSession = async () => { if (draft) await persist(draft, 'Session saved'); };
  const completeSession = async () => {
    if (!draft) return;
    const completed = { ...draft, status: 'completed' as const, completedAt: new Date().toISOString() };
    await persist(completed, 'Training session completed');
  };
  const requestCompletion = () => setConfirmation('complete');
  const editCompletedSession = () => setConfirmation('edit-completed');

  if (status === 'loading' && !draft) {
    return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Session Plan" subtitle="Manage today’s training" /><View style={styles.loading}><HeroCardSkeleton height={180} /><SummaryCardSkeleton /></View></AppScreen>;
  }
  if (!draft) {
    return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Session Plan" subtitle="Manage today’s training" /><ContentState type="error" title="Session unavailable" message="Today’s assigned training session could not be restored." onRetry={retry} /></AppScreen>;
  }

  const completedDrills = draft.drills.filter((drill) => drill.completed).length;
  const stickyStatus = draft.status === 'completed' ? 'Session completed' : draft.status === 'upcoming' ? 'Upcoming session' : hasChanges ? 'Unsaved session changes' : 'Session in progress';
  const stickyDetail = draft.status === 'upcoming' ? 'Plan ready to begin' : `${completedDrills} of ${draft.drills.length} activities · ${draft.assignedLessonIds.length} Sessions`;
  const stickyActionLabel = isSaving ? 'Saving…' : draft.status === 'upcoming' ? 'Start Session' : draft.status === 'completed' ? 'Edit Session' : hasChanges ? 'Save Session' : 'Complete Session';
  const stickyAction = draft.status === 'upcoming' ? () => { void startSession(); } : draft.status === 'completed' ? editCompletedSession : hasChanges ? () => { void saveSession(); } : requestCompletion;
  const trainingBottomClearance = coachTabBarMetrics.stickyActionHeight + coachTabBarMetrics.bottomInset + coachTabBarMetrics.stickyContentClearance;

  return (
    <View style={styles.screen}>
      <AppScreen withTabBarClearance={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss} contentContainerStyle={{ paddingBottom: trainingBottomClearance }}>
<CoachPageHeader title="Session Plan" subtitle="Manage today’s training" />
        <View style={styles.sections}>
          {storageWarning ? <InlineInfoBanner tone="warning" title="Local storage is unavailable" message="Your draft stays on this screen until saving succeeds." /> : null}
          {interactionMessage ? <InlineInfoBanner tone="warning" title="Selection limit reached" message={interactionMessage} actionLabel="Dismiss" onAction={() => setInteractionMessage(null)} /> : null}
          {draft.status === 'completed' ? <InlineInfoBanner tone="success" title="Today’s session has been completed" message="The saved plan is visible on the Coach Dashboard and Player screens." /> : null}
          {saveError ? <ErrorState compact title="Unable to save the training session" message="Your draft remains on this screen." onRetry={() => { void persist(draft); }} retryLabel="Retry save" /> : null}
          <FadeInView translate={false}><TodaySessionCard plan={draft} /></FadeInView>
          <View><SectionHeader title="Session Plan" /><SessionPlanCard drills={draft.drills} disabled={!isEditable} onToggle={toggleDrill} /></View>
          <View><SectionHeader title="Focus Areas" /><FocusAreaChips selectedIds={draft.focusAreaIds} disabled={!isEditable} onToggle={toggleFocus} /></View>
          <View><SectionHeader title="Assigned Academy Sessions" /><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.supporting}>Choose up to two recommendations. Player Sessions updates after saving.</AppText>{lessonIds.length ? <TrainingLessonSelector lessonIds={lessonIds} selectedIds={draft.assignedLessonIds} disabled={!isEditable} onToggle={toggleLesson} /> : <ContentState type="empty" title="No matching Sessions" message="Choose a focus area to see Academy Session recommendations." />}</View>
          <View><SectionHeader title="Coach Note" /><CoachSessionNotes value={draft.notes} disabled={!isEditable} onChange={(notes) => updateDraft((current) => ({ ...current, notes }))} /></View>
        </View>
      </AppScreen>
      <StickyCoachAction status={stickyStatus} detail={stickyDetail} actionLabel={stickyActionLabel} accessibilityLabel={`${stickyStatus}. ${stickyDetail}. ${stickyActionLabel}`} loading={isSaving} bottom={coachTabBarMetrics.bottomInset} onPress={stickyAction} testID="coach-training-primary-action" />
      <AppConfirmationDialog visible={confirmation === 'complete'} icon="check-decagram-outline" title="Complete this training session?" description={`Attendance: ${attendance.getSessionRecord(sessionId) ? 'Completed' : 'Pending'} · Activities: ${completedDrills} of ${draft.drills.length} · Sessions: ${draft.assignedLessonIds.length} · Feedback: ${feedbackPending} pending`} cancelLabel="Continue Session" confirmLabel="Complete Session" loading={isSaving} onCancel={() => setConfirmation(null)} onConfirm={() => { setConfirmation(null); void completeSession(); }} />
      <AppConfirmationDialog visible={confirmation === 'edit-completed'} icon="pencil-outline" title="Edit completed session?" description="The session will return to In Progress until you save and complete it again." cancelLabel="Keep Completed" confirmLabel="Edit Session" onCancel={() => setConfirmation(null)} onConfirm={() => { updateDraft((current) => ({ ...current, status: 'in-progress', completedAt: undefined })); setConfirmation(null); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.neutral.background },
  sections: { gap: coachLayout.sectionGap },
  supporting: { marginTop: -spacing.xs, marginBottom: coachLayout.cardGap },
  loading: { gap: coachLayout.cardGap },
});
