import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { AttendanceSessionRow } from '@/components/progress/progress-detail-content';
import { ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useAttendanceData, useAttendanceDraft } from '@/contexts/attendance-context';
import { julyAttendance } from '@/data/progress-details';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { AttendanceSession } from '@/types/progress';

export default function AttendanceDetailScreen() {
  const router = useRouter(); const attendance = useAttendanceData(); const attendanceDraft = useAttendanceDraft(); const summary = attendance.getPlayerSummary('player-ayaan'); const submitted = attendance.getPlayerHistory('player-ayaan');
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/progress'); };
  const sessions = new Map<string, AttendanceSession>(julyAttendance.sessions.map((session) => [session.id, session]));
  submitted.forEach(({ session, entry }) => { if (entry.status !== 'not-marked') sessions.set(session.id, { id: session.id, date: session.displayDate.replace(' 2026', ''), time: session.timeLabel, coachName: 'Sandeep', status: entry.status, note: entry.note }); });
  const history = [...sessions.values()];
  if (attendance.loadStatus === 'loading') return <AppScreen withTabBarClearance={false}><View style={styles.loading}><PageHeaderSkeleton /><SummaryCardSkeleton /><SummaryCardSkeleton /></View></AppScreen>;
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Attendance" subtitle={julyAttendance.month} onBack={back} /><View style={styles.sections}>{attendance.loadError ? <InlineInfoBanner tone="error" title="Unable to restore saved attendance" message="Your academy attendance history remains available." actionLabel="Retry" onAction={attendanceDraft.retryLoad} /> : null}{summary ? <View style={styles.summary}><View><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>MONTHLY ATTENDANCE</AppText><AppText variant="display" weight="extraBold">{summary.percentage}%</AppText></View><View style={styles.counts}><Count label="Present" value={summary.present} color={colors.status.success} /><Count label="Absent" value={summary.absent} color={colors.status.error} /><Count label="Late" value={summary.late} color={colors.status.warning} /></View></View> : <ContentState type="empty" title="No attendance summary" message="Attendance will appear after your first recorded session." />}<ProfileSection title="Recent Sessions">{history.length ? <SurfaceCard>{history.map((session) => <AttendanceSessionRow key={session.id} session={session} />)}</SurfaceCard> : <ContentState type="empty" title="No attendance history" message="Recorded training sessions will appear here." />}</ProfileSection></View></AppScreen>;
}

function Count({ label, value, color }: { readonly label: string; readonly value: number; readonly color: string }) { return <View style={styles.count}><AppText variant="heading" weight="extraBold" color={color}>{value}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText></View>; }
const styles = StyleSheet.create({ loading: { gap: layout.sectionGap }, sections: { gap: layout.sectionGap }, summary: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.md }, counts: { flexDirection: 'row', gap: spacing.sm }, count: { flex: 1, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, alignItems: 'center' } });
