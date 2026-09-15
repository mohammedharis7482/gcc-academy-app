import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CoachIdentityCard, coachSquadNames } from '@/components/admin/admin-coach-cards';
import { SquadCard } from '@/components/admin/admin-squad-cards';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { InfoRow, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }

export default function AdminCoachDetailScreen() {
  const params = useLocalSearchParams<{ coachId?: string | string[] }>();
  const router = useRouter();
  const admin = useAdminData();
  const navigateOnce = useSingleNavigation();
  const coachId = normalize(params.coachId);
  const coach = coachId ? admin.getCoach(coachId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/coaches'); };

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading coach record" /></AppScreen>;
  if (!coach) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Coach Detail" onBack={back} /><ContentState type="error" title="Coach not found" message="This coach ID is invalid or the record is no longer available." actionLabel="Back to coaches" onRetry={back} /></AppScreen>;

  const squads = admin.squads.filter((squad) => coach.squadIds.includes(squad.id));
  const managedPlayers = squads.reduce((total, squad) => total + admin.getSquadMembers(squad.id).filter((member) => member.enrolment !== 'left').length, 0);
  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title={`Coach ${coach.name}`} subtitle={coach.roleTitle} onBack={back} />
    <View style={styles.sections}>
      <CoachIdentityCard coach={coach} squadSummary={coachSquadNames(coach, admin.squads)} />
      <ProfileSection title="Assignment"><SurfaceCard><InfoRow icon="briefcase-outline" label="Engagement" value={coach.engagement} /><InfoRow icon="calendar-account-outline" label="Availability" value={coach.availability === 'available' ? 'Available for sessions' : 'On leave'} /><InfoRow icon="account-multiple-outline" label="Players managed" value={`${managedPlayers} players`} /><InfoRow icon="clipboard-text-clock-outline" label="Sessions this month" value={String(coach.sessionsThisMonth)} /><InfoRow icon="certificate-outline" label="Certification" value={coach.certification} /><InfoRow icon="calendar-start" label="Joined" value={coach.joinedOn} /></SurfaceCard></ProfileSection>
      <ProfileSection title="Contact"><SurfaceCard><InfoRow icon="phone-outline" label="Phone" value={coach.phoneMasked} /><InfoRow icon="email-outline" label="Email" value={coach.email} /></SurfaceCard></ProfileSection>
      <ProfileSection title="Assigned Squads">{squads.length ? <View style={styles.list}>{squads.map((squad) => <SquadCard key={squad.id} squad={squad} memberCount={admin.getSquadMembers(squad.id).filter((member) => member.enrolment !== 'left').length} headCoachName={admin.getCoach(squad.headCoachId)?.name ?? 'Unassigned'} onPress={() => navigateOnce(() => router.push({ pathname: '/(admin)/squads/[squadId]', params: { squadId: squad.id } }))} />)}</View> : <ContentState type="empty" icon="account-group-outline" title="No squads assigned" message="Assign this coach to a squad from the squad settings." />}</ProfileSection>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, list: { gap: adminLayout.cardGap } });
