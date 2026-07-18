import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, spacing } from '@/design/tokens';

export function UpdatesHeader({ unreadCount, onMarkAllRead }: { unreadCount: number; onMarkAllRead: () => void }) {
  return <View style={styles.header}><View style={styles.copy}><AppText variant="display" weight="extraBold">Updates</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Stay connected with your academy</AppText></View>{unreadCount > 0 && <AnimatedPressable testID="updates-mark-all-read" accessibilityRole="button" accessibilityLabel={`Mark all ${unreadCount} updates as read`} onPress={onMarkAllRead} style={styles.action}><AppText variant="bodySmall" weight="bold" color={colors.brand.blue} numberOfLines={1}>Mark all read</AppText></AnimatedPressable>}</View>;
}
const styles = StyleSheet.create({ header: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, copy: { flex: 1, minWidth: 0, gap: spacing.xs }, action: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.xs, justifyContent: 'center' } });
