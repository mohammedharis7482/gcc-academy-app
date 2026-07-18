import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/states/content-state';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { CoachDashboardTask, SharedAcademyUpdate } from '@/types/academy';

const taskIcons = { attendance: 'clipboard-check-outline', assessment: 'message-draw', 'training-plan': 'clipboard-text-outline', announcement: 'bullhorn-outline' } as const;

export function CoachTaskList({ tasks, onTaskPress }: { readonly tasks: readonly CoachDashboardTask[]; readonly onTaskPress: (task: CoachDashboardTask) => void }) {
  if (!tasks.length) return <EmptyState compact icon="clipboard-check-outline" title="No tasks today" message="New attendance, feedback, and training tasks will appear here." />;
  return <View style={styles.card}>{tasks.map((task, index) => <AnimatedPressable key={task.id} testID={`coach-task-${task.id}`} accessibilityRole="button" accessibilityLabel={`${task.title}, ${task.supportingText}, ${task.status}`} onPress={() => onTaskPress(task)} style={[styles.task, index > 0 && styles.divided]}><View style={styles.compactIcon}><MaterialCommunityIcons name={taskIcons[task.type]} size={20} color={colors.brand.navy} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="bold" numberOfLines={2}>{task.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={2}>{task.supportingText}</AppText></View><View style={styles.taskState}><StatusBadge label={task.status} tone={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'warning'} /><MaterialCommunityIcons name="chevron-right" size={20} color={colors.neutral.textMuted} /></View></AnimatedPressable>)}</View>;
}

export function CoachUpdateCard({ update, onPress }: { readonly update: SharedAcademyUpdate; readonly onPress: () => void }) {
  return <AnimatedPressable testID="coach-latest-update" accessibilityRole="button" accessibilityLabel={`View update, ${update.title}`} onPress={onPress} style={styles.update}><View style={styles.updateIcon}><MaterialCommunityIcons name="bullhorn-outline" size={22} color={colors.brand.navy} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="extraBold">{update.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={2}>{update.summary}</AppText><AppText variant="caption" weight="bold" color={colors.brand.blue}>{update.publishedAt}</AppText></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={22} color={colors.brand.blue} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({
  card: { ...shadows.card, padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  grow: { flex: 1, minWidth: 0 },
  compactIcon: { width: layout.compactIconSize, height: layout.compactIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  task: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, taskState: { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 4 }, divided: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.sm },
  update: { ...shadows.card, minHeight: 96, padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  updateIcon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.small, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' }, arrow: { width: 32, alignItems: 'flex-end' },
});
