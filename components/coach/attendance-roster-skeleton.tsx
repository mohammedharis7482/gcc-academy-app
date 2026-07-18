import { StyleSheet, View } from 'react-native';

import { PageHeaderSkeleton, PlayerRowSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function AttendanceRosterSkeleton() {
  return <View accessible accessibilityLabel="Loading attendance sessions and roster" style={styles.wrap}><PageHeaderSkeleton /><View style={styles.sessions} /><SummaryCardSkeleton /><View style={styles.search} />{[0, 1, 2].map((item) => <PlayerRowSkeleton key={item} />)}</View>;
}

const styles = StyleSheet.create({ wrap: { paddingHorizontal: layout.pageHorizontal, gap: spacing.sm }, sessions: { height: 104, borderRadius: radius.standard, backgroundColor: colors.neutral.border }, search: { height: layout.minTouchTarget, borderRadius: radius.medium, backgroundColor: colors.neutral.border } });
