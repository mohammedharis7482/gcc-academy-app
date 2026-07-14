import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { SurfaceCard } from '@/components/profile/profile-shared';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { AttendanceSession, FeedbackDetail, PlayerAssessment, SkillKey } from '@/types/progress';

const attendanceTones = { present: 'success', absent: 'error', late: 'warning' } as const;

export function AttendanceSessionRow({ session }: { session: AttendanceSession }) {
  return <View style={styles.session}><View style={styles.icon}><MaterialCommunityIcons name={session.status === 'present' ? 'check' : session.status === 'late' ? 'clock-outline' : 'close'} size={20} color={session.status === 'present' ? colors.status.success : session.status === 'late' ? colors.status.warning : colors.status.error} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="bold">{session.date}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{session.time} · Coach {session.coachName}</AppText>{session.note ? <AppText variant="caption" color={colors.neutral.textSecondary}>{session.note}</AppText> : null}</View><StatusBadge label={session.status} tone={attendanceTones[session.status]} /></View>;
}

export function AssessmentSummary({ assessment, highlightedSkill, onLessonPress }: { assessment: PlayerAssessment; highlightedSkill?: SkillKey; onLessonPress: () => void }) {
  return <View style={styles.sections}><View style={styles.ratingCard}><View><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>OVERALL COACH RATING</AppText><AppText variant="display" weight="extraBold">{assessment.overallRating.toFixed(1)}<AppText variant="bodySmall" weight="bold" color={colors.neutral.textSecondary}> / 5</AppText></AppText></View><View style={styles.coach}><MaterialCommunityIcons name="account-tie" size={20} color={colors.brand.navy} /><View style={styles.copy}><AppText variant="bodySmall" weight="bold">Coach {assessment.coachName}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{assessment.coachRole} · {assessment.period}</AppText></View></View></View><SurfaceCard>{assessment.skillScores.map((skill) => <View key={skill.key} style={[styles.skill, highlightedSkill === skill.key && styles.highlight]}><AppText variant="bodySmall" weight="bold" style={styles.copy}>{skill.label}</AppText><AppText variant="heading" weight="extraBold">{skill.rating.toFixed(1)}<AppText variant="caption" color={colors.neutral.textSecondary}> / 5</AppText></AppText></View>)}</SurfaceCard><AssessmentList title="Strengths" icon="check-decagram-outline" items={assessment.strengths} tone="success" /><AssessmentList title="Improvement Areas" icon="target" items={assessment.improvementAreas} tone="info" /><View style={styles.comment}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>COACH COMMENT</AppText><AppText variant="body" color={colors.neutral.textSecondary}>{assessment.comment}</AppText></View><Pressable testID="assessment-recommended-lesson" onPress={onLessonPress} accessibilityRole="button" accessibilityLabel="Open recommended Weak-foot Passing Drill lesson" style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}><View style={styles.icon}><MaterialCommunityIcons name="play-circle-outline" size={22} color={colors.brand.blue} /></View><View style={styles.copy}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>CURRENT GOAL</AppText><AppText variant="bodySmall" weight="bold">{assessment.currentGoal}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Open recommended lesson</AppText></View><MaterialCommunityIcons name="chevron-right" size={22} color={colors.neutral.textMuted} /></Pressable></View>;
}

function AssessmentList({ title, icon, items, tone }: { title: string; icon: 'check-decagram-outline' | 'target'; items: readonly string[]; tone: 'success' | 'info' }) {
  const color = tone === 'success' ? colors.status.success : colors.brand.blue;
  return <View style={styles.listCard}><AppText variant="heading" weight="extraBold">{title}</AppText>{items.map((item) => <View key={item} style={styles.listRow}><MaterialCommunityIcons name={icon} size={18} color={color} /><AppText variant="bodySmall" style={styles.copy}>{item}</AppText></View>)}</View>;
}

export function FeedbackDetailCard({ feedback, onAssessmentPress, onLessonPress }: { feedback: FeedbackDetail; onAssessmentPress: () => void; onLessonPress: () => void }) {
  return <View style={styles.sections}><View style={styles.comment}><View style={styles.coach}><View style={styles.icon}><MaterialCommunityIcons name="account-tie" size={21} color={colors.brand.navy} /></View><View style={styles.copy}><AppText variant="heading" weight="extraBold">Coach {feedback.coachName}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{feedback.coachRole} · {feedback.date}</AppText></View></View><AppText variant="body" color={colors.neutral.textSecondary}>{feedback.message}</AppText><View style={styles.focus}><MaterialCommunityIcons name="target" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" weight="bold" style={styles.copy}>Focus: {feedback.focus}</AppText></View></View><Pressable onPress={onAssessmentPress} accessibilityRole="button" accessibilityLabel="Open related assessment" style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}><View style={styles.icon}><MaterialCommunityIcons name="clipboard-text-outline" size={21} color={colors.brand.blue} /></View><AppText variant="bodySmall" weight="bold" style={styles.copy}>View full assessment</AppText><MaterialCommunityIcons name="chevron-right" size={22} color={colors.neutral.textMuted} /></Pressable><Pressable onPress={onLessonPress} accessibilityRole="button" accessibilityLabel="Open coach recommended lesson" style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}><View style={styles.icon}><MaterialCommunityIcons name="play-circle-outline" size={21} color={colors.brand.blue} /></View><AppText variant="bodySmall" weight="bold" style={styles.copy}>Open recommended lesson</AppText><MaterialCommunityIcons name="chevron-right" size={22} color={colors.neutral.textMuted} /></Pressable></View>;
}

const styles = StyleSheet.create({
  sections: { gap: layout.cardGap }, copy: { flex: 1, minWidth: 0 },
  session: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  icon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  ratingCard: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.avatarBorder, backgroundColor: colors.brand.blueSoft, gap: spacing.md },
  coach: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  skill: { minHeight: layout.informationRowMinHeight, flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, paddingHorizontal: spacing.xs, borderRadius: radius.small },
  highlight: { backgroundColor: colors.brand.blueSoft },
  listCard: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  comment: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.avatarBorder, backgroundColor: colors.brand.blueSoft, gap: spacing.sm },
  focus: { padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderRadius: radius.medium, backgroundColor: colors.neutral.white },
  lesson: { minHeight: layout.minTouchTarget, padding: layout.compactRowPadding, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
