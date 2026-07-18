import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachPageHeader } from '@/components/coach/coach-header';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { LogoutDialog } from '@/components/profile/logout-dialog';
import { ProfileSkeleton } from '@/components/profile/profile-states';
import { InfoRow, ProfileMenuItem, ProfileSection, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useAcademyData } from '@/contexts/academy-data-context';
import { useProfile } from '@/contexts/profile-context';
import { coachLayout, coachTabBarMetrics, colors, radius, shadows, spacing } from '@/design/tokens';

export default function CoachProfileScreen() {
  const data = useAcademyData();
  const { logout } = useProfile();
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const squad = data.squads.find((item) => item.id === 'u13') ?? data.squads[0];
  if (data.rosterStatus === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><ProfileSkeleton /></AppScreen>;
  if (data.rosterStatus === 'error') return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Profile" subtitle="Your coach academy account" /><ContentState type="error" title="Unable to load Coach profile" message="Your academy assignment could not be restored." onRetry={data.retryRoster} /></AppScreen>;
  if (!squad) return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Profile" subtitle="Your coach academy account" /><ContentState type="empty" icon="account-group-outline" title="No squad assigned" message="Your academy assignment will appear after it is configured." /></AppScreen>;
  const confirmLogout = async () => { setLogoutVisible(false); await logout(); };
  return <AppScreen withTabBarClearance tabBarMetrics={coachTabBarMetrics}><CoachPageHeader title="Profile" subtitle="Your coach academy account" /><View style={styles.sections}><View style={styles.identity}><View style={styles.identityTop}><View style={styles.avatar}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>SS</AppText></View><View style={styles.grow}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>Coach {data.coach.name}</AppText><AppText variant="bodySmall" color={colors.navyMutedText}>{data.coach.roleTitle}</AppText></View><BrandLogo containerSize={48} feature /></View><View style={styles.assignment}><MaterialCommunityIcons name="account-group-outline" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} numberOfLines={1}>{squad.name}</AppText><AppText variant="caption" color={colors.navyMutedText}>{squad.playerCount} players</AppText></View></View><ProfileSection title="Academy Assignment"><SurfaceCard><InfoRow icon="shield-star-outline" label="Academy" value={data.academy.name} /><InfoRow icon="account-group-outline" label="Assigned squad" value={squad.name} /><InfoRow icon="calendar-week" label="Training days" value={squad.trainingDays.join(', ')} /><InfoRow icon="clock-outline" label="Batch" value={squad.batch} /></SurfaceCard></ProfileSection><ProfileSection title="Support & Account"><SurfaceCard><ProfileMenuItem icon="lifebuoy" label="Help and Support" supportingText="Contact the academy" onPress={() => router.push('/(coach)/support')} /><ProfileMenuItem testID="coach-logout" icon="logout" label="Logout" supportingText="Sign out of this coach account" destructive onPress={() => setLogoutVisible(true)} /></SurfaceCard></ProfileSection></View><LogoutDialog visible={logoutVisible} accountLabel="coach" onCancel={() => setLogoutVisible(false)} onConfirm={() => { void confirmLogout(); }} /></AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: coachLayout.sectionGap }, identity: { ...shadows.hero, padding: coachLayout.cardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, gap: spacing.sm }, identityTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, avatar: { width: 52, height: 52, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.brand.blue, backgroundColor: colors.brand.navySoft, alignItems: 'center', justifyContent: 'center' }, grow: { flex: 1, minWidth: 0 }, assignment: { minHeight: 40, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs } });
