import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { colors, radius, spacing } from '@/design/tokens';
import { AttendanceDetail, DevelopmentScore } from '@/types/progress';
import { ProgressCard } from './progress-card';

function ScoreRing({ score }: { score: number }) {
  const size = 104;
  const strokeWidth = 9;
  const radiusValue = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusValue;
  return <View style={styles.ring}><Svg width={size} height={size} accessibilityLabel={`Overall development score ${score} out of 100`}><Circle cx={size / 2} cy={size / 2} r={radiusValue} fill="none" stroke={colors.neutral.divider} strokeWidth={strokeWidth} /><Circle cx={size / 2} cy={size / 2} r={radiusValue} fill="none" stroke={colors.brand.blue} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - score / 100)} rotation="-90" origin={`${size / 2}, ${size / 2}`} /></Svg><View style={styles.ringValue}><AppText variant="display" weight="extraBold">{score}</AppText><AppText variant="caption" weight="bold" color={colors.neutral.textSecondary}>/100</AppText></View></View>;
}

export function OverallDevelopmentCard({ development }: { development: DevelopmentScore }) {
  return <ProgressCard accessibilityLabel={`Overall development ${development.score} out of 100, up ${development.changePercent} percent`}><View style={styles.overallHeader}><View><AppText variant="heading" weight="bold">Overall Development</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Current academy assessment</AppText></View><StatusBadge label={`+${development.changePercent}% this month`} tone="success" /></View><View style={styles.overallBody}><ScoreRing score={development.score} /><View style={styles.overallCopy}><AppText variant="heading" weight="extraBold">{development.label}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary} numberOfLines={3}>{development.summary}</AppText><View style={styles.signal}><MaterialCommunityIcons name="trending-up" size={17} color={colors.status.success} /><AppText variant="bodySmall" weight="bold" color={colors.status.success}>Upward trend this month</AppText></View></View></View></ProgressCard>;
}

export function AttendanceSummaryCard({ attendance }: { attendance: AttendanceDetail }) {
  return <ProgressCard accessibilityLabel={`${attendance.percentage} percent attendance, ${attendance.attendedSessions} of ${attendance.totalSessions} sessions`}><View style={styles.attendanceHeader}><View style={styles.attendanceIcon}><MaterialCommunityIcons name="calendar-check-outline" size={22} color={colors.status.success} /></View><View style={styles.grow}><AppText variant="heading" weight="bold">Attendance</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Consistency builds development</AppText></View><View style={styles.attendanceValue}><AppText variant="title" weight="extraBold">{attendance.percentage}%</AppText><AppText variant="caption" weight="semibold" color={colors.neutral.textSecondary}>{attendance.attendedSessions} of {attendance.totalSessions}</AppText></View></View><ProgressBar progress={attendance.percentage / 100} color={colors.status.success} trackStyle={styles.track} accessibilityLabel={`${attendance.percentage} percent attendance`} /><View style={styles.streak}><MaterialCommunityIcons name="fire" size={18} color={colors.status.warning} /><AppText variant="bodySmall" weight="bold">{attendance.currentStreak}-session attendance streak</AppText></View></ProgressCard>;
}

const styles = StyleSheet.create({
  overallHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  overallBody: { marginTop: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ring: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center' },
  ringValue: { position: 'absolute', alignItems: 'center' },
  overallCopy: { flex: 1, minWidth: 0, gap: spacing.xs },
  signal: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  attendanceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  attendanceIcon: { width: 40, height: 40, borderRadius: radius.medium, backgroundColor: colors.status.successSoft, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1, minWidth: 0 },
  attendanceValue: { alignItems: 'flex-end' },
  track: { height: 8, marginTop: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.neutral.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.status.success },
  streak: { marginTop: spacing.sm, minHeight: 40, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
