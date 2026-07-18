import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { LessonThumbnail } from '@/components/learn/lesson-thumbnail';
import { InfoRow } from '@/components/profile/profile-shared';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { AcademyPlayer, SharedCoachFeedback, SquadSummary } from '@/types/academy';
import { LearningLesson } from '@/types/learning';

export function PlayerFeedbackCard({ feedback, coachName, onHistory, limit = 2 }: { readonly feedback: readonly SharedCoachFeedback[]; readonly coachName: string; readonly onHistory: () => void; readonly limit?: number }) {
  return <View style={styles.card}>{feedback.slice(0, limit).map((item, index) => <View key={item.id} style={[styles.feedback, index > 0 && styles.divided]}><View style={styles.feedbackIcon}><MaterialCommunityIcons name="message-text-outline" size={19} color={colors.brand.blue} /></View><View style={styles.grow}><View style={styles.row}><AppText variant="bodySmall" weight="bold">Coach {coachName}</AppText><AppText variant="caption" color={colors.neutral.textMuted}>{item.date.replace(' 2026', '')}</AppText></View><AppText variant="bodySmall" color={colors.neutral.textSecondary} numberOfLines={2}>{item.comment}</AppText><AppText variant="caption" weight="bold" color={colors.brand.blue}>Focus: {item.focus}</AppText></View></View>)}<AppButton label="Feedback history" variant="secondary" onPress={onHistory} /></View>;
}

export function AssignedLessonsCard({ lessons, onOpen, limit = 1 }: { readonly lessons: readonly LearningLesson[]; readonly onOpen: (lesson: LearningLesson) => void; readonly limit?: number }) {
  return <View style={styles.card}>{lessons.slice(0, limit).map((lesson, index) => <AnimatedPressable key={lesson.id} accessibilityRole="button" accessibilityLabel={`Open assigned Session ${lesson.title}`} onPress={() => onOpen(lesson)} style={[styles.lesson, index > 0 && styles.divided]}><LessonThumbnail thumbnail={lesson.thumbnail} style={styles.thumbnail} /><View style={styles.grow}><AppText variant="bodySmall" weight="extraBold" numberOfLines={2}>{lesson.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{lesson.category} · {lesson.durationMinutes} min</AppText><AppText variant="caption" weight="bold" color={lesson.initialStatus === 'completed' ? colors.status.success : colors.brand.blue}>{lesson.initialStatus === 'completed' ? 'Completed' : 'Priority Session'}</AppText></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={21} color={colors.brand.blue} /></View></AnimatedPressable>)}</View>;
}

export function CoachPlayerAcademyDetails({ player, squad, coachName, ground }: { readonly player: AcademyPlayer; readonly squad: SquadSummary; readonly coachName: string; readonly ground: string }) {
  return <View style={styles.card}><InfoRow icon="clock-outline" label="Batch" value={squad.batch} /><InfoRow icon="calendar-plus" label="Joining date" value={player.joiningDate} /><InfoRow icon="calendar-week" label="Training days" value={squad.trainingDays.join(', ')} /><InfoRow icon="map-marker-outline" label="Training ground" value={ground} /><InfoRow icon="whistle-outline" label="Assigned coach" value={coachName} /><InfoRow icon="card-account-details-outline" label="Membership" value={player.membershipStatus === 'active' ? 'Active' : 'Pending renewal'} /></View>;
}

const styles = StyleSheet.create({
  card: { ...shadows.card, padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm }, grow: { flex: 1, minWidth: 0 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, feedbackIcon: { width: layout.compactIconSize, height: layout.compactIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' }, divided: { paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.neutral.divider },
  lesson: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, thumbnail: { width: 92, height: 58, borderRadius: radius.small }, arrow: { width: 24, alignItems: 'flex-end' },
});
