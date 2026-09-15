import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { feeLabel, feeTone } from '@/components/admin/admin-member-cards';
import { adminLayout } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { AdminFeeRecord, AdminSquadReport } from '@/types/admin';
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
});
