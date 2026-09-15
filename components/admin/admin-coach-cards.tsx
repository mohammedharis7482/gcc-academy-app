import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { adminLayout } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { AdminCoach, AdminSquad } from '@/types/admin';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function coachSquadNames(coach: AdminCoach, squads: readonly AdminSquad[]) {
  const names = coach.squadIds.map((id) => squads.find((squad) => squad.id === id)?.name).filter((name): name is string => Boolean(name));
  return names.length ? names.join(' · ') : 'No squad assigned';
}

function CoachListCardComponent({ coach, squadSummary, onPress }: { readonly coach: AdminCoach; readonly squadSummary: string; readonly onPress: (coach: AdminCoach) => void }) {
  const initials = coach.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return <AnimatedPressable testID={`admin-coach-${coach.id}`} accessibilityRole="button" accessibilityLabel={`${coach.name}, ${coach.roleTitle}, ${squadSummary}, ${coach.availability === 'available' ? 'available' : 'on leave'}`} onPress={() => onPress(coach)} style={styles.card}><View style={styles.avatar}><AppText variant="bodySmall" weight="extraBold" color={colors.brand.navy}>{initials}</AppText></View><View style={styles.copy}><View style={styles.titleRow}><AppText variant="heading" weight="extraBold" numberOfLines={1} style={styles.grow}>{coach.name}</AppText><StatusBadge label={coach.availability === 'available' ? 'Available' : 'On Leave'} tone={coach.availability === 'available' ? 'success' : 'warning'} /></View><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{coach.roleTitle} · {coach.engagement}</AppText><View style={styles.metrics}><Metric icon="account-group-outline" label={squadSummary} /><Metric icon="clipboard-text-clock-outline" label={`${coach.sessionsThisMonth} sessions`} /></View></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={22} color={colors.brand.blue} /></View></AnimatedPressable>;
}

export const CoachListCard = memo(CoachListCardComponent);

export function CoachIdentityCard({ coach, squadSummary }: { readonly coach: AdminCoach; readonly squadSummary: string }) {
  const initials = coach.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return <View style={styles.identity}><View style={styles.identityTop}><View style={styles.identityAvatar}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>{initials}</AppText></View><View style={styles.grow}><AppText variant="title" weight="extraBold" color={colors.neutral.white} numberOfLines={1}>Coach {coach.name}</AppText><AppText variant="bodySmall" color={colors.navyMutedText} numberOfLines={1}>{coach.roleTitle}</AppText></View><StatusBadge label={coach.engagement} tone="info" /></View><View style={styles.assignment}><MaterialCommunityIcons name="account-group-outline" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} numberOfLines={2} style={styles.grow}>{squadSummary}</AppText></View></View>;
}

export function CoachWorkloadCard({ coaches }: { readonly coaches: readonly AdminCoach[] }) {
  const available = coaches.filter((coach) => coach.availability === 'available').length;
  const sessions = coaches.reduce((total, coach) => total + coach.sessionsThisMonth, 0);
  return <View style={styles.surface}><View style={styles.workloadRow}><Workload label="Coaches" value={String(coaches.length)} /><Workload label="Available" value={String(available)} /><Workload label="Sessions this month" value={String(sessions)} /></View></View>;
}

function Workload({ label, value }: { readonly label: string; readonly value: string }) {
  return <View accessibilityLabel={`${label}: ${value}`} style={styles.workload}><AppText variant="heading" weight="extraBold">{value}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={2}>{label}</AppText></View>;
}

function Metric({ icon, label }: { readonly icon: IconName; readonly label: string }) {
  return <View style={styles.metric}><MaterialCommunityIcons name={icon} size={15} color={colors.brand.blue} /><AppText variant="caption" weight="semibold" color={colors.neutral.textSecondary} numberOfLines={1} style={styles.grow}>{label}</AppText></View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  card: { ...shadows.card, minHeight: 92, paddingHorizontal: adminLayout.compactRowPaddingHorizontal, paddingVertical: adminLayout.compactRowPaddingVertical, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 46, height: 46, borderRadius: radius.pill, backgroundColor: colors.brand.goldSoft, borderWidth: 1, borderColor: colors.amberBorder, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 3 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metrics: { gap: 2 }, metric: { flexDirection: 'row', alignItems: 'center', gap: 4 }, arrow: { width: 26, alignItems: 'flex-end' },
  identity: { ...shadows.hero, padding: adminLayout.cardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, gap: spacing.sm },
  identityTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  identityAvatar: { width: 52, height: 52, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.brand.gold, backgroundColor: colors.brand.navySoft, alignItems: 'center', justifyContent: 'center' },
  assignment: { minHeight: 44, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  surface: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface },
  workloadRow: { flexDirection: 'row', gap: spacing.sm }, workload: { flex: 1, minWidth: 0 },
});
