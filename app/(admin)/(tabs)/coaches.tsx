import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminFilterChips, AdminFilterLabel, AdminSearch } from '@/components/admin/admin-filters';
import { AdminPageHeader } from '@/components/admin/admin-header';
import { CoachListCard, CoachWorkloadCard, coachSquadNames } from '@/components/admin/admin-coach-cards';
import { AdminListSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { SectionHeader } from '@/components/common/section-header';
import { ContentState } from '@/components/states/content-state';
import { searchAdminCoaches } from '@/data/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout, adminTabBarMetrics } from '@/design/tokens/admin';
import { spacing } from '@/design/tokens';
import { AdminCoach, CoachEngagement } from '@/types/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

type EngagementFilter = 'all' | CoachEngagement;
const engagementOptions = [{ value: 'all' as const, label: 'All' }, { value: 'Full-time' as const, label: 'Full-time' }, { value: 'Part-time' as const, label: 'Part-time' }, { value: 'Guest' as const, label: 'Guest' }];

export default function AdminCoachesScreen() {
  const admin = useAdminData();
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const [query, setQuery] = useState('');
  const [engagement, setEngagement] = useState<EngagementFilter>('all');

  const filteredCoaches = useMemo(() => {
    const searched = searchAdminCoaches(admin.coaches, query);
    return engagement === 'all' ? searched : searched.filter((coach) => coach.engagement === engagement);
  }, [admin.coaches, engagement, query]);

  if (admin.status === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics} scrollable={false}><AdminListSkeleton label="Loading academy coaches" rows={3} /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><AdminPageHeader title="Coaches" subtitle="Academy coaching staff" /><ContentState type="error" title="Coaches unavailable" message="The coaching directory could not be loaded." onRetry={admin.retry} /></AppScreen>;

  const openCoach = (coach: AdminCoach) => navigateOnce(() => router.push({ pathname: '/(admin)/coaches/[coachId]', params: { coachId: coach.id } }));
  const unassignedSquads = admin.squads.filter((squad) => !admin.coaches.some((coach) => coach.squadIds.includes(squad.id)));

  return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}>
    <AdminPageHeader title="Coaches" subtitle="Academy coaching staff and squad cover" actionLabel="Add coach" actionTestID="admin-coaches-add" onAction={() => navigateOnce(() => router.push('/(admin)/coaches/new'))} />
    <View style={styles.sections}>
      <CoachWorkloadCard coaches={admin.coaches} />
      {unassignedSquads.length ? <ContentState type="empty" compact icon="account-alert-outline" title="Squads without a coach" message={unassignedSquads.map((squad) => squad.name).join(', ')} /> : null}
      <View style={styles.controls}>
        <AdminSearch testID="admin-coach-search" query={query} onChange={setQuery} placeholder="Search name, role or certification" accessibilityLabel="Search coaches by name, role, or certification" />
        <View><AdminFilterLabel label="Engagement" /><AdminFilterChips options={engagementOptions} selected={engagement} onSelect={setEngagement} label="Engagement" testIDPrefix="admin-coach-engagement" /></View>
      </View>
      <View><SectionHeader title="Coaching Staff" />{filteredCoaches.length ? <View style={styles.list}>{filteredCoaches.map((coach) => <CoachListCard key={coach.id} coach={coach} squadSummary={coachSquadNames(coach, admin.squads)} onPress={openCoach} />)}</View> : <ContentState type="empty" icon="account-search-outline" title="No coaches found" message={query ? `No coaches match “${query}” with the selected filters.` : 'No coaches match the selected engagement type.'} />}</View>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, controls: { gap: spacing.sm }, list: { gap: adminLayout.cardGap } });
