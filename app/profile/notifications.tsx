import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { NotificationSettingRow } from '@/components/profile/settings-components';
import { SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { useProfile } from '@/contexts/profile-context';
import { layout } from '@/design/tokens';

const settings = [
  ['trainingUpdates', 'Training updates', 'Schedule, time, and ground changes'],
  ['progressFeedback', 'Progress and feedback', 'Assessments and new coach guidance'],
  ['feeReminders', 'Payment reminders', 'Upcoming and overdue academy payments'],
  ['learningRecommendations', 'Session recommendations', 'Academy Sessions selected for player development'],
  ['academyAnnouncements', 'Academy announcements', 'Important GCC news and notices'],
] as const;

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { preferences, togglePreference } = useProfile();
  const { showSuccess } = useToast();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  const updatePreference = (key: typeof settings[number][0]) => { togglePreference(key); showSuccess('Settings updated', 'Your notification preference was saved.'); };
  return <AppScreen><SubpageHeader title="Notification Settings" subtitle="Choose which academy alerts you receive" onBack={back} /><View style={styles.sections}><InlineInfoBanner title="Changes apply immediately" message="Notification preferences are saved on this device." /><SurfaceCard>{settings.map(([key, label, description]) => <NotificationSettingRow key={key} label={label} description={description} value={preferences[key]} onValueChange={() => updatePreference(key)} />)}</SurfaceCard></View></AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: layout.cardGap } });
