import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { NotificationSettingRow } from '@/components/profile/settings-components';
import { SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { useProfile } from '@/contexts/profile-context';
import { colors, spacing } from '@/design/tokens';
import { AppText } from '@/components/common/app-text';

const settings = [
  ['trainingUpdates', 'Training updates', 'Schedule, time, and ground changes'],
  ['progressFeedback', 'Progress and feedback', 'Assessments and new coach guidance'],
  ['feeReminders', 'Fee reminders', 'Upcoming and overdue academy fees'],
  ['learningRecommendations', 'Learning recommendations', 'Lessons selected for player development'],
  ['academyAnnouncements', 'Academy announcements', 'Important GCC news and notices'],
] as const;

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { preferences, togglePreference } = useProfile();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  return <AppScreen><SubpageHeader title="Notification Settings" subtitle="Choose which academy alerts you receive" onBack={back} /><View style={styles.intro}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Changes apply immediately and are saved on this device.</AppText></View><SurfaceCard>{settings.map(([key, label, description]) => <NotificationSettingRow key={key} label={label} description={description} value={preferences[key]} onValueChange={() => togglePreference(key)} />)}</SurfaceCard></AppScreen>;
}

const styles = StyleSheet.create({ intro: { paddingBottom: spacing.md } });
