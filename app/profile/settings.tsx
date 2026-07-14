import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileMenuItem, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { demoConfig } from '@/config/demo';
import { useLearning } from '@/contexts/learning-context';
import { useProfile } from '@/contexts/profile-context';
import { useUpdates } from '@/contexts/updates-context';
import { colors, spacing } from '@/design/tokens';
import { clearDemoStorage } from '@/utils/app-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { selectedLanguage, setLanguage, resetSettings } = useProfile();
  const { resetProgress } = useLearning();
  const { resetReadState } = useUpdates();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  const resetDemo = () => Alert.alert('Reset demo data?', 'Learning progress, update read state, and preferences will return to their defaults. You will remain signed in.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => { void clearDemoStorage(true).then(() => { resetProgress(); resetReadState(); resetSettings(); Alert.alert('Demo data reset', 'The frontend demo state has been restored.'); }); } }]);
  return <AppScreen><SubpageHeader title="Language" subtitle="App language preferences" onBack={back} /><View style={styles.sections}><SurfaceCard><ProfileMenuItem icon="check-circle" label="English" supportingText="Current app language" trailingText={selectedLanguage === 'en' ? 'Selected' : undefined} onPress={() => setLanguage('en')} /><ProfileMenuItem icon="clock-outline" label="Malayalam" supportingText="Localization is planned for a future release" trailingText="Coming later" /></SurfaceCard>{demoConfig.resetEnabled ? <ProfileSection title="Developer Demo"><View style={styles.demo}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Restore local learning, update, and preference state without signing out.</AppText><AppButton testID="reset-demo-data" label="Reset demo data" variant="secondary" onPress={resetDemo} accessibilityLabel="Reset frontend demo data" /></View></ProfileSection> : null}</View></AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: spacing.lg }, demo: { gap: spacing.sm } });
