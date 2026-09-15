import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { adminLayout } from '@/design/tokens/admin';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { AdminFeeRecord, AdminFeeStatus, AdminMember, EnrolmentStatus } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export const enrolmentTone: Readonly<Record<EnrolmentStatus, Tone>> = { active: 'success', trial: 'info', paused: 'warning', left: 'neutral' };
export const enrolmentLabel: Readonly<Record<EnrolmentStatus, string>> = { active: 'Active', trial: 'Trial', paused: 'Paused', left: 'Left' };
export const feeTone: Readonly<Record<AdminFeeStatus, Tone>> = { paid: 'success', pending: 'warning', overdue: 'error' };
export const feeLabel: Readonly<Record<AdminFeeStatus, string>> = { paid: 'Paid', pending: 'Pending', overdue: 'Overdue' };

function initialsOf(name: string) { return name.split(' ').map((part) => part[0]).slice(0, 2).join(''); }

function MemberListCardComponent({ member, onPress }: { readonly member: AdminMember; readonly onPress: (member: AdminMember) => void }) {
  const label = `${member.name}, ${member.playerId}, ${member.squadName}, ${enrolmentLabel[member.enrolment]}, fee ${feeLabel[member.feeStatus]}`;
  return <AnimatedPressable testID={`admin-member-${member.id}`} accessibilityRole="button" accessibilityLabel={label} onPress={() => onPress(member)} style={styles.card}><View style={styles.avatar}><AppText variant="bodySmall" weight="extraBold" color={colors.brand.navy}>{initialsOf(member.name)}</AppText><View style={styles.jersey}><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>{member.jerseyNumber}</AppText></View></View><View style={styles.copy}><View style={styles.titleRow}><AppText variant="heading" weight="extraBold" numberOfLines={2} style={styles.grow}>{member.name}</AppText><StatusBadge label={enrolmentLabel[member.enrolment]} tone={enrolmentTone[member.enrolment]} /></View><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{member.playerId} · {member.squadName}</AppText><View style={styles.metrics}><Metric icon="calendar-check-outline" label={`${member.attendancePercent}% attendance`} tone={colors.status.success} /><Metric icon={member.feeStatus === 'paid' ? 'cash-check' : 'cash-clock'} label={member.feeStatus === 'paid' ? 'Fees settled' : `${formatCurrency(member.outstandingAmount)} due`} tone={member.feeStatus === 'paid' ? colors.status.success : member.feeStatus === 'overdue' ? colors.status.error : colors.status.warning} /></View></View><View style={styles.arrow}><MaterialCommunityIcons name="chevron-right" size={22} color={colors.brand.blue} /></View></AnimatedPressable>;
}

export const MemberListCard = memo(MemberListCardComponent);

export function MemberIdentityCard({ member }: { readonly member: AdminMember }) {
  return <View style={styles.identity}><View style={styles.identityTop}><View style={styles.identityAvatar}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>{initialsOf(member.name)}</AppText></View><View style={styles.grow}><AppText variant="title" weight="extraBold" color={colors.neutral.white} numberOfLines={2}>{member.name}</AppText><AppText variant="bodySmall" color={colors.navyMutedText}>{member.playerId} · #{member.jerseyNumber}</AppText></View><StatusBadge label={enrolmentLabel[member.enrolment]} tone={enrolmentTone[member.enrolment]} /></View><View style={styles.identityMeta}><IdentityMeta icon="account-group-outline" label={member.squadName} /><IdentityMeta icon="soccer" label={member.position} /><IdentityMeta icon="cake-variant-outline" label={`${member.age} years`} /></View></View>;
}

function IdentityMeta({ icon, label }: { readonly icon: IconName; readonly label: string }) {
  return <View style={styles.identityMetaItem}><MaterialCommunityIcons name={icon} size={16} color={colors.brand.blue} /><AppText variant="caption" weight="semibold" color={colors.neutral.white} numberOfLines={1} style={styles.grow}>{label}</AppText></View>;
}

