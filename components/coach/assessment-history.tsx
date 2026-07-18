import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { getPlayerById } from '@/data/academy';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { CoachAssessment } from '@/types/assessment';

export function AssessmentHistoryRow({ assessment, onPress }: { readonly assessment: CoachAssessment; readonly onPress: () => void }) {
  const player = getPlayerById(assessment.playerId); if (!player) return null;
  const date = new Date(assessment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return <AnimatedPressable testID={`coach-feedback-${assessment.id}`} accessibilityRole="button" accessibilityLabel={`Open ${assessment.mode === 'full-assessment' ? 'full assessment' : 'quick feedback'} for ${player.name}`} onPress={onPress} style={styles.row}><View style={styles.icon}><MaterialCommunityIcons name={assessment.mode === 'full-assessment' ? 'clipboard-text-outline' : 'message-text-outline'} size={21} color={colors.brand.navy} /></View><View style={styles.grow}><View style={styles.titleRow}><AppText variant="bodySmall" weight="extraBold" numberOfLines={2} style={styles.grow}>{player.name}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{date}</AppText></View><AppText variant="caption" color={colors.neutral.textSecondary}>{assessment.strength} · Improve {assessment.improvementArea}</AppText><StatusBadge label={assessment.mode === 'full-assessment' ? 'Full Assessment' : 'Quick Feedback'} tone={assessment.mode === 'full-assessment' ? 'info' : 'neutral'} /></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={22} color={colors.brand.blue} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({ row: { ...shadows.card, minHeight: 96, padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, icon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' }, grow: { flex: 1, minWidth: 0, gap: 3 }, titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs }, arrow: { width: 24, alignItems: 'flex-end' } });
