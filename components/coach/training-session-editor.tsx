import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { LessonThumbnail } from '@/components/learn/lesson-thumbnail';
import { trainingFocusAreas, trainingNoteSuggestions } from '@/data/coach-training';
import { getLessonById } from '@/data/learning';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { CoachTrainingPlan, TrainingDrillBlock } from '@/types/training';

function statusLabel(status: CoachTrainingPlan['status']) {
  if (status === 'in-progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  if (status === 'cancelled') return 'Cancelled';
  return 'Upcoming';
}

export function TodaySessionCard({ plan }: { readonly plan: CoachTrainingPlan }) {
  const tone = plan.status === 'completed' ? 'success' : plan.status === 'cancelled' ? 'error' : plan.status === 'in-progress' ? 'info' : 'warning';
  return (
    <View accessibilityLabel={`${plan.squadName}. ${plan.dateLabel}. ${plan.time}. ${plan.ground}. ${plan.playerCount} players. Coach ${plan.coachName}. Status ${statusLabel(plan.status)}.`} style={styles.sessionCard}>
      <View style={styles.sessionTop}>
        <View style={styles.sessionIcon}><MaterialCommunityIcons name="whistle-outline" size={23} color={colors.brand.navy} /></View>
        <View style={styles.grow}>
          <AppText variant="heading" weight="extraBold">{plan.squadName}</AppText>
          <AppText variant="bodySmall" weight="semibold" color={colors.neutral.textSecondary}>{plan.dateLabel}</AppText>
        </View>
        <StatusBadge label={statusLabel(plan.status)} tone={tone} />
      </View>
      <View style={styles.sessionMeta}>
        <SessionMeta icon="clock-outline" label={plan.time} />
        <SessionMeta icon="map-marker-outline" label={plan.ground} />
        <SessionMeta icon="account-group-outline" label={`${plan.playerCount} players`} />
        <SessionMeta icon="account-outline" label={`Coach ${plan.coachName}`} />
      </View>
    </View>
  );
}

function SessionMeta({ icon, label }: { readonly icon: 'clock-outline' | 'account-outline' | 'account-group-outline' | 'map-marker-outline'; readonly label: string }) {
  return <View style={styles.meta}><MaterialCommunityIcons name={icon} size={17} color={colors.brand.blue} /><AppText variant="caption" weight="semibold" color={colors.neutral.textSecondary} numberOfLines={2} style={styles.grow}>{label}</AppText></View>;
}

export function SessionPlanCard({ drills, disabled, onToggle }: { readonly drills: readonly TrainingDrillBlock[]; readonly disabled: boolean; readonly onToggle: (id: string) => void }) {
  const completed = drills.filter((drill) => drill.completed).length;
  return (
    <View style={styles.planCard}>
      <View style={styles.planProgress} accessibilityLabel={`${completed} of ${drills.length} drills completed`}>
        <AppText variant="bodySmall" weight="extraBold">{completed} of {drills.length} completed</AppText>
        <AppText variant="caption" color={colors.neutral.textSecondary}>{disabled ? 'Start or edit the session to update' : 'Tap a drill when complete'}</AppText>
      </View>
      <ProgressBar progress={drills.length ? completed / drills.length : 0} color={colors.status.success} accessibilityLabel={`${completed} of ${drills.length} drills completed`} trackStyle={styles.progressTrack} />
      <View>
        {drills.map((drill, index) => <TrainingDrillRow key={drill.id} drill={drill} divided={index > 0} disabled={disabled} onToggle={() => onToggle(drill.id)} />)}
      </View>
    </View>
  );
}

const TrainingDrillRow = memo(function TrainingDrillRow({ drill, divided, disabled, onToggle }: { readonly drill: TrainingDrillBlock; readonly divided: boolean; readonly disabled: boolean; readonly onToggle: () => void }) {
  return (
    <AnimatedPressable testID={`training-drill-${drill.id}`} accessibilityRole="checkbox" accessibilityState={{ checked: drill.completed, disabled }} accessibilityLabel={`${drill.name}, ${drill.durationMinutes} minutes, ${drill.completed ? 'completed' : 'not completed'}`} disabled={disabled} onPress={onToggle} style={[styles.drillRow, divided && styles.divided, disabled && styles.disabled]}>
      <View style={[styles.check, drill.completed && styles.checkSelected]}><MaterialCommunityIcons name={drill.completed ? 'check' : 'circle-outline'} size={20} color={drill.completed ? colors.neutral.white : colors.neutral.textMuted} /></View>
      <View style={styles.grow}>
        <View style={styles.drillTitle}><AppText variant="bodySmall" weight="extraBold" style={styles.grow}>{drill.name}</AppText><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>{drill.durationMinutes} min</AppText></View>
        <AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{drill.description}</AppText>
      </View>
    </AnimatedPressable>
  );
});

export function FocusAreaChips({ selectedIds, disabled, onToggle }: { readonly selectedIds: readonly string[]; readonly disabled: boolean; readonly onToggle: (id: string) => void }) {
  return <View style={styles.chips}>{trainingFocusAreas.map((focus) => { const selected = selectedIds.includes(focus.id); return <AnimatedPressable key={focus.id} testID={`training-focus-${focus.id}`} accessibilityRole="checkbox" accessibilityState={{ checked: selected, disabled }} accessibilityLabel={`${focus.label} focus area`} disabled={disabled} onPress={() => onToggle(focus.id)} style={[styles.chip, selected && styles.chipSelected, disabled && styles.disabled]}><MaterialCommunityIcons name={selected ? 'check' : 'target'} size={16} color={selected ? colors.neutral.white : colors.brand.blue} /><AppText variant="bodySmall" weight="semibold" color={selected ? colors.neutral.white : colors.neutral.textSecondary}>{focus.label}</AppText></AnimatedPressable>; })}</View>;
}

export function TrainingLessonSelector({ lessonIds, selectedIds, disabled, onToggle }: { readonly lessonIds: readonly string[]; readonly selectedIds: readonly string[]; readonly disabled: boolean; readonly onToggle: (id: string) => void }) {
  const lessons = lessonIds.flatMap((id) => { const lesson = getLessonById(id); return lesson ? [lesson] : []; });
  return <View style={styles.lessonList}>{lessons.map((lesson) => { const selected = selectedIds.includes(lesson.id); const selectionDisabled = disabled || (!selected && selectedIds.length >= 2); return <AnimatedPressable key={lesson.id} testID={`training-lesson-${lesson.id}`} accessibilityRole="checkbox" accessibilityState={{ checked: selected, disabled: selectionDisabled }} accessibilityLabel={`Assign ${lesson.title}, ${lesson.durationMinutes} minutes`} disabled={selectionDisabled} onPress={() => onToggle(lesson.id)} style={[styles.lesson, selected && styles.lessonSelected, selectionDisabled && styles.disabled]}><LessonThumbnail thumbnail={lesson.thumbnail} style={styles.thumbnail} /><View style={styles.grow}><AppText variant="bodySmall" weight="extraBold" color={selectionDisabled && !selected ? colors.neutral.textMuted : colors.neutral.text} numberOfLines={2}>{lesson.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{lesson.durationMinutes} min · Coach {lesson.coachName}</AppText></View><MaterialCommunityIcons name={selected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={24} color={selected ? colors.brand.blue : colors.neutral.textMuted} /></AnimatedPressable>; })}</View>;
}

export function CoachSessionNotes({ value, disabled, onChange }: { readonly value: string; readonly disabled: boolean; readonly onChange: (value: string) => void }) {
  return (
    <View style={styles.notes}>
      <View style={styles.suggestions}>{trainingNoteSuggestions.map((note) => <AnimatedPressable key={note} accessibilityRole="button" accessibilityState={{ disabled }} accessibilityLabel={`Use note suggestion: ${note}`} disabled={disabled} onPress={() => onChange(note)} style={[styles.suggestion, disabled && styles.disabled]}><AppText variant="caption" weight="semibold" color={colors.brand.navy}>{note}</AppText></AnimatedPressable>)}</View>
      <View>
        <AppTextInput testID="training-coach-notes" accessibilityLabel="Coach note about today's session" accessibilityState={{ disabled }} editable={!disabled} value={value} onChangeText={onChange} multiline maxLength={200} placeholder="Add a short note about today’s session." containerStyle={styles.noteInput} inputStyle={styles.noteInputCopy} />
        <AppText variant="caption" color={colors.neutral.textMuted} style={styles.counter}>{value.length} / 200</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  sessionCard: { ...shadows.card, padding: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  sessionTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sessionIcon: { width: layout.standardIconSize, height: layout.standardIconSize, flexShrink: 0, borderRadius: radius.small, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' },
  sessionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  meta: { flexBasis: '47%', flexGrow: 1, minHeight: 34, paddingHorizontal: spacing.xs, borderRadius: radius.medium, backgroundColor: colors.neutral.background, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  planCard: { ...shadows.card, paddingHorizontal: layout.cardPadding, paddingTop: layout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface },
  planProgress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  progressTrack: { marginTop: spacing.xs, marginBottom: 2 },
  drillRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divided: { borderTopWidth: 1, borderTopColor: colors.neutral.divider },
  drillTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  check: { width: 38, height: 38, flexShrink: 0, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, alignItems: 'center', justifyContent: 'center' },
  checkSelected: { borderColor: colors.status.success, backgroundColor: colors.status.success },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { minHeight: layout.chipHeight, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.pill, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  chipSelected: { borderColor: colors.brand.navy, backgroundColor: colors.brand.navy },
  lessonList: { gap: layout.cardGap },
  lesson: { minHeight: 76, padding: spacing.xs, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lessonSelected: { borderColor: colors.brand.blue, backgroundColor: colors.brand.blueSoft },
  thumbnail: { width: 88, height: 58, borderRadius: radius.small },
  disabled: { opacity: 0.55 },
  notes: { gap: spacing.sm },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  suggestion: { minHeight: layout.chipHeight, paddingHorizontal: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  noteInput: { minHeight: 104, paddingBottom: spacing.lg, borderRadius: radius.standard },
  noteInputCopy: { paddingBottom: spacing.md },
  counter: { position: 'absolute', right: spacing.sm, bottom: spacing.xs },
});
