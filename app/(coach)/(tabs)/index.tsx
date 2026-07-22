import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CoachHeader } from '@/components/coach/coach-header';
import { CoachTaskList, CoachUpdateCard } from '@/components/coach/coach-dashboard-lists';
import { CoachTrainingCard, QuickAction } from '@/components/coach/training-and-attendance';
import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { HeroCardSkeleton, ListRowSkeleton, PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { useAssessments } from '@/contexts/assessment-context';
import { useTrainingPlans } from '@/contexts/training-plan-context';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { coachLayout, coachTabBarMetrics } from '@/design/tokens';
import { CoachDashboardTask } from '@/types/academy';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

export default function CoachDashboardScreen() {
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const data = useAcademyData();
  const attendance = useAttendanceData();
  const assessmentState = useAssessments();
  const trainingState = useTrainingPlans();
  const operations = useAcademyOperations();
  const categorySchedules = operations.getSchedulesForCategory('u13');
  const activeSchedule = categorySchedules.find((item) => item.source === 'coach-created' && item.status === 'upcoming') ?? categorySchedules.find((item) => item.status === 'upcoming');
  const dashboardSession = activeSchedule ? { ...data.todaySession, id: activeSchedule.id, squadId: activeSchedule.categoryId, date: activeSchedule.dateLabel, shortDate: activeSchedule.dateLabel, time: activeSchedule.time, ground: activeSchedule.pitch, coachId: activeSchedule.coachId, focus: activeSchedule.note ?? data.todaySession.focus, status: activeSchedule.status } : data.todaySession;
  const trainingPlan = trainingState.getPlan('training-1');
  const squad = data.squads.find((item) => item.id === 'u13') ?? data.squads[0];
  const attendanceRecord = attendance.getSessionRecord('training-1');
  const attendanceSummary = attendance.getSessionSummary('training-1');
  const createdPlayers = new Set(assessmentState.records.filter((item) => item.source === 'coach-created').map((item) => item.playerId));
  const feedbackPending = Math.max(0, 4 - createdPlayers.size);
  const tasks = data.tasks.map((task) => {
    if (task.type === 'attendance' && attendanceRecord) return { ...task, title: 'U13 attendance completed', supportingText: `${attendanceSummary.marked} of ${attendanceSummary.total} players saved`, status: 'completed' as const };
    if (task.type === 'assessment') return { ...task, title: feedbackPending ? `Add feedback for ${feedbackPending} player${feedbackPending === 1 ? '' : 's'}` : 'Player feedback completed', supportingText: feedbackPending ? 'Post-session development notes' : 'All priority feedback has been published', status: feedbackPending ? 'pending' as const : 'completed' as const };
    if (task.type === 'training-plan' && trainingPlan?.source === 'coach-saved') {
      const completedDrills = trainingPlan.drills.filter((item) => item.completed).length;
      const lessonCount = trainingPlan.assignedLessonIds.length;
      const savedSummary = completedDrills > 0
        ? `${completedDrills} activities complete${lessonCount ? ` · ${lessonCount} Sessions assigned` : ''}`
        : lessonCount > 0 ? `${lessonCount} Sessions assigned` : 'Session details ready';
      if (trainingPlan.status === 'completed') return { ...task, title: 'U13 training session completed', supportingText: savedSummary, status: 'completed' as const };
      if (trainingPlan.status === 'in-progress') return { ...task, title: 'U13 session in progress', supportingText: savedSummary, status: 'in-progress' as const };
      return { ...task, title: 'U13 training plan saved', supportingText: savedSummary, status: 'completed' as const };
    }
    return task;
  });
  const openTask = (task: CoachDashboardTask) => {
    navigateOnce(() => {
      if (task.targetTab === 'attendance') router.navigate({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: 'training-1' } });
      else if (task.targetTab === 'training') router.navigate('/(coach)/(tabs)/schedule');
      else if (task.type === 'assessment') router.push('/(coach)/feedback');
      else router.navigate('/(coach)/(tabs)/players');
    });
  };
  const loading = data.rosterStatus === 'loading' || attendance.loadStatus === 'loading' || assessmentState.status === 'loading' || trainingState.status === 'loading' || operations.status === 'loading';
  const partialError = data.rosterStatus === 'error' || attendance.loadStatus === 'error' || assessmentState.status === 'error' || trainingState.status === 'error' || operations.status === 'error';
  if (loading) return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><View style={styles.loading} accessibilityLabel="Loading coach dashboard"><PageHeaderSkeleton /><HeroCardSkeleton height={220} /><SummaryCardSkeleton /><ListRowSkeleton /></View></AppScreen>;
  if (!squad) return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachHeader name={data.coach.name} roleTitle={data.coach.roleTitle} squadName="No assigned squad" /><ContentState type="empty" icon="account-group-outline" title="No players assigned" message="Assigned squads and training tasks will appear here." /></AppScreen>;
  const recentActivity = operations.announcements[0] ? { id: operations.announcements[0].id, title: 'Announcement posted', summary: operations.announcements[0].title, publishedAt: 'Just now' } : operations.assignments.find((item) => item.source === 'coach-created') ? { id: 'session-assigned', title: 'Academy Session assigned', summary: 'The Player Sessions list has been updated.', publishedAt: 'Just now' } : data.latestUpdate;
  return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><FadeInView translate={false}><CoachHeader name={data.coach.name} roleTitle={data.coach.roleTitle} squadName={squad.name} /></FadeInView><View style={styles.sections}>{partialError ? <InlineInfoBanner tone="warning" title="Some coach information could not be refreshed" message="Saved squad information remains available." /> : null}<FadeInView delay={40}><CoachTrainingCard session={dashboardSession} squad={squad} attendanceSubmitted={Boolean(attendanceRecord)} feedbackPending={feedbackPending} trainingPlan={trainingPlan} onAttendance={() => navigateOnce(() => router.navigate({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: 'training-1' } }))} onEditSchedule={() => navigateOnce(() => router.push({ pathname: '/(coach)/schedule/[scheduleId]', params: { scheduleId: dashboardSession.id } }))} /></FadeInView><View><SectionHeader title="Quick Actions" /><View style={styles.quickGrid}><QuickAction testID="coach-take-attendance" icon="clipboard-check-outline" label="Mark Attendance" onPress={() => navigateOnce(() => router.navigate({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: 'training-1' } }))} /><QuickAction testID="coach-add-schedule" icon="calendar-plus" label="Add Schedule" onPress={() => navigateOnce(() => router.push('/(coach)/schedule/new'))} /><QuickAction testID="coach-post-update" icon="bullhorn-outline" label="Post Update" onPress={() => navigateOnce(() => router.push('/(coach)/announcement/new'))} /><QuickAction testID="coach-assign-session" icon="play-box-multiple-outline" label="Assign Session" onPress={() => navigateOnce(() => router.push('/(coach)/session-assignment/new'))} /></View></View><View><SectionHeader title="Pending Tasks" /><CoachTaskList tasks={tasks} onTaskPress={openTask} /></View><View><SectionHeader title="Recent Activity" /><CoachUpdateCard update={recentActivity} onPress={() => navigateOnce(() => router.push('/(coach)/update'))} /></View></View></AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: coachLayout.sectionGap }, loading: { gap: coachLayout.cardGap }, quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: coachLayout.actionGridGap } });
