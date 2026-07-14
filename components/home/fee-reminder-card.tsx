import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { FeeReminder } from '@/types/player';
import { formatCurrency } from '@/utils/format';

export function FeeReminderCard({ fee, onPress }: { fee: FeeReminder; onPress?: () => void }) {
  const overdue = fee.status === 'overdue';
  return <AnimatedPressable testID="home-fee-reminder" accessibilityRole="button" accessibilityLabel={`${fee.title}, ${formatCurrency(fee.amount)}, due ${fee.dueDate}`} onPress={onPress} style={[styles.card, overdue && styles.overdue]}><View style={[styles.icon, overdue && styles.overdueIcon]}><MaterialCommunityIcons name="receipt-text-outline" size={24} color={overdue ? colors.status.error : colors.status.warning} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="bold" numberOfLines={2} style={styles.title}>{fee.title}</AppText><View style={styles.feeMeta}><AppText variant="heading" weight="extraBold">{formatCurrency(fee.amount)}</AppText><View style={styles.dot} /><AppText variant="bodySmall" weight="medium" color={colors.neutral.textSecondary}>Due {fee.dueDate}</AppText></View></View><View style={styles.arrow}><MaterialCommunityIcons name="arrow-right" size={18} color={colors.brand.navy} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({
  card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.status.warningSoft, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: radius.large },
  overdue: { backgroundColor: colors.status.errorSoft, borderColor: colors.errorBorder },
  icon: { width: 44, height: 44, borderRadius: radius.medium, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' },
  overdueIcon: { backgroundColor: colors.status.errorSoft },
  copy: { flex: 1, minWidth: 0 },
  title: { flex: 1 },
  feeMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 3, height: 3, borderRadius: radius.pill, backgroundColor: colors.neutral.textMuted },
  arrow: { width: layout.minTouchTarget, height: layout.minTouchTarget, borderRadius: radius.pill, backgroundColor: colors.neutral.white, alignItems: 'center', justifyContent: 'center' },
});
