import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { AppScreen } from '@/components/common/app-screen';
import { LegalPlaceholderSection } from '@/components/profile/legal-placeholder-section';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { colors, radius, spacing } from '@/design/tokens';

export default function TermsScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="Terms & Conditions" subtitle="Draft frontend content" onBack={back} /><View style={styles.notice}><AppText variant="bodySmall" weight="bold" color={colors.status.warning}>DRAFT / DEMO — NOT BINDING TERMS</AppText></View><View style={styles.sections}><LegalPlaceholderSection title="Academy Account">Final terms will describe authorized use of a registered player account by the player or guardian.</LegalPlaceholderSection><LegalPlaceholderSection title="Academy Information">Training, learning, progress, and fee information shown in the app will remain subject to academy confirmation.</LegalPlaceholderSection><LegalPlaceholderSection title="Before Launch">Approved academy terms, contact details, and effective dates will be added before production launch.</LegalPlaceholderSection></View></AppScreen>;
}

const styles = StyleSheet.create({ notice: { marginBottom: spacing.md, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.warningSoft }, sections: { gap: spacing.md } });
