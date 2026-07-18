import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, motion, radius, shadows, spacing } from '@/design/tokens';
import { SharedTrainingSession, SquadSummary } from '@/types/academy';
import { CoachTrainingPlan } from '@/types/training';

export function CoachTrainingCard({ session, squad, onAttendance, onEditSchedule, attendanceSubmitted = false, feedbackPending = 0, trainingPlan }: { readonly session: SharedTrainingSession; readonly squad: SquadSummary; readonly onAttendance: () => void; readonly onEditSchedule: () => void; readonly attendanceSubmitted?: boolean; readonly feedbackPending?: number; readonly trainingPlan?: CoachTrainingPlan }) {
  const planSaved = trainingPlan?.source === 'coach-saved';
  const sessionStatus = trainingPlan?.status ?? session.status;
  const focus = trainingPlan?.focusAreaIds.map((item) => item.replace(/-/g, ' ')).join(' · ') || session.focus;
  const topStatus = sessionStatus === 'completed' ? 'SESSION COMPLETED' : sessionStatus === 'in-progress' ? 'SESSION IN PROGRESS' : sessionStatus === 'cancelled' ? 'SESSION CANCELLED' : 'TODAY’S SESSION';
  return <View style={styles.hero}><Image source={require('@/assets/images/home/training-hero.png')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={180} /><LinearGradient colors={['rgba(5,20,51,0.18)', 'rgba(5,20,51,0.86)', 'rgba(5,20,51,0.98)']} locations={[0, 0.43, 1]} style={StyleSheet.absoluteFill} /><View style={styles.heroContent}><View style={styles.heroTop}><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>{topStatus}</AppText><AppText variant="caption" weight="extraBold" color={planSaved ? colors.brand.gold : colors.navyMutedText}>{planSaved ? 'SESSION READY' : 'UPCOMING'}</AppText></View><View style={styles.titleGroup}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>{squad.name}</AppText><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} numberOfLines={2}>{trainingPlan?.dateLabel ?? session.shortDate} · {trainingPlan?.time ?? session.time}</AppText></View><View style={styles.metaRow}><Meta icon="map-marker-outline" label={trainingPlan?.ground ?? session.ground} /><Meta icon="account-group-outline" label={`${squad.playerCount} players`} /></View><View style={styles.operations}><OperationalStatus icon={attendanceSubmitted ? 'check-circle-outline' : 'clipboard-clock-outline'} label="Attendance" value={attendanceSubmitted ? 'Complete' : 'Pending'} complete={attendanceSubmitted} /><OperationalStatus icon="message-text-outline" label="Feedback" value={feedbackPending ? `${feedbackPending} pending` : 'Complete'} complete={!feedbackPending} /></View><View style={styles.focus}><MaterialCommunityIcons name="target" size={18} color={colors.brand.blue} /><View style={styles.grow}><AppText variant="caption" color={colors.navyMutedText}>SESSION FOCUS</AppText><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} numberOfLines={2}>{focus}</AppText></View></View><View style={styles.ctaRow}><AppButton testID="coach-open-attendance" label="Open Attendance" variant="white" onPress={onAttendance} accessibilityLabel={`Open ${squad.name} attendance`} style={styles.ctaButton} /><AppButton testID="coach-edit-schedule" label="Edit Schedule" variant="secondary" onPress={onEditSchedule} accessibilityLabel={`Edit ${squad.name} schedule`} style={styles.ctaButton} /></View></View></View>;
}

function OperationalStatus({ icon, label, value, complete }: { readonly icon: keyof typeof MaterialCommunityIcons.glyphMap; readonly label: string; readonly value: string; readonly complete: boolean }) {
  return <View accessibilityLabel={`${label}: ${value}`} style={styles.operation}><MaterialCommunityIcons name={icon} size={17} color={complete ? colors.status.success : colors.status.warning} /><View style={styles.grow}><AppText variant="caption" color={colors.navyMutedText}>{label}</AppText><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>{value}</AppText></View></View>;
}

function Meta({ icon, label }: { readonly icon: 'map-marker-outline' | 'account-group-outline'; readonly label: string }) {
  return <View style={styles.meta}><MaterialCommunityIcons name={icon} size={17} color={colors.neutral.white} /><AppText variant="caption" weight="semibold" color={colors.neutral.white} numberOfLines={1} style={styles.grow}>{label}</AppText></View>;
}

export function QuickAction({ icon, label, onPress, testID }: { readonly icon: keyof typeof MaterialCommunityIcons.glyphMap; readonly label: string; readonly onPress: () => void; readonly testID: string }) {
  return <AnimatedPressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} pressedScale={motion.scale.pressStrong} style={styles.quickAction}><View style={styles.quickIcon}><MaterialCommunityIcons name={icon} size={22} color={colors.brand.navy} /></View><View style={styles.quickLabelWrap}><AppText variant="button" weight="bold" numberOfLines={2} style={styles.quickLabel}>{label}</AppText></View><View style={styles.quickArrow}><MaterialCommunityIcons name="arrow-top-right" size={18} color={colors.brand.blue} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({
  hero: { ...shadows.hero, minHeight: 312, overflow: 'hidden', borderRadius: radius.hero, backgroundColor: colors.brand.navy },
  heroContent: { flex: 1, minHeight: 312, paddingHorizontal: layout.largeCardPadding, paddingTop: spacing.md, paddingBottom: spacing.md },
  heroTop: { minHeight: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  titleGroup: { marginTop: spacing.sm, gap: 4 },
  metaRow: { marginTop: spacing.sm, flexDirection: 'row', gap: spacing.sm }, meta: { flex: 1, minWidth: 0, minHeight: 22, flexDirection: 'row', alignItems: 'center', gap: 6 },
  operations: { marginTop: spacing.sm, flexDirection: 'row', gap: spacing.xs }, operation: { flex: 1, minWidth: 0, minHeight: 42, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  focus: { minHeight: 44, marginTop: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, grow: { flex: 1, minWidth: 0 },
  ctaRow: { marginTop: spacing.sm, flexDirection: 'row', gap: spacing.xs }, ctaButton: { flex: 1, paddingHorizontal: spacing.xs },
  quickAction: { ...shadows.card, flexBasis: '47%', flexGrow: 1, height: 80, padding: spacing.sm, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  quickIcon: { width: layout.compactIconSize, height: layout.compactIconSize, flexShrink: 0, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  quickLabelWrap: { flex: 1, minWidth: 0, minHeight: 36, justifyContent: 'center' },
  quickLabel: { textAlignVertical: 'center' },
  quickArrow: { width: 18, flexShrink: 0, alignItems: 'flex-end' },
});
