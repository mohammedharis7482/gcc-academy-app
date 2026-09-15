import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { ProgressBar } from '@/components/common/progress-bar';
import { StatusBadge } from '@/components/common/status-badge';
import { adminLayout } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { AdminSquad, SquadStatus } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const squadTone: Readonly<Record<SquadStatus, 'success' | 'warning' | 'neutral'>> = { open: 'success', full: 'warning', paused: 'neutral' };
const squadLabel: Readonly<Record<SquadStatus, string>> = { open: 'Open', full: 'Full', paused: 'Paused' };

export function SquadCard({ squad, memberCount, headCoachName, onPress }: { readonly squad: AdminSquad; readonly memberCount: number; readonly headCoachName: string; readonly onPress?: () => void }) {
  const fill = squad.capacity ? memberCount / squad.capacity : 0;
  const label = `${squad.name}, ${memberCount} of ${squad.capacity} places, head coach ${headCoachName}`;
  const content = <>
    <View style={styles.top}><View style={styles.icon}><MaterialCommunityIcons name="account-group-outline" size={22} color={colors.brand.blue} /></View><View style={styles.grow}><AppText variant="heading" weight="extraBold" numberOfLines={1}>{squad.name}</AppText><AppText variant="caption" color={colors.neutral.textSecondary} numberOfLines={1}>{squad.batch} · Coach {headCoachName}</AppText></View><StatusBadge label={squadLabel[squad.status]} tone={squadTone[squad.status]} /></View>
    <ProgressBar progress={fill} color={fill >= 1 ? colors.status.warning : colors.brand.blue} accessibilityLabel={`${squad.name} capacity ${Math.round(fill * 100)} percent`} />
    <View style={styles.meta}><Meta icon="account-multiple-outline" label={`${memberCount} of ${squad.capacity} places`} /><Meta icon="calendar-week" label={squad.trainingDays.join(', ')} /><Meta icon="map-marker-outline" label={squad.ground} /><Meta icon="cash" label={`${formatCurrency(squad.monthlyFee)} per month`} /></View>
  </>;
  if (!onPress) return <View accessibilityLabel={label} style={styles.card}>{content}</View>;
  return <AnimatedPressable testID={`admin-squad-${squad.id}`} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.card}>{content}</AnimatedPressable>;
}

function Meta({ icon, label }: { readonly icon: keyof typeof MaterialCommunityIcons.glyphMap; readonly label: string }) {
  return <View style={styles.metaItem}><MaterialCommunityIcons name={icon} size={16} color={colors.brand.blue} /><AppText variant="caption" weight="semibold" color={colors.neutral.textSecondary} numberOfLines={1} style={styles.grow}>{label}</AppText></View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  card: { ...shadows.card, padding: adminLayout.cardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: 40, height: 40, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  metaItem: { minWidth: '46%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
});
