import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { feeLabel, feeTone } from '@/components/admin/admin-member-cards';
import { adminLayout } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { AdminCoachSalary, AdminExpense, AdminExpenseBreakdownRow, AdminFeeRecord, AdminIncome, AdminMoneySummary, AdminSquadReport, ExpenseCategory } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

function FeeRowComponent({ record, onPress }: { readonly record: AdminFeeRecord; readonly onPress: (record: AdminFeeRecord) => void }) {
  return <AnimatedPressable testID={`admin-fee-${record.id}`} accessibilityRole="button" accessibilityLabel={`${record.memberName}, ${record.period}, ${formatCurrency(record.amount)}, ${feeLabel[record.status]}`} onPress={() => onPress(record)} style={styles.row}><View style={[styles.icon, { backgroundColor: record.status === 'paid' ? colors.status.successSoft : record.status === 'overdue' ? colors.status.errorSoft : colors.status.warningSoft }]}><MaterialCommunityIcons name={record.status === 'paid' ? 'cash-check' : 'cash-clock'} size={20} color={record.status === 'paid' ? colors.status.success : record.status === 'overdue' ? colors.status.error : colors.status.warning} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>{record.memberName}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{record.playerId} · {record.squadName}</AppText><AppText variant="caption" color={colors.neutral.textMuted} numberOfLines={1}>{record.status === 'paid' ? `Paid ${record.paidOn ?? ''}` : `Due ${record.dueDate}`}</AppText></View><View style={styles.end}><AppText variant="bodySmall" weight="extraBold">{formatCurrency(record.amount)}</AppText><StatusBadge label={feeLabel[record.status]} tone={feeTone[record.status]} /></View></AnimatedPressable>;
}

export const FeeRow = memo(FeeRowComponent);

export function SquadCollectionReport({ reports }: { readonly reports: readonly AdminSquadReport[] }) {
  return <View style={styles.card}>{reports.map((report, index) => <View key={report.squadId} style={[styles.report, index > 0 && styles.divided]}><View style={styles.reportTop}><AppText variant="bodySmall" weight="extraBold" numberOfLines={1} style={styles.grow}>{report.squadName}</AppText><AppText variant="bodySmall" weight="extraBold" color={report.collectionRate >= 80 ? colors.status.success : report.collectionRate >= 60 ? colors.status.warning : colors.status.error}>{report.collectionRate}%</AppText></View><ProgressBar progress={report.collectionRate / 100} color={report.collectionRate >= 80 ? colors.status.success : report.collectionRate >= 60 ? colors.status.warning : colors.status.error} accessibilityLabel={`${report.squadName} collection ${report.collectionRate} percent`} /><AppText variant="caption" color={colors.neutral.textSecondary}>{report.memberCount} of {report.capacity} places · {formatCurrency(report.outstandingAmount)} outstanding · {report.averageAttendance}% attendance</AppText></View>)}</View>;
}

export function FeeDetailCard({ record }: { readonly record: AdminFeeRecord }) {
  return <View style={styles.card}><View style={styles.detailTop}><View style={styles.grow}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>{record.period.toUpperCase()}</AppText><AppText variant="display" weight="extraBold">{formatCurrency(record.amount)}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{record.memberName} · {record.playerId}</AppText></View><StatusBadge label={feeLabel[record.status]} tone={feeTone[record.status]} /></View><View style={styles.detailRows}><DetailRow icon="account-group-outline" label="Squad" value={record.squadName} /><DetailRow icon="calendar-outline" label="Due date" value={record.dueDate} />{record.paidOn ? <DetailRow icon="calendar-check-outline" label="Paid on" value={record.paidOn} /> : null}{record.method ? <DetailRow icon="bank-outline" label="Method" value={record.method} /> : null}{record.reference ? <DetailRow icon="receipt" label="Reference" value={record.reference} /> : null}</View></View>;
}

