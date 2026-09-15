import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AdminHeader } from '@/components/admin/admin-header';
import { ActivityFeed, AdminQuickAction, ApprovalList } from '@/components/admin/admin-dashboard-lists';
import { AcademyPulseCard, CollectionCard, MetricGrid } from '@/components/admin/admin-metrics';
import { AdminDashboardSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { useAdminSession } from '@/contexts/admin-session-context';
import { adminLayout, adminTabBarMetrics } from '@/design/tokens/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

export default function AdminOverviewScreen() {
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const admin = useAdminData();
  const { session } = useAdminSession();
  const period = adminDemoConfig.billing.currentPeriod;

  if (admin.status === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><AdminDashboardSkeleton /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><AdminHeader name={session?.displayName ?? adminDemoConfig.admin.name} roleTitle={adminDemoConfig.admin.roleTitle} academyName={admin.directory.profile.shortName} /><ContentState type="error" title="Academy overview unavailable" message="The academy directory could not be loaded on this device." onRetry={admin.retry} /></AppScreen>;

  const summary = admin.getCollectionSummary(period);
  const pending = admin.approvals.filter((approval) => approval.state === 'pending');
  return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}>
    <FadeInView translate={false}><AdminHeader name={session?.displayName ?? adminDemoConfig.admin.name} roleTitle={adminDemoConfig.admin.roleTitle} academyName={admin.directory.profile.shortName} /></FadeInView>
    <View style={styles.sections}>
      {admin.storageWarning ? <InlineInfoBanner tone="warning" title="Admin storage unavailable" message="Saved academy changes remain visible for this session only." /> : null}
      <FadeInView delay={40}><AcademyPulseCard academyName={admin.directory.profile.name} period={period} overview={admin.overview} onOpenApprovals={() => navigateOnce(() => router.push('/(admin)/approvals'))} /></FadeInView>
      <MetricGrid metrics={[
        { id: 'active', icon: 'account-check-outline', label: 'Active members', value: String(admin.overview.activeMembers), supporting: `${admin.overview.trialMembers} on trial · ${admin.overview.pausedMembers} paused` },
        { id: 'coaches', icon: 'whistle-outline', label: 'Coaches available', value: `${admin.overview.availableCoaches}/${admin.overview.totalCoaches}`, supporting: 'Across all academy squads', tone: 'success' },
        { id: 'attendance', icon: 'calendar-check-outline', label: 'Average attendance', value: `${admin.overview.averageAttendance}%`, supporting: 'Rolling squad average', tone: 'success' },
        { id: 'approvals', icon: 'clipboard-alert-outline', label: 'Pending requests', value: String(admin.overview.pendingApprovals), supporting: 'Enrolments, transfers, concessions', tone: admin.overview.pendingApprovals ? 'warning' : 'brand' },
      ]} />
      <CollectionCard summary={summary} actionLabel="Open finance" onAction={() => navigateOnce(() => router.navigate('/(admin)/(tabs)/finance'))} />
      <View><SectionHeader title="Quick Actions" /><View style={styles.quickGrid}>
        <AdminQuickAction testID="admin-enrol-member" icon="account-plus-outline" label="Enrol Member" onPress={() => navigateOnce(() => router.push('/(admin)/members/new'))} />
        <AdminQuickAction testID="admin-add-coach" icon="whistle-outline" label="Add Coach" onPress={() => navigateOnce(() => router.push('/(admin)/coaches/new'))} />
        <AdminQuickAction testID="admin-post-announcement" icon="bullhorn-outline" label="Post Announcement" onPress={() => navigateOnce(() => router.push('/(admin)/announcements/new'))} />
        <AdminQuickAction testID="admin-manage-squads" icon="account-group-outline" label="Manage Squads" onPress={() => navigateOnce(() => router.push('/(admin)/squads'))} />
      </View></View>
      <View><SectionHeader title="Pending Approvals" actionLabel={pending.length ? 'View all' : undefined} onAction={pending.length ? () => navigateOnce(() => router.push('/(admin)/approvals')) : undefined} actionTestID="admin-view-approvals" /><ApprovalList approvals={pending.slice(0, 2)} onOpen={() => navigateOnce(() => router.push('/(admin)/approvals'))} /></View>
      <View><SectionHeader title="Recent Activity" /><ActivityFeed activity={admin.activity.slice(0, 5)} /></View>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: adminLayout.actionGridGap } });
