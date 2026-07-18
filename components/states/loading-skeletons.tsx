import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { SkeletonPulse } from '@/components/common/skeleton-pulse';
import { colors, layout, radius, spacing } from '@/design/tokens';

function SkeletonBlock({ style }: { readonly style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.block, style]} />;
}

export function AvatarSkeleton({ size = 48 }: { readonly size?: number }) {
  return <SkeletonBlock style={{ width: size, height: size, borderRadius: radius.pill }} />;
}

export function ChipSkeleton({ width = 84 }: { readonly width?: number }) {
  return <SkeletonBlock style={{ width, height: 36, borderRadius: radius.pill }} />;
}

export function PageHeaderSkeleton() {
  return <SkeletonPulse><View style={styles.header} accessibilityLabel="Loading page header"><SkeletonBlock style={styles.pageTitle} /><SkeletonBlock style={styles.pageSubtitle} /></View></SkeletonPulse>;
}

export function HeroCardSkeleton({ height = 280 }: { readonly height?: number }) {
  return <SkeletonPulse><SkeletonBlock style={{ height, borderRadius: radius.hero }} /></SkeletonPulse>;
}

export function SummaryCardSkeleton() {
  return <SkeletonPulse><View style={styles.summary} accessibilityLabel="Loading summary"><View style={styles.summaryTop}><SkeletonBlock style={styles.summaryValue} /><SkeletonBlock style={styles.summaryBadge} /></View><SkeletonBlock style={styles.summaryLine} /><View style={styles.summaryMetrics}><SkeletonBlock style={styles.metric} /><SkeletonBlock style={styles.metric} /><SkeletonBlock style={styles.metric} /></View></View></SkeletonPulse>;
}

export function ListRowSkeleton({ avatar = false }: { readonly avatar?: boolean }) {
  return <SkeletonPulse><View style={styles.listRow} accessibilityLabel="Loading list item">{avatar ? <AvatarSkeleton size={layout.standardIconSize} /> : <SkeletonBlock style={styles.rowIcon} />}<View style={styles.copy}><SkeletonBlock style={styles.shortLine} /><SkeletonBlock style={styles.longLine} /><SkeletonBlock style={styles.mediumLine} /></View><SkeletonBlock style={styles.chevron} /></View></SkeletonPulse>;
}

export function LessonCardSkeleton() {
  return <SkeletonPulse><View style={styles.lesson} accessibilityLabel="Loading Session"><SkeletonBlock style={styles.lessonImage} /><View style={styles.copy}><SkeletonBlock style={styles.shortLine} /><SkeletonBlock style={styles.longLine} /><SkeletonBlock style={styles.mediumLine} /></View></View></SkeletonPulse>;
}

export function PlayerRowSkeleton() {
  return <SkeletonPulse><View style={styles.player} accessibilityLabel="Loading player"><AvatarSkeleton size={48} /><View style={styles.copy}><SkeletonBlock style={styles.longLine} /><SkeletonBlock style={styles.mediumLine} /><SkeletonBlock style={styles.shortLine} /></View><SkeletonBlock style={styles.playerStatus} /></View></SkeletonPulse>;
}

export function SkeletonList({ count = 3, variant = 'row' }: { readonly count?: number; readonly variant?: 'row' | 'lesson' | 'player' }) {
  return <View style={styles.list}>{Array.from({ length: count }, (_, index) => variant === 'lesson' ? <LessonCardSkeleton key={index} /> : variant === 'player' ? <PlayerRowSkeleton key={index} /> : <ListRowSkeleton key={index} />)}</View>;
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.neutral.border },
  header: { paddingTop: layout.pageTop, gap: spacing.xs },
  pageTitle: { width: '44%', height: 34, borderRadius: radius.small },
  pageSubtitle: { width: '68%', height: 16, borderRadius: radius.small },
  summary: { minHeight: 156, padding: layout.cardPadding, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, gap: spacing.sm },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryValue: { width: 92, height: 36, borderRadius: radius.small },
  summaryBadge: { width: 88, height: 28, borderRadius: radius.pill },
  summaryLine: { width: '100%', height: 10, borderRadius: radius.pill },
  summaryMetrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, height: 46, borderRadius: radius.small },
  list: { gap: layout.cardGap },
  listRow: { minHeight: 104, padding: layout.compactRowPaddingHorizontal, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowIcon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.small },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  shortLine: { width: '38%', height: 10, borderRadius: radius.pill },
  longLine: { width: '92%', height: 17, borderRadius: radius.small },
  mediumLine: { width: '66%', height: 12, borderRadius: radius.small },
  chevron: { width: 18, height: 18, borderRadius: radius.pill },
  lesson: { minHeight: 108, padding: spacing.sm, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, flexDirection: 'row', gap: spacing.sm },
  lessonImage: { width: 104, borderRadius: radius.medium },
  player: { minHeight: 122, padding: layout.compactRowPaddingHorizontal, borderRadius: radius.compact, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  playerStatus: { width: 78, height: 28, borderRadius: radius.pill },
});
