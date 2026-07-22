import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileMenuItem, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { academySupportContact } from '@/config/academy';
import { colors, radius, spacing } from '@/design/tokens';

export default function CoachSupportScreen() {
  const router = useRouter();
  const [linkError, setLinkError] = useState<string>();
  const phone = `tel:${academySupportContact.phone.replace(/\s/g, '')}`;
  const email = `mailto:${academySupportContact.email}`;
  const open = async (label: string, url: string) => {
    setLinkError(undefined);
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Unsupported link');
      await Linking.openURL(url);
    } catch {
      setLinkError(`${label} is unavailable on this device. Please use another contact method.`);
    }
  };
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/profile'); };
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Support" subtitle="Contact the GCC academy team" onBack={back} /><View style={styles.sections}>{academySupportContact.isDemo ? <View style={styles.demo}><MaterialCommunityIcons name="information-outline" size={19} color={colors.status.warning} /><AppText variant="bodySmall" weight="semibold" color={colors.status.warning} style={styles.grow}>Demo contacts — replace before production.</AppText></View> : null}{linkError ? <InlineInfoBanner tone="error" title="Unable to open this contact method" message={linkError} /> : null}<SurfaceCard><ProfileMenuItem icon="phone-outline" label="Academy phone" supportingText={academySupportContact.phone} onPress={() => { void open('Phone', phone); }} /><ProfileMenuItem icon="email-outline" label="Email" supportingText={academySupportContact.email} onPress={() => { void open('Email', email); }} /><ProfileMenuItem icon="clock-outline" label="Office hours" supportingText={academySupportContact.officeHours} /></SurfaceCard></View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: spacing.sm }, demo: { padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.warningSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, grow: { flex: 1 } });
