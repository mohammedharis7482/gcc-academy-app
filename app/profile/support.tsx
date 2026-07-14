import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { ProfileMenuItem, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { academySupportContact } from '@/config/academy';
import { colors, layout, radius, spacing } from '@/design/tokens';

const helpTopics = ['Login problem', 'Incorrect player information', 'Fee record issue', 'Missing attendance', 'Learning-video problem'] as const;

export default function SupportScreen() {
  const router = useRouter();
  const [linkError, setLinkError] = useState<string>();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  const openContact = async (label: string, url: string) => {
    setLinkError(undefined);
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('Unsupported link');
      await Linking.openURL(url);
    } catch { setLinkError(`${label} is unavailable on this device. Please use another contact method.`); }
  };
  const phoneUrl = `tel:${academySupportContact.phone.replace(/\s/g, '')}`;
  const whatsappUrl = `https://wa.me/${academySupportContact.whatsapp.replace(/[^0-9]/g, '')}`;
  const emailUrl = `mailto:${academySupportContact.email}`;
  return <AppScreen><SubpageHeader title="Help & Support" subtitle="Get help from the GCC academy team" onBack={back} /><View style={styles.sections}>{academySupportContact.isDemo ? <View style={styles.demo}><MaterialCommunityIcons name="information-outline" size={19} color={colors.status.warning} /><AppText variant="bodySmall" weight="semibold" color={colors.status.warning} style={styles.grow}>Demo contact details — replace before production launch.</AppText></View> : null}{linkError ? <View accessibilityRole="alert" style={styles.error}><AppText variant="bodySmall" weight="semibold" color={colors.status.error}>{linkError}</AppText></View> : null}<ProfileSection title="Contact the Academy"><SurfaceCard><ProfileMenuItem icon="phone-outline" label="Academy phone" supportingText={academySupportContact.phone} onPress={() => void openContact('Phone', phoneUrl)} /><ProfileMenuItem icon="whatsapp" label="WhatsApp" supportingText={academySupportContact.whatsapp} onPress={() => void openContact('WhatsApp', whatsappUrl)} /><ProfileMenuItem icon="email-outline" label="Email" supportingText={academySupportContact.email} onPress={() => void openContact('Email', emailUrl)} /><ProfileMenuItem icon="clock-outline" label="Office hours" supportingText={academySupportContact.officeHours} /></SurfaceCard></ProfileSection><ProfileSection title="Common Help Topics"><SurfaceCard>{helpTopics.map((topic) => <ProfileMenuItem key={topic} icon="help-circle-outline" label={topic} onPress={() => void openContact('Email', `${emailUrl}?subject=${encodeURIComponent(topic)}`)} />)}</SurfaceCard></ProfileSection></View></AppScreen>;
}

const styles = StyleSheet.create({
  sections: { gap: layout.sectionGap },
  demo: { padding: spacing.md, borderRadius: radius.medium, borderWidth: 1, borderColor: colors.amberBorder, backgroundColor: colors.status.warningSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  error: { padding: spacing.md, borderRadius: radius.medium, borderWidth: 1, borderColor: colors.errorBorder, backgroundColor: colors.status.errorSoft },
  grow: { flex: 1 },
});
