import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MemberAttendanceCard, MemberFeeHistory, MemberFeeSummaryCard, MemberIdentityCard } from '@/components/admin/admin-member-cards';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { InfoRow, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }

export default function AdminMemberDetailScreen() {
  const params = useLocalSearchParams<{ memberId?: string | string[] }>();
  const router = useRouter();
  const admin = useAdminData();
  const navigateOnce = useSingleNavigation();
  const memberId = normalize(params.memberId);
  const member = memberId ? admin.getMember(memberId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/members'); };

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading member record" /></AppScreen>;
  if (!member) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Member Detail" onBack={back} /><ContentState type="error" title="Member not found" message="This member ID is invalid or the record is no longer available." actionLabel="Back to members" onRetry={back} /></AppScreen>;

  const fees = admin.getMemberFees(member.id);
  const currentFee = fees.find((record) => record.period === adminDemoConfig.billing.currentPeriod);
  const squad = admin.getSquad(member.squadId);
  return <AppScreen withTabBarClearance={false}>
    <SubpageHeader title={member.name} subtitle={`${member.playerId} · ${member.squadName}`} onBack={back} />
    <View style={styles.sections}>
      <MemberIdentityCard member={member} />
      <ProfileSection title="Billing"><MemberFeeSummaryCard member={member} onRecordPayment={currentFee ? () => navigateOnce(() => router.push({ pathname: '/(admin)/finance/[feeId]', params: { feeId: currentFee.id } })) : undefined} /></ProfileSection>
      <ProfileSection title="Training"><MemberAttendanceCard member={member} /></ProfileSection>
      <ProfileSection title="Enrolment"><SurfaceCard><InfoRow icon="calendar-account-outline" label="Enrolled on" value={member.enrolledOn} /><InfoRow icon="card-account-details-outline" label="Plan" value={member.plan} /><InfoRow icon="account-group-outline" label="Squad" value={member.squadName} /><InfoRow icon="clock-outline" label="Batch" value={squad?.batch ?? 'Not assigned'} /><InfoRow icon="calendar-week" label="Training days" value={squad?.trainingDays.join(', ') ?? 'Not scheduled'} /></SurfaceCard></ProfileSection>
      <ProfileSection title="Guardian"><SurfaceCard><InfoRow icon="account-child-outline" label={member.guardian.relationship} value={member.guardian.name} /><InfoRow icon="phone-outline" label="Primary phone" value={member.guardian.phone} /><InfoRow icon="email-outline" label="Email" value={member.guardian.email} /></SurfaceCard></ProfileSection>
      <ProfileSection title="Fee History"><MemberFeeHistory records={fees} /></ProfileSection>
      {squad ? <AppButton label="Open Squad" variant="secondary" onPress={() => navigateOnce(() => router.push({ pathname: '/(admin)/squads/[squadId]', params: { squadId: squad.id } }))} accessibilityLabel={`Open ${squad.name}`} /> : null}
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap } });
