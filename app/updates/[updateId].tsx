import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { ContentState } from '@/components/states/content-state';
import { UpdateDetailHeader, UpdateMessageCard, UpdateMetadataCard, UpdatePrimaryAction, UpdateSenderCard } from '@/components/updates/update-detail';
import { UpdatesSkeleton } from '@/components/updates/updates-states';
import { useUpdates } from '@/contexts/updates-context';
import { layout, spacing } from '@/design/tokens';
import { AcademyCommunicationUpdate } from '@/types/updates';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

function normalizeUpdateId(value: string | string[] | undefined) { const candidate = Array.isArray(value) ? value[0] : value; const normalized = candidate?.trim(); return normalized || undefined; }

export default function UpdateDetailScreen() {
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const params = useLocalSearchParams<{ updateId?: string | string[] }>();
  const { updates, status, markRead, retry } = useUpdates();
  const updateId = normalizeUpdateId(params.updateId);
  const update = updateId ? updates.find((item) => item.id === updateId) : undefined;
  useEffect(() => { if (update) markRead(update.id); }, [markRead, update]);
  const goBack = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/updates'); };
  if (status === 'loading') return <AppScreen withTabBarClearance={false}><View style={styles.loading}><UpdatesSkeleton /></View></AppScreen>;
  if (status === 'error') return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Update unavailable" message="This academy update could not be loaded." onRetry={retry} /></AppScreen>;
  if (!update) return <AppScreen withTabBarClearance={false}><ContentState type="error" title="Update not found" message="This update ID is invalid or no longer available." actionLabel="Back to Updates" onRetry={goBack} /></AppScreen>;
  const action = getUpdateAction(update, router);
  return <AppScreen><View style={styles.sections}><UpdateDetailHeader update={update} onBack={goBack} /><UpdateMessageCard update={update} /><UpdateMetadataCard metadata={update.metadata} /><UpdatePrimaryAction label={action?.label} onPress={action ? () => navigateOnce(action.onPress) : undefined} /><UpdateSenderCard update={update} /></View></AppScreen>;
}

function getUpdateAction(update: AcademyCommunicationUpdate, router: ReturnType<typeof useRouter>): { label: string; onPress: () => void } | undefined {
  if (update.actionType === 'schedule') return { label: update.actionLabel ?? 'View training schedule', onPress: () => router.push('/training/schedule') };
  if (update.actionType === 'progress' && update.targetId) {
    const assessmentId = update.targetId;
    return { label: update.actionLabel ?? 'View assessment', onPress: () => router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId } }) };
  }
  if (update.actionType === 'feedback' && update.targetId) {
    const feedbackId = update.targetId;
    return { label: update.actionLabel ?? 'View feedback', onPress: () => router.push({ pathname: '/progress/feedback/[feedbackId]', params: { feedbackId } }) };
  }
  if (update.actionType === 'session' && update.targetId) {
    const sessionId = update.targetId;
    return { label: update.actionLabel ?? 'Open Session', onPress: () => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId } }) };
  }
  if (update.actionType === 'fee-details') return { label: update.actionLabel ?? 'View payment details', onPress: () => router.push('/profile/fees') };
  return undefined;
}

const styles = StyleSheet.create({ sections: { paddingTop: spacing.sm, gap: layout.sectionGap }, loading: { paddingTop: spacing.xl } });
