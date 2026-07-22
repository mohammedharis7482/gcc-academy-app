import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachPageHeader } from '@/components/coach/coach-header';
import { OperationsChoiceChips, ScheduleCard } from '@/components/coach/operations-controls';
import { AppScreen } from '@/components/common/app-screen';
import { AppButton } from '@/components/common/app-button';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useToast } from '@/components/states/success-toast';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { coachLayout, coachTabBarMetrics } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

type ScheduleFilter = 'Upcoming' | 'History';

export default function CoachScheduleScreen() {
  const router = useRouter(); const operations = useAcademyOperations(); const { showSuccess } = useToast(); const [filter, setFilter] = useState<ScheduleFilter>('Upcoming'); const [cancelId, setCancelId] = useState<string | null>(null); const [actionError, setActionError] = useState<string>();
  const navigateOnce = useSingleNavigation();
  if (operations.status === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><View style={styles.loading}><PageHeaderSkeleton /><SummaryCardSkeleton /><SummaryCardSkeleton /></View></AppScreen>;
  const schedules = operations.schedules.filter((item) => filter === 'Upcoming' ? item.status === 'upcoming' : item.status !== 'upcoming').sort((a, b) => filter === 'Upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const confirmCancellation = async () => { if (!cancelId) return; const saved = await operations.cancelSchedule(cancelId); if (!saved) { setCancelId(null); setActionError('The schedule could not be cancelled. Try again.'); return; } setCancelId(null); setActionError(undefined); showSuccess('Schedule cancelled', 'Player Updates has been refreshed.'); };
  const notify = async (id: string) => { const saved = await operations.notifySchedule(id); if (!saved) { setActionError('Players could not be notified. Try again.'); return; } setActionError(undefined); showSuccess('Players notified', 'The schedule notice is now in Player Updates.'); };
  return <><AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Schedule" subtitle="Manage upcoming training" actionLabel="Add schedule" onAction={() => navigateOnce(() => router.push('/(coach)/schedule/new'))} /><View style={styles.sections}>{operations.storageWarning ? <InlineInfoBanner tone="warning" title="Schedule storage unavailable" message="Saved demo schedules remain visible on this screen." /> : null}{actionError ? <InlineInfoBanner tone="error" title="Schedule action unavailable" message={actionError} actionLabel="Dismiss" onAction={() => setActionError(undefined)} /> : null}<OperationsChoiceChips values={['Upcoming', 'History'] as const} selected={filter} onSelect={setFilter} label="Schedule view" />{schedules.length ? <View style={styles.list}>{schedules.map((schedule) => <ScheduleCard key={schedule.id} schedule={schedule} busy={operations.isSaving} onEdit={() => navigateOnce(() => router.push({ pathname: '/(coach)/schedule/[scheduleId]', params: { scheduleId: schedule.id } }))} onCancel={() => setCancelId(schedule.id)} onNotify={() => { void notify(schedule.id); }} onOpenPlan={schedule.id === 'training-1' ? () => navigateOnce(() => router.navigate('/(coach)/(tabs)/training')) : undefined} />)}</View> : <ContentState type="empty" icon="calendar-blank-outline" title={filter === 'Upcoming' ? 'No upcoming training' : 'No schedule history'} message={filter === 'Upcoming' ? 'A new schedule will appear when you publish it.' : 'Completed and cancelled schedules will appear here.'} actionLabel={filter === 'Upcoming' ? 'Add schedule' : undefined} onRetry={filter === 'Upcoming' ? () => navigateOnce(() => router.push('/(coach)/schedule/new')) : undefined} />}{filter === 'Upcoming' ? <AppButton label="Add Schedule" onPress={() => navigateOnce(() => router.push('/(coach)/schedule/new'))} accessibilityLabel="Create a training schedule" disabled={operations.isSaving} /> : null}</View></AppScreen><AppConfirmationDialog visible={Boolean(cancelId)} icon="calendar-remove-outline" title="Cancel this training schedule?" description="Players in the selected category will no longer see this session as upcoming." cancelLabel="Keep Schedule" confirmLabel="Cancel Schedule" destructive loading={operations.isSaving} onCancel={() => setCancelId(null)} onConfirm={() => { void confirmCancellation(); }} /></>;
}

const styles = StyleSheet.create({ sections: { gap: coachLayout.sectionGap }, list: { gap: coachLayout.cardGap }, loading: { gap: coachLayout.cardGap } });
