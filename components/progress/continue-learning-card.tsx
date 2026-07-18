import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { RecommendedLesson } from '@/types/progress';

export function ContinueLearningCard({ lesson, onPress }: { lesson: RecommendedLesson; onPress: () => void }) {
  return <AnimatedPressable testID="progress-next-lesson" onPress={onPress} accessibilityRole="button" accessibilityLabel={`Watch Academy Session ${lesson.title}, ${lesson.durationMinutes} minutes`} style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="play" size={25} color={colors.neutral.white} /></View><View style={styles.copy}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>{lesson.category.toUpperCase()} · {lesson.durationMinutes} MIN</AppText><AppText variant="heading" weight="extraBold" numberOfLines={2}>{lesson.title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary} numberOfLines={2}>{lesson.reason}</AppText></View><View style={styles.arrow}><MaterialCommunityIcons name="arrow-right" size={19} color={colors.neutral.white} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({
  card: { ...shadows.card, minHeight: 96, padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.avatarBorder, backgroundColor: colors.brand.blueSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.navy, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  arrow: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.pill, backgroundColor: colors.brand.blue, alignItems: 'center', justifyContent: 'center' },
});
