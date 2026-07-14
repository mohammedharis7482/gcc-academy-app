import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { UpcomingSessionCard, WeeklyScheduleCard } from '@/components/training/training-schedule-content';
import { playerTrainingSchedule } from '@/data/training';
import { colors, layout } from '@/design/tokens';

export default function TrainingScheduleScreen() {
  const router = useRouter();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)'); };
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Training Schedule" subtitle={playerTrainingSchedule.category} onBack={back} /><View style={styles.intro}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Regular weekly sessions and confirmed upcoming changes for Ayaan.</AppText></View><View style={styles.sections}><ProfileSection title="Weekly Schedule"><WeeklyScheduleCard slots={playerTrainingSchedule.weeklySchedule} /></ProfileSection><ProfileSection title="Upcoming Sessions"><View style={styles.list}>{playerTrainingSchedule.upcomingSessions.map((session) => <UpcomingSessionCard key={session.id} session={session} />)}</View></ProfileSection></View></AppScreen>;
}

const styles = StyleSheet.create({ intro: { marginBottom: layout.headerToFirstSection }, sections: { gap: layout.sectionGap }, list: { gap: layout.cardGap } });
