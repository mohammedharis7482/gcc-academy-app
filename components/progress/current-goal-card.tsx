import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { colors, radius, spacing } from '@/design/tokens';
import { DevelopmentGoal } from '@/types/progress';
import { ProgressCard } from './progress-card';

export function CurrentGoalCard({ goal, onPress }: { goal: DevelopmentGoal; onPress?: () => void }) {
  const percentage = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.current);
  const card = <ProgressCard><View style={styles.header}><View style={styles.icon}><MaterialCommunityIcons name="flag-checkered" size={22} color={colors.brand.navy} /></View><View style={styles.copy}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>CURRENT GOAL</AppText><AppText variant="heading" weight="extraBold">{goal.title}</AppText></View><AppText variant="bodySmall" weight="bold" color={colors.neutral.textSecondary}>{goal.current}/{goal.target}</AppText></View><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.description}>{goal.description}</AppText><View style={styles.progressMeta}><AppText variant="bodySmall" weight="bold">{remaining} passes remaining</AppText><AppText variant="caption" weight="medium" color={colors.neutral.textSecondary}>Due {goal.dueDate}</AppText></View><ProgressBar progress={percentage / 100} trackStyle={styles.track} accessibilityLabel={`${Math.round(percentage)} percent of current goal complete`} /></ProgressCard>;
  if (!onPress) return card;
  return <AnimatedPressable testID="progress-current-goal" onPress={onPress} accessibilityRole="button" accessibilityLabel={`Current goal ${goal.title}, ${goal.current} of ${goal.target} complete. Open recommended lesson.`}>{card}</AnimatedPressable>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: 44, height: 44, borderRadius: radius.medium, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0 },
  description: { marginTop: spacing.sm },
  progressMeta: { marginTop: spacing.sm, marginBottom: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.neutral.divider, overflow: 'hidden' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
