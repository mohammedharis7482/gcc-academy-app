import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { adminLayout } from '@/design/tokens/admin';
import { colors, layout, motion, radius, shadows, spacing } from '@/design/tokens';
import { AdminCollectionSummary, AdminOverview } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function AcademyPulseCard({ academyName, period, overview, onOpenApprovals }: { readonly academyName: string; readonly period: string; readonly overview: AdminOverview; readonly onOpenApprovals: () => void }) {
  return <View style={styles.hero}><LinearGradient colors={[colors.brand.navySoft, colors.brand.navy]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><View style={styles.heroContent}><View style={styles.heroTop}><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>ACADEMY SNAPSHOT</AppText><AppText variant="caption" weight="extraBold" color={colors.brand.gold}>{period.toUpperCase()}</AppText></View><AppText variant="title" weight="extraBold" color={colors.neutral.white} numberOfLines={2}>{academyName}</AppText><View style={styles.heroStats}><HeroStat label="Members" value={String(overview.totalMembers)} /><HeroStat label="Coaches" value={String(overview.totalCoaches)} /><HeroStat label="Squads" value={String(overview.totalSquads)} /><HeroStat label="Attendance" value={`${overview.averageAttendance}%`} /></View><View style={styles.capacity}><View style={styles.capacityCopy}><AppText variant="caption" color={colors.navyMutedText}>SQUAD CAPACITY USED</AppText><AppText variant="bodySmall" weight="extraBold" color={colors.neutral.white}>{overview.capacityUsedPercent}% of available places</AppText></View></View><ProgressBar progress={overview.capacityUsedPercent / 100} color={colors.brand.gold} accessibilityLabel={`Squad capacity used ${overview.capacityUsedPercent} percent`} trackStyle={styles.capacityTrack} /><AnimatedPressable testID="admin-open-approvals" accessibilityRole="button" accessibilityLabel={`Open approval queue, ${overview.pendingApprovals} pending`} onPress={onOpenApprovals} pressedScale={motion.scale.pressStrong} style={styles.approvalLink}><MaterialCommunityIcons name="clipboard-alert-outline" size={19} color={colors.brand.gold} /><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} style={styles.grow}>{overview.pendingApprovals ? `${overview.pendingApprovals} request${overview.pendingApprovals === 1 ? '' : 's'} need a decision` : 'No requests are waiting'}</AppText><MaterialCommunityIcons name="chevron-right" size={19} color={colors.neutral.white} /></AnimatedPressable></View></View>;
}

function HeroStat({ label, value }: { readonly label: string; readonly value: string }) {
  return <View accessibilityLabel={`${label}: ${value}`} style={styles.heroStat}><AppText variant="heading" weight="extraBold" color={colors.neutral.white}>{value}</AppText><AppText variant="caption" color={colors.navyMutedText} numberOfLines={1}>{label}</AppText></View>;
}

export function MetricGrid({ metrics }: { readonly metrics: readonly { readonly id: string; readonly icon: IconName; readonly label: string; readonly value: string; readonly supporting: string; readonly tone?: 'brand' | 'success' | 'warning' | 'error' }[] }) {
  return <View style={styles.grid}>{metrics.map((metric) => <MetricTile key={metric.id} {...metric} />)}</View>;
}

function MetricTile({ icon, label, value, supporting, tone = 'brand' }: { readonly icon: IconName; readonly label: string; readonly value: string; readonly supporting: string; readonly tone?: 'brand' | 'success' | 'warning' | 'error' }) {
  const accent = tone === 'success' ? colors.status.success : tone === 'warning' ? colors.status.warning : tone === 'error' ? colors.status.error : colors.brand.blue;
  const surface = tone === 'success' ? colors.status.successSoft : tone === 'warning' ? colors.status.warningSoft : tone === 'error' ? colors.status.errorSoft : colors.brand.blueSoft;
  return <View accessibilityLabel={`${label}: ${value}. ${supporting}`} style={styles.tile}><View style={styles.tileTop}><View style={[styles.tileIcon, { backgroundColor: surface }]}><MaterialCommunityIcons name={icon} size={19} color={accent} /></View><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary} numberOfLines={2} style={styles.grow}>{label}</AppText></View><AppText variant="title" weight="extraBold" numberOfLines={1}>{value}</AppText><AppText variant="caption" color={colors.neutral.textMuted} numberOfLines={2}>{supporting}</AppText></View>;
}

