import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { AcademyPlayer, AttendanceMark } from '@/types/academy';

const statusTone: Readonly<Record<AttendanceMark, 'success' | 'error' | 'warning' | 'neutral'>> = { present: 'success', absent: 'error', late: 'warning', 'not-marked': 'neutral' };
const statusLabel: Readonly<Record<AttendanceMark, string>> = { present: 'Present', absent: 'Absent', late: 'Late', 'not-marked': 'Not Marked' };

function PlayerListCardComponent({ player, onPress }: { readonly player: AcademyPlayer; readonly onPress: (player: AcademyPlayer) => void }) {
  const initials = player.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const label = `${player.name}, jersey ${player.jerseyNumber}, ${player.position}, ${statusLabel[player.sessionStatus]}, attendance ${player.attendance.percentage} percent`;
  return <AnimatedPressable testID={`coach-player-${player.id}`} accessibilityRole="button" accessibilityLabel={label} onPress={() => onPress(player)} style={styles.card}><View style={styles.avatar}><AppText variant="bodySmall" weight="extraBold" color={colors.brand.navy}>{initials}</AppText><View style={styles.jersey}><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>{player.jerseyNumber}</AppText></View></View><View style={styles.copy}><View style={styles.titleRow}><AppText variant="heading" weight="extraBold" numberOfLines={2} style={styles.name}>{player.name}</AppText><StatusBadge label={statusLabel[player.sessionStatus]} tone={statusTone[player.sessionStatus]} /></View><AppText variant="caption" color={colors.neutral.textSecondary}>#{player.jerseyNumber} · {player.category} · {player.position}</AppText><View style={styles.metric}><MaterialCommunityIcons name="calendar-check-outline" size={16} color={colors.status.success} /><AppText variant="caption" weight="bold">{player.attendance.percentage}% attendance</AppText></View></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={22} color={colors.brand.blue} /></View></AnimatedPressable>;
}

export const PlayerListCard = memo(PlayerListCardComponent);

const styles = StyleSheet.create({
  card: { ...shadows.card, minHeight: 92, paddingHorizontal: layout.compactRowPaddingHorizontal, paddingVertical: layout.compactRowPaddingVertical, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 46, height: 46, borderRadius: radius.pill, backgroundColor: colors.brand.blueSoft, borderWidth: 1, borderColor: colors.avatarBorder, alignItems: 'center', justifyContent: 'center' }, jersey: { position: 'absolute', right: -3, bottom: -3, minWidth: 21, height: 21, paddingHorizontal: 4, borderRadius: radius.pill, backgroundColor: colors.brand.navy, borderWidth: 2, borderColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 3 }, titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs }, name: { flex: 1, minWidth: 0 }, metric: { flexDirection: 'row', alignItems: 'center', gap: 4 }, arrow: { width: 26, alignItems: 'flex-end' },
});
