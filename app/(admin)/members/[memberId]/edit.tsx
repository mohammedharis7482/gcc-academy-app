import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AdminField } from '@/components/admin/admin-form';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { EnrolmentStatus } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const plans = ['Annual Development', 'Quarterly Development', 'Monthly Foundation'] as const;
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward'] as const;
const relationships = ['Father', 'Mother', 'Guardian'] as const;
const enrolments = ['active', 'trial', 'paused', 'left'] as const satisfies readonly EnrolmentStatus[];
const enrolmentLabels: Readonly<Record<EnrolmentStatus, string>> = { active: 'Active', trial: 'Trial', paused: 'Paused', left: 'Left the academy' };
type MemberSheet = 'squad' | 'plan' | 'position' | 'enrolment' | 'relationship' | null;

function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }

export default function EditMemberRoute() {
  const params = useLocalSearchParams<{ memberId?: string | string[] }>();
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const memberId = normalize(params.memberId);
  const member = memberId ? admin.getMember(memberId) : undefined;

  // Prefilled from the current record so the form opens on what is already stored.
  const [squadId, setSquadId] = useState(member?.squadId ?? '');
  const [name, setName] = useState(member?.name ?? '');
  const [age, setAge] = useState(member ? String(member.age) : '');
  const [position, setPosition] = useState(member?.position ?? 'Midfielder');
  const [plan, setPlan] = useState(member?.plan ?? plans[1]);
  const [enrolment, setEnrolment] = useState<EnrolmentStatus>(member?.enrolment ?? 'active');
  const [guardianName, setGuardianName] = useState(member?.guardian.name ?? '');
  const [relationship, setRelationship] = useState(member?.guardian.relationship ?? 'Guardian');
  const [guardianPhone, setGuardianPhone] = useState(member?.guardian.phone ?? '');
  const [guardianEmail, setGuardianEmail] = useState(member?.guardian.email ?? '');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<MemberSheet>(null);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/members'); };
  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading member record" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Edit Member" onBack={back} /><ContentState type="error" title="Member record unavailable" message="This member record could not be loaded." onRetry={admin.retry} /></AppScreen>;
  if (!member) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Edit Member" onBack={back} /><ContentState type="error" title="Member not found" message="This member ID is invalid or the record is no longer available." actionLabel="Back to members" onRetry={back} /></AppScreen>;

  const squad = admin.squads.find((item) => item.id === squadId);

  const save = async () => {
    if (savingRef.current) return;
    if (!name.trim()) { setError('Enter the player name.'); return; }
    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 6 || parsedAge > 19) { setError('Enter an age between 6 and 19.'); return; }
    if (!guardianName.trim()) { setError('Enter the guardian name.'); return; }
    if (guardianPhone.replace(/\D/g, '').length < 10) { setError('Enter a valid guardian phone number.'); return; }
    if (!guardianEmail.includes('@')) { setError('Enter a valid guardian email address.'); return; }
    if (!squad) { setError('Select a squad for this member.'); return; }
    savingRef.current = true;
    try {
      const result = await admin.updateMember({
        memberId: member.id, name, age: parsedAge, position, plan, enrolment, squadId: squad.id,
        guardian: { name: guardianName.trim(), relationship, phone: guardianPhone.trim(), email: guardianEmail.trim().toLowerCase() },
      });
      if (!result.value) { setError(result.error ?? 'Unable to save this member.'); return; }
      showSuccess('Member updated', `${result.value.name}'s record has been corrected.`);
      back();
    } finally { savingRef.current = false; }
  };

  const squadChanged = squad ? squad.id !== member.squadId : false;
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Edit Member" subtitle={`${member.playerId} · enrolled ${member.enrolledOn}`} onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the member details" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        {squadChanged ? <InlineInfoBanner tone="info" title="Moving squad" message={`This also sets the category to ${squad?.ageCategory} and the monthly fee to ${formatCurrency(squad?.monthlyFee ?? 0)}.`} /> : null}
        <AppSelectRow label="Squad" value={squad?.name ?? 'Select a squad'} supportingText={squad ? `${squad.batch} · ${formatCurrency(squad.monthlyFee)} per month` : undefined} icon="account-group-outline" disabled={admin.isSaving} onPress={() => setSheet('squad')} />
        <AdminField title="Player name"><AppTextInput testID="admin-edit-name" value={name} onChangeText={(value) => { setName(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Full name" accessibilityLabel="Player name" returnKeyType="next" error={error === 'Enter the player name.'} /></AdminField>
        <AdminField title="Age"><AppTextInput testID="admin-edit-age" value={age} onChangeText={(value) => { setAge(value.replace(/\D/g, '').slice(0, 2)); setError(undefined); }} keyboardType="number-pad" maxLength={2} placeholder="Age in years" accessibilityLabel="Player age" error={error === 'Enter an age between 6 and 19.'} /></AdminField>
        <AppSelectRow label="Position" value={position} icon="soccer" disabled={admin.isSaving} onPress={() => setSheet('position')} />
        <AppSelectRow label="Membership plan" value={plan} icon="card-account-details-outline" disabled={admin.isSaving} onPress={() => setSheet('plan')} />
        <AppSelectRow label="Enrolment status" value={enrolmentLabels[enrolment]} icon="account-check-outline" disabled={admin.isSaving} onPress={() => setSheet('enrolment')} />
        <AdminField title="Guardian name"><AppTextInput testID="admin-edit-guardian" value={guardianName} onChangeText={(value) => { setGuardianName(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Parent or guardian" accessibilityLabel="Guardian name" error={error === 'Enter the guardian name.'} /></AdminField>
        <AppSelectRow label="Relationship" value={relationship} icon="account-child-outline" disabled={admin.isSaving} onPress={() => setSheet('relationship')} />
        <AdminField title="Guardian phone"><AppTextInput testID="admin-edit-phone" value={guardianPhone} onChangeText={(value) => { setGuardianPhone(value.slice(0, 16)); setError(undefined); }} keyboardType="phone-pad" maxLength={16} placeholder="+91 XXXXX XXXXX" accessibilityLabel="Guardian phone number" error={error === 'Enter a valid guardian phone number.'} /></AdminField>
        <AdminField title="Guardian email"><AppTextInput testID="admin-edit-email" value={guardianEmail} onChangeText={(value) => { setGuardianEmail(value.slice(0, 60)); setError(undefined); }} keyboardType="email-address" autoCapitalize="none" maxLength={60} placeholder="name@guardian.gccacademy.in" accessibilityLabel="Guardian email address" error={error === 'Enter a valid guardian email address.'} /></AdminField>
        <AppButton testID="admin-edit-save" label="Save Changes" onPress={() => void save()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'squad'} title="Select squad" description="The squad sets the age category and monthly fee." options={admin.squads.map((item) => ({ id: item.id, label: item.name, supportingText: `${admin.getSquadMembers(item.id).filter((entry) => entry.enrolment !== 'left').length} of ${item.capacity} places · ${formatCurrency(item.monthlyFee)}`, icon: 'account-group-outline' as const }))} selectedIds={[squadId]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { setSquadId(id); setSheet(null); setError(undefined); }} />
    <AppBottomSheet visible={sheet === 'plan'} title="Membership plan" options={plans.map((value) => ({ id: value, label: value, icon: 'card-account-details-outline' as const }))} selectedIds={[plan]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = plans.find((item) => item === id); if (value) { setPlan(value); setSheet(null); } }} />
    <AppBottomSheet visible={sheet === 'position'} title="Playing position" options={positions.map((value) => ({ id: value, label: value, icon: 'soccer' as const }))} selectedIds={[position]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = positions.find((item) => item === id); if (value) { setPosition(value); setSheet(null); } }} />
    <AppBottomSheet visible={sheet === 'enrolment'} title="Enrolment status" description="Use this to pause a membership or record that a player has left." options={enrolments.map((value) => ({ id: value, label: enrolmentLabels[value], icon: 'account-check-outline' as const }))} selectedIds={[enrolment]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = enrolments.find((item) => item === id); if (value) { setEnrolment(value); setSheet(null); } }} />
    <AppBottomSheet visible={sheet === 'relationship'} title="Guardian relationship" options={relationships.map((value) => ({ id: value, label: value, icon: 'account-child-outline' as const }))} selectedIds={[relationship]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = relationships.find((item) => item === id); if (value) { setRelationship(value); setSheet(null); } }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
