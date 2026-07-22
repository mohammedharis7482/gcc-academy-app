import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { AcademyUpdateCard } from '@/components/home/academy-update-card';
import { AttendanceHomeCard } from '@/components/home/attendance-home-card';
import { CoachFeedbackCard } from '@/components/home/coach-feedback-card';
import { FeeReminderCard } from '@/components/home/fee-reminder-card';
import { LearningVideoCard } from '@/components/home/learning-video-card';
import { NextTrainingCard } from '@/components/home/next-training-card';
import { PlayerHeader } from '@/components/home/player-header';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { HeroCardSkeleton, ListRowSkeleton, PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { assessmentAverage } from '@/data/assessments';
import { getLessonById, getSessionTopic } from '@/data/learning';
import { homeDashboardMock } from '@/data/home';
import { latestAssessmentId } from '@/data/progress-details';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { useAssessments } from '@/contexts/assessment-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { useLearning } from '@/contexts/learning-context';
import { useUpdates } from '@/contexts/updates-context';
import { layout } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

export default function HomeScreen() {
  const router = useRouter(); const attendance = useAttendanceData(); const assessments = useAssessments(); const learning = useLearning(); const operations = useAcademyOperations(); const updates = useUpdates();
  const navigateOnce = useSingleNavigation();
  const attendanceSummary = attendance.getPlayerSummary('player-ayaan'); const latestAssessment = assessments.getLatestAssessment('player-ayaan'); const latestFull = assessments.getLatestFullAssessment('player-ayaan');
  const categorySchedules = operations.getSchedulesForCategory('u13'); const schedule = categorySchedules.find((item) => item.source === 'coach-created' && item.status === 'upcoming') ?? categorySchedules.filter((item) => item.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextTraining = schedule ? { id: schedule.id, relativeDay: schedule.date === '2026-07-11' ? 'Today' : 'Next', date: schedule.dateLabel, time: schedule.time, venue: schedule.pitch, coachName: `Coach ${schedule.coachName}`, category: schedule.categoryName, countdown: 'Published schedule', focus: schedule.note, status: schedule.status } as const : null;
  const assignments = operations.getAssignmentsForPlayer('player-ayaan', 'u13'); const latestAssignment = assignments[0]; const assignedSession = latestAssignment ? getLessonById(latestAssignment.sessionId) : undefined; const assignedProgress = assignedSession ? learning.getProgress(assignedSession) : undefined;
  const assignedVideo = assignedSession && assignedProgress ? { id: assignedSession.id, title: assignedSession.title, type: getSessionTopic(assignedSession), coachName: latestAssignment.assignedByName, durationMinutes: assignedSession.durationMinutes, watchedMinutes: assignedProgress.watchedMinutes } : null;
  const dynamicFeedback = latestAssessment ? { id: latestAssessment.id, coachName: 'Sandeep', coachRole: 'Technical Coach', date: new Date(latestAssessment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), text: latestAssessment.comment, focus: latestAssessment.improvementArea } : homeDashboardMock.latestFeedback;
  const rating = latestFull ? assessmentAverage(latestFull) ?? homeDashboardMock.progress.coachRating : homeDashboardMock.progress.coachRating;
  const latestUpdate = updates.updates[0] ? { id: updates.updates[0].id, title: updates.updates[0].title, summary: updates.updates[0].preview, publishedAt: updates.updates[0].relativeTime } : homeDashboardMock.latestUpdate;
  const openPerformance = () => navigateOnce(() => latestAssessment?.mode === 'quick-feedback' ? router.push({ pathname: '/progress/feedback/[feedbackId]', params: { feedbackId: latestAssessment.id } }) : router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId: latestAssessment?.id ?? latestAssessmentId } }));
  const loading = attendance.loadStatus === 'loading' || assessments.status === 'loading' || learning.loadState === 'loading' || operations.status === 'loading' || updates.status === 'loading';
  const partialError = attendance.loadStatus === 'error' || assessments.status === 'error' || operations.status === 'error' || updates.status === 'error';
  if (loading) return <AppScreen><View style={styles.loading} accessibilityLabel="Loading player dashboard"><PageHeaderSkeleton /><HeroCardSkeleton /><SummaryCardSkeleton /><ListRowSkeleton avatar /></View></AppScreen>;
  return <AppScreen><FadeInView translate={false}><PlayerHeader player={homeDashboardMock.player} onNotificationPress={() => navigateOnce(() => router.navigate('/(tabs)/updates'))} /></FadeInView><View style={styles.sections}>{partialError ? <InlineInfoBanner tone="warning" title="Some academy information could not be refreshed" message="Saved dashboard information remains available." /> : null}<FadeInView delay={40}>{nextTraining ? <NextTrainingCard training={nextTraining} onPress={() => navigateOnce(() => router.push('/training/schedule'))} /> : <ContentState type="empty" title="No upcoming training" message="A new schedule will appear when your Coach publishes it." />}</FadeInView>{attendanceSummary ? <View><SectionHeader title="Attendance Summary" actionLabel="View Attendance" onAction={() => navigateOnce(() => router.push('/progress/attendance'))} /><AttendanceHomeCard summary={attendanceSummary} onPress={() => navigateOnce(() => router.push('/progress/attendance'))} /></View> : null}{dynamicFeedback ? <View><SectionHeader title="Latest Performance" actionLabel="View Progress" onAction={() => navigateOnce(() => router.navigate('/(tabs)/progress'))} /><CoachFeedbackCard feedback={dynamicFeedback} rating={rating} onPress={openPerformance} /></View> : null}{assignedVideo ? <View><SectionHeader title="Assigned Session" actionLabel="All Sessions" onAction={() => navigateOnce(() => router.navigate('/(tabs)/sessions'))} /><LearningVideoCard video={assignedVideo} onPress={() => navigateOnce(() => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId: assignedVideo.id } }))} /></View> : <ContentState type="empty" title="No assigned sessions yet" message="Your Coach's assigned Academy Sessions will appear here." />}{latestUpdate ? <View><SectionHeader title="Latest Update" actionLabel="View All Updates" onAction={() => navigateOnce(() => router.navigate('/(tabs)/updates'))} /><AcademyUpdateCard update={latestUpdate} onPress={() => navigateOnce(() => router.push({ pathname: '/updates/[updateId]', params: { updateId: latestUpdate.id } }))} /></View> : <ContentState type="empty" title="No announcements yet" message="Academy and Coach updates will appear here." />}{homeDashboardMock.feeReminder ? <View><SectionHeader title="Payment Status" actionLabel="View Payments" onAction={() => navigateOnce(() => router.push('/profile/fees'))} /><FeeReminderCard fee={homeDashboardMock.feeReminder} onPress={() => navigateOnce(() => router.push('/profile/fees'))} /></View> : null}</View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, loading: { gap: layout.cardGap } });
