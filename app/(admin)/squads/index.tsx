import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SquadCard } from '@/components/admin/admin-squad-cards';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { colors } from '@/design/tokens';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

export default function AdminSquadsScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const navigateOnce = useSingleNavigation();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/settings'); };

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading academy squads" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Squads" onBack={back} /><ContentState type="error" title="Squads unavailable" message="Academy squads could not be loaded." onRetry={admin.retry} /></AppScreen>;

  const enrolled = admin.members.filter((member) => member.enrolment !== 'left').length;
  const capacity = admin.squads.reduce((total, squad) => total + squad.capacity, 0);
  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title="Squads" subtitle="Categories, batches, and capacity" onBack={back} />
    <View style={styles.sections}>
      <AppText variant="bodySmall" color={colors.neutral.textSecondary}>{enrolled} of {capacity} places filled across {admin.squads.length} squads.</AppText>
      <View style={styles.list}>{admin.squads.map((squad) => <SquadCard key={squad.id} squad={squad} memberCount={admin.getSquadMembers(squad.id).filter((member) => member.enrolment !== 'left').length} headCoachName={admin.getCoach(squad.headCoachId)?.name ?? 'Unassigned'} onPress={() => navigateOnce(() => router.push({ pathname: '/(admin)/squads/[squadId]', params: { squadId: squad.id } }))} />)}</View>
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, list: { gap: adminLayout.cardGap } });
