import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminShowMore } from '@/components/admin/admin-disclosure';
import { AdminFilterChips, AdminFilterLabel, AdminSearch } from '@/components/admin/admin-filters';
import { feeIncomeRowProps, IncomeRow, otherIncomeRowProps } from '@/components/admin/admin-finance';
import { MetricGrid } from '@/components/admin/admin-metrics';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { AdminBillingPeriod, adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';
import { spacing } from '@/design/tokens';
import { formatCurrency } from '@/utils/format';

type SourceFilter = 'all' | 'fees' | 'other';
const periodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));
const previewCount = 8;
const sourceOptions = [{ value: 'all' as const, label: 'All' }, { value: 'fees' as const, label: 'Player Fees' }, { value: 'other' as const, label: 'Other Income' }];

interface MoneyInRow { readonly key: string; readonly title: string; readonly subtitle: string; readonly note: string; readonly amount: number; readonly date: string; readonly icon: Parameters<typeof IncomeRow>[0]['icon'] }

export default function AdminMoneyInScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const navigateOnce = useSingleNavigation();
  const [period, setPeriod] = useState<AdminBillingPeriod>(adminDemoConfig.billing.currentPeriod);
  const [source, setSource] = useState<SourceFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');

  const summary = useMemo(() => admin.getMoneySummary(period), [admin, period]);
  const rows = useMemo<readonly MoneyInRow[]>(() => {
    const normalized = query.trim().toLowerCase();
    const fees = source === 'other' ? [] : admin.feeRecords.filter((record) => record.period === period && record.status === 'paid').map((record) => ({ key: record.id, ...feeIncomeRowProps(record) }));
    const others = source === 'fees' ? [] : admin.incomes.filter((income) => income.period === period).map((income) => ({ key: income.id, ...otherIncomeRowProps(income) }));
    return [...others, ...fees]
      .filter((row) => !normalized || row.title.toLowerCase().includes(normalized) || row.subtitle.toLowerCase().includes(normalized) || row.note.toLowerCase().includes(normalized))
      .sort((a, b) => b.amount - a.amount);
  }, [admin.feeRecords, admin.incomes, period, query, source]);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/finance'); };
  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading money in" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Money In" onBack={back} /><ContentState type="error" title="Money In unavailable" message="Academy income could not be loaded." onRetry={admin.retry} /></AppScreen>;

  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title="Money In" subtitle="Player fees and other academy income" onBack={back} actionLabel="Add income" actionAccessibilityLabel="Add other academy income" onAction={() => navigateOnce(() => router.push('/(admin)/finance/new-income'))} />
    <View style={styles.sections}>
      <View><AdminFilterLabel label="Period" /><AdminFilterChips options={periodOptions} selected={period} onSelect={(value) => { setPeriod(value); setShowAll(false); }} label="Period" testIDPrefix="admin-money-in-period" /></View>
      <MetricGrid metrics={[
        { id: 'in', icon: 'cash-plus', label: 'Money In', value: formatCurrency(summary.moneyIn), supporting: `${summary.incomeCount} records`, tone: 'success' },
        { id: 'fees', icon: 'account-cash-outline', label: 'Player fees', value: formatCurrency(summary.feeIncome), supporting: 'Fees collected this period' },
        { id: 'other', icon: 'hand-coin-outline', label: 'Other income', value: formatCurrency(summary.otherIncome), supporting: 'Camps, sponsorship, merchandise' },
        { id: 'net', icon: summary.net >= 0 ? 'trending-up' : 'trending-down', label: 'Net', value: `${summary.net < 0 ? '−' : ''}${formatCurrency(Math.abs(summary.net))}`, supporting: `Money Out ${formatCurrency(summary.moneyOut)}`, tone: summary.net >= 0 ? 'success' : 'error' },
      ]} />
      <View style={styles.controls}>
        <AdminSearch testID="admin-income-search" query={query} onChange={setQuery} placeholder="Search source, category or note" accessibilityLabel="Search money in by source, category, or note" />
        <View><AdminFilterLabel label="Source" /><AdminFilterChips options={sourceOptions} selected={source} onSelect={(value) => { setSource(value); setShowAll(false); }} label="Source" testIDPrefix="admin-money-in-source" /></View>
      </View>
      <ProfileSection title={`Records · ${rows.length}`}>{rows.length ? <View style={styles.list}>{(showAll ? rows : rows.slice(0, previewCount)).map((row) => <IncomeRow key={row.key} title={row.title} subtitle={row.subtitle} note={row.note} amount={row.amount} date={row.date} icon={row.icon} />)}<AdminShowMore testID="admin-money-in-show-all" expanded={showAll} hiddenCount={Math.max(0, rows.length - previewCount)} onToggle={() => setShowAll((value) => !value)} /></View> : <ContentState type="empty" icon="cash-plus" title="No money in" message="No income matches the selected filters." />}</ProfileSection>
      <AppButton testID="admin-money-in-add" label="Add Income" onPress={() => navigateOnce(() => router.push('/(admin)/finance/new-income'))} accessibilityLabel="Add other academy income" />
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, controls: { gap: spacing.sm }, list: { gap: adminLayout.cardGap } });
