import { ScrollView, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { LearningCategory } from '@/types/learning';

export function LearningCategoryTabs({ categories, selected, onSelect }: { categories: readonly LearningCategory[]; selected: LearningCategory; onSelect: (category: LearningCategory) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} accessibilityRole="tablist">{categories.map((category) => { const active = selected === category; const slug = category.toLowerCase().replace(/\s+/g, '-'); return <Pressable testID={`learn-category-${slug}`} key={category} onPress={() => onSelect(category)} accessibilityRole="tab" accessibilityState={{ selected: active }} aria-selected={active} accessibilityLabel={`${category} lessons`} style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}><AppText variant="bodySmall" weight="semibold" color={active ? colors.neutral.white : colors.neutral.textSecondary} numberOfLines={1}>{category}</AppText></Pressable>; })}</ScrollView>;
}
const styles = StyleSheet.create({ row: { gap: spacing.xs, paddingRight: spacing.md }, chip: { minHeight: layout.buttonHeight, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' }, active: { backgroundColor: colors.brand.navy, borderColor: colors.brand.navy }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] } });
