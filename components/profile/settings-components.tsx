import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, spacing } from '@/design/tokens';

export function NotificationSettingRow({ label, description, value, onValueChange }: { label: string; description: string; value: boolean; onValueChange: () => void }) {
  return <View style={styles.row}><View style={styles.copy}><AppText variant="bodySmall" weight="bold">{label}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{description}</AppText></View><Switch accessibilityLabel={`${label} notifications`} accessibilityState={{ checked: value }} aria-checked={value} value={value} onValueChange={onValueChange} trackColor={{ false: colors.neutral.borderStrong, true: colors.brand.blue }} thumbColor={colors.neutral.white} ios_backgroundColor={colors.neutral.borderStrong} style={styles.switch} /></View>;
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral.divider },
  copy: { flex: 1, minWidth: 0 },
  switch: { minWidth: layout.minTouchTarget },
});
