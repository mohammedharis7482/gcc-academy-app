import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function AdminField({ title, supporting, children }: { readonly title: string; readonly supporting?: string; readonly children: ReactNode }) {
  return <View style={styles.field}><View><AppText variant="heading" weight="extraBold">{title}</AppText>{supporting ? <AppText variant="caption" color={colors.neutral.textSecondary}>{supporting}</AppText> : null}</View>{children}</View>;
}

export function AdminChoiceChips<T extends string>({ values, selected, onSelect, label, disabled = false }: { readonly values: readonly T[]; readonly selected: T; readonly onSelect: (value: T) => void; readonly label: string; readonly disabled?: boolean }) {
  return <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.chips}>{values.map((value) => { const active = selected === value; return <AnimatedPressable key={value} accessibilityRole="radio" accessibilityLabel={`${label}: ${value}`} accessibilityState={{ checked: active, selected: active, disabled }} disabled={disabled} onPress={() => onSelect(value)} style={[styles.chip, active && styles.chipSelected, disabled && styles.disabled]}><AppText variant="bodySmall" weight="bold" color={active ? colors.neutral.white : colors.neutral.textSecondary}>{value}</AppText></AnimatedPressable>; })}</View>;
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { minHeight: layout.chipHeight, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.pill, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { borderColor: colors.brand.navy, backgroundColor: colors.brand.navy },
  disabled: { opacity: 0.4 },
});
