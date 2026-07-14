import { StyleSheet, View } from 'react-native';

import { SkeletonPulse } from '@/components/common/skeleton-pulse';
import { colors, radius, spacing } from '@/design/tokens';

export function ProfileSkeleton() {
  return <SkeletonPulse><View accessible accessibilityLabel="Loading profile" style={styles.wrap}><View style={styles.header} /><View style={styles.identity} /><View style={styles.section} /><View style={styles.card} /><View style={styles.section} /><View style={styles.card} /></View></SkeletonPulse>;
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.lg, gap: spacing.md },
  header: { width: '48%', height: 34, borderRadius: radius.small, backgroundColor: colors.neutral.border },
  identity: { height: 220, borderRadius: radius.hero, backgroundColor: colors.neutral.border },
  section: { width: '42%', height: 24, marginTop: spacing.sm, borderRadius: radius.small, backgroundColor: colors.neutral.border },
  card: { height: 156, borderRadius: radius.large, backgroundColor: colors.neutral.border },
});
