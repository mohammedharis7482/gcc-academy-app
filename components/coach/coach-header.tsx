import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { colors, coachLayout, layout, radius, spacing } from '@/design/tokens';

export function CoachHeader({ name, roleTitle, squadName }: { readonly name: string; readonly roleTitle: string; readonly squadName: string }) {
  return <View accessibilityLabel={`Good evening, Coach ${name}, ${roleTitle}, ${squadName}`} style={styles.header}><View style={styles.copy}><AppText variant="caption" weight="bold" color={colors.brand.blue}>GOOD EVENING</AppText><AppText variant="display" weight="extraBold" numberOfLines={1}>Coach {name}</AppText><AppText variant="bodySmall" weight="semibold" color={colors.neutral.textSecondary} numberOfLines={1}>{roleTitle} · {squadName}</AppText></View><View style={styles.logo}><BrandLogo containerSize={layout.headerActionSize} /></View></View>;
}

export function CoachPageHeader({ title, subtitle, actionLabel, onAction }: { readonly title: string; readonly subtitle: string; readonly actionLabel?: string; readonly onAction?: () => void }) {
  return <View style={styles.pageHeader}><View style={styles.pageHeaderRow}><View style={styles.copy}><AppText variant="display" weight="extraBold">{title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>{subtitle}</AppText></View>{actionLabel && onAction ? <AnimatedPressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={styles.headerAction}><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>{actionLabel}</AppText></AnimatedPressable> : null}</View></View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  logo: { width: layout.headerActionSize, height: layout.headerActionSize, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  pageHeader: { paddingTop: coachLayout.pageTop, paddingBottom: coachLayout.headerToFirstSection },
  pageHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerAction: { minHeight: layout.minTouchTarget, maxWidth: 132, paddingHorizontal: spacing.xs, alignItems: 'flex-end', justifyContent: 'center' },
});
