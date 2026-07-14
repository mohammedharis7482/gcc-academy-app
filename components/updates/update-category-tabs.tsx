import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { UpdateCategory } from '@/types/updates';

export function UpdateCategoryTabs({ categories, selected, onSelect }: { categories: readonly UpdateCategory[]; selected: UpdateCategory; onSelect: (category: UpdateCategory) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} accessibilityRole="tablist">{categories.map((category) => { const active = category === selected; return <Pressable key={category} onPress={() => onSelect(category)} accessibilityRole="tab" accessibilityState={{ selected: active }} aria-selected={active} accessibilityLabel={`Show ${category.toLowerCase()} updates`} style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}><AppText variant="bodySmall" weight="semibold" color={active ? colors.neutral.white : colors.neutral.textSecondary} numberOfLines={1}>{category}</AppText></Pressable>; })}</ScrollView>;
}
const styles = StyleSheet.create({ row: { gap: spacing.xs, paddingRight: spacing.md }, chip: { minHeight: layout.buttonHeight, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, justifyContent: 'center' }, active: { backgroundColor: colors.brand.navy, borderColor: colors.brand.navy }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] } });
