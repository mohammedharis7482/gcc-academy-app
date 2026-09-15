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
import { CoachEngagement } from '@/types/admin';

const engagements = ['Full-time', 'Part-time', 'Guest'] as const satisfies readonly CoachEngagement[];
const roleTitles = ['Technical Coach', 'Foundation Coach', 'Performance Coach', 'Assistant Coach', 'Goalkeeping Coach'] as const;

export default function NewCoachRoute() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState<(typeof roleTitles)[number]>('Assistant Coach');
  const [engagement, setEngagement] = useState<CoachEngagement>('Part-time');
  const [squadIds, setSquadIds] = useState<readonly string[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [certification, setCertification] = useState('');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<'role' | 'squads' | null>(null);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/coaches'); };
  const squadSummary = squadIds.length ? squadIds.map((id) => admin.getSquad(id)?.name).filter(Boolean).join(', ') : 'Select at least one squad';

  const save = async () => {
    if (savingRef.current) return;
    if (!name.trim()) { setError('Enter the coach name.'); return; }
    if (!squadIds.length) { setError('Assign at least one squad to this coach.'); return; }
    if (phone.replace(/\D/g, '').length < 10) { setError('Enter a valid contact number.'); return; }
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    savingRef.current = true;
    try {
      const result = await admin.addCoach({ name, roleTitle, engagement, availability: 'available', squadIds, phoneMasked: phone.trim(), email: email.trim().toLowerCase(), certification: certification.trim() || 'Pending verification' });
      if (!result.value) { setError(result.error ?? 'Unable to add this coach.'); return; }
      showSuccess('Coach added', `${result.value.name} is now listed in the coaching staff.`);
      back();
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Add Coach" subtitle="Register a coach and assign squads" onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the coach details" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <AdminField title="Coach name"><AppTextInput testID="admin-coach-name" value={name} onChangeText={(value) => { setName(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Full name" accessibilityLabel="Coach name" returnKeyType="next" error={error === 'Enter the coach name.'} /></AdminField>
        <AppSelectRow label="Role" value={roleTitle} icon="whistle-outline" disabled={admin.isSaving} onPress={() => setSheet('role')} />
        <AdminField title="Engagement"><AdminChoiceChips values={engagements} selected={engagement} onSelect={setEngagement} label="Engagement" disabled={admin.isSaving} /></AdminField>
        <AppSelectRow label="Assigned squads" value={squadSummary} supportingText="A coach can cover more than one squad" icon="account-group-outline" error={error === 'Assign at least one squad to this coach.'} disabled={admin.isSaving} onPress={() => setSheet('squads')} />
        <AdminField title="Contact number"><AppTextInput testID="admin-coach-phone" value={phone} onChangeText={(value) => { setPhone(value.slice(0, 16)); setError(undefined); }} keyboardType="phone-pad" maxLength={16} placeholder="+91 XXXXX XXXXX" accessibilityLabel="Coach contact number" error={error === 'Enter a valid contact number.'} /></AdminField>
        <AdminField title="Email"><AppTextInput testID="admin-coach-email" value={email} onChangeText={(value) => { setEmail(value.slice(0, 60)); setError(undefined); }} keyboardType="email-address" autoCapitalize="none" maxLength={60} placeholder="name@gccacademy.in" accessibilityLabel="Coach email address" error={error === 'Enter a valid email address.'} /></AdminField>
        <AdminField title="Certification" supporting="Optional — recorded for academy compliance"><AppTextInput testID="admin-coach-certification" value={certification} onChangeText={(value) => setCertification(value.slice(0, 48))} maxLength={48} placeholder="AIFF D Licence" accessibilityLabel="Coach certification" /></AdminField>
        <AppButton testID="admin-coach-save" label="Add Coach" onPress={() => void save()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'role'} title="Coach role" options={roleTitles.map((value) => ({ id: value, label: value, icon: 'whistle-outline' as const }))} selectedIds={[roleTitle]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = roleTitles.find((item) => item === id); if (value) { setRoleTitle(value); setSheet(null); } }} />
    <AppBottomSheet visible={sheet === 'squads'} multiple title="Assign squads" description="Select every squad this coach will work with." options={admin.squads.map((squad) => ({ id: squad.id, label: squad.name, supportingText: `${squad.batch} · ${squad.trainingDays.join(', ')}`, icon: 'account-group-outline' as const }))} selectedIds={squadIds} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { setSquadIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); setError(undefined); }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
