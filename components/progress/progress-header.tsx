import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, spacing } from '@/design/tokens';

export function ProgressHeader({ playerName, updatedAt }: { playerName: string; updatedAt: string }) {
  return <View style={styles.header}><View style={styles.copy}><AppText variant="display" weight="extraBold">Progress</AppText><AppText color={colors.neutral.textSecondary}>A clear view of {playerName.split(' ')[0]}’s football development.</AppText><View style={styles.updated}><MaterialCommunityIcons name="refresh" size={14} color={colors.neutral.textMuted} /><AppText variant="caption" weight="medium" color={colors.neutral.textMuted}>{updatedAt}</AppText></View></View></View>;
}

const styles = StyleSheet.create({ header: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, copy: { flex: 1, minWidth: 0, gap: spacing.xs }, updated: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs } });
