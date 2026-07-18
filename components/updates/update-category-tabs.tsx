import { ScrollView, StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { UpdateCategory } from '@/types/updates';

export function UpdateCategoryTabs({ categories, selected, onSelect }: { categories: readonly UpdateCategory[]; selected: UpdateCategory; onSelect: (category: UpdateCategory) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} accessibilityRole="tablist">{categories.map((category) => { const active = category === selected; return <AnimatedPressable key={category} onPress={() => onSelect(category)} accessibilityRole="tab" accessibilityState={{ selected: active }} aria-selected={active} accessibilityLabel={`Show ${category.toLowerCase()} updates`} style={[styles.chip, active && styles.active]}><AppText variant="bodySmall" weight="semibold" color={active ? colors.neutral.white : colors.neutral.textSecondary} numberOfLines={1}>{category}</AppText></AnimatedPressable>; })}</ScrollView>;
}
const styles = StyleSheet.create({ row: { gap: spacing.xs, paddingRight: spacing.md }, chip: { minHeight: layout.chipHeight, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' }, active: { backgroundColor: colors.brand.navy, borderColor: colors.brand.navy } });
