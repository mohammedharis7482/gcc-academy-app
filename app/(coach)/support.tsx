import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileMenuItem, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { academySupportContact } from '@/config/academy';
import { colors, radius, spacing } from '@/design/tokens';

export default function CoachSupportScreen() {
  const router = useRouter();
  const phone = `tel:${academySupportContact.phone.replace(/\s/g, '')}`;
  const email = `mailto:${academySupportContact.email}`;
  const open = async (url: string) => { if (await Linking.canOpenURL(url)) await Linking.openURL(url); };
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Support" subtitle="Contact the GCC academy team" onBack={() => router.back()} /><View style={styles.sections}>{academySupportContact.isDemo ? <View style={styles.demo}><MaterialCommunityIcons name="information-outline" size={19} color={colors.status.warning} /><AppText variant="bodySmall" weight="semibold" color={colors.status.warning} style={styles.grow}>Demo contacts — replace before production.</AppText></View> : null}<SurfaceCard><ProfileMenuItem icon="phone-outline" label="Academy phone" supportingText={academySupportContact.phone} onPress={() => { void open(phone); }} /><ProfileMenuItem icon="email-outline" label="Email" supportingText={academySupportContact.email} onPress={() => { void open(email); }} /><ProfileMenuItem icon="clock-outline" label="Office hours" supportingText={academySupportContact.officeHours} /></SurfaceCard></View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: spacing.sm }, demo: { padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.warningSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, grow: { flex: 1 } });
