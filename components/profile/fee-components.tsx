import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { FeeRecord } from '@/types/profile';
import { formatCurrency } from '@/utils/format';
import { SurfaceCard } from './profile-shared';

export function CurrentFeeCard({ fee }: { fee: FeeRecord | null }) {
  if (!fee) return <SurfaceCard compactRows={false} accessibilityLabel="No pending academy payment"><View style={styles.empty}><View style={styles.success}><MaterialCommunityIcons name="check" size={25} color={colors.status.success} /></View><View style={styles.grow}><AppText variant="heading" weight="extraBold">No pending payment</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Academy payment records are currently up to date.</AppText></View></View></SurfaceCard>;
  return <View style={styles.current} accessibilityLabel={`${fee.period}, ${formatCurrency(fee.amount)}, ${fee.status}, due ${fee.dueDate}`}><View style={styles.currentTop}><View><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>PENDING AMOUNT</AppText><AppText variant="heading" weight="extraBold">{fee.period}</AppText></View><StatusBadge label={fee.status} tone={fee.status === 'overdue' ? 'error' : 'warning'} /></View><AppText variant="display" weight="extraBold" color={colors.brand.navy}>{formatCurrency(fee.amount)}</AppText><View style={styles.due}><MaterialCommunityIcons name="calendar-alert" size={18} color={colors.status.warning} /><AppText variant="bodySmall" weight="semibold">Due {fee.dueDate}</AppText></View></View>;
}

export function FeeHistoryItem({ fee }: { fee: FeeRecord }) {
  return <View style={styles.historyRow} accessibilityLabel={`${fee.period}, ${formatCurrency(fee.amount)}, paid ${fee.paidDate}`}><View style={styles.paidIcon}><MaterialCommunityIcons name="check" size={19} color={colors.status.success} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="bold">{fee.period}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Paid {fee.paidDate}</AppText>{fee.receiptNumber ? <AppText variant="caption" color={colors.neutral.textMuted}>Receipt {fee.receiptNumber}</AppText> : null}</View><View style={styles.amount}><AppText variant="bodySmall" weight="extraBold">{formatCurrency(fee.amount)}</AppText><AppText variant="caption" weight="bold" color={colors.status.success}>PAID</AppText></View></View>;
}

export function PaymentInstructions({ instructions }: { instructions: readonly string[] }) {
  return <SurfaceCard compactRows={false}>{instructions.map((instruction, index) => <View key={instruction} style={styles.instruction}><View style={styles.number}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>{index + 1}</AppText></View><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.grow}>{instruction}</AppText></View>)}</SurfaceCard>;
}

const styles = StyleSheet.create({
  current: { padding: layout.cardPadding, gap: spacing.sm, borderRadius: radius.large, borderWidth: 1, borderColor: colors.amberBorder, backgroundColor: colors.status.warningSoft },
  currentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  due: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  empty: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  success: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.status.successSoft, alignItems: 'center', justifyContent: 'center' },
  historyRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.neutral.divider },
  paidIcon: { width: layout.menuIconSize, height: layout.menuIconSize, borderRadius: radius.pill, backgroundColor: colors.status.successSoft, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1, minWidth: 0 },
  amount: { alignItems: 'flex-end' },
  instruction: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  number: { width: 28, height: 28, borderRadius: radius.pill, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
});
