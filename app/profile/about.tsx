import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { BrandLogo } from '@/components/common/brand-logo';
import { InfoRow, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { colors, layout, radius, spacing } from '@/design/tokens';

export default function AboutScreen() {
  const router = useRouter();
  const [logoFailed, setLogoFailed] = useState(false);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="About GCC Academy" subtitle="Football development in Chalissery" onBack={back} /><View style={styles.sections}><View style={styles.hero}>{!logoFailed ? <BrandLogo containerSize={layout.brandFeatureLogoSize} feature onError={() => setLogoFailed(true)} /> : <MaterialCommunityIcons name="shield-star-outline" size={44} color={colors.brand.gold} />}<View style={styles.copy}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>GCC Chalissery Football Academy</AppText><AppText variant="bodySmall" color={colors.navyMutedText}>Building confident footballers through structured academy development.</AppText></View></View><ProfileSection title="Our Story"><SurfaceCard><InfoRow icon="flag-outline" label="Football club founded" value="1980" /><InfoRow icon="school-outline" label="Academy established" value="2021" /><InfoRow icon="shield-check-outline" label="AIFF affiliation achieved" value="2024" /></SurfaceCard></ProfileSection><ProfileSection title="Player Categories"><SurfaceCard><InfoRow icon="account-group-outline" label="Current academy categories" value="U10, U13, U15" /></SurfaceCard></ProfileSection></View></AppScreen>;
}

const styles = StyleSheet.create({
  sections: { gap: layout.sectionGap },
  hero: { padding: layout.visualCardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
});
