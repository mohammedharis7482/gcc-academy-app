import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminFilterChips, AdminFilterLabel, AdminSearch } from '@/components/admin/admin-filters';
import { AdminPageHeader } from '@/components/admin/admin-header';
import { FeeRow, MoneyFlowCard, SquadCollectionReport } from '@/components/admin/admin-finance';
import { AdminQuickAction } from '@/components/admin/admin-dashboard-lists';
import { CollectionCard } from '@/components/admin/admin-metrics';
import { AdminListSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { SectionHeader } from '@/components/common/section-header';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { adminDemoConfig, AdminBillingPeriod } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout, adminTabBarMetrics } from '@/design/tokens/admin';
import { spacing } from '@/design/tokens';
import { AdminFeeRecord, AdminFeeStatus } from '@/types/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

type FeeFilter = 'all' | AdminFeeStatus;
const periodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));
const statusOptions = [{ value: 'all' as const, label: 'All' }, { value: 'pending' as const, label: 'Pending' }, { value: 'overdue' as const, label: 'Overdue' }, { value: 'paid' as const, label: 'Paid' }];

export default function AdminFinanceScreen() {
  const admin = useAdminData();
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const [period, setPeriod] = useState<AdminBillingPeriod>(adminDemoConfig.billing.currentPeriod);
  const [status, setStatus] = useState<FeeFilter>('pending');
  const [query, setQuery] = useState('');

  const summary = useMemo(() => admin.getCollectionSummary(period), [admin, period]);
  const money = useMemo(() => admin.getMoneySummary(period), [admin, period]);
  const pendingSalaries = useMemo(() => admin.getCoachSalaries(period).filter((salary) => salary.status === 'pending').length, [admin, period]);
  const reports = useMemo(() => admin.getSquadReports(period), [admin, period]);
  const records = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return admin.feeRecords
      .filter((record) => record.period === period)
      .filter((record) => status === 'all' || record.status === status)
      .filter((record) => !normalized || record.memberName.toLowerCase().includes(normalized) || record.playerId.toLowerCase().includes(normalized) || record.squadName.toLowerCase().includes(normalized))
      .sort((a, b) => a.memberName.localeCompare(b.memberName));
  }, [admin.feeRecords, period, query, status]);

  if (admin.status === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics} scrollable={false}><AdminListSkeleton label="Loading academy finance" rows={3} /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><AdminPageHeader title="Finance" subtitle="Academy fee collection" /><ContentState type="error" title="Finance unavailable" message="Academy fee records could not be loaded." onRetry={admin.retry} /></AppScreen>;

  const openRecord = (record: AdminFeeRecord) => navigateOnce(() => router.push({ pathname: '/(admin)/finance/[feeId]', params: { feeId: record.id } }));
  return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}>
    <AdminPageHeader title="Finance" subtitle="Fee collection across every squad" actionLabel="Reports" actionTestID="admin-finance-reports" onAction={() => navigateOnce(() => router.push('/(admin)/reports'))} />
    <View style={styles.sections}>
      {admin.storageWarning ? <InlineInfoBanner tone="warning" title="Payment storage unavailable" message="Recorded payments remain visible for this session only." /> : null}
      <View><AdminFilterLabel label="Billing period" /><AdminFilterChips options={periodOptions} selected={period} onSelect={setPeriod} label="Billing period" testIDPrefix="admin-finance-period" /></View>
      <MoneyFlowCard summary={money} onMoneyIn={() => navigateOnce(() => router.push('/(admin)/finance/money-in'))} onMoneyOut={() => navigateOnce(() => router.push('/(admin)/finance/money-out'))} />
      <View style={styles.quickGrid}>
        <AdminQuickAction testID="admin-finance-add-expense" icon="cash-minus" label="Add Expense" onPress={() => navigateOnce(() => router.push('/(admin)/finance/new-expense'))} />
        <AdminQuickAction testID="admin-finance-add-income" icon="cash-plus" label="Add Income" onPress={() => navigateOnce(() => router.push('/(admin)/finance/new-income'))} /><AdminQuickAction testID="admin-finance-salaries" icon="whistle-outline" label={pendingSalaries ? `Coach Salaries · ${pendingSalaries}` : 'Coach Salaries'} onPress={() => navigateOnce(() => router.push('/(admin)/finance/salaries'))} />
      </View>
      <CollectionCard summary={summary} />
      <View><SectionHeader title="Squad Collection" /><SquadCollectionReport reports={reports} /></View>
      <View style={styles.controls}>
        <AdminSearch testID="admin-fee-search" query={query} onChange={setQuery} placeholder="Search member, ID or squad" accessibilityLabel="Search fee records by member, ID, or squad" />
        <View><AdminFilterLabel label="Fee status" /><AdminFilterChips options={statusOptions} selected={status} onSelect={setStatus} label="Fee status" testIDPrefix="admin-fee-status" /></View>
      </View>
      <View><SectionHeader title={`Fee Records · ${records.length}`} />{records.length ? <View style={styles.list}>{records.map((record) => <FeeRow key={record.id} record={record} onPress={openRecord} />)}</View> : <ContentState type="empty" icon="cash-check" title="No fee records" message={status === 'pending' ? 'Every fee for this period has been collected.' : 'No fee records match the selected filters.'} />}</View>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, controls: { gap: spacing.sm }, list: { gap: adminLayout.cardGap }, quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: adminLayout.actionGridGap } });
