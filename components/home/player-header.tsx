import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { IconButton } from '@/components/common/icon-button';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { Player } from '@/types/player';

export function PlayerHeader({ player, onNotificationPress }: { player: Player; onNotificationPress?: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.playerColumn}>
        <View style={styles.avatar} accessibilityLabel={`${player.name}, jersey ${player.jerseyNumber}`}>
          <MaterialCommunityIcons name="account" size={28} color={colors.brand.navySoft} />
          <View style={styles.jersey}><AppText variant="caption" weight="extraBold" color={colors.brand.navy}>{player.jerseyNumber}</AppText></View>
        </View>
        <View style={styles.copy}>
          <AppText variant="caption" weight="medium" color={colors.neutral.textSecondary}>Good evening</AppText>
          <AppText variant="title" weight="extraBold" numberOfLines={2}>{player.name}</AppText>
          <AppText variant="bodySmall" weight="medium" color={colors.neutral.textSecondary} numberOfLines={1} ellipsizeMode="tail">{player.category}</AppText>
        </View>
      </View>
      <View style={styles.actionsColumn}>
        <View style={styles.academyBadge} accessibilityLabel={player.academy}>
          <BrandLogo containerSize={layout.academyLogoSize} />
        </View>
        <IconButton testID="home-notification-button" icon="bell-outline" size={21} accessibilityLabel="Open academy updates" onPress={onNotificationPress} style={styles.notification} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm, paddingBottom: layout.headerToFirstSection, gap: spacing.sm },
  playerColumn: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 50, height: 50, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, borderWidth: 1, borderColor: colors.avatarBorder, alignItems: 'center', justifyContent: 'center' },
  jersey: { position: 'absolute', right: -4, bottom: -4, minWidth: 22, height: 22, paddingHorizontal: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.brand.gold, borderWidth: 2, borderColor: colors.neutral.background, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0 },
  actionsColumn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  academyBadge: { ...shadows.floating, width: layout.academyLogoSize, height: layout.academyLogoSize, borderRadius: radius.pill, backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  notification: { ...shadows.floating, backgroundColor: colors.neutral.surface },
});
