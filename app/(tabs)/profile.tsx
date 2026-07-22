import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppScreen } from '@/components/common/app-screen';
import { FadeInView } from '@/components/common/motion';
import { AcademyInfoCard, FeeSummaryCard, GuardianInfoCard, MembershipCard } from '@/components/profile/profile-cards';
import { LogoutDialog } from '@/components/profile/logout-dialog';
import { PlayerIdentityCard } from '@/components/profile/player-identity-card';
import { ProfileSkeleton } from '@/components/profile/profile-states';
import { ProfileHeader, ProfileMenuGroup, ProfileMenuItem, ProfileSection, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useProfile } from '@/contexts/profile-context';
import { layout } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

export default function ProfileScreen() {
  const router = useRouter(); const { profile, status, retry, logout } = useProfile(); const [logoutVisible, setLogoutVisible] = useState(false); const [logoutPending, setLogoutPending] = useState(false); const logoutPendingRef = useRef(false);
  const navigateOnce = useSingleNavigation();
  if (status === 'loading') return <AppScreen><ProfileSkeleton /></AppScreen>;
  if (status === 'error') return <AppScreen><ProfileHeader /><ContentState type="error" title="Profile unavailable" message="The player account could not be loaded." onRetry={retry} /></AppScreen>;
  if (!profile) return <AppScreen><ProfileHeader /><ContentState type="empty" title="No player profile" message="Ask the academy office to connect a registered player to this account." /></AppScreen>;
  const confirmLogout = async () => {
    if (logoutPendingRef.current) return;
    logoutPendingRef.current = true; setLogoutPending(true);
    await logout();
  };
  return <AppScreen><ProfileHeader /><View style={styles.sections}><FadeInView translate={false}><PlayerIdentityCard identity={profile.identity} /></FadeInView><ProfileSection title="Academy Information"><AcademyInfoCard academy={profile.academy} /></ProfileSection><ProfileSection title="Membership Status"><MembershipCard membership={profile.membership} /></ProfileSection><ProfileSection title="Payments"><FeeSummaryCard fee={profile.currentFee} onPress={() => navigateOnce(() => router.push('/profile/fees'))} /></ProfileSection><ProfileSection title="Guardian & Emergency"><GuardianInfoCard guardian={profile.guardian} /></ProfileSection><ProfileSection title="Settings & Support"><SurfaceCard><ProfileMenuGroup title="Preferences"><ProfileMenuItem testID="profile-notification-settings" icon="bell-outline" label="Notification Settings" supportingText="Choose the academy alerts you receive" onPress={() => navigateOnce(() => router.push('/profile/notifications'))} /><ProfileMenuItem icon="translate" label="Language" supportingText="English" onPress={() => navigateOnce(() => router.push('/profile/settings'))} /></ProfileMenuGroup><ProfileMenuGroup title="Support" divided><ProfileMenuItem icon="lifebuoy" label="Help and Support" supportingText="Contact the academy" onPress={() => navigateOnce(() => router.push('/profile/support'))} /><ProfileMenuItem icon="shield-star-outline" label="About GCC Academy" onPress={() => navigateOnce(() => router.push('/profile/about'))} /></ProfileMenuGroup><ProfileMenuGroup title="Legal" divided><ProfileMenuItem icon="shield-lock-outline" label="Privacy Policy" onPress={() => navigateOnce(() => router.push('/profile/privacy'))} /><ProfileMenuItem icon="file-document-outline" label="Terms and Conditions" onPress={() => navigateOnce(() => router.push('/profile/terms'))} /></ProfileMenuGroup></SurfaceCard></ProfileSection><ProfileSection title="Account"><SurfaceCard><ProfileMenuItem testID="profile-logout" icon="logout" label="Logout" supportingText="Sign out of this player account" destructive onPress={() => setLogoutVisible(true)} /></SurfaceCard></ProfileSection></View><LogoutDialog visible={logoutVisible} loading={logoutPending} onCancel={() => setLogoutVisible(false)} onConfirm={() => { void confirmLogout(); }} /></AppScreen>;
}
const styles = StyleSheet.create({ sections: { gap: layout.sectionGap } });
