import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { PlayerIdentity } from '@/types/profile';

export function PlayerIdentityCard({ identity }: { identity: PlayerIdentity }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  return <View style={styles.card} accessibilityLabel={`${identity.name}, ${identity.category}, active member, player ID ${identity.playerId}`}><View style={styles.accent} /><View style={styles.top}><View style={styles.photo}>{identity.photo && !photoFailed ? <Image source={identity.photo} style={styles.photoImage} contentFit="cover" contentPosition="center" onError={() => setPhotoFailed(true)} /> : <MaterialCommunityIcons name="account" size={36} color={colors.brand.navy} />}</View><View style={styles.identity}><AppText variant="caption" weight="bold" color={colors.navyMutedText}>GCC PLAYER</AppText><AppText variant="title" weight="extraBold" color={colors.neutral.white} numberOfLines={2}>{identity.name}</AppText><AppText variant="bodySmall" weight="medium" color={colors.navyMutedText} numberOfLines={2}>{identity.category}</AppText></View><View style={styles.logoWrap}>{!logoFailed ? <BrandLogo containerSize={layout.academyLogoSize} onError={() => setLogoFailed(true)} /> : <MaterialCommunityIcons name="shield-star-outline" size={28} color={colors.brand.gold} />}</View></View><View style={styles.statusRow}><View style={styles.activeBadge}><View style={styles.statusDot} /><AppText variant="caption" weight="extraBold" color={colors.neutral.white}>ACTIVE</AppText></View><View style={styles.jersey}><AppText variant="caption" weight="bold" color={colors.navyMutedText}>JERSEY</AppText><AppText variant="heading" weight="extraBold" color={colors.neutral.white}>#{identity.jerseyNumber}</AppText></View></View><View style={styles.divider} /><View style={styles.details}><Detail label="PLAYER ID" value={identity.playerId} /><Detail label="JOINED" value={String(identity.joinedYear)} /></View></View>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><AppText variant="caption" weight="bold" color={colors.navyMutedText}>{label}</AppText><AppText variant="bodySmall" weight="extraBold" color={colors.neutral.white}>{value}</AppText></View>;
}

const styles = StyleSheet.create({
  card: { ...shadows.hero, overflow: 'hidden', padding: layout.visualCardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, gap: spacing.sm },
  accent: { position: 'absolute', top: 0, left: spacing.xl, width: 72, height: 4, borderBottomLeftRadius: radius.small, borderBottomRightRadius: radius.small, backgroundColor: colors.brand.gold },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  photo: { width: layout.profileAvatarSize, height: layout.profileAvatarSize, overflow: 'hidden', borderRadius: radius.large, borderWidth: 2, borderColor: colors.navyBorder, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  photoImage: { width: '100%', height: '100%' },
  identity: { flex: 1, minWidth: 0, gap: spacing.xs },
  logoWrap: { width: layout.academyLogoSize, height: layout.academyLogoSize, overflow: 'hidden', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.navyBorder, backgroundColor: colors.neutral.white, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  activeBadge: { minHeight: 28, paddingHorizontal: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.brand.navySoft, borderWidth: 1, borderColor: colors.navyBorder, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statusDot: { width: spacing.xs, height: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.status.success },
  jersey: { alignItems: 'flex-end' },
  divider: { height: 1, backgroundColor: colors.navyBorder },
  details: { flexDirection: 'row', gap: spacing.md },
  detail: { flex: 1, minWidth: 0, gap: spacing.xs },
});
