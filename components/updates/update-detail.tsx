import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/animated-pressable';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { AcademyCommunicationUpdate, UpdateMetadata } from '@/types/updates';
import { priorityUI, updateCategoryUI, UpdateIconName } from './update-category';

export function UpdateDetailHeader({ update, onBack }: { update: AcademyCommunicationUpdate; onBack: () => void }) {
  const category = updateCategoryUI[update.category];
  const priority = update.priority === 'normal' ? undefined : priorityUI[update.priority];
  return <View style={styles.header}><AnimatedPressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><MaterialCommunityIcons name="arrow-left" size={22} color={colors.brand.navy} /></AnimatedPressable><View style={styles.badges}><View style={[styles.categoryBadge, { backgroundColor: category.surface }]}><MaterialCommunityIcons name={category.icon} size={16} color={category.color} /><AppText variant="caption" weight="extraBold" color={category.color}>{update.category.toUpperCase()}</AppText></View>{priority && <View style={[styles.priorityBadge, { backgroundColor: priority.surface, borderColor: priority.border }]}><AppText variant="caption" weight="extraBold" color={priority.color}>{priority.label}</AppText></View>}</View><AppText variant="title" weight="extraBold">{update.title}</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Published {update.publishedAt}</AppText></View>;
}

const metadataConfig: readonly { key: keyof UpdateMetadata; label: string; icon: UpdateIconName }[] = [
  { key: 'date', label: 'Date', icon: 'calendar-outline' }, { key: 'time', label: 'Time', icon: 'clock-outline' }, { key: 'ground', label: 'Pitch', icon: 'map-marker-outline' }, { key: 'coach', label: 'Coach', icon: 'account-outline' }, { key: 'amount', label: 'Amount', icon: 'wallet-outline' }, { key: 'dueDate', label: 'Due date', icon: 'calendar-alert' }, { key: 'assessmentPeriod', label: 'Assessment period', icon: 'chart-box-outline' }, { key: 'sessionDuration', label: 'Session duration', icon: 'timer-outline' }, { key: 'audience', label: 'Audience', icon: 'account-group-outline' },
];

export function UpdateMetadataCard({ metadata }: { metadata: UpdateMetadata }) {
  const rows = metadataConfig.flatMap((item) => metadata[item.key] ? [{ ...item, value: metadata[item.key] }] : []);
  if (!rows.length) return null;
  return <View style={styles.card}><AppText variant="heading" weight="extraBold">Details</AppText><View style={styles.metadata}>{rows.map((row) => <View key={row.key} style={styles.metaRow}><View style={styles.metaIcon}><MaterialCommunityIcons name={row.icon} size={19} color={colors.brand.blue} /></View><View style={styles.metaCopy}><AppText variant="caption" color={colors.neutral.textSecondary}>{row.label}</AppText><AppText variant="bodySmall" weight="semibold">{row.value}</AppText></View></View>)}</View></View>;
}

export function UpdatePrimaryAction({ label, onPress }: { label?: string; onPress?: () => void }) {
  if (!label || !onPress) return null;
  return <AppButton testID="update-primary-action" label={label} onPress={onPress} accessibilityLabel={label} />;
}

export function UpdateMessageCard({ update }: { update: AcademyCommunicationUpdate }) {
  return <View style={styles.card}><AppText variant="heading" weight="extraBold">Message</AppText><AppText variant="body" color={colors.neutral.textSecondary}>{update.message}</AppText></View>;
}

export function UpdateSenderCard({ update }: { update: AcademyCommunicationUpdate }) {
  return <View style={styles.sender}><View style={styles.senderIcon}><MaterialCommunityIcons name="shield-account-outline" size={22} color={colors.brand.blue} /></View><View style={styles.metaCopy}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>SENT BY</AppText><AppText variant="bodySmall" weight="bold">{update.senderName}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{update.senderRole}</AppText></View></View>;
}

const styles = StyleSheet.create({ header: { paddingTop: layout.pageTop, gap: spacing.sm }, back: { width: layout.minTouchTarget, height: layout.minTouchTarget, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' }, badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, categoryBadge: { minHeight: 30, paddingHorizontal: spacing.sm, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, priorityBadge: { minHeight: 30, paddingHorizontal: spacing.sm, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center' }, card: { ...shadows.card, padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.neutral.border, backgroundColor: colors.neutral.surface, gap: spacing.sm }, metadata: { gap: spacing.sm }, metaRow: { minHeight: layout.minTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, metaIcon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' }, metaCopy: { flex: 1, minWidth: 0 }, sender: { padding: layout.cardPadding, borderRadius: radius.large, borderWidth: 1, borderColor: colors.avatarBorder, backgroundColor: colors.brand.blueSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, senderIcon: { width: layout.rowIconSize, height: layout.rowIconSize, borderRadius: radius.medium, backgroundColor: colors.neutral.white, alignItems: 'center', justifyContent: 'center' } });
