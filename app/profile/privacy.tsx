import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { LegalPlaceholderSection } from '@/components/profile/legal-placeholder-section';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { colors, radius, spacing } from '@/design/tokens';

export default function PrivacyScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="Privacy Policy" subtitle="Draft frontend content" onBack={back} /><View style={styles.notice}><AppText variant="bodySmall" weight="bold" color={colors.status.warning}>DRAFT / DEMO — NOT A FINAL LEGAL POLICY</AppText></View><View style={styles.sections}><LegalPlaceholderSection title="Player Information">The production policy will explain how registered player, guardian, attendance, progress, learning, and fee data are handled.</LegalPlaceholderSection><LegalPlaceholderSection title="Account Access">The finalized policy will describe academy-authorized access, account security, retention, and correction requests.</LegalPlaceholderSection><LegalPlaceholderSection title="Before Launch">GCC Football Academy will review and publish approved privacy terms before the production release.</LegalPlaceholderSection></View></AppScreen>;
}

const styles = StyleSheet.create({ notice: { marginBottom: spacing.md, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.warningSoft }, sections: { gap: spacing.md } });