function DetailRow({ icon, label, value }: { readonly icon: keyof typeof MaterialCommunityIcons.glyphMap; readonly label: string; readonly value: string }) {
  return <View style={styles.detailRow}><View style={styles.detailIcon}><MaterialCommunityIcons name={icon} size={18} color={colors.brand.blue} /></View><View style={styles.grow}><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText><AppText variant="bodySmall" weight="semibold">{value}</AppText></View></View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  row: { ...shadows.card, minHeight: 84, paddingHorizontal: adminLayout.compactRowPaddingHorizontal, paddingVertical: adminLayout.compactRowPaddingVertical, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: 40, height: 40, borderRadius: radius.small, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 1 }, end: { alignItems: 'flex-end', gap: 4 },
  card: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  report: { gap: 6 }, reportTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  divided: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.sm },
  detailTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, detailRows: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.xs },
  detailRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailIcon: { width: 36, height: 36, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },

  flowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  netBadge: { width: 44, height: 44, borderRadius: radius.medium, alignItems: 'center', justifyContent: 'center' },
  flowRow: { flexDirection: 'row', gap: spacing.xs },
  flowTile: { flex: 1, minWidth: 0, minHeight: 82, padding: spacing.sm, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, gap: 2 },
  flowIconRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flowSplit: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.xs },
  salary: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  salaryTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const expenseCategoryIcons: Readonly<Record<ExpenseCategory, IconName>> = {
  'Coach Salary': 'whistle-outline', 'Ground Rent': 'soccer-field', Equipment: 'soccer', Transportation: 'bus',
  Tournament: 'trophy-outline', Events: 'party-popper', Marketing: 'bullhorn-outline', Maintenance: 'wrench-outline',
  Office: 'printer-outline', Other: 'dots-horizontal-circle-outline',
};

/** Money In, Money Out, and Net for the selected period, in plain language. */
export function MoneyFlowCard({ summary, onMoneyIn, onMoneyOut }: { readonly summary: AdminMoneySummary; readonly onMoneyIn?: () => void; readonly onMoneyOut?: () => void }) {
  const positive = summary.net >= 0;
  return <View style={styles.card}>
    <View style={styles.flowTop}><View style={styles.grow}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>MONEY SUMMARY · {summary.period.toUpperCase()}</AppText><AppText variant="display" weight="extraBold" color={positive ? colors.status.success : colors.status.error}>{positive ? '' : '−'}{formatCurrency(Math.abs(summary.net))}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Net for this period</AppText></View><View style={[styles.netBadge, { backgroundColor: positive ? colors.status.successSoft : colors.status.errorSoft }]}><MaterialCommunityIcons name={positive ? 'trending-up' : 'trending-down'} size={22} color={positive ? colors.status.success : colors.status.error} /></View></View>
    <View style={styles.flowRow}>
      <FlowTile testID="admin-money-in-tile" icon="cash-plus" label="Money In" amount={summary.moneyIn} supporting={`${summary.incomeCount} records`} tone={colors.status.success} onPress={onMoneyIn} />
      <FlowTile testID="admin-money-out-tile" icon="cash-minus" label="Money Out" amount={summary.moneyOut} supporting={`${summary.expenseCount} records`} tone={colors.status.error} onPress={onMoneyOut} />
    </View>
    <View style={styles.flowSplit}><AppText variant="caption" color={colors.neutral.textSecondary}>Player fees {formatCurrency(summary.feeIncome)} · Other income {formatCurrency(summary.otherIncome)}</AppText></View>
  </View>;
}

function FlowTile({ icon, label, amount, supporting, tone, onPress, testID }: { readonly icon: IconName; readonly label: string; readonly amount: number; readonly supporting: string; readonly tone: string; readonly onPress?: () => void; readonly testID: string }) {
  const content = <><View style={styles.flowIconRow}><MaterialCommunityIcons name={icon} size={18} color={tone} /><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>{label}</AppText>{onPress ? <MaterialCommunityIcons name="chevron-right" size={18} color={colors.brand.blue} /> : null}</View><AppText variant="heading" weight="extraBold" numberOfLines={1}>{formatCurrency(amount)}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{supporting}</AppText></>;
  if (!onPress) return <View accessibilityLabel={`${label}: ${formatCurrency(amount)}, ${supporting}`} style={styles.flowTile}>{content}</View>;
  return <AnimatedPressable testID={testID} accessibilityRole="button" accessibilityLabel={`${label}: ${formatCurrency(amount)}, ${supporting}`} onPress={onPress} style={styles.flowTile}>{content}</AnimatedPressable>;
}

function ExpenseRowComponent({ expense, onPress }: { readonly expense: AdminExpense; readonly onPress?: (expense: AdminExpense) => void }) {
  const label = `${expense.category}, ${formatCurrency(expense.amount)} to ${expense.paidTo}, ${expense.date}`;
  const content = <><View style={[styles.icon, { backgroundColor: colors.status.errorSoft }]}><MaterialCommunityIcons name={expenseCategoryIcons[expense.category]} size={20} color={colors.status.error} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>{expense.paidTo}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{expense.category} · {expense.method}</AppText><AppText variant="caption" color={colors.neutral.textMuted} numberOfLines={1}>{expense.note || expense.date}</AppText></View><View style={styles.end}><AppText variant="bodySmall" weight="extraBold" color={colors.status.error}>−{formatCurrency(expense.amount)}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{expense.date}</AppText></View></>;
  if (!onPress) return <View accessibilityLabel={label} style={styles.row}>{content}</View>;
  return <AnimatedPressable testID={`admin-expense-${expense.id}`} accessibilityRole="button" accessibilityLabel={label} onPress={() => onPress(expense)} style={styles.row}>{content}</AnimatedPressable>;
}

