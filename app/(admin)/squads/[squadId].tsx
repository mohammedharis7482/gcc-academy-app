import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MemberListCard } from '@/components/admin/admin-member-cards';
import { SquadCard } from '@/components/admin/admin-squad-cards';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { InfoRow, ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { SquadStatus } from '@/types/admin';
import { formatCurrency } from '@/utils/format';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

const statuses = ['open', 'full', 'paused'] as const satisfies readonly SquadStatus[];
const statusLabels: Readonly<Record<SquadStatus, string>> = { open: 'Open for enrolment', full: 'Full', paused: 'Paused' };
function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }

export default function AdminSquadDetailScreen() {
  const params = useLocalSearchParams<{ squadId?: string | string[] }>();
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const navigateOnce = useSingleNavigation();
  const savingRef = useRef(false);
  const [sheet, setSheet] = useState<'coach' | 'status' | null>(null);
  const [error, setError] = useState<string>();

  const squadId = normalize(params.squadId);
  const squad = squadId ? admin.getSquad(squadId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/squads'); };

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading squad" /></AppScreen>;
  if (!squad) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Squad" onBack={back} /><ContentState type="error" title="Squad not found" message="This squad ID is invalid or is no longer available." actionLabel="Back to squads" onRetry={back} /></AppScreen>;

  const members = admin.getSquadMembers(squad.id).filter((member) => member.enrolment !== 'left').sort((a, b) => a.jerseyNumber - b.jerseyNumber);
  const headCoach = admin.getCoach(squad.headCoachId);
  const save = async (change: { readonly headCoachId?: string; readonly status?: SquadStatus }) => {
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      const result = await admin.updateSquad({ squadId: squad.id, ...change });
      if (!result.value) { setError(result.error ?? 'The squad could not be saved.'); return; }
      setError(undefined);
      showSuccess('Squad updated', `${squad.name} settings have been saved.`);
    } finally { savingRef.current = false; }
  };

  return <>
    <AppScreen withTabBarClearance={false}>
      <SubpageHeader title={squad.name} subtitle={`${squad.batch} · ${members.length} of ${squad.capacity} places`} onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.sections}>
        {error ? <InlineInfoBanner tone="error" title="Squad not saved" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <SquadCard squad={squad} memberCount={members.length} headCoachName={headCoach?.name ?? 'Unassigned'} />
        <ProfileSection title="Squad Settings"><View style={styles.form}><AppSelectRow label="Head coach" value={headCoach ? `Coach ${headCoach.name}` : 'Unassigned'} supportingText={headCoach?.roleTitle} icon="whistle-outline" disabled={admin.isSaving} onPress={() => setSheet('coach')} /><AppSelectRow label="Enrolment status" value={statusLabels[squad.status]} icon="account-group-outline" disabled={admin.isSaving} onPress={() => setSheet('status')} /></View></ProfileSection>
        <ProfileSection title="Schedule"><SurfaceCard><InfoRow icon="calendar-week" label="Training days" value={squad.trainingDays.join(', ')} /><InfoRow icon="clock-outline" label="Batch" value={squad.batch} /><InfoRow icon="map-marker-outline" label="Ground" value={squad.ground} /><InfoRow icon="cash" label="Monthly fee" value={formatCurrency(squad.monthlyFee)} /></SurfaceCard></ProfileSection>
        <ProfileSection title={`Squad Members · ${members.length}`}>{members.length ? <View style={styles.list}>{members.map((member) => <MemberListCard key={member.id} member={member} onPress={() => navigateOnce(() => router.push({ pathname: '/(admin)/members/[memberId]', params: { memberId: member.id } }))} />)}</View> : <ContentState type="empty" icon="account-search-outline" title="No members" message="Enrol a player to fill this squad." />}</ProfileSection>
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'coach'} title="Head coach" description="Assign the coach responsible for this squad." options={admin.coaches.map((coach) => ({ id: coach.id, label: `Coach ${coach.name}`, supportingText: `${coach.roleTitle} · ${coach.engagement}`, icon: 'whistle-outline' as const }))} selectedIds={[squad.headCoachId]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { setSheet(null); void save({ headCoachId: id }); }} />
    <AppBottomSheet visible={sheet === 'status'} title="Enrolment status" options={statuses.map((value) => ({ id: value, label: statusLabels[value], icon: 'account-group-outline' as const }))} selectedIds={[squad.status]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = statuses.find((item) => item === id); if (value) { setSheet(null); void save({ status: value }); } }} />
  </>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap }, form: { gap: adminLayout.cardGap }, list: { gap: adminLayout.cardGap } });
