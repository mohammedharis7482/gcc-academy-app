import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminFilterChips, AdminFilterLabel, AdminSearch } from '@/components/admin/admin-filters';
import { ExpenseBreakdownCard, ExpenseRow } from '@/components/admin/admin-finance';
import { MetricGrid } from '@/components/admin/admin-metrics';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { AdminBillingPeriod, adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { searchAdminExpenses } from '@/data/admin';
import { adminLayout } from '@/design/tokens/admin';
import { spacing } from '@/design/tokens';
import { ExpenseCategory } from '@/types/admin';
import { formatCurrency } from '@/utils/format';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

type CategoryFilter = 'all' | ExpenseCategory;
const periodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));
const categories: readonly ExpenseCategory[] = ['Coach Salary', 'Ground Rent', 'Equipment', 'Transportation', 'Tournament', 'Events', 'Marketing', 'Maintenance', 'Office', 'Other'];
const categoryOptions = [{ value: 'all' as const, label: 'All' }, ...categories.map((category) => ({ value: category, label: category }))];

export default function AdminMoneyOutScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const navigateOnce = useSingleNavigation();
  const [period, setPeriod] = useState<AdminBillingPeriod>(adminDemoConfig.billing.currentPeriod);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');

  const summary = useMemo(() => admin.getMoneySummary(period), [admin, period]);
  const breakdown = useMemo(() => admin.getExpenseBreakdown(period), [admin, period]);
  const expenses = useMemo(() => {
    const scoped = admin.expenses.filter((expense) => expense.period === period).filter((expense) => category === 'all' || expense.category === category);
    return [...searchAdminExpenses(scoped, query)].sort((a, b) => b.amount - a.amount);
  }, [admin.expenses, category, period, query]);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/finance'); };
  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading money out" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Money Out" onBack={back} /><ContentState type="error" title="Money Out unavailable" message="Academy spending could not be loaded." onRetry={admin.retry} /></AppScreen>;

  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title="Money Out" subtitle="Everything the academy spent" onBack={back} actionLabel="Add expense" actionAccessibilityLabel="Add an academy expense" onAction={() => navigateOnce(() => router.push('/(admin)/finance/new-expense'))} />
    <View style={styles.sections}>
      {admin.storageWarning ? <InlineInfoBanner tone="warning" title="Expense storage unavailable" message="Recorded expenses remain visible for this session only." /> : null}
      <View><AdminFilterLabel label="Period" /><AdminFilterChips options={periodOptions} selected={period} onSelect={setPeriod} label="Period" testIDPrefix="admin-money-out-period" /></View>
      <MetricGrid metrics={[
        { id: 'out', icon: 'cash-minus', label: 'Money Out', value: formatCurrency(summary.moneyOut), supporting: `${summary.expenseCount} records`, tone: 'error' },
        { id: 'top', icon: 'chart-donut', label: 'Largest category', value: breakdown[0]?.category ?? 'None', supporting: breakdown[0] ? `${formatCurrency(breakdown[0].amount)} · ${breakdown[0].share}%` : 'Nothing recorded yet' },
      ]} />
      <ProfileSection title="By Category"><ExpenseBreakdownCard breakdown={breakdown} /></ProfileSection>
      <View style={styles.controls}>
        <AdminSearch testID="admin-expense-search" query={query} onChange={setQuery} placeholder="Search paid to, category or note" accessibilityLabel="Search money out by who was paid, category, or note" />
        <View><AdminFilterLabel label="Category" /><AdminFilterChips options={categoryOptions} selected={category} onSelect={setCategory} label="Category" testIDPrefix="admin-expense-category" /></View>
      </View>
      <ProfileSection title={`Records · ${expenses.length}`}>{expenses.length ? <View style={styles.list}>{expenses.map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}</View> : <ContentState type="empty" icon="cash-minus" title="No money out" message={query || category !== 'all' ? 'No spending matches the selected filters.' : 'Nothing has been recorded for this period yet.'} />}</ProfileSection>
      <AppButton testID="admin-money-out-add" label="Add Expense" onPress={() => navigateOnce(() => router.push('/(admin)/finance/new-expense'))} accessibilityLabel="Add an academy expense" />
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, controls: { gap: spacing.sm }, list: { gap: adminLayout.cardGap } });
