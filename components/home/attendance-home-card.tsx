import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { PlayerAttendanceComputed } from '@/types/attendance';

export function AttendanceHomeCard({ summary, onPress }: { readonly summary: PlayerAttendanceComputed; readonly onPress: () => void }) {
  return <AnimatedPressable testID="home-view-attendance" accessibilityRole="button" accessibilityLabel={`View attendance, ${summary.percentage} percent, ${summary.present} present, ${summary.absent} absent, ${summary.late} late`} onPress={onPress} style={styles.card}><View style={styles.top}><View><AppText variant="display" weight="extraBold">{summary.percentage}<AppText variant="heading" weight="bold" color={colors.neutral.textSecondary}>%</AppText></AppText><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>THIS MONTH</AppText></View><View style={styles.counts}><Count label="Present" value={summary.present} color={colors.status.success} /><Count label="Absent" value={summary.absent} color={colors.status.error} /><Count label="Late" value={summary.late} color={colors.status.warning} /></View></View><ProgressBar progress={summary.percentage / 100} accessibilityLabel={`${summary.percentage} percent attendance`} /><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>View Attendance</AppText></AnimatedPressable>;
}
function Count({ label, value, color }: { readonly label: string; readonly value: number; readonly color: string }) { return <View style={styles.count}><AppText variant="heading" weight="extraBold" color={color}>{value}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText></View>; }
const styles = StyleSheet.create({ card: { ...shadows.card, padding: layout.cardPadding, gap: spacing.sm, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.large, backgroundColor: colors.neutral.surface }, top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, counts: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.xs }, count: { minWidth: 54, alignItems: 'center' } });