export function MemberFeeSummaryCard({ member, onRecordPayment }: { readonly member: AdminMember; readonly onRecordPayment?: () => void }) {
  return <View style={styles.surface}><View style={styles.feeTop}><View style={styles.grow}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>CURRENT BILLING</AppText><AppText variant="title" weight="extraBold">{formatCurrency(member.monthlyFee)}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{member.plan} · due {member.feeDueDate}</AppText></View><StatusBadge label={feeLabel[member.feeStatus]} tone={feeTone[member.feeStatus]} /></View>{member.outstandingAmount ? <View style={styles.outstanding}><MaterialCommunityIcons name="alert-circle-outline" size={19} color={colors.status.warning} /><AppText variant="bodySmall" weight="bold" color={colors.status.warning} style={styles.grow}>{formatCurrency(member.outstandingAmount)} outstanding</AppText></View> : null}{onRecordPayment && member.feeStatus !== 'paid' ? <AnimatedPressable testID="admin-member-record-payment" accessibilityRole="button" accessibilityLabel={`Record payment for ${member.name}`} onPress={onRecordPayment} style={styles.inlineAction}><MaterialCommunityIcons name="cash-plus" size={19} color={colors.brand.blue} /><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>Record payment</AppText><MaterialCommunityIcons name="chevron-right" size={19} color={colors.brand.blue} /></AnimatedPressable> : null}</View>;
}

export function MemberAttendanceCard({ member }: { readonly member: AdminMember }) {
  return <View style={styles.surface}><View style={styles.feeTop}><View style={styles.grow}><AppText variant="caption" weight="extraBold" color={colors.neutral.textSecondary}>TRAINING ATTENDANCE</AppText><AppText variant="title" weight="extraBold">{member.attendancePercent}%</AppText></View><AppText variant="caption" weight="bold" color={colors.brand.blue}>Coach {member.coachName}</AppText></View><ProgressBar progress={member.attendancePercent / 100} accessibilityLabel={`Attendance ${member.attendancePercent} percent`} /></View>;
}

export function MemberFeeHistory({ records }: { readonly records: readonly AdminFeeRecord[] }) {
  return <View style={styles.surface}>{records.map((record, index) => <View key={record.id} style={[styles.historyRow, index > 0 && styles.divided]}><View style={styles.grow}><AppText variant="bodySmall" weight="bold">{record.period}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{record.status === 'paid' ? `Paid ${record.paidOn ?? ''} · ${record.method ?? 'Cash'}` : `Due ${record.dueDate}`}</AppText></View><View style={styles.historyEnd}><AppText variant="bodySmall" weight="extraBold">{formatCurrency(record.amount)}</AppText><StatusBadge label={feeLabel[record.status]} tone={feeTone[record.status]} /></View></View>)}</View>;
}

function Metric({ icon, label, tone }: { readonly icon: IconName; readonly label: string; readonly tone: string }) {
  return <View style={styles.metric}><MaterialCommunityIcons name={icon} size={15} color={tone} /><AppText variant="caption" weight="bold" numberOfLines={1}>{label}</AppText></View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  card: { ...shadows.card, minHeight: 92, paddingHorizontal: adminLayout.compactRowPaddingHorizontal, paddingVertical: adminLayout.compactRowPaddingVertical, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 46, height: 46, borderRadius: radius.pill, backgroundColor: colors.brand.blueSoft, borderWidth: 1, borderColor: colors.avatarBorder, alignItems: 'center', justifyContent: 'center' },
  jersey: { position: 'absolute', right: -3, bottom: -3, minWidth: 21, height: 21, paddingHorizontal: 4, borderRadius: radius.pill, backgroundColor: colors.brand.navy, borderWidth: 2, borderColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 3 }, titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, metric: { flexDirection: 'row', alignItems: 'center', gap: 4 }, arrow: { width: 26, alignItems: 'flex-end' },
  identity: { ...shadows.hero, padding: adminLayout.cardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, gap: spacing.sm },
  identityTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  identityAvatar: { width: 52, height: 52, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.brand.blue, backgroundColor: colors.brand.navySoft, alignItems: 'center', justifyContent: 'center' },
  identityMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  identityMetaItem: { minWidth: '30%', flexGrow: 1, minHeight: 36, paddingHorizontal: spacing.xs, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: 4 },
  surface: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  feeTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  outstanding: { minHeight: 44, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.warningSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  inlineAction: { minHeight: layout.minTouchTarget, borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  historyRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, historyEnd: { alignItems: 'flex-end', gap: 4 },
  divided: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.sm },
});
