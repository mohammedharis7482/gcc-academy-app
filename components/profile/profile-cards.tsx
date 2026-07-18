import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { colors, layout, radius, spacing } from '@/design/tokens';
import { AcademyAssignment, FeeRecord, GuardianDetails, PlayerMembership } from '@/types/profile';
import { formatCurrency } from '@/utils/format';
import { InfoRow, SurfaceCard } from './profile-shared';

const membershipLabels: Record<PlayerMembership['status'], string> = { active: 'Active', 'pending-renewal': 'Pending renewal', paused: 'Paused', inactive: 'Inactive' };

export function AcademyInfoCard({ academy }: { academy: AcademyAssignment }) {
  return <SurfaceCard compactRows><InfoRow icon="account-group-outline" label="Category" value={academy.category} /><InfoRow icon="clock-outline" label="Batch" value={academy.batch} /><InfoRow icon="account-tie-outline" label="Head coach" value={academy.headCoach} /><InfoRow icon="account-multiple-outline" label="Assistant coaches" value={academy.assistantCoaches.join(', ')} /><InfoRow icon="map-marker-outline" label="Training ground" value={academy.trainingGround} /><InfoRow icon="calendar-week-outline" label="Training days" value={academy.trainingDays.join(', ')} /><InfoRow icon="calendar-check-outline" label="Joining date" value={academy.joiningDate} /></SurfaceCard>;
}

export function MembershipCard({ membership }: { membership: PlayerMembership }) {
  const tone = membership.status === 'active' ? 'success' : membership.status === 'pending-renewal' ? 'warning' : 'neutral';
  return <SurfaceCard compactRows={false} accessibilityLabel={`Membership ${membershipLabels[membership.status]}`}><View style={styles.cardHeading}><View style={styles.headingIcon}><MaterialCommunityIcons name="shield-check-outline" size={23} color={colors.brand.blue} /></View><View style={styles.grow}><AppText variant="heading" weight="extraBold">Membership</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>{membership.plan}</AppText></View><StatusBadge label={membershipLabels[membership.status]} tone={tone} /></View><View style={styles.twoColumns}><Value label="Membership ID" value={membership.membershipId} /><Value label="Current period" value={membership.currentPeriod} /></View><View style={styles.renewal}><MaterialCommunityIcons name="calendar-refresh-outline" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Renews <AppText variant="bodySmall" weight="bold">{membership.renewalDate}</AppText></AppText></View></SurfaceCard>;
}

export function FeeSummaryCard({ fee, onPress }: { fee: FeeRecord | null; onPress: () => void }) {
  if (!fee) return <SurfaceCard compactRows={false}><View style={styles.cardHeading}><View style={styles.successIcon}><MaterialCommunityIcons name="check" size={23} color={colors.status.success} /></View><View style={styles.grow}><AppText variant="heading" weight="extraBold">Payments up to date</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>There is no pending academy payment.</AppText></View></View><AnimatedPressable accessibilityRole="button" accessibilityLabel="View payment history" onPress={onPress} style={styles.textAction}><AppText variant="bodySmall" weight="bold" color={colors.brand.blue}>View payment history</AppText></AnimatedPressable></SurfaceCard>;
  return <AnimatedPressable testID="profile-fee-summary" accessibilityRole="button" accessibilityLabel={`${fee.period} academy payment, ${formatCurrency(fee.amount)}, ${fee.status}, due ${fee.dueDate}`} onPress={onPress} style={styles.feeCard}><View style={styles.feeIcon}><MaterialCommunityIcons name="receipt-text-outline" size={24} color={colors.status.warning} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="bold">{fee.period} Academy Payment</AppText><AppText variant="title" weight="extraBold">{formatCurrency(fee.amount)}</AppText><AppText variant="caption" weight="medium" color={colors.neutral.textSecondary}>Pending · Due {fee.dueDate}</AppText></View><View style={styles.arrow}><MaterialCommunityIcons name="arrow-right" size={19} color={colors.brand.navy} /></View></AnimatedPressable>;
}

export function GuardianInfoCard({ guardian }: { guardian: GuardianDetails }) {
  return <SurfaceCard compactRows><InfoRow icon="account-heart-outline" label="Guardian" value={guardian.name} /><InfoRow icon="account-child-outline" label="Relationship" value={guardian.relationship} /><InfoRow icon="phone-outline" label="Primary phone" value={guardian.primaryPhone} /><InfoRow icon="phone-alert-outline" label="Emergency contact" value={guardian.emergencyPhone} /></SurfaceCard>;
}

function Value({ label, value }: { label: string; value: string }) { return <View style={styles.grow}><AppText variant="caption" color={colors.neutral.textSecondary}>{label}</AppText><AppText variant="bodySmall" weight="bold">{value}</AppText></View>; }

const styles = StyleSheet.create({
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headingIcon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.status.successSoft, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1, minWidth: 0 },
  twoColumns: { flexDirection: 'row', gap: spacing.md },
  renewal: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  feeCard: { minHeight: 100, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: layout.cardPadding, borderRadius: radius.compact, borderWidth: 1, borderColor: colors.amberBorder, backgroundColor: colors.status.warningSoft },
  feeIcon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.goldSoft, alignItems: 'center', justifyContent: 'center' },
  arrow: { width: layout.minTouchTarget, height: layout.minTouchTarget, borderRadius: radius.pill, backgroundColor: colors.neutral.white, alignItems: 'center', justifyContent: 'center' },
  textAction: { minHeight: layout.minTouchTarget, alignItems: 'flex-start', justifyContent: 'center' },
});
