import { View, StyleSheet } from 'react-native';

import { HeroCardSkeleton, PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { layout } from '@/design/tokens';

export function ProfileSkeleton() {
  return <View accessible accessibilityLabel="Loading profile" style={styles.wrap}><PageHeaderSkeleton /><HeroCardSkeleton height={220} /><SummaryCardSkeleton /><SummaryCardSkeleton /></View>;
}

const styles = StyleSheet.create({ wrap: { gap: layout.cardGap } });
