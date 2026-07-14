import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { SectionHeader } from '@/components/common/section-header';
import { AchievementCards } from '@/components/progress/achievement-cards';
import { ContinueLearningCard } from '@/components/progress/continue-learning-card';
import { CurrentGoalCard } from '@/components/progress/current-goal-card';
import { AttendanceSummaryCard, OverallDevelopmentCard } from '@/components/progress/development-overview';
import { FeedbackTimeline } from '@/components/progress/feedback-timeline';
import { MonthlyDevelopmentChart } from '@/components/progress/monthly-development-chart';
import { ProgressHeader } from '@/components/progress/progress-header';
import { CoachSkillRatingsCard, SkillRadarCard } from '@/components/progress/skills-dashboard';
import { progressDashboardMock } from '@/data/progress';
import { latestAssessmentId } from '@/data/progress-details';
import { layout } from '@/design/tokens';
import { ProgressFeedback, SkillRating } from '@/types/progress';

export default function ProgressScreen() {
  const router = useRouter(); const dashboard = progressDashboardMock;
  const openGoalLesson = () => router.push({ pathname: '/learn/[lessonId]', params: { lessonId: dashboard.recommendedLesson.id } });
  const openSkill = (skill: SkillRating) => router.push({ pathname: '/progress/assessment/[assessmentId]', params: { assessmentId: latestAssessmentId, skillId: skill.key } });
  const openFeedback = (feedback: ProgressFeedback) => router.push({ pathname: '/progress/feedback/[feedbackId]', params: { feedbackId: feedback.id } });
  return <AppScreen><View><ProgressHeader playerName={dashboard.playerName} updatedAt={dashboard.updatedAt} /><View style={styles.sections}><FadeInView translate={false}><OverallDevelopmentCard development={dashboard.overall} /></FadeInView><View><SectionHeader title="Attendance Summary" /><Pressable testID="progress-attendance-card" onPress={() => router.push('/progress/attendance')} accessibilityRole="button" accessibilityLabel="Open attendance details" style={({ pressed }) => pressed && styles.pressed}><AttendanceSummaryCard attendance={dashboard.attendance} /></Pressable></View><View><SectionHeader title="Coach Skill Ratings" /><CoachSkillRatingsCard ratings={dashboard.skillRatings} onSkillPress={openSkill} /></View><FadeInView translate={false}><View><SectionHeader title="Skill Radar" /><SkillRadarCard ratings={dashboard.skillRatings} /></View></FadeInView><FadeInView translate={false}><View><SectionHeader title="Development Trend" /><MonthlyDevelopmentChart points={dashboard.monthlyDevelopment} /></View></FadeInView><View><SectionHeader title="Coach Feedback Timeline" /><FeedbackTimeline feedback={dashboard.feedback} onFeedbackPress={openFeedback} /></View><View><SectionHeader title="Achievements" /><AchievementCards achievements={dashboard.achievements} /></View><View><SectionHeader title="Current Goal" /><CurrentGoalCard goal={dashboard.currentGoal} onPress={openGoalLesson} /></View><View><SectionHeader title="Learn Before Your Next Session" /><ContinueLearningCard lesson={dashboard.recommendedLesson} onPress={openGoalLesson} /></View></View></View></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap }, pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] } });
