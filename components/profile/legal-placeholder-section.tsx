import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, radius, spacing } from '@/design/tokens';

export function LegalPlaceholderSection({ title, children }: { title: string; children: string }) {
  return <View style={styles.section}><AppText variant="heading" weight="extraBold">{title}</AppText><AppText color={colors.neutral.textSecondary}>{children}</AppText></View>;
}

const styles = StyleSheet.create({ section: { padding: spacing.md, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.xs } });
