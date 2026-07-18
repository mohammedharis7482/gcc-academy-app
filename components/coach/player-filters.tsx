import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { AgeCategory, AttendanceMark } from '@/types/academy';

export type RosterCategoryFilter = 'All' | AgeCategory;
export type RosterStatusFilter = 'all' | AttendanceMark;
const categories: readonly RosterCategoryFilter[] = ['All', 'U10', 'U13', 'U15'];
const statuses: readonly { value: RosterStatusFilter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }, { value: 'late', label: 'Late' }, { value: 'not-marked', label: 'Not Marked' }];

export function PlayerSearch({ query, onChange }: { readonly query: string; readonly onChange: (value: string) => void }) {
  return <AppTextInput testID="coach-player-search" accessibilityLabel="Search players by name, ID, jersey number, or position" value={query} onChangeText={onChange} placeholder="Search name, ID, jersey or position" autoCapitalize="none" autoCorrect={false} returnKeyType="search" leading={<MaterialCommunityIcons name="magnify" size={layout.iconSizeStandard} color={colors.neutral.textSecondary} />} trailing={query ? <AnimatedPressable testID="coach-player-search-clear" accessibilityRole="button" accessibilityLabel="Clear player search" onPress={() => onChange('')} style={styles.clear}><MaterialCommunityIcons name="close-circle" size={layout.iconSizeCompact} color={colors.neutral.textSecondary} /></AnimatedPressable> : null} />;
}

export function CategoryFilters({ selected, onSelect }: { readonly selected: RosterCategoryFilter; readonly onSelect: (category: RosterCategoryFilter) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} accessibilityRole="tablist">{categories.map((category) => <FilterChip key={category} testID={`coach-category-${category.toLowerCase()}`} label={category} selected={category === selected} onPress={() => onSelect(category)} />)}</ScrollView>;
}

export function StatusFilters({ selected, onSelect }: { readonly selected: RosterStatusFilter; readonly onSelect: (status: RosterStatusFilter) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} accessibilityRole="tablist">{statuses.map((status) => <FilterChip key={status.value} testID={`coach-status-${status.value}`} label={status.label} selected={status.value === selected} compact onPress={() => onSelect(status.value)} />)}</ScrollView>;
}

function FilterChip({ label, selected, onPress, compact = false, testID }: { readonly label: string; readonly selected: boolean; readonly onPress: () => void; readonly compact?: boolean; readonly testID: string }) {
  return <AnimatedPressable testID={testID} accessibilityRole="tab" accessibilityLabel={`${label} filter`} accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, compact && styles.compactChip, selected && styles.selectedChip]}><AppText variant="bodySmall" weight="semibold" color={selected ? colors.neutral.white : colors.neutral.textSecondary} numberOfLines={1}>{label}</AppText></AnimatedPressable>;
}

const styles = StyleSheet.create({
  clear: { width: layout.minTouchTarget, height: layout.minTouchTarget, marginRight: -spacing.md, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: spacing.xs, paddingRight: spacing.md }, chip: { minHeight: layout.chipHeight, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' }, compactChip: { paddingHorizontal: spacing.sm }, selectedChip: { backgroundColor: colors.brand.navy, borderColor: colors.brand.navy },
});
