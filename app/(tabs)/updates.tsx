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
import { useUpdates } from '@/contexts/updates-context';
import { updateCategories } from '@/data/updates';
import { layout } from '@/design/tokens';
import { UpdateCategory, UpdateDateGroup } from '@/types/updates';

const dateGroups: readonly UpdateDateGroup[] = ['Today', 'Yesterday', 'Earlier'];

export default function UpdatesScreen() {
  const router = useRouter();
  const { updates, status, unreadCount, isRead, markAllRead, retry } = useUpdates();
  const [selected, setSelected] = useState<UpdateCategory>('All');
  const openUpdate = (updateId: string) => router.push({ pathname: '/updates/[updateId]', params: { updateId } });
  const filtered = useMemo(() => updates.filter((update) => selected === 'All' || update.category === selected), [selected, updates]);
  const important = updates.find((update) => !isRead(update.id) && update.priority !== 'normal');

  return <AppScreen><UpdatesHeader unreadCount={unreadCount} onMarkAllRead={markAllRead} />{status === 'loading' ? <UpdatesSkeleton /> : status === 'error' ? <ContentState type="error" title="Updates are unavailable" message="Academy communication could not be loaded." onRetry={retry} /> : <View style={styles.sections}>{important && <FadeInView translate={false}><ImportantUpdateCard update={important} onPress={() => openUpdate(important.id)} /></FadeInView>}<UpdateCategoryTabs categories={updateCategories} selected={selected} onSelect={setSelected} />{filtered.length ? <View style={styles.groups}>{dateGroups.map((group) => <UpdateSection key={group} title={group} updates={filtered.filter((update) => update.dateGroup === group)} isRead={isRead} onOpen={openUpdate} />)}</View> : <UpdatesEmptyState category={selected === 'All' ? undefined : selected} />}</View>}</AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: layout.cardGap }, groups: { gap: layout.sectionGap } });
