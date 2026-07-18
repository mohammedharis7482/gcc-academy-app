import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';

export function LegalInfoSection({ title, children }: { title: string; children: string }) {
  return <View style={styles.section}><AppText variant="heading" weight="extraBold">{title}</AppText><AppText color={colors.neutral.textSecondary}>{children}</AppText></View>;
}

const styles = StyleSheet.create({ section: { padding: layout.cardPadding, borderRadius: radius.standard, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.xs } });
