import { StyleSheet, View } from 'react-native';

import { SkeletonPulse } from '@/components/common/skeleton-pulse';
import { ContentState } from '@/components/states/content-state';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function UpdatesSkeleton() {
  return <SkeletonPulse style={styles.list}><View accessibilityLabel="Loading academy updates">{[0, 1, 2].map((item) => <View key={item} style={[styles.row, item > 0 && styles.rowGap]}><View style={styles.icon} /><View style={styles.copy}><View style={styles.short} /><View style={styles.long} /><View style={styles.medium} /></View></View>)}</View></SkeletonPulse>;
}

export function UpdatesEmptyState({ category }: { category?: string }) {
  return <ContentState type="empty" title={category ? `No ${category} updates` : 'You’re all caught up'} message={category ? `There are no ${category.toLowerCase()} updates to show.` : 'New academy communication will appear here.'} />;
}

const styles = StyleSheet.create({ list: {}, row: { minHeight: 112, padding: layout.compactRowPadding, borderRadius: radius.compact, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, rowGap: { marginTop: layout.cardGap }, icon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.neutral.divider }, copy: { flex: 1, gap: spacing.sm }, short: { width: '32%', height: 10, borderRadius: radius.pill, backgroundColor: colors.neutral.divider }, long: { width: '92%', height: 18, borderRadius: radius.small, backgroundColor: colors.neutral.divider }, medium: { width: '68%', height: 12, borderRadius: radius.small, backgroundColor: colors.neutral.divider } });
