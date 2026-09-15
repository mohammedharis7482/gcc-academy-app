import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminFilterChips, AdminFilterLabel } from '@/components/admin/admin-filters';
import { CoachSalaryRow } from '@/components/admin/admin-finance';
import { MetricGrid } from '@/components/admin/admin-metrics';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { AdminBillingPeriod, adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { AdminCoachSalary, PaymentMethod } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const periodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));
const methods = ['Cash', 'Bank Transfer', 'UPI'] as const satisfies readonly PaymentMethod[];

export default function AdminSalariesScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const payingRef = useRef(false);
  const [period, setPeriod] = useState<AdminBillingPeriod>(adminDemoConfig.billing.currentPeriod);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [methodSheet, setMethodSheet] = useState(false);
  const [pending, setPending] = useState<AdminCoachSalary | null>(null);
  const [error, setError] = useState<string>();

  const salaries = useMemo(() => admin.getCoachSalaries(period), [admin, period]);
  const totals = useMemo(() => {
    const paid = salaries.filter((salary) => salary.status === 'paid');
    const unpaid = salaries.filter((salary) => salary.status === 'pending');
    return {
      paidAmount: paid.reduce((total, salary) => total + salary.amount, 0),
      pendingAmount: unpaid.reduce((total, salary) => total + salary.amount, 0),
      paidCount: paid.length,
      pendingCount: unpaid.length,
    };
  }, [salaries]);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/finance'); };
  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading coach salaries" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Salaries" onBack={back} /><ContentState type="error" title="Salaries unavailable" message="Coach salary records could not be loaded." onRetry={admin.retry} /></AppScreen>;

  const confirmPay = async () => {
    if (!pending || payingRef.current) return;
    payingRef.current = true;
    try {
      const result = await admin.payCoachSalary({ coachId: pending.coachId, period, method, note: `${period} salary` });
      if (!result.value) { setPending(null); setError(result.error ?? 'The salary could not be paid.'); return; }
      setPending(null); setError(undefined);
      showSuccess('Salary paid', `${formatCurrency(result.value.amount)} to Coach ${pending.coachName}. Money Out updated.`);
    } finally { payingRef.current = false; }
  };

  return <>
    <AppScreen withTabBarClearance={false}>
      <SubpageHeader title="Coach Salaries" subtitle="Monthly salary status for every coach" onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.sections}>
        {admin.storageWarning ? <InlineInfoBanner tone="warning" title="Salary storage unavailable" message="Paid salaries remain visible for this session only." /> : null}
        {error ? <InlineInfoBanner tone="error" title="Salary not paid" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <InlineInfoBanner tone="info" title="Paying a salary records Money Out" message="Each payment is also saved as a Coach Salary expense, so Money Out and Net update together." />
        <View><AdminFilterLabel label="Period" /><AdminFilterChips options={periodOptions} selected={period} onSelect={setPeriod} label="Period" testIDPrefix="admin-salary-period" /></View>
        <MetricGrid metrics={[
          { id: 'pending', icon: 'cash-clock', label: 'Pending', value: formatCurrency(totals.pendingAmount), supporting: `${totals.pendingCount} ${totals.pendingCount === 1 ? 'coach' : 'coaches'} unpaid`, tone: totals.pendingCount ? 'warning' : 'success' },
          { id: 'paid', icon: 'cash-check', label: 'Paid', value: formatCurrency(totals.paidAmount), supporting: `${totals.paidCount} of ${salaries.length} coaches`, tone: 'success' },
        ]} />
        <AppSelectRow label="Payment method" value={method} supportingText="Used for the next salary you pay" icon="bank-outline" disabled={admin.isSaving} onPress={() => setMethodSheet(true)} />
        <ProfileSection title={`Coaches · ${salaries.length}`}>{salaries.length ? <View style={styles.list}>{salaries.map((salary) => <CoachSalaryRow key={salary.coachId} salary={salary} busy={admin.isSaving} onPay={setPending} />)}</View> : <ContentState type="empty" icon="whistle-outline" title="No coaches" message="Add a coach to track salary payments." />}</ProfileSection>
      </View>
    </AppScreen>
    <AppBottomSheet visible={methodSheet} title="Payment method" description="How is the salary being paid?" options={methods.map((value) => ({ id: value, label: value, icon: value === 'Cash' ? 'cash' as const : value === 'UPI' ? 'cellphone' as const : 'bank-outline' as const }))} selectedIds={[method]} loading={admin.isSaving} onClose={() => setMethodSheet(false)} onSelect={(id) => { const value = methods.find((item) => item === id); if (value) { setMethod(value); setMethodSheet(false); } }} />
    <AppConfirmationDialog visible={Boolean(pending)} icon="cash-minus" title={`Pay ${pending ? formatCurrency(pending.amount) : ''}?`} description={pending ? `${pending.period} salary for Coach ${pending.coachName}, paid by ${method}. This is also recorded as Money Out in the Coach Salary category.` : ''} cancelLabel="Cancel" confirmLabel="Pay Salary" confirmTestID="admin-confirm-pay-salary" loading={admin.isSaving} onCancel={() => setPending(null)} onConfirm={() => { void confirmPay(); }} />
  </>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, list: { gap: adminLayout.cardGap } });
