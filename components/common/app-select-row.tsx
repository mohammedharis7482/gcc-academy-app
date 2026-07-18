import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function AppSelectRow({ label, value, supportingText, icon = 'tune-variant', error = false, disabled = false, onPress }: { readonly label: string; readonly value: string; readonly supportingText?: string; readonly icon?: keyof typeof MaterialCommunityIcons.glyphMap; readonly error?: boolean; readonly disabled?: boolean; readonly onPress: () => void }) {
  return <AnimatedPressable accessibilityRole="button" accessibilityLabel={`${label}. ${value}`} accessibilityHint={`Opens ${label.toLowerCase()} options`} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.row, error && styles.error, disabled && styles.disabled]}><View style={styles.icon}><MaterialCommunityIcons name={icon} size={20} color={colors.brand.blue} /></View><View style={styles.copy}><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>{label.toUpperCase()}</AppText><AppText variant="bodySmall" weight="extraBold">{value}</AppText>{supportingText ? <AppText variant="caption" color={colors.neutral.textMuted}>{supportingText}</AppText> : null}</View><MaterialCommunityIcons name="chevron-down" size={22} color={colors.brand.blue} /></AnimatedPressable>;
}

const styles = StyleSheet.create({
  row: { minHeight: layout.selectRowMinHeight, paddingHorizontal: layout.compactRowPaddingHorizontal, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.medium, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.compactIconSize, height: layout.compactIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 1 },
  error: { borderColor: colors.status.error },
  disabled: { opacity: 0.48 },
});
