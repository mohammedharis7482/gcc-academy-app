import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminFilterChips, AdminFilterLabel } from '@/components/admin/admin-filters';
import { SquadCollectionReport } from '@/components/admin/admin-finance';
import { MetricGrid } from '@/components/admin/admin-metrics';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { AdminBillingPeriod, adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { formatCurrency } from '@/utils/format';

const periodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));

export default function AdminReportsScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const [period, setPeriod] = useState<AdminBillingPeriod>(adminDemoConfig.billing.currentPeriod);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/settings'); };

  const summary = useMemo(() => admin.getCollectionSummary(period), [admin, period]);
  const reports = useMemo(() => admin.getSquadReports(period), [admin, period]);
  const enrolmentSplit = useMemo(() => [
    { label: 'Active', count: admin.overview.activeMembers, tone: colors.status.success },
    { label: 'Trial', count: admin.overview.trialMembers, tone: colors.status.info },
    { label: 'Paused', count: admin.overview.pausedMembers, tone: colors.status.warning },
  ], [admin.overview]);
  const totalSplit = enrolmentSplit.reduce((total, item) => total + item.count, 0);

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading academy reports" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Reports" onBack={back} /><ContentState type="error" title="Reports unavailable" message="Academy reporting data could not be loaded." onRetry={admin.retry} /></AppScreen>;

  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title="Reports" subtitle="Attendance, collection, and capacity" onBack={back} />
    <View style={styles.sections}>
      <View><AdminFilterLabel label="Billing period" /><AdminFilterChips options={periodOptions} selected={period} onSelect={setPeriod} label="Billing period" testIDPrefix="admin-report-period" /></View>
      <MetricGrid metrics={[
        { id: 'billed', icon: 'file-document-outline', label: 'Billed', value: formatCurrency(summary.billed), supporting: `${summary.paidCount + summary.pendingCount + summary.overdueCount} fee records` },
        { id: 'collected', icon: 'cash-check', label: 'Collected', value: formatCurrency(summary.collected), supporting: `${summary.collectionRate}% of billed`, tone: 'success' },
        { id: 'outstanding', icon: 'cash-clock', label: 'Outstanding', value: formatCurrency(summary.pending + summary.overdue), supporting: `${summary.pendingCount} pending · ${summary.overdueCount} overdue`, tone: 'warning' },
        { id: 'capacity', icon: 'account-group-outline', label: 'Capacity used', value: `${admin.overview.capacityUsedPercent}%`, supporting: `${admin.overview.totalMembers} enrolled members` },
      ]} />
      <ProfileSection title="Squad Performance"><SquadCollectionReport reports={reports} /></ProfileSection>
      <ProfileSection title="Enrolment Mix"><View style={styles.card}>{enrolmentSplit.map((item) => <View key={item.label} style={styles.splitRow}><View style={styles.splitTop}><AppText variant="bodySmall" weight="bold" style={styles.grow}>{item.label}</AppText><AppText variant="bodySmall" weight="extraBold" color={item.tone}>{item.count}</AppText></View><ProgressBar progress={totalSplit ? item.count / totalSplit : 0} color={item.tone} accessibilityLabel={`${item.label}: ${item.count} members`} /></View>)}</View></ProfileSection>
      <ProfileSection title="Squad Attendance"><View style={styles.card}>{reports.map((report) => <View key={report.squadId} style={styles.splitRow}><View style={styles.splitTop}><AppText variant="bodySmall" weight="bold" numberOfLines={1} style={styles.grow}>{report.squadName}</AppText><AppText variant="bodySmall" weight="extraBold" color={report.averageAttendance >= 85 ? colors.status.success : colors.status.warning}>{report.averageAttendance}%</AppText></View><ProgressBar progress={report.averageAttendance / 100} color={report.averageAttendance >= 85 ? colors.status.success : colors.status.warning} accessibilityLabel={`${report.squadName} attendance ${report.averageAttendance} percent`} /></View>)}</View></ProfileSection>
      <AppText variant="caption" color={colors.neutral.textMuted}>Reports are generated from the demo academy directory stored on this device.</AppText>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({
  sections: { gap: adminLayout.sectionGap }, grow: { flex: 1, minWidth: 0 },
  card: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  splitRow: { gap: 6 }, splitTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
