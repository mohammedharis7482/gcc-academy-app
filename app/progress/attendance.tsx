import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { AttendanceSessionRow } from '@/components/progress/progress-detail-content';
import { ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { julyAttendance } from '@/data/progress-details';
import { colors, layout, radius, spacing } from '@/design/tokens';

export default function AttendanceDetailScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/progress'); };
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Attendance" subtitle={julyAttendance.month} onBack={back} /><View style={styles.sections}><View style={styles.summary}><View><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>MONTHLY ATTENDANCE</AppText><AppText variant="display" weight="extraBold">{julyAttendance.percentage}%</AppText></View><View style={styles.counts}><Count label="Present" value={julyAttendance.presentCount} color={colors.status.success} /><Count label="Absent" value={julyAttendance.absentCount} color={colors.status.error} /><Count label="Late" value={julyAttendance.lateCount} color={colors.status.warning} /></View></View><ProfileSection title="Recent Sessions"><SurfaceCard>{julyAttendance.sessions.map((session) => <AttendanceSessionRow key={session.id} session={session} />)}</SurfaceCard></ProfileSection></View></AppScreen>;
}

function Count({ label, value, color }: { label: string; value: number; color: string }) { return <View style={styles.count}><AppText variant="heading" weight="extraBold" color={color}>{value}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText></View>; }
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, summary: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.md }, counts: { flexDirection: 'row', gap: spacing.sm }, count: { flex: 1, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, alignItems: 'center' } });
