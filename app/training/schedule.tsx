import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { UpcomingSessionCard, WeeklyScheduleCard } from '@/components/training/training-schedule-content';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { playerTrainingSchedule } from '@/data/training';
import { colors, layout } from '@/design/tokens';

export default function TrainingScheduleScreen() {
  const router = useRouter(); const operations = useAcademyOperations(); const schedules = operations.getSchedulesForCategory('u13');
  const sessions = schedules.map((schedule) => ({ id: schedule.id, date: schedule.dateLabel, time: schedule.time, ground: schedule.pitch, coachName: schedule.coachName, status: schedule.status, focus: schedule.note }));
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)');
  if (operations.status === 'loading') return <AppScreen><View style={styles.loading}><PageHeaderSkeleton /><SummaryCardSkeleton /></View></AppScreen>;
  return <AppScreen><SubpageHeader title="Training Schedule" subtitle={playerTrainingSchedule.category} onBack={back} /><View style={styles.intro}><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Regular weekly times and schedules published by Coach Sandeep.</AppText></View><View style={styles.sections}>{operations.storageWarning ? <InlineInfoBanner tone="warning" title="Saved schedule storage unavailable" message="Published demo schedules remain visible." actionLabel="Retry" onAction={operations.retry} /> : null}<ProfileSection title="Weekly Schedule"><WeeklyScheduleCard slots={playerTrainingSchedule.weeklySchedule} /></ProfileSection><ProfileSection title="Published Schedule">{sessions.length ? <View style={styles.list}>{sessions.map((session) => <UpcomingSessionCard key={session.id} session={session} />)}</View> : <ContentState type="empty" title="No upcoming training" message="A new schedule will appear when your Coach publishes it." />}</ProfileSection></View></AppScreen>;
}
const styles = StyleSheet.create({ loading: { gap: layout.sectionGap }, intro: { marginBottom: layout.headerToFirstSection }, sections: { gap: layout.sectionGap }, list: { gap: layout.cardGap } });