export const ExpenseRow = memo(ExpenseRowComponent);

function IncomeRowComponent({ title, subtitle, note, amount, date, icon }: { readonly title: string; readonly subtitle: string; readonly note: string; readonly amount: number; readonly date: string; readonly icon: IconName }) {
  return <View accessibilityLabel={`${title}, ${formatCurrency(amount)}, ${date}`} style={styles.row}><View style={[styles.icon, { backgroundColor: colors.status.successSoft }]}><MaterialCommunityIcons name={icon} size={20} color={colors.status.success} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>{title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{subtitle}</AppText><AppText variant="caption" color={colors.neutral.textMuted} numberOfLines={1}>{note}</AppText></View><View style={styles.end}><AppText variant="bodySmall" weight="extraBold" color={colors.status.success}>+{formatCurrency(amount)}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{date}</AppText></View></View>;
}

export const IncomeRow = memo(IncomeRowComponent);

export function otherIncomeRowProps(income: AdminIncome) {
  return { title: income.receivedFrom, subtitle: `${income.category} · ${income.method}`, note: income.note || income.period, amount: income.amount, date: income.date, icon: 'cash-plus' as IconName };
}

export function feeIncomeRowProps(record: AdminFeeRecord) {
  return { title: record.memberName, subtitle: `Player Fee · ${record.method ?? 'Cash'}`, note: `${record.playerId} · ${record.squadName}`, amount: record.amount, date: record.paidOn ?? record.period, icon: 'account-cash-outline' as IconName };
}

export function ExpenseBreakdownCard({ breakdown }: { readonly breakdown: readonly AdminExpenseBreakdownRow[] }) {
  if (!breakdown.length) return <View style={styles.card}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>No money out recorded for this period.</AppText></View>;
  return <View style={styles.card}>{breakdown.map((row, index) => <View key={row.category} style={[styles.report, index > 0 && styles.divided]}><View style={styles.reportTop}><MaterialCommunityIcons name={expenseCategoryIcons[row.category]} size={17} color={colors.brand.blue} /><AppText variant="bodySmall" weight="extraBold" numberOfLines={1} style={styles.grow}>{row.category}</AppText><AppText variant="bodySmall" weight="extraBold">{formatCurrency(row.amount)}</AppText></View><ProgressBar progress={row.share / 100} color={colors.brand.navy} accessibilityLabel={`${row.category}: ${row.share} percent of money out`} /><AppText variant="caption" color={colors.neutral.textSecondary}>{row.share}% of money out · {row.count} {row.count === 1 ? 'record' : 'records'}</AppText></View>)}</View>;
}

export function CoachSalaryRow({ salary, busy = false, onPay }: { readonly salary: AdminCoachSalary; readonly busy?: boolean; readonly onPay: (salary: AdminCoachSalary) => void }) {
  const paid = salary.status === 'paid';
  return <View testID={`admin-salary-${salary.coachId}`} style={styles.salary}><View style={styles.salaryTop}><View style={[styles.icon, { backgroundColor: paid ? colors.status.successSoft : colors.status.warningSoft }]}><MaterialCommunityIcons name="whistle-outline" size={20} color={paid ? colors.status.success : colors.status.warning} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>Coach {salary.coachName}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{salary.roleTitle} · {salary.engagement}</AppText><AppText variant="caption" color={colors.neutral.textMuted} numberOfLines={1}>{paid ? `Paid ${salary.paidOn ?? ''} · ${salary.method ?? 'Cash'}` : `${salary.period} salary not paid`}</AppText></View><View style={styles.end}><AppText variant="bodySmall" weight="extraBold">{formatCurrency(salary.amount)}</AppText><StatusBadge label={paid ? 'Paid' : 'Pending'} tone={paid ? 'success' : 'warning'} /></View></View>{paid ? null : <AppButton testID={`admin-pay-salary-${salary.coachId}`} label={`Pay ${formatCurrency(salary.amount)}`} disabled={busy} onPress={() => onPay(salary)} accessibilityLabel={`Pay ${salary.period} salary for Coach ${salary.coachName}`} />}</View>;
}
