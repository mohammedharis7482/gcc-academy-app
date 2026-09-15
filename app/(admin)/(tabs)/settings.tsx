import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminPageHeader } from '@/components/admin/admin-header';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { InfoRow, ProfileMenuItem, ProfileSection, SurfaceCard } from '@/components/profile/profile-shared';
import { ProfileSkeleton } from '@/components/profile/profile-states';
import { ContentState } from '@/components/states/content-state';
import { adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { useProfile } from '@/contexts/profile-context';
import { adminLayout, adminTabBarMetrics } from '@/design/tokens/admin';
import { colors, radius, shadows, spacing } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';
import { initialsOf } from '@/utils/admin-display';

export default function AdminSettingsScreen() {
  const admin = useAdminData();
  const { session, logout } = useProfile();
  const router = useRouter();
  const navigateOnce = useSingleNavigation();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const logoutPendingRef = useRef(false);

  if (admin.status === 'loading') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><ProfileSkeleton /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}><AdminPageHeader title="Settings" subtitle="Academy profile and admin account" /><ContentState type="error" title="Unable to load academy settings" message="The academy profile could not be restored." onRetry={admin.retry} /></AppScreen>;

  const profile = admin.directory.profile;
  const name = session?.displayName ?? adminDemoConfig.admin.name;
  const initials = initialsOf(name);
  const confirmLogout = async () => { if (logoutPendingRef.current) return; logoutPendingRef.current = true; setLogoutPending(true); await logout(); };

  return <AppScreen withTabBarClearance tabBarMetrics={adminTabBarMetrics}>
    <AdminPageHeader title="Settings" subtitle="Academy profile and admin account" />
    <View style={styles.sections}>
      <View style={styles.identity}><View style={styles.identityTop}><View style={styles.avatar}><AppText variant="title" weight="extraBold" color={colors.neutral.white}>{initials}</AppText></View><View style={styles.grow}><AppText variant="title" weight="extraBold" color={colors.neutral.white} numberOfLines={1}>{name}</AppText><AppText variant="bodySmall" color={colors.navyMutedText}>{adminDemoConfig.admin.roleTitle}</AppText></View><BrandLogo containerSize={48} feature /></View><View style={styles.assignment}><MaterialCommunityIcons name="shield-star-outline" size={18} color={colors.brand.blue} /><AppText variant="bodySmall" weight="bold" color={colors.neutral.white} numberOfLines={1}>{profile.shortName}</AppText><AppText variant="caption" color={colors.navyMutedText}>{admin.overview.totalMembers} members</AppText></View></View>

      <ProfileSection title="Academy Profile"><SurfaceCard><InfoRow icon="shield-star-outline" label="Academy" value={profile.name} /><InfoRow icon="card-account-details-outline" label="Registration" value={profile.registrationId} /><InfoRow icon="calendar-star" label="Established" value={String(profile.establishedYear)} /><InfoRow icon="map-marker-outline" label="Address" value={profile.address} /><InfoRow icon="soccer-field" label="Grounds" value={profile.grounds.join(', ')} /></SurfaceCard></ProfileSection>

      <ProfileSection title="Academy Management"><SurfaceCard><ProfileMenuItem testID="admin-settings-squads" icon="account-group-outline" label="Squads and categories" supportingText={`${admin.squads.length} squads configured`} onPress={() => navigateOnce(() => router.push('/(admin)/squads'))} /><ProfileMenuItem testID="admin-settings-approvals" icon="clipboard-alert-outline" label="Approval queue" supportingText={`${admin.overview.pendingApprovals} waiting for a decision`} onPress={() => navigateOnce(() => router.push('/(admin)/approvals'))} /><ProfileMenuItem testID="admin-settings-reports" icon="chart-box-outline" label="Academy reports" supportingText="Attendance, collection, and capacity" onPress={() => navigateOnce(() => router.push('/(admin)/reports'))} /><ProfileMenuItem testID="admin-settings-announcement" icon="bullhorn-outline" label="Post announcement" supportingText={`${admin.announcements.length} published from this device`} onPress={() => navigateOnce(() => router.push('/(admin)/announcement/new'))} /></SurfaceCard></ProfileSection>

      <ProfileSection title="Contact"><SurfaceCard><InfoRow icon="phone-outline" label="Academy phone" value={profile.phone} /><InfoRow icon="email-outline" label="Academy email" value={profile.email} /></SurfaceCard></ProfileSection>

      <ProfileSection title="Account"><SurfaceCard><ProfileMenuItem testID="admin-settings-support" icon="lifebuoy" label="Help and support" supportingText="Contact the academy team" onPress={() => navigateOnce(() => router.push('/(admin)/support'))} /><ProfileMenuItem testID="admin-logout" icon="logout" label="Logout" supportingText="Sign out of this admin account" destructive onPress={() => setLogoutVisible(true)} /></SurfaceCard></ProfileSection>

      <View style={styles.footer}><AppText variant="caption" color={colors.neutral.textMuted} style={styles.center}>Admin module · frontend demo build</AppText><AppText variant="caption" color={colors.neutral.textMuted} style={styles.center}>All academy records shown here are demonstration data stored on this device.</AppText></View>
    </View>
    <AppConfirmationDialog visible={logoutVisible} icon="logout" title="Log out of your Admin account?" description="You will need to sign in again to manage the academy." cancelLabel="Stay Logged In" confirmLabel="Log Out" cancelTestID="admin-logout-cancel" confirmTestID="admin-logout-confirm" destructive loading={logoutPending} onCancel={() => setLogoutVisible(false)} onConfirm={() => { void confirmLogout(); }} />
  </AppScreen>;
}

const styles = StyleSheet.create({
  sections: { gap: adminLayout.sectionGap },
  identity: { ...shadows.hero, padding: adminLayout.cardPadding, borderRadius: radius.hero, backgroundColor: colors.brand.navy, gap: spacing.sm },
  identityTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 52, height: 52, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.brand.blue, backgroundColor: colors.brand.navySoft, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1, minWidth: 0 },
  assignment: { minHeight: 40, paddingHorizontal: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.heroMetadata, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footer: { gap: 2 }, center: { textAlign: 'center' },
});
