import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { ChipSkeleton, HeroCardSkeleton, ListRowSkeleton, PageHeaderSkeleton, PlayerRowSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { adminLayout } from '@/design/tokens/admin';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function AdminDashboardSkeleton() {
  return <View accessible accessibilityLabel="Loading academy overview" style={styles.stack}><PageHeaderSkeleton /><HeroCardSkeleton height={adminLayout.heroMinHeight} /><SummaryCardSkeleton /><ListRowSkeleton /></View>;
}

export function AdminListSkeleton({ label, rows = 4 }: { readonly label: string; readonly rows?: number }) {
  return <View accessible accessibilityLabel={label} style={styles.list}><PageHeaderSkeleton /><View style={styles.search} /><View style={styles.chips}><ChipSkeleton width={64} /><ChipSkeleton width={64} /><ChipSkeleton width={64} /><ChipSkeleton width={64} /></View><SummaryCardSkeleton />{Array.from({ length: rows }, (_, index) => <PlayerRowSkeleton key={index} />)}</View>;
}

export function AdminDetailSkeleton({ label }: { readonly label: string }) {
  return <View accessible accessibilityLabel={label} style={styles.stack}><PageHeaderSkeleton /><HeroCardSkeleton height={168} /><SummaryCardSkeleton /><ListRowSkeleton /></View>;
}

const styles = StyleSheet.create({
  stack: { gap: adminLayout.cardGap },
  list: { paddingHorizontal: adminLayout.pageHorizontal, gap: spacing.sm },
  search: { height: layout.minTouchTarget, borderRadius: radius.medium, backgroundColor: colors.neutral.border },
  chips: { flexDirection: 'row', gap: spacing.xs },
});

export function AdminAuthLoadingScreen() {
  return <SafeAreaView style={authStyles.safe}><View style={authStyles.content}><BrandLogo containerSize={84} /><AppText variant="title" weight="extraBold">GCC Football Academy</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Restoring the admin account…</AppText><ActivityIndicator color={colors.brand.blue} accessibilityLabel="Loading admin account" /></View></SafeAreaView>;
}

const authStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
