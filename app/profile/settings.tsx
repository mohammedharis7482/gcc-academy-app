import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileMenuItem, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { demoConfig } from '@/config/demo';
import { useAttendanceDraft } from '@/contexts/attendance-context';
import { useLearning } from '@/contexts/learning-context';
import { useProfile } from '@/contexts/profile-context';
import { useUpdates } from '@/contexts/updates-context';
import { useAssessments } from '@/contexts/assessment-context';
import { useTrainingPlans } from '@/contexts/training-plan-context';
import { useToast } from '@/components/states/success-toast';
import { colors, spacing } from '@/design/tokens';
import { clearDemoStorage } from '@/utils/app-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetAttendance } = useAttendanceDraft();
  const { selectedLanguage, setLanguage, resetSettings } = useProfile();
  const { resetProgress } = useLearning();
  const { resetReadState } = useUpdates();
  const { resetAssessments } = useAssessments();
  const { resetTrainingPlans } = useTrainingPlans();
  const { showSuccess } = useToast(); const [resetVisible, setResetVisible] = useState(false); const [resetting, setResetting] = useState(false);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  const resetDemo = async () => { setResetting(true); await clearDemoStorage(true); resetProgress(); resetReadState(); resetSettings(); resetAttendance(); await Promise.all([resetAssessments(), resetTrainingPlans()]); setResetting(false); setResetVisible(false); showSuccess('Demo data reset', 'The frontend demo state has been restored.'); };
  return <><AppScreen><SubpageHeader title="Language" subtitle="App language preferences" onBack={back} /><View style={styles.sections}><SurfaceCard><ProfileMenuItem icon="check-circle" label="English" supportingText="Current app language" trailingText={selectedLanguage === 'en' ? 'Selected' : undefined} onPress={() => setLanguage('en')} /><ProfileMenuItem icon="clock-outline" label="Malayalam" supportingText="Localization is planned for a future release" trailingText="Coming later" /></SurfaceCard>{demoConfig.resetEnabled ? <ProfileSection title="Developer Demo"><View style={styles.demo}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Restore local Session progress, updates, attendance, assessments, training plans, Admin records, and preferences without signing out.</AppText><AppButton testID="reset-demo-data" label="Reset demo data" variant="secondary" onPress={() => setResetVisible(true)} accessibilityLabel="Reset frontend demo data" /></View></ProfileSection> : null}</View></AppScreen><AppConfirmationDialog visible={resetVisible} icon="restore-alert" title="Reset demo data?" description="Session progress, update read state, attendance, assessments, training plans, Admin records, and preferences will return to their defaults. You will remain signed in." cancelLabel="Keep Demo Data" confirmLabel="Reset Demo Data" destructive loading={resetting} onCancel={() => setResetVisible(false)} onConfirm={() => { void resetDemo(); }} /></>;
}

const styles = StyleSheet.create({ sections: { gap: spacing.lg }, demo: { gap: spacing.sm } });
