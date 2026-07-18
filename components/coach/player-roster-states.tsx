import { StyleSheet, View } from 'react-native';

import { ChipSkeleton, PageHeaderSkeleton, PlayerRowSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function PlayerRosterSkeleton() {
  return <View accessible accessibilityLabel="Loading player roster" style={styles.wrap}><PageHeaderSkeleton /><View style={styles.search} /><View style={styles.chips}><ChipSkeleton width={64} /><ChipSkeleton width={64} /><ChipSkeleton width={64} /><ChipSkeleton width={64} /></View><SummaryCardSkeleton />{[0, 1, 2, 3].map((item) => <PlayerRowSkeleton key={item} />)}</View>;
}

const styles = StyleSheet.create({ wrap: { paddingHorizontal: layout.pageHorizontal, gap: spacing.sm }, search: { height: layout.minTouchTarget, borderRadius: radius.medium, backgroundColor: colors.neutral.border }, chips: { flexDirection: 'row', gap: spacing.xs } });
