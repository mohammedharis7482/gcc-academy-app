import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { ContentState } from '@/components/states/content-state';
import { UpdateCategoryTabs } from '@/components/updates/update-category-tabs';
import { ImportantUpdateCard, UpdateSection } from '@/components/updates/update-list';
import { UpdatesHeader } from '@/components/updates/updates-header';
import { UpdatesEmptyState, UpdatesSkeleton } from '@/components/updates/updates-states';
import { useToast } from '@/components/states/success-toast';
import { useUpdates } from '@/contexts/updates-context';
import { updateCategories } from '@/data/updates';
import { layout } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';
import { UpdateCategory, UpdateDateGroup } from '@/types/updates';

const dateGroups: readonly UpdateDateGroup[] = ['Today', 'Yesterday', 'Earlier'];

export default function UpdatesScreen() {
  const router = useRouter();
  const { updates, status, unreadCount, isRead, markAllRead, retry } = useUpdates();
  const { showSuccess } = useToast();
  const navigateOnce = useSingleNavigation();
  const [selected, setSelected] = useState<UpdateCategory>('All');
  const openUpdate = (updateId: string) => navigateOnce(() => router.push({ pathname: '/updates/[updateId]', params: { updateId } }));
  const filtered = useMemo(() => updates.filter((update) => selected === 'All' || update.category === selected), [selected, updates]);
  const important = updates.find((update) => !isRead(update.id) && update.priority !== 'normal');

  const markEverythingRead = () => { markAllRead(); showSuccess('Updates marked as read', 'Your unread badge has been cleared.'); };
  return <AppScreen><UpdatesHeader unreadCount={unreadCount} onMarkAllRead={markEverythingRead} />{status === 'loading' ? <UpdatesSkeleton /> : status === 'error' ? <ContentState type="error" title="Unable to load updates" message="Academy communication could not be loaded." onRetry={retry} /> : <View style={styles.sections}>{important && <FadeInView translate={false}><ImportantUpdateCard update={important} onPress={() => openUpdate(important.id)} /></FadeInView>}<UpdateCategoryTabs categories={updateCategories} selected={selected} onSelect={setSelected} />{filtered.length ? <View style={styles.groups}>{dateGroups.map((group) => <UpdateSection key={group} title={group} updates={filtered.filter((update) => update.dateGroup === group)} isRead={isRead} onOpen={openUpdate} />)}</View> : <UpdatesEmptyState category={selected === 'All' ? undefined : selected} />}</View>}</AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: layout.cardGap }, groups: { gap: layout.sectionGap } });
