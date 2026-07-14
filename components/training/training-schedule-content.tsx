import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { SurfaceCard } from '@/components/profile/profile-shared';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { ScheduledTrainingSession, WeeklyTrainingSlot } from '@/types/training';

export function WeeklyScheduleCard({ slots }: { slots: readonly WeeklyTrainingSlot[] }) {
  return <SurfaceCard>{slots.map((slot) => <View key={slot.id} style={styles.row}><View style={styles.icon}><MaterialCommunityIcons name="calendar-week-outline" size={20} color={colors.brand.blue} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="bold">{slot.day}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{slot.time}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{slot.ground}</AppText></View></View>)}</SurfaceCard>;
}

export function UpcomingSessionCard({ session }: { session: ScheduledTrainingSession }) {
  const tone = session.status === 'upcoming' ? 'info' : 'warning';
  return <View style={styles.session}><View style={styles.sessionHeader}><View style={styles.copy}><AppText variant="heading" weight="extraBold">{session.date}</AppText><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>{session.time}</AppText></View><StatusBadge label={session.status} tone={tone} /></View><View style={styles.meta}><MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.neutral.textSecondary} /><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.copy}>{session.ground}</AppText></View><View style={styles.meta}><MaterialCommunityIcons name="account-outline" size={18} color={colors.neutral.textSecondary} /><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.copy}>Coach {session.coachName}</AppText></View>{session.focus ? <View style={styles.focus}><MaterialCommunityIcons name="target" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" weight="semibold" style={styles.copy}>{session.focus}</AppText></View> : null}</View>;
}

const styles = StyleSheet.create({
  row: { minHeight: layout.informationRowMinHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0 },
  session: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  sessionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  focus: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft },
});
