import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OperationsChoiceChips } from '@/components/coach/operations-controls';
import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { ProfileSection, SurfaceCard } from '@/components/profile/profile-shared';
import { AchievementCards } from '@/components/progress/achievement-cards';
import { ContinueLearningCard } from '@/components/progress/continue-learning-card';
import { CurrentGoalCard } from '@/components/progress/current-goal-card';
import { AttendanceSummaryCard, OverallDevelopmentCard } from '@/components/progress/development-overview';
import { FeedbackTimeline } from '@/components/progress/feedback-timeline';
import { MonthlyDevelopmentChart } from '@/components/progress/monthly-development-chart';
import { ProgressHeader } from '@/components/progress/progress-header';
import { AttendanceSessionRow } from '@/components/progress/progress-detail-content';
import { CoachSkillRatingsCard, SkillRadarCard } from '@/components/progress/skills-dashboard';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { ListRowSkeleton, PageHeaderSkeleton, SummaryCardSkeleton } from '@/components/states/loading-skeletons';
import { useAssessments } from '@/contexts/assessment-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { assessmentAverage, toPlayerAssessment } from '@/data/assessments';
import { getLessonById } from '@/data/learning';
import { progressDashboardMock } from '@/data/progress';
import { julyAttendance, latestAssessmentId } from '@/data/progress-details';
import { layout } from '@/design/tokens';
import { AttendanceSession, ProgressFeedback, SkillRating } from '@/types/progress';

type ProgressView = 'Attendance' | 'Performance';

export default function ProgressScreen() {
  const router = useRouter(); const attendance = useAttendanceData(); const assessments = useAssessments(); const [view, setView] = useState<ProgressView>('Attendance');
  const attendanceSummary = attendance.getPlayerSummary('player-ayaan'); const latest = assessments.getLatestAssessment('player-ayaan'); const latestFull = assessments.getLatestFullAssessment('player-ayaan'); const playerAssessment = latestFull ? toPlayerAssessment(latestFull) : undefined; const average = latestFull ? assessmentAverage(latestFull) : undefined;
  const recommendedSessionId = latest?.recommendedLessonIds[0] ?? progressDashboardMock.recommendedLesson.id; const recommended = getLessonById(recommendedSessionId);
  const dynamicFeedback = assessments.getPlayerAssessments('player-ayaan').filter((item) => item.source === 'coach-created').map((item) => ({ id: item.id, date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), coachName: 'Sandeep', message: item.comment, focus: item.improvementArea }));
  const goalTargetMatch = latest?.developmentGoal?.target?.match(/\d+/); const goalTarget = goalTargetMatch ? Number(goalTargetMatch[0]) : 100;
  const dashboard = { ...progressDashboardMock, updatedAt: latest ? `Updated ${new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : progressDashboardMock.updatedAt, overall: average ? { ...progressDashboardMock.overall, score: Math.round(average * 20), summary: latestFull?.comment ?? progressDashboardMock.overall.summary } : progressDashboardMock.overall, attendance: attendanceSummary ? { ...progressDashboardMock.attendance, percentage: attendanceSummary.percentage, attendedSessions: attendanceSummary.present + attendanceSummary.late, totalSessions: attendanceSummary.total } : progressDashboardMock.attendance, skillRatings: playerAssessment?.skillScores.length ? [...playerAssessment.skillScores] : progressDashboardMock.skillRatings, feedback: [...dynamicFeedback, ...progressDashboardMock.feedback.filter((item) => !dynamicFeedback.some((entry) => entry.id === item.id))], currentGoal: latest?.developmentGoal ? { id: `goal-${latest.id}`, title: latest.developmentGoal.title, description: latest.comment, current: Math.round((latest.developmentGoal.progressValue ?? 0) * goalTarget / 100), target: goalTarget, dueDate: latest.developmentGoal.dueLabel ?? 'next review' } : progressDashboardMock.currentGoal, recommendedLesson: recommended ? { id: recommended.id, title: recommended.title, category: recommended.category, durationMinutes: recommended.durationMinutes, reason: 'Recommended from your latest Coach review' } : progressDashboardMock.recommendedLesson };
  const history = new Map<string, AttendanceSession>(julyAttendance.sessions.map((session) => [session.id, session])); attendance.getPlayerHistory('player-ayaan').forEach(({ session, entry }) => { if (entry.status !== 'not-marked') history.set(session.id, { id: session.id, date: session.displayDate, time: session.timeLabel, coachName: 'Sandeep', status: entry.status, note: entry.note }); }); const attendanceHistory = [...history.values()].sort((a, b) => b.date.localeCompare(a.date));
  const openSession = () => router.push({ pathname: '/sessions/[sessionId]', params: { sessionId: dashboard.recommendedLesson.id } }); const openSkill = (skill: SkillRating) => router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId: latestFull?.id ?? latestAssessmentId, skillId: skill.key } }); const openFeedback = (feedback: ProgressFeedback) => router.push({ pathname: '/progress/feedback/[feedbackId]', params: { feedbackId: feedback.id } });
  const loading = attendance.loadStatus === 'loading' || assessments.status === 'loading'; const partialError = attendance.loadStatus === 'error' || assessments.status === 'error';
  if (loading) return <AppScreen><View style={styles.loading}><PageHeaderSkeleton /><SummaryCardSkeleton /><ListRowSkeleton /></View></AppScreen>;
  return <AppScreen><ProgressHeader playerName={dashboard.playerName} updatedAt={dashboard.updatedAt} /><View style={styles.sections}><OperationsChoiceChips values={['Attendance', 'Performance'] as const} selected={view} onSelect={setView} label="Progress section" />{partialError ? <InlineInfoBanner tone="warning" title="Some progress information could not be refreshed" message="Your latest saved information remains available." /> : null}{view === 'Attendance' ? <>{attendanceSummary ? <><SectionHeader title="Monthly Attendance" /><AnimatedPressable testID="progress-attendance-card" onPress={() => router.push('/progress/attendance')} accessibilityRole="button"><AttendanceSummaryCard attendance={dashboard.attendance} /></AnimatedPressable><ProfileSection title="Training History"><SurfaceCard>{attendanceHistory.map((session) => <AttendanceSessionRow key={session.id} session={session} />)}</SurfaceCard></ProfileSection></> : <ContentState type="empty" title="No attendance history yet" message="Attendance will appear after your first recorded session." />}</> : <><FadeInView translate={false}><OverallDevelopmentCard development={dashboard.overall} /></FadeInView><View><SectionHeader title="Coach Skill Ratings" /><CoachSkillRatingsCard ratings={dashboard.skillRatings} onSkillPress={openSkill} /></View><View><SectionHeader title="Skill Overview" /><SkillRadarCard ratings={dashboard.skillRatings} /></View><View><SectionHeader title="Development Trend" /><MonthlyDevelopmentChart points={dashboard.monthlyDevelopment} /></View><View><SectionHeader title="Coach Feedback" /><FeedbackTimeline feedback={dashboard.feedback} onFeedbackPress={openFeedback} /></View><View><SectionHeader title="Achievements" /><AchievementCards achievements={dashboard.achievements} /></View><View><SectionHeader title="Current Goal" /><CurrentGoalCard goal={dashboard.currentGoal} onPress={openSession} /></View><View><SectionHeader title="Assigned Academy Session" /><ContinueLearningCard lesson={dashboard.recommendedLesson} onPress={openSession} /></View></>}</View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, loading: { gap: layout.cardGap } });
