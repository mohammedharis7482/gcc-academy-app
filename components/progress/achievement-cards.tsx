import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { Achievement } from '@/types/progress';

export function AchievementCards({ achievements }: { achievements: Achievement[] }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(244, width - 88);
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content} snapToInterval={cardWidth + spacing.sm} decelerationRate="fast" accessibilityLabel={`${achievements.length} player achievements`}>{achievements.map((achievement) => <View key={achievement.id} style={[styles.card, { width: cardWidth }]}><View style={styles.icon}><MaterialCommunityIcons name={achievement.icon} size={25} color={colors.status.warning} /></View><AppText variant="body" weight="bold">{achievement.title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.grow}>{achievement.description}</AppText><AppText variant="caption" weight="semibold" color={colors.neutral.textMuted}>Earned {achievement.earnedDate}</AppText></View>)}</ScrollView>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xs },
  card: { ...shadows.card, height: 156, padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.xs },
  icon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
});
