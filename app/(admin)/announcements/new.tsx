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
import { AdminAnnouncementAudience } from '@/types/admin';

const audiences = ['All Players', 'Selected Squads', 'Coaches Only'] as const;
const audienceValues: Readonly<Record<(typeof audiences)[number], AdminAnnouncementAudience>> = { 'All Players': 'all-players', 'Selected Squads': 'selected-categories', 'Coaches Only': 'coaches' };
const priorities = ['Normal', 'Important'] as const;

export default function NewAdminAnnouncementRoute() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const [audienceLabel, setAudienceLabel] = useState<(typeof audiences)[number]>('All Players');
  const [squadIds, setSquadIds] = useState<readonly string[]>([]);
  const [priority, setPriority] = useState<(typeof priorities)[number]>('Normal');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<'audience' | 'squads' | null>(null);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/overview'); };
  const squadSummary = squadIds.length ? squadIds.map((id) => admin.getSquad(id)?.name).filter(Boolean).join(', ') : 'Select squads';

  const publish = async () => {
    if (savingRef.current) return;
    if (!title.trim()) { setError('Enter an announcement title.'); return; }
    if (!message.trim()) { setError('Enter a short announcement message.'); return; }
    if (audienceLabel === 'Selected Squads' && !squadIds.length) { setError('Select at least one squad.'); return; }
    savingRef.current = true;
    try {
      const audience = audienceValues[audienceLabel];
      const categoryIds = audience === 'all-players' ? admin.squads.map((squad) => squad.id) : audience === 'selected-categories' ? squadIds : [];
      const result = await admin.postAnnouncement({ title: title.trim(), message: message.trim(), audience, categoryIds, priority: priority === 'Important' ? 'important' : 'normal' });
      if (!result.value) { setError(result.error ?? 'Unable to publish this announcement.'); return; }
      showSuccess('Announcement published', 'The academy announcement log has been updated.');
      back();
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Post Announcement" subtitle="Share an academy-wide notice" onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the announcement" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <InlineInfoBanner tone="info" title="Recorded in the Admin module" message="Announcements are stored locally for this demo and are not delivered to devices." />
        <AppSelectRow label="Audience" value={audienceLabel} supportingText="Admins can address every academy squad" icon="account-multiple-outline" disabled={admin.isSaving} onPress={() => setSheet('audience')} />
        {audienceLabel === 'Selected Squads' ? <AppSelectRow label="Squads" value={squadSummary} icon="account-group-outline" error={error === 'Select at least one squad.'} disabled={admin.isSaving} onPress={() => setSheet('squads')} /> : null}
        <AdminField title="Priority"><AdminChoiceChips values={priorities} selected={priority} onSelect={setPriority} label="Priority" disabled={admin.isSaving} /></AdminField>
        <AdminField title="Title"><AppTextInput testID="admin-announcement-title" value={title} onChangeText={(value) => { setTitle(value.slice(0, 70)); setError(undefined); }} maxLength={70} placeholder="Short announcement title" accessibilityLabel="Announcement title" returnKeyType="next" error={error === 'Enter an announcement title.'} /></AdminField>
        <AdminField title="Message" supporting={`${message.length}/240 characters`}><AppTextInput testID="admin-announcement-message" value={message} onChangeText={(value) => { setMessage(value.slice(0, 240)); setError(undefined); }} maxLength={240} multiline placeholder="What do players, parents, and coaches need to know?" accessibilityLabel="Announcement message" error={error === 'Enter a short announcement message.'} /></AdminField>
        <AppButton testID="admin-announcement-save" label="Publish Announcement" onPress={() => void publish()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'audience'} title="Select audience" description="Choose who this announcement is addressed to." options={audiences.map((value) => ({ id: value, label: value, supportingText: value === 'All Players' ? 'Every academy squad' : value === 'Selected Squads' ? 'Choose specific squads' : 'Coaching staff only', icon: 'account-multiple-outline' as const }))} selectedIds={[audienceLabel]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = audiences.find((item) => item === id); if (value) { setAudienceLabel(value); setSheet(null); setError(undefined); } }} />
    <AppBottomSheet visible={sheet === 'squads'} multiple title="Select squads" options={admin.squads.map((squad) => ({ id: squad.id, label: squad.name, supportingText: squad.batch, icon: 'account-group-outline' as const }))} selectedIds={squadIds} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { setSquadIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); setError(undefined); }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
