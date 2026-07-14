import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { ProgressSummary } from '@/types/player';

function ProgressLine({ progress, color }: { progress: number; color: string }) {
  return <ProgressBar progress={progress / 100} color={color} trackStyle={styles.track} accessibilityLabel={`${Math.round(progress)} percent`} />;
}

function Metric({ value, suffix, label, progress, color, showDivider }: { value: string; suffix: string; label: string; progress: number; color: string; showDivider?: boolean }) {
  return <View style={[styles.metric, showDivider && styles.divider]}><View style={styles.valueRow}><AppText variant="title" weight="extraBold" style={styles.value}>{value}</AppText><AppText variant="bodySmall" weight="bold" color={colors.neutral.textSecondary} style={styles.suffix}>{suffix}</AppText></View><ProgressLine progress={progress} color={color} /><AppText variant="bodySmall" weight="medium" color={colors.neutral.textSecondary} numberOfLines={1} style={styles.label}>{label}</AppText></View>;
}

export function ProgressSummaryCard({ progress }: { progress: ProgressSummary }) {
  return <View style={styles.card}><Metric value={`${progress.attendancePercent}`} suffix="%" label="Attendance" progress={progress.attendancePercent} color={colors.status.success} /><Metric showDivider value={progress.coachRating.toFixed(1)} suffix="/5" label="Coach rating" progress={progress.coachRating * 20} color={colors.brand.blue} /><Metric showDivider value={`+${progress.monthlyProgressPercent}`} suffix="%" label="This month" progress={progress.monthlyProgressPercent * 10} color={colors.status.success} /></View>;
}

const styles = StyleSheet.create({
  card: { ...shadows.card, flexDirection: 'row', backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.large, paddingVertical: layout.largeCardPadding, paddingHorizontal: spacing.xs },
  metric: { flex: 1, minWidth: 0, paddingHorizontal: spacing.xs, gap: spacing.xs },
  divider: { borderLeftWidth: 1, borderLeftColor: colors.neutral.divider },
  valueRow: { minHeight: 32, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 2 },
  value: { lineHeight: 30 },
  suffix: { lineHeight: 19 },
  label: { textAlign: 'center' },
  track: { width: '100%', height: 6, borderRadius: radius.pill, backgroundColor: colors.neutral.border, overflow: 'hidden' },
});
