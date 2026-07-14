import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { AcademyUpdate } from '@/types/player';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';

export function AcademyUpdateCard({ update, onPress }: { update: AcademyUpdate; onPress?: () => void }) {
  return <AnimatedPressable testID="home-latest-update" onPress={onPress} accessibilityRole="button" accessibilityLabel={`Academy update: ${update.title}`} style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="calendar-clock-outline" size={22} color={colors.brand.blue} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="bold" numberOfLines={2}>{update.title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary} numberOfLines={2}>{update.summary}</AppText><AppText variant="caption" weight="semibold" color={colors.brand.blue}>{update.publishedAt}</AppText></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={20} color={colors.neutral.textSecondary} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({
  card: { ...shadows.card, minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: layout.cardPadding, backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.large },
  icon: { width: layout.minTouchTarget, height: layout.minTouchTarget, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  arrow: { width: layout.minTouchTarget, height: layout.minTouchTarget, alignItems: 'center', justifyContent: 'center' },
});
