import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { AppText } from './app-text';
import { colors, layout, spacing } from '@/design/tokens';
import { AnimatedPressable } from './animated-pressable';

export function SectionHeader({ title, actionLabel, onAction, actionTestID }: { title: string; actionLabel?: string; onAction?: () => void; actionTestID?: string }) {
  const hasAction = Boolean(actionLabel && onAction);
  return <View style={[styles.row, hasAction && styles.actionRow]}><AppText variant="heading" weight="bold" style={styles.title}>{title}</AppText>{actionLabel && onAction ? <AnimatedPressable testID={actionTestID} accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={styles.action}><AppText variant="bodySmall" weight="bold" color={colors.brand.blue} numberOfLines={1}>{actionLabel}</AppText><MaterialCommunityIcons name="chevron-right" size={18} color={colors.brand.blue} /></AnimatedPressable> : null}</View>;
}
const styles = StyleSheet.create({ row: { marginBottom: layout.sectionHeaderToCard, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, actionRow: { minHeight: layout.minTouchTarget }, title: { flex: 1 }, action: { minHeight: layout.minTouchTarget, paddingLeft: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' } });
