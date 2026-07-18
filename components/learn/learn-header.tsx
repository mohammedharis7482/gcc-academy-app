import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, spacing } from '@/design/tokens';

export function LearnHeader() {
  return <View style={styles.header}><View style={styles.copy}><AppText variant="display" weight="extraBold">Sessions</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Academy videos for your development</AppText></View></View>;
}
const styles = StyleSheet.create({ header: { paddingTop: layout.pageTop, paddingBottom: layout.headerToFirstSection, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, copy: { flex: 1, minWidth: 0, gap: spacing.xs } });
