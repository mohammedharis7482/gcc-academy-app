import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { colors, layout, radius, spacing } from '@/design/tokens';

export interface AdminFilterOption<T extends string> { readonly value: T; readonly label: string }

export function AdminSearch({ query, onChange, placeholder, accessibilityLabel, testID }: { readonly query: string; readonly onChange: (value: string) => void; readonly placeholder: string; readonly accessibilityLabel: string; readonly testID: string }) {
  return <AppTextInput testID={testID} accessibilityLabel={accessibilityLabel} value={query} onChangeText={onChange} placeholder={placeholder} autoCapitalize="none" autoCorrect={false} returnKeyType="search" leading={<MaterialCommunityIcons name="magnify" size={layout.iconSizeStandard} color={colors.neutral.textSecondary} />} trailing={query ? <AnimatedPressable testID={`${testID}-clear`} accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChange('')} style={styles.clear}><MaterialCommunityIcons name="close-circle" size={layout.iconSizeCompact} color={colors.neutral.textSecondary} /></AnimatedPressable> : null} />;
}

export function AdminFilterChips<T extends string>({ options, selected, onSelect, label, testIDPrefix }: { readonly options: readonly AdminFilterOption<T>[]; readonly selected: T; readonly onSelect: (value: T) => void; readonly label: string; readonly testIDPrefix: string }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" accessibilityLabel={label} contentContainerStyle={styles.chips}>{options.map((option) => { const active = option.value === selected; return <AnimatedPressable key={option.value} testID={`${testIDPrefix}-${option.value}`} accessibilityRole="tab" accessibilityLabel={`${label}: ${option.label}`} accessibilityState={{ selected: active }} onPress={() => onSelect(option.value)} style={[styles.chip, active && styles.chipSelected]}><AppText variant="bodySmall" weight="semibold" color={active ? colors.neutral.white : colors.neutral.textSecondary} numberOfLines={1}>{option.label}</AppText></AnimatedPressable>; })}</ScrollView>;
}

export function AdminFilterLabel({ label }: { readonly label: string }) {
  return <AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary} style={styles.filterLabel}>{label.toUpperCase()}</AppText>;
}

const styles = StyleSheet.create({
  clear: { width: layout.minTouchTarget, height: layout.minTouchTarget, marginRight: -spacing.md, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: spacing.xs, paddingRight: spacing.md },
  chip: { minHeight: layout.chipHeight, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: colors.brand.navy, borderColor: colors.brand.navy },
  filterLabel: { marginBottom: spacing.xs },
});
