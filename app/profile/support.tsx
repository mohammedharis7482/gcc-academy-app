import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { ProfileMenuItem, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { academySupportContact } from '@/config/academy';
import { layout } from '@/design/tokens';

const helpTopics = ['Login problem', 'Incorrect player information', 'Payment record issue', 'Missing attendance', 'Session video problem'] as const;

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
  return <AppScreen><SubpageHeader title="Help & Support" subtitle="Get help from the GCC academy team" onBack={back} /><View style={styles.sections}>{academySupportContact.isDemo ? <InlineInfoBanner tone="warning" title="Demo contact details" message="Replace these contacts before production launch." /> : null}{linkError ? <InlineInfoBanner tone="error" title="Unable to open this contact method" message={linkError} /> : null}<ProfileSection title="Contact the Academy"><SurfaceCard><ProfileMenuItem icon="phone-outline" label="Academy phone" supportingText={academySupportContact.phone} onPress={() => void openContact('Phone', phoneUrl)} /><ProfileMenuItem icon="whatsapp" label="WhatsApp" supportingText={academySupportContact.whatsapp} onPress={() => void openContact('WhatsApp', whatsappUrl)} /><ProfileMenuItem icon="email-outline" label="Email" supportingText={academySupportContact.email} onPress={() => void openContact('Email', emailUrl)} /><ProfileMenuItem icon="clock-outline" label="Office hours" supportingText={academySupportContact.officeHours} /></SurfaceCard></ProfileSection><ProfileSection title="Common Help Topics"><SurfaceCard>{helpTopics.map((topic) => <ProfileMenuItem key={topic} icon="help-circle-outline" label={topic} onPress={() => void openContact('Email', `${emailUrl}?subject=${encodeURIComponent(topic)}`)} />)}</SurfaceCard></ProfileSection></View></AppScreen>;
}

const styles = StyleSheet.create({
  sections: { gap: layout.sectionGap },
});
