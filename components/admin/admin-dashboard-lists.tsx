import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/states/content-state';
import { adminLayout } from '@/design/tokens/admin';
import { colors, layout, motion, radius, shadows, spacing } from '@/design/tokens';
import { AdminActivityEntry, AdminApprovalItem, ApprovalKind, AdminActivityKind } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const approvalIcons: Readonly<Record<ApprovalKind, IconName>> = { enrolment: 'account-plus-outline', 'squad-transfer': 'swap-horizontal', 'fee-concession': 'cash-minus', 'coach-leave': 'calendar-account-outline' };
const activityIcons: Readonly<Record<AdminActivityKind, IconName>> = { payment: 'cash-check', enrolment: 'account-plus-outline', approval: 'clipboard-check-outline', announcement: 'bullhorn-outline', coach: 'whistle-outline', squad: 'account-group-outline' };

export function AdminQuickAction({ icon, label, onPress, testID }: { readonly icon: IconName; readonly label: string; readonly onPress: () => void; readonly testID: string }) {
  return <AnimatedPressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} pressedScale={motion.scale.pressStrong} style={styles.quickAction}><View style={styles.quickIcon}><MaterialCommunityIcons name={icon} size={22} color={colors.brand.navy} /></View><View style={styles.quickLabelWrap}><AppText variant="button" weight="bold" numberOfLines={2} style={styles.quickLabel}>{label}</AppText></View><View style={styles.quickArrow}><MaterialCommunityIcons name="arrow-top-right" size={18} color={colors.brand.blue} /></View></AnimatedPressable>;
}

export function ApprovalList({ approvals, busy = false, onDecide, onOpen }: { readonly approvals: readonly AdminApprovalItem[]; readonly busy?: boolean; readonly onDecide?: (approval: AdminApprovalItem, state: 'approved' | 'declined') => void; readonly onOpen?: () => void }) {
  if (!approvals.length) return <EmptyState compact icon="clipboard-check-outline" title="No requests waiting" message="Enrolment, transfer, concession, and leave requests appear here." action={onOpen ? { label: 'Open queue', onPress: onOpen } : undefined} />;
  return <View style={styles.list}>{approvals.map((approval) => <View key={approval.id} testID={`admin-approval-${approval.id}`} style={styles.approval}><View style={styles.approvalTop}><View style={styles.compactIcon}><MaterialCommunityIcons name={approvalIcons[approval.kind]} size={20} color={colors.brand.navy} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="extraBold" numberOfLines={2}>{approval.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={3}>{approval.summary}</AppText></View><StatusBadge label={approval.state === 'pending' ? 'Pending' : approval.state === 'approved' ? 'Approved' : 'Declined'} tone={approval.state === 'pending' ? 'warning' : approval.state === 'approved' ? 'success' : 'error'} /></View><View style={styles.approvalMeta}><Meta icon="account-tie-outline" label={approval.requestedBy} /><Meta icon="calendar-outline" label={approval.requestedOn} />{approval.amount ? <Meta icon="cash" label={formatCurrency(approval.amount)} /> : null}</View>{approval.state === 'pending' && onDecide ? <View style={styles.approvalActions}><AppButton label="Decline" variant="ghost" disabled={busy} onPress={() => onDecide(approval, 'declined')} accessibilityLabel={`Decline: ${approval.title}`} style={styles.approvalAction} /><AppButton label="Approve" disabled={busy} onPress={() => onDecide(approval, 'approved')} accessibilityLabel={`Approve: ${approval.title}`} style={styles.approvalAction} /></View> : approval.decidedOn ? <AppText variant="caption" color={colors.neutral.textMuted}>Reviewed on {approval.decidedOn}</AppText> : null}</View>)}</View>;
}

export function ActivityFeed({ activity }: { readonly activity: readonly AdminActivityEntry[] }) {
  if (!activity.length) return <EmptyState compact icon="history" title="No recent activity" message="Payments, enrolments, and announcements appear here." />;
  return <View style={styles.card}>{activity.map((entry, index) => <View key={entry.id} style={[styles.activity, index > 0 && styles.divided]}><View style={styles.compactIcon}><MaterialCommunityIcons name={activityIcons[entry.kind]} size={20} color={colors.brand.navy} /></View><View style={styles.grow}><AppText variant="bodySmall" weight="bold" numberOfLines={2}>{entry.title}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={2}>{entry.summary}</AppText></View><AppText variant="caption" weight="bold" color={colors.brand.blue} numberOfLines={2} style={styles.activityAt}>{entry.at}</AppText></View>)}</View>;
}

function Meta({ icon, label }: { readonly icon: IconName; readonly label: string }) {
  return <View style={styles.metaItem}><MaterialCommunityIcons name={icon} size={16} color={colors.brand.blue} /><AppText variant="caption" weight="semibold" color={colors.neutral.textSecondary} numberOfLines={1} style={styles.grow}>{label}</AppText></View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  list: { gap: adminLayout.cardGap },
  card: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  compactIcon: { width: layout.compactIconSize, height: layout.compactIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  approval: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  approvalTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  approvalMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  metaItem: { minWidth: '44%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  approvalActions: { flexDirection: 'row', gap: spacing.xs }, approvalAction: { flex: 1, minWidth: 96 },
  activity: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, activityAt: { maxWidth: 96, textAlign: 'right' },
  divided: { borderTopWidth: 1, borderTopColor: colors.neutral.divider, paddingTop: spacing.sm },
  quickAction: { ...shadows.card, flexGrow: 1, flexBasis: '46%', minWidth: 148, minHeight: 104, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.compact, backgroundColor: colors.neutral.surface, gap: spacing.xs },
  quickIcon: { width: layout.standardIconSize, height: layout.standardIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  quickLabelWrap: { flex: 1, justifyContent: 'flex-end' }, quickLabel: { flexShrink: 1 },
  quickArrow: { position: 'absolute', top: adminLayout.cardPadding, right: adminLayout.cardPadding },
});
