import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { LegalInfoSection } from '@/components/profile/legal-info-section';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { colors, layout, radius, spacing } from '@/design/tokens';

export default function TermsScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="Terms & Conditions" subtitle="Academy account terms" onBack={back} /><View style={styles.notice}><AppText variant="bodySmall" weight="bold" color={colors.status.warning}>TERMS REVIEW PENDING</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>This summary is informational and does not create binding terms.</AppText></View><View style={styles.sections}><LegalInfoSection title="Academy Account">The approved terms will describe authorized use of a registered player account by the player or guardian.</LegalInfoSection><LegalInfoSection title="Academy Information">Training, Academy Sessions, performance, and payment information shown in the app remains subject to academy confirmation.</LegalInfoSection><LegalInfoSection title="Before Release">Approved academy terms, contact information, and effective dates will be published before production release.</LegalInfoSection></View></AppScreen>;
}

const styles = StyleSheet.create({ notice: { marginBottom: layout.sectionHeaderToCard, padding: layout.compactRowPaddingHorizontal, borderRadius: radius.compact, backgroundColor: colors.status.warningSoft, gap: spacing.xs }, sections: { gap: layout.cardGap } });
