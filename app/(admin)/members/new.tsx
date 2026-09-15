import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AdminChoiceChips, AdminField } from '@/components/admin/admin-form';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { EnrolmentStatus } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const plans = ['Annual Development', 'Quarterly Development', 'Monthly Foundation'] as const;
const enrolmentChoices = ['Full member', 'Trial'] as const;
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward'] as const;
type EnrolmentSheet = 'squad' | 'plan' | 'position' | null;

export default function NewMemberRoute() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const [squadId, setSquadId] = useState(admin.squads[0]?.id ?? '');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState<(typeof positions)[number]>('Midfielder');
  const [plan, setPlan] = useState<(typeof plans)[number]>('Quarterly Development');
  const [enrolment, setEnrolment] = useState<Extract<EnrolmentStatus, 'active' | 'trial'>>('active');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<EnrolmentSheet>(null);

  const squad = admin.squads.find((item) => item.id === squadId);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/members'); };

  const save = async () => {
    if (savingRef.current) return;
    if (!name.trim()) { setError('Enter the player name.'); return; }
    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 6 || parsedAge > 19) { setError('Enter an age between 6 and 19.'); return; }
    if (!guardianName.trim()) { setError('Enter the guardian name.'); return; }
    if (guardianPhone.replace(/\D/g, '').length < 10) { setError('Enter a valid guardian phone number.'); return; }
    if (!squad) { setError('Select a squad for this member.'); return; }
    savingRef.current = true;
    try {
      const result = await admin.enrolMember({
        name, category: squad.ageCategory, squadId: squad.id, age: parsedAge, position, plan, monthlyFee: squad.monthlyFee, enrolment,
        guardian: { name: guardianName.trim(), relationship: 'Guardian', phone: guardianPhone.trim(), email: `${guardianName.trim().toLowerCase().replace(/\s+/g, '.')}@guardian.gccacademy.in` },
      });
      if (!result.value) { setError(result.error ?? 'Unable to enrol this member.'); return; }
      showSuccess('Member enrolled', `${result.value.name} has been added to the ${squad.name}.`);
      back();
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Enrol Member" subtitle="Add a player to an academy squad" onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the enrolment" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <AppSelectRow label="Squad" value={squad?.name ?? 'Select a squad'} supportingText={squad ? `${squad.batch} · ${formatCurrency(squad.monthlyFee)} per month` : undefined} icon="account-group-outline" disabled={admin.isSaving} onPress={() => setSheet('squad')} />
        <AdminField title="Player name"><AppTextInput testID="admin-member-name" value={name} onChangeText={(value) => { setName(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Full name" accessibilityLabel="Player name" returnKeyType="next" error={error === 'Enter the player name.'} /></AdminField>
        <AdminField title="Age"><AppTextInput testID="admin-member-age" value={age} onChangeText={(value) => { setAge(value.replace(/\D/g, '').slice(0, 2)); setError(undefined); }} keyboardType="number-pad" maxLength={2} placeholder="Age in years" accessibilityLabel="Player age" error={error === 'Enter an age between 6 and 19.'} /></AdminField>
        <AppSelectRow label="Position" value={position} icon="soccer" disabled={admin.isSaving} onPress={() => setSheet('position')} />
        <AppSelectRow label="Membership plan" value={plan} icon="card-account-details-outline" disabled={admin.isSaving} onPress={() => setSheet('plan')} />
        <AdminField title="Enrolment type" supporting="Trial members convert to full members after an approval."><AdminChoiceChips values={enrolmentChoices} selected={enrolment === 'trial' ? 'Trial' : 'Full member'} onSelect={(value) => setEnrolment(value === 'Trial' ? 'trial' : 'active')} label="Enrolment type" disabled={admin.isSaving} /></AdminField>
        <AdminField title="Guardian name"><AppTextInput testID="admin-member-guardian" value={guardianName} onChangeText={(value) => { setGuardianName(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Parent or guardian" accessibilityLabel="Guardian name" error={error === 'Enter the guardian name.'} /></AdminField>
        <AdminField title="Guardian phone"><AppTextInput testID="admin-member-phone" value={guardianPhone} onChangeText={(value) => { setGuardianPhone(value.slice(0, 16)); setError(undefined); }} keyboardType="phone-pad" maxLength={16} placeholder="+91 XXXXX XXXXX" accessibilityLabel="Guardian phone number" error={error === 'Enter a valid guardian phone number.'} /></AdminField>
        <AppButton testID="admin-member-save" label="Enrol Member" onPress={() => void save()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'squad'} title="Select squad" description="The squad sets the age category and monthly fee." options={admin.squads.map((item) => ({ id: item.id, label: item.name, supportingText: `${admin.getSquadMembers(item.id).filter((member) => member.enrolment !== 'left').length} of ${item.capacity} places · ${formatCurrency(item.monthlyFee)}`, icon: 'account-group-outline' as const }))} selectedIds={[squadId]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { setSquadId(id); setSheet(null); setError(undefined); }} />
    <AppBottomSheet visible={sheet === 'plan'} title="Membership plan" options={plans.map((value) => ({ id: value, label: value, icon: 'card-account-details-outline' as const }))} selectedIds={[plan]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = plans.find((item) => item === id); if (value) { setPlan(value); setSheet(null); } }} />
    <AppBottomSheet visible={sheet === 'position'} title="Playing position" options={positions.map((value) => ({ id: value, label: value, icon: 'soccer' as const }))} selectedIds={[position]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = positions.find((item) => item === id); if (value) { setPosition(value); setSheet(null); } }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
