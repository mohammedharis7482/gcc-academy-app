import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { LegalInfoSection } from '@/components/profile/legal-info-section';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { colors, layout, radius, spacing } from '@/design/tokens';

export default function PrivacyScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="Privacy Policy" subtitle="Academy data and account privacy" onBack={back} /><View style={styles.notice}><AppText variant="bodySmall" weight="bold" color={colors.status.warning}>POLICY REVIEW PENDING</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>This summary is informational and is not the academy’s final legal policy.</AppText></View><View style={styles.sections}><LegalInfoSection title="Player Information">The approved policy will explain how registered player, guardian, attendance, performance, Academy Session, and payment data are handled.</LegalInfoSection><LegalInfoSection title="Account Access">The approved policy will describe academy-authorized access, account security, retention, and correction requests.</LegalInfoSection><LegalInfoSection title="Before Release">GCC Football Academy will review and publish its approved privacy policy before production release.</LegalInfoSection></View></AppScreen>;
}

const styles = StyleSheet.create({ notice: { marginBottom: layout.sectionHeaderToCard, padding: layout.compactRowPaddingHorizontal, borderRadius: radius.compact, backgroundColor: colors.status.warningSoft, gap: spacing.xs }, sections: { gap: layout.cardGap } });
