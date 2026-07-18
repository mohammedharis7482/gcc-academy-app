import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { useImageTransition } from '@/hooks/use-image-transition';
import { TrainingSession } from '@/types/player';

function MetadataChip({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return <View style={styles.metadataChip}><View style={styles.metadataIcon}><MaterialCommunityIcons name={icon} size={16} color={colors.brand.gold} /></View><AppText variant="bodySmall" weight="semibold" color={colors.neutral.white} numberOfLines={1} style={styles.metadataText}>{label}</AppText></View>;
}

export function NextTrainingCard({ training, onPress }: { training: TrainingSession; onPress: () => void }) {
  const { width } = useWindowDimensions();
  const imageTransition = useImageTransition();
  const cardWidth = Math.min(width, layout.contentMaxWidth) - layout.pageHorizontal * 2;
  const cardHeight = Math.min(layout.heroMaxHeight, Math.max(layout.heroMinHeight, cardWidth * layout.heroHeightRatio));
  const badgeLabel = training.status === 'completed' ? 'SESSION COMPLETED' : training.status === 'in-progress' ? 'SESSION IN PROGRESS' : training.status === 'cancelled' ? 'SESSION CANCELLED' : 'NEXT TRAINING';
  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <Image source={require('@/assets/images/home/training-hero.png')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={imageTransition} accessibilityLabel="Academy players training on the football ground" />
      <LinearGradient colors={colors.heroGradient} locations={[0, 0.36, 0.68, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.topRow}>
        <View style={styles.trainingBadge}><View style={[styles.badgeDot, training.status === 'completed' && styles.completedDot, training.status === 'cancelled' && styles.cancelledDot]} /><AppText variant="caption" weight="extraBold" color={colors.brand.navy}>{badgeLabel}</AppText></View>
        <View style={styles.countdown}><MaterialCommunityIcons name="clock-outline" size={14} color={colors.neutral.white} /><AppText variant="caption" weight="semibold" color={colors.neutral.white}>{training.countdown}</AppText></View>
      </View>
      <View style={styles.content}>
        <View style={styles.dateRow}><AppText variant="display" weight="extraBold" color={colors.neutral.white} style={styles.today}>{training.relativeDay}</AppText><AppText variant="bodySmall" weight="semibold" color={colors.heroSecondaryText}>{training.date}</AppText></View>
        <AppText variant="heading" weight="bold" color={colors.neutral.white} style={styles.time}>{training.time}</AppText>
        <View style={styles.metadataRow}><MetadataChip icon="map-marker-outline" label={training.venue} /><MetadataChip icon="account-outline" label={training.coachName} /></View>
        {training.category ? <View style={styles.categoryRow}><MetadataChip icon="account-group-outline" label={training.category} /></View> : null}
        <AnimatedPressable testID="home-view-schedule" onPress={onPress} accessibilityRole="button" accessibilityLabel="View training schedule" style={styles.action}><AppText variant="bodySmall" weight="bold" color={colors.brand.navy}>View training schedule</AppText><View style={styles.actionIcon}><MaterialCommunityIcons name="arrow-right" size={17} color={colors.neutral.white} /></View></AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...shadows.hero, minHeight: layout.heroMinHeight, maxHeight: layout.heroMaxHeight, borderRadius: radius.hero, overflow: 'hidden', backgroundColor: colors.brand.navy },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs, paddingTop: layout.compactRowPadding, paddingHorizontal: layout.compactRowPadding },
  trainingBadge: { minHeight: 31, paddingHorizontal: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.neutral.white, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  badgeDot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.brand.blue },
  completedDot: { backgroundColor: colors.status.success },
  cancelledDot: { backgroundColor: colors.status.error },
  countdown: { minHeight: 31, paddingHorizontal: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.heroChip, borderWidth: 1, borderColor: colors.heroBorder, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  content: { marginTop: 'auto', paddingHorizontal: layout.cardPadding, paddingTop: layout.cardPadding, paddingBottom: layout.largeCardPadding, gap: spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: spacing.sm },
  today: { fontSize: 32, lineHeight: 38 },
  time: { fontSize: 19, lineHeight: 26 },
  metadataRow: { flexDirection: 'row', gap: spacing.xs },
  categoryRow: { flexDirection: 'row' },
  metadataChip: { flexGrow: 1, flexBasis: '46%', minWidth: 0, minHeight: 40, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, borderWidth: 1, borderColor: colors.heroBorder, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metadataIcon: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  metadataText: { flexShrink: 1 },
  action: { alignSelf: 'stretch', minHeight: layout.heroButtonHeight, paddingLeft: spacing.md, paddingRight: spacing.xs, borderRadius: radius.medium, backgroundColor: colors.neutral.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionIcon: { width: layout.heroActionIconSize, height: layout.heroActionIconSize, borderRadius: radius.pill, backgroundColor: colors.brand.blue, alignItems: 'center', justifyContent: 'center' },
});