export function CollectionCard({ summary, actionLabel, onAction }: { readonly summary: AdminCollectionSummary; readonly actionLabel?: string; readonly onAction?: () => void }) {
  return <View style={styles.collection}><View style={styles.collectionTop}><View style={styles.grow}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>FEE COLLECTION · {summary.period.toUpperCase()}</AppText><AppText variant="display" weight="extraBold">{formatCurrency(summary.collected)}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Collected of {formatCurrency(summary.billed)} billed</AppText></View><View style={styles.rate}><AppText variant="heading" weight="extraBold" color={colors.status.success}>{summary.collectionRate}%</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Collected</AppText></View></View><ProgressBar progress={summary.collectionRate / 100} color={colors.status.success} accessibilityLabel={`Collection rate ${summary.collectionRate} percent`} /><View style={styles.breakdown}><Breakdown label="Paid" amount={summary.collected} count={summary.paidCount} tone={colors.status.success} /><Breakdown label="Pending" amount={summary.pending} count={summary.pendingCount} tone={colors.status.warning} /><Breakdown label="Overdue" amount={summary.overdue} count={summary.overdueCount} tone={colors.status.error} /></View>{actionLabel && onAction ? <AnimatedPressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={styles.collectionAction}><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>{actionLabel}</AppText><MaterialCommunityIcons name="chevron-right" size={19} color={colors.brand.blue} /></AnimatedPressable> : null}</View>;
}

function Breakdown({ label, amount, count, tone }: { readonly label: string; readonly amount: number; readonly count: number; readonly tone: string }) {
  return <View accessibilityLabel={`${label}: ${formatCurrency(amount)} across ${count} records`} style={styles.breakdownItem}><View style={[styles.dot, { backgroundColor: tone }]} /><View style={styles.grow}><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{label}</AppText><AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>{formatCurrency(amount)}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{count} records</AppText></View></View>;
}

const styles = StyleSheet.create({
  hero: { ...shadows.hero, minHeight: adminLayout.heroMinHeight, overflow: 'hidden', borderRadius: radius.hero, backgroundColor: colors.brand.navy },
  heroContent: { padding: adminLayout.largeCardPadding, gap: spacing.sm },
  heroTop: { minHeight: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  heroStat: { flexGrow: 1, minWidth: '22%', minHeight: 52, paddingHorizontal: spacing.xs, paddingVertical: 6, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, justifyContent: 'center' },
  capacity: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, capacityCopy: { flex: 1, minWidth: 0 }, capacityTrack: { backgroundColor: colors.heroMetadata },
  approvalLink: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.sm, borderRadius: radius.medium, borderWidth: 1, borderColor: colors.navyBorder, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  grow: { flex: 1, minWidth: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: adminLayout.metricGridGap },
  tile: { ...shadows.card, flexGrow: 1, flexBasis: '46%', minWidth: 148, minHeight: adminLayout.metricCardMinHeight, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, gap: 2 },
  tileTop: { minHeight: layout.compactIconSize, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tileIcon: { width: layout.compactIconSize, height: layout.compactIconSize, flexShrink: 0, borderRadius: radius.small, alignItems: 'center', justifyContent: 'center' },
  collection: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  collectionTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  rate: { alignItems: 'flex-end' },
  breakdown: { flexDirection: 'row', gap: spacing.xs },
  breakdownItem: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  dot: { width: 8, height: 8, marginTop: 5, borderRadius: radius.pill },
  collectionAction: { minHeight: layout.minTouchTarget, borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
