import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function ProfileHeader({ title = 'Profile', subtitle = 'Your academy account' }: { title?: string; subtitle?: string }) {
  return <View style={styles.header}><AppText variant="display" weight="extraBold">{title}</AppText><AppText color={colors.neutral.textSecondary}>{subtitle}</AppText></View>;
}

export function SubpageHeader({ title, subtitle, onBack, backDisabled = false, actionLabel, actionAccessibilityLabel, onAction }: { title: string; subtitle?: string; onBack: () => void; backDisabled?: boolean; actionLabel?: string; actionAccessibilityLabel?: string; onAction?: () => void }) {
  return <View style={styles.subpageHeader}><AnimatedPressable accessibilityRole="button" accessibilityLabel="Go back" accessibilityState={{ disabled: backDisabled }} disabled={backDisabled} onPress={onBack} style={[styles.back, backDisabled && styles.disabled]}><MaterialCommunityIcons name="arrow-left" size={22} color={colors.brand.navy} /></AnimatedPressable><View style={styles.headerCopy}><AppText variant="title" weight="extraBold">{title}</AppText>{subtitle ? <AppText variant="bodySmall" color={colors.neutral.textSecondary}>{subtitle}</AppText> : null}</View>{actionLabel && onAction ? <AnimatedPressable accessibilityRole="button" accessibilityLabel={actionAccessibilityLabel ?? actionLabel} onPress={onAction} style={styles.headerAction}><AppText variant="caption" weight="extraBold" color={colors.brand.blue} numberOfLines={2}>{actionLabel}</AppText></AnimatedPressable> : null}</View>;
}

export function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return <View><AppText variant="heading" weight="bold" style={styles.sectionTitle}>{title}</AppText>{children}</View>;
}

export function SurfaceCard({ children, accessibilityLabel, compactRows = true }: { children: ReactNode; accessibilityLabel?: string; compactRows?: boolean }) {
  return <View accessible={Boolean(accessibilityLabel)} accessibilityLabel={accessibilityLabel} style={[styles.card, compactRows && styles.compactRows]}>{children}</View>;
}

export function ProfileMenuGroup({ title, children, divided = false }: { title: string; children: ReactNode; divided?: boolean }) {
  return <View style={[styles.menuGroup, divided && styles.menuGroupDivided]}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary} style={styles.menuGroupTitle}>{title.toUpperCase()}</AppText>{children}</View>;
}

export function ProfileMenuItem({ icon, label, supportingText, onPress, destructive = false, trailingText, testID }: { icon: IconName; label: string; supportingText?: string; onPress?: () => void; destructive?: boolean; trailingText?: string; testID?: string }) {
  const foreground = destructive ? colors.status.error : colors.brand.navy;
  const content = <><View style={[styles.menuIcon, destructive && styles.destructiveIcon]}><MaterialCommunityIcons name={icon} size={21} color={foreground} /></View><View style={styles.menuCopy}><AppText variant="bodySmall" weight="bold" color={destructive ? colors.status.error : colors.neutral.text}>{label}</AppText>{supportingText ? <AppText variant="caption" color={colors.neutral.textSecondary}>{supportingText}</AppText> : null}</View>{trailingText ? <AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>{trailingText}</AppText> : null}{onPress ? <View style={styles.trailing}><MaterialCommunityIcons name="chevron-right" size={21} color={colors.neutral.textMuted} /></View> : null}</>;
  if (!onPress) return <View accessibilityLabel={supportingText ? `${label}, ${supportingText}` : label} style={styles.menuItem}>{content}</View>;
  return <AnimatedPressable testID={testID} accessibilityRole="button" accessibilityLabel={supportingText ? `${label}, ${supportingText}` : label} onPress={onPress} style={styles.menuItem}>{content}</AnimatedPressable>;
}

export function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.infoRow}><View style={styles.rowIcon}><MaterialCommunityIcons name={icon} size={19} color={colors.brand.blue} /></View><View style={styles.rowCopy}><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText><AppText variant="bodySmall" weight="semibold">{value}</AppText></View></View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, gap: spacing.xs },
  subpageHeader: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerCopy: { flex: 1, minWidth: 0 },
  headerAction: { minHeight: layout.minTouchTarget, maxWidth: 108, paddingLeft: spacing.xs, alignItems: 'flex-end', justifyContent: 'center' },
  back: { width: layout.minTouchTarget, height: layout.minTouchTarget, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  sectionTitle: { marginBottom: layout.sectionHeaderToCard },
  card: { ...shadows.card, padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: layout.cardGap },
  compactRows: { gap: 0 },
  menuGroup: { paddingTop: spacing.xs },
  menuGroupDivided: { marginTop: spacing.xs, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.neutral.divider },
  menuGroupTitle: { marginBottom: spacing.xs },
  menuItem: { minHeight: layout.compactRowMinHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  menuIcon: { width: layout.menuIconSize, height: layout.menuIconSize, borderRadius: radius.small, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand.blueSoft },
  destructiveIcon: { backgroundColor: colors.status.errorSoft },
  menuCopy: { flex: 1, minWidth: 0 },
  trailing: { width: layout.minTouchTarget, minHeight: layout.minTouchTarget, alignItems: 'flex-end', justifyContent: 'center' },
  infoRow: { minHeight: layout.informationRowMinHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowIcon: { width: layout.menuIconSize, height: layout.menuIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, minWidth: 0 },
});
