import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { coachLayout, coachTabBarMetrics, colors, radius, shadows, spacing } from '@/design/tokens';

export function StickyCoachAction({ status, detail, actionLabel, accessibilityLabel, disabled = false, loading = false, bottom, minHeight = coachTabBarMetrics.stickyActionHeight, onPress, testID }: { readonly status: string; readonly detail?: string; readonly actionLabel: string; readonly accessibilityLabel: string; readonly disabled?: boolean; readonly loading?: boolean; readonly bottom: number; readonly minHeight?: number; readonly onPress: () => void; readonly testID: string }) {
  return <View style={[styles.container, { bottom, minHeight }]} accessibilityLiveRegion="polite"><View style={styles.copy}><AppText variant="caption" color={colors.neutral.textSecondary}>{status}</AppText>{detail ? <AppText variant="bodySmall" weight="extraBold" numberOfLines={1}>{detail}</AppText> : null}</View><AppButton testID={testID} label={actionLabel} onPress={onPress} disabled={disabled} loading={loading} accessibilityLabel={accessibilityLabel} style={styles.action} /></View>;
}

export const stickyCoachActionClearance = coachTabBarMetrics.stickyActionHeight + coachTabBarMetrics.stickyContentClearance;

const styles = StyleSheet.create({
  container: { ...shadows.floating, position: 'absolute', left: coachLayout.pageHorizontal, right: coachLayout.pageHorizontal, minHeight: coachTabBarMetrics.stickyActionHeight, paddingVertical: 10, paddingHorizontal: coachLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  copy: { flex: 1, minWidth: 0 },
  action: { minWidth: 140, maxWidth: 184, minHeight: 48, paddingHorizontal: spacing.sm },
});
