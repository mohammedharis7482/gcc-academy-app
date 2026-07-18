import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachPlayerIdentityCard, PlayerGoalCard, PlayerQuickActions, PlayerSnapshotCard } from '@/components/coach/player-detail-cards';
import { AssignedLessonsCard, CoachPlayerAcademyDetails, PlayerFeedbackCard } from '@/components/coach/player-detail-lists';
import { AppScreen } from '@/components/common/app-screen';
import { AppButton } from '@/components/common/app-button';
import { FadeInView } from '@/components/common/motion';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useAttendanceData } from '@/contexts/attendance-context';
import { useAssessments } from '@/contexts/assessment-context';
import { useTrainingPlans } from '@/contexts/training-plan-context';
import { getLatestPlayerAssessment, getPlayerById, getRecentPlayerFeedback } from '@/data/academy';
import { assessmentAverage, assessmentSkills } from '@/data/assessments';
import { getDefaultAttendanceSessionForSquad } from '@/data/attendance';
import { getLessonById } from '@/data/learning';
import { coachLayout } from '@/design/tokens';
import { CoachPlayerAction } from '@/types/academy';
import { LearningLesson } from '@/types/learning';

function normalizeParam(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default function CoachPlayerDetailScreen() {
  const params = useLocalSearchParams<{ playerId?: string | string[] }>(); const router = useRouter(); const data = useAcademyData(); const attendance = useAttendanceData(); const assessmentState = useAssessments(); const trainingState = useTrainingPlans(); const playerId = normalizeParam(params.playerId); const basePlayer = playerId ? getPlayerById(playerId) : undefined; const attendanceSummary = basePlayer ? attendance.getPlayerSummary(basePlayer.id) : undefined;
  const [showMore, setShowMore] = useState(false);
  const latestRecord = basePlayer ? assessmentState.getLatestAssessment(basePlayer.id) : undefined; const latestFull = basePlayer ? assessmentState.getLatestFullAssessment(basePlayer.id) : undefined; const dynamicGoal = latestRecord?.developmentGoal; const dynamicSkills = latestFull?.skillRatings.map((item) => ({ key: item.skill, label: assessmentSkills.find((skill) => skill.key === item.skill)?.label ?? item.skill, rating: item.rating }));
  const playerWithAttendance = basePlayer && attendanceSummary ? { ...basePlayer, attendance: { ...basePlayer.attendance, ...attendanceSummary }, sessionStatus: attendanceSummary.currentStatus } : basePlayer;
  const player = playerWithAttendance ? { ...playerWithAttendance, latestRating: latestFull ? assessmentAverage(latestFull) ?? playerWithAttendance.latestRating : playerWithAttendance.latestRating, focus: dynamicGoal?.title ?? latestRecord?.improvementArea ?? playerWithAttendance.focus, goalTarget: dynamicGoal?.target ?? playerWithAttendance.goalTarget, goalProgress: dynamicGoal?.progressValue ?? playerWithAttendance.goalProgress, coachNote: latestRecord?.comment ?? playerWithAttendance.coachNote, skills: dynamicSkills?.length ? dynamicSkills : playerWithAttendance.skills } : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/players'); };
  if (!player) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Player Detail" onBack={back} /><ContentState type="error" title="Player not found" message="This player ID is missing or is not part of the academy roster." actionLabel="Back to Players" onRetry={() => router.replace('/(coach)/(tabs)/players')} /></AppScreen>;
  const squad = data.squads.find((item) => item.id === player.squadId) ?? data.squads[0]; const staticAssessment = getLatestPlayerAssessment(player.id); const assessment = latestFull ? { id: latestFull.id, playerId: player.id, coachId: latestFull.coachId, rating: assessmentAverage(latestFull) ?? player.latestRating, focus: latestFull.improvementArea, period: latestFull.periodLabel, strength: latestFull.strength, improvementArea: latestFull.improvementArea, updatedAt: new Date(latestFull.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } : staticAssessment;
  const dynamicFeedback = assessmentState.getPlayerAssessments(player.id).filter((item) => item.source === 'coach-created').map((item) => ({ id: item.id, playerId: player.id, playerName: player.name, coachId: item.coachId, focus: item.improvementArea, updatedAt: 'Updated just now', date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), comment: item.comment }));
  const feedback = [...dynamicFeedback, ...getRecentPlayerFeedback(player.id).filter((item) => !dynamicFeedback.some((dynamic) => dynamic.id === item.id))]; const dynamicLessonIds = assessmentState.getRecommendedLessonIds(player.id); const trainingLessonIds = trainingState.getAssignedLessonIds(player.squadId); const lessons = [...new Set([...dynamicLessonIds, ...trainingLessonIds, ...player.assignedLessonIds])].flatMap((lessonId) => { const lesson = getLessonById(lessonId); return lesson ? [lesson] : []; });
  const openHandoff = (action: CoachPlayerAction) => router.push({ pathname: '/(coach)/players/[playerId]/action/[action]', params: { playerId: player.id, action } });
  const attendanceSessionId = getDefaultAttendanceSessionForSquad(player.squadId)?.id ?? 'training-1';
  const quickAction = (action: CoachPlayerAction | 'attendance') => { if (action === 'attendance') router.push({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: attendanceSessionId, playerId: player.id } }); else if (action === 'feedback') router.push({ pathname: '/(coach)/feedback', params: { playerId: player.id } }); else if (action === 'progress' && assessment) router.push({ pathname: '/(coach)/feedback/[assessmentId]', params: { assessmentId: assessment.id } }); else openHandoff(action); };
  const openLesson = (lesson: LearningLesson) => router.push({ pathname: '/(coach)/sessions/[sessionId]', params: { sessionId: lesson.id, playerId: player.id } });
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Player Detail" subtitle={player.category} onBack={back} /><View style={styles.sections}><FadeInView translate={false}><CoachPlayerIdentityCard player={player} /></FadeInView><ProfileSection title="Quick Actions"><PlayerQuickActions onAction={quickAction} /></ProfileSection><ProfileSection title="Current Snapshot"><PlayerSnapshotCard player={player} assessment={assessment} onAttendance={() => router.push({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId: attendanceSessionId, playerId: player.id } })} onProgress={() => quickAction('progress')} /></ProfileSection><ProfileSection title="Current Goal"><PlayerGoalCard player={player} /></ProfileSection><ProfileSection title="Latest Feedback">{feedback.length ? <PlayerFeedbackCard feedback={feedback} coachName={data.coach.name} onHistory={() => router.push({ pathname: '/(coach)/feedback/history', params: { playerId: player.id } })} /> : <ContentState type="empty" title="No recent feedback" message="Coach feedback will appear here after review." />}</ProfileSection><ProfileSection title="Current Assigned Session">{lessons.length ? <AssignedLessonsCard lessons={lessons} onOpen={openLesson} /> : <ContentState type="empty" title="No assigned Session" message="Assign a Session while adding feedback or preparing a Session plan." />}</ProfileSection><View><AppButton label={showMore ? 'Hide More Information' : 'More Information'} variant="secondary" onPress={() => setShowMore((current) => !current)} accessibilityLabel={showMore ? 'Hide academy and player information' : 'Show more academy and player information'} />{showMore ? <View style={styles.more}><CoachPlayerAcademyDetails player={player} squad={squad} coachName={data.coach.name} ground={data.todaySession.ground} /></View> : null}</View></View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: coachLayout.sectionGap }, more: { marginTop: coachLayout.cardGap } });
