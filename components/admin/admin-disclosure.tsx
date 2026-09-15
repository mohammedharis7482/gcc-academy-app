import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { adminLayout } from '@/design/tokens/admin';
import { colors, layout, spacing } from '@/design/tokens';

/**
 * Caps a long list to a preview and reveals the rest in place, so a screen opens
 * short without putting any record out of reach.
 */
export function AdminShowMore({ expanded, hiddenCount, onToggle, testID, noun = 'records' }: { readonly expanded: boolean; readonly hiddenCount: number; readonly onToggle: () => void; readonly testID: string; readonly noun?: string }) {
  if (hiddenCount <= 0) return null;
  return <AppButton testID={testID} variant="ghost" label={expanded ? 'Show fewer' : `Show ${hiddenCount} more ${noun}`} onPress={onToggle} accessibilityLabel={expanded ? `Show fewer ${noun}` : `Show ${hiddenCount} more ${noun}`} />;
}

/**
 * A secondary section the screen does not need open to do its primary job.
 * Collapsed by default; the header stays a full-height touch target.
 */
export function AdminCollapsibleSection({ title, summary, expanded, onToggle, children, testID }: { readonly title: string; readonly summary?: string; readonly expanded: boolean; readonly onToggle: () => void; readonly children: ReactNode; readonly testID: string }) {
  return <View style={styles.wrap}>
    <AnimatedPressable testID={testID} accessibilityRole="button" accessibilityState={{ expanded }} accessibilityLabel={`${title}. ${expanded ? 'Collapse' : 'Expand'}`} onPress={onToggle} style={styles.header}>
      <View style={styles.copy}><AppText variant="heading" weight="bold" numberOfLines={1}>{title}</AppText>{summary && !expanded ? <AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{summary}</AppText> : null}</View>
      <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color={colors.brand.blue} />
    </AnimatedPressable>
    {expanded ? <View style={styles.body}>{children}</View> : null}
  </View>;
}

const styles = StyleSheet.create({
  wrap: { gap: adminLayout.sectionHeaderToCard },
  header: { minHeight: layout.minTouchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  copy: { flex: 1, minWidth: 0 },
  body: { gap: adminLayout.cardGap },
});
